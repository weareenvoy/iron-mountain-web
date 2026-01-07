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
