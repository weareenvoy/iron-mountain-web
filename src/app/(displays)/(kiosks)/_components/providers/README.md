# Kiosk Provider

The `KioskProvider` follows the same context provider pattern used by Basecamp and Summit exhibits. It provides
centralized data fetching and state management for kiosk displays.

**Note**: Kiosks are part of a multi-device exhibit and use MQTT for **state persistence and recovery**. This allows
kiosks to:

- Report availability (`status: 'online'`)
- Publish current state to MQTT for persistence
- Bootstrap back to the correct state after crashes, reboots, or refreshes
- Maintain longer-lasting stateful information across sessions

MQTT acts as a **stateful backup system**, not a remote control mechanism.

## Architecture

```
Layout (per kiosk)
  ↓
MqttProvider (MQTT connection for state persistence)
  ↓
KioskProvider (data + state)
  ↓
View Component (renders slides + publishes state)
```

## Features

- **Data fetching**: Loads kiosk JSON data from `/api/<kioskId>.json` (ex: `/api/kiosk-2.json`) with online API
  fallback.
- **Resilience**: Times out quickly and falls back to static JSON if the API is unavailable/offline.
- **MQTT Integration**: Connects to MQTT broker for state persistence and availability tracking.
- **State Recovery**: Subscribes to own state topic to recover last known state after crashes/reboots.
- **State management**: Provides `data`, `error`, `kioskId`, `loading`, `refetch`.

## Usage

### 1. Wrap layout with MQTT and Kiosk providers

```tsx
// layout.tsx
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk3Layout = ({ children }: LayoutProps) => {
  return (
    <MqttProvider topic="kiosk-03">
      <KioskProvider kioskId="kiosk-3">{children}</KioskProvider>
    </MqttProvider>
  );
};
```

### 2. Publish state for persistence and recovery

```tsx
// Kiosk3View.tsx
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { useEffect, useState } from 'react';

const Kiosk3View = () => {
  const { data, error, loading } = useKiosk();
  const { client, isConnected } = useMqtt();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasRecovered, setHasRecovered] = useState(false);

  // Recover state from MQTT on mount (after crash/reboot/refresh)
  useEffect(() => {
    if (!client || hasRecovered) return;

    const handler = (message: Buffer) => {
      try {
        const parsed = JSON.parse(message.toString());
        const state = parsed.body;

        // Bootstrap back to last known state
        if (state.currentSlide !== undefined) {
          setCurrentSlide(state.currentSlide);
        }

        setHasRecovered(true);
      } catch (error) {
        console.error('Failed to recover state:', error);
      }
    };

    // Subscribe to own state topic to recover
    client.subscribeToTopic('state/kiosk-03', handler);

    return () => {
      client.unsubscribeFromTopic('state/kiosk-03', handler);
    };
  }, [client, hasRecovered]);

  // Publish state updates for persistence
  useEffect(() => {
    if (!client || !isConnected) return;

    // Publish current state (will be retained by broker)
    client.publish('state/kiosk-03', {
      status: 'online',
      currentSlide,
      timestamp: new Date().toISOString(),
    });
  }, [client, isConnected, currentSlide]);

  if (loading) return <LoadingState />;
  if (error || !data) return <ErrorState error={error} />;

  return <div>{/* render slides */}</div>;
};
```

## Message Format

Kiosks publish state messages following this structure:

```json
{
  "meta": {
    "id": "kiosk-01-1766166679944",
    "ts": "2025-12-19T17:51:19.944Z",
    "source": "kiosk-01"
  },
  "body": {
    "status": "online",
    "currentSlide": 3,
    "timestamp": "2025-12-19T17:51:19.944Z"
  }
}
```

The `meta` wrapper is automatically added by `MqttService` when publishing.

## State Recovery Flow

1. **Kiosk loads** → Subscribe to `state/kiosk-XX` topic
2. **Receive last state** → Bootstrap to `currentSlide`, etc.
3. **User interacts** → Update local state
4. **Publish new state** → MQTT broker retains it
5. **Kiosk crashes/reboots** → Go back to step 1

This ensures kiosks always recover to their last known state, providing a seamless experience even after interruptions.

## Tour Lifecycle (MQTT Commands)

Kiosks are **standalone exhibits** with their own content. Each kiosk (kiosk-1, kiosk-2, kiosk-3) operates independently
and only responds to tour commands meant for itself.

### Starting a Tour

**When**: User dismisses the idle screen overlay on the `InitialScreenTemplate`

**Flow**:

1. `InitialScreenTemplate` detects idle screen tap
2. Calls `client.loadTour(kioskId)` (e.g., `'kiosk-1'`)
3. Message broadcasts to `cmd/dev/all/load-tour` with `tour-id: 'kiosk-1'`
4. This kiosk receives its own broadcast → fetches fresh data
5. Other kiosks receive broadcast → ignore it (different tour-id)

**Why fetch data?** Even though kiosks have static content, fetching ensures the latest data is loaded if the kiosk has
been idle for an extended period.

```typescript
// In InitialScreenTemplate
if (client && isConnected && kioskId) {
  client.loadTour(kioskId, {
    onError: err => console.error(`${kioskId}: Failed to trigger loadTour:`, err),
    onSuccess: () => console.info(`${kioskId}: Successfully triggered loadTour`),
  });
}
```

### Ending a Tour

**When**: Tour ends (broadcast from GEC or Docent)

**Flow**:

1. All kiosks receive `cmd/dev/all/end-tour` broadcast
2. Each kiosk reports idle state to MQTT: `{ 'beat-id': 'kiosk-idle' }`
3. After 100ms delay (ensures MQTT message is sent), kiosk refreshes: `window.location.reload()`

**Why refresh?** Kiosks need a complete state reset to return to pristine idle screen:

- Idle overlay state is restored
- Scroll position returns to top
- Navigation resets
- All nested component state (carousels, accordions, animations) is cleared
- Memory is freed (videos, images, etc.)
- Next user gets a fresh, clean experience

This is intentional and preferred over stateful resets, which can miss edge cases or leave stale state.

```typescript
// In kiosk-provider.tsx
const handleEndTour = () => {
  reportStateRef.current({ 'beat-id': DEFAULT_KIOSK_BEAT_ID });
  setTimeout(() => window.location.reload(), 100);
};
```

### Key Differences from Other Exhibits

| Behavior              | Kiosks                            | Basecamp/Summit             |
| --------------------- | --------------------------------- | --------------------------- |
| **Tour Identity**     | kioskId is the tour-id            | Receives actual tour-id     |
| **Content**           | Static per kiosk                  | Dynamic based on tour       |
| **load-tour**         | Only responds to own kioskId      | Responds to all tour-ids    |
| **end-tour**          | Full page refresh                 | Stateful reset (no refresh) |
| **Idle Screen**       | Integrated into initial screen    | Separate idle state         |
| **Self-broadcasting** | Triggers loadTour on idle dismiss | Never self-triggers tours   |

### MQTT Topics

- **Subscriptions**:
  - `cmd/dev/all/load-tour` - Tour start commands (filtered by tour-id)
  - `cmd/dev/all/end-tour` - Tour end commands (all kiosks respond)
- **Publications**:
  - `cmd/dev/gec/load-tour` - Triggered when idle dismissed
  - `state/kiosk-XX` - State reporting for persistence

## Data Structure

`getKioskData(kioskId)` follows the same convention as the other `get-*` utilities and returns:

```tsx
{
  data: KioskData | null;
  error?: string;
}
```

The `KioskData` type is intentionally flexible to accommodate different kiosk structures (kiosk-1 uses nested `screens`,
kiosk-2/3 use flat top-level keys).
