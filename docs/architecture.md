# Architecture Overview

## System Overview

The Iron Mountain system is a distributed interactive experience composed of multiple devices communicating in
real-time. The core architecture revolves around a **Controller-Display** model where tablet devices ("Controllers")
send commands to large screen displays ("Viewers") via MQTT.

## Communication (MQTT)

The system uses MQTT v5 over WebSockets for real-time communication.

### Topic Structure

Topics generally follow the pattern: `cmd/<target-device>/<action>` or `state/<device>`.

- **Commands**: `cmd/<target-device>/<action>`
  - Example: `cmd/basecamp/goto-beat` payload: `{ "id": "intro-1" }`
  - Broadcast commands: `cmd/dev/all/<action>` (all exhibits respond)
  - GEC commands: `cmd/dev/gec/<action>` (relayed by GEC to exhibits)
- **State**: `state/<device>`
  - Devices publish their full state here on change.
  - Example: `state/basecamp` payload: `{ "slide": "idle", "volume-level": 0.8 }`

### Tour Lifecycle Commands

**Starting a Tour:**

1. Docent app sends `loadTour(tourId)` (e.g., `"tour-001"`)
2. Publishes to both:
   - `cmd/dev/gec/load-tour` → GEC receives and relays (production)
   - `cmd/dev/all/load-tour` → Direct to exhibits (development without GEC)
3. All kiosks activate (dismiss idle screens, fetch data)
4. Basecamp/Summit load tour-specific content

**Ending a Tour:**

1. Docent app or GEC sends `endTour()`
2. Publishes to `cmd/dev/all/end-tour`
3. All exhibits return to idle state
4. Kiosks perform full page refresh for clean reset

### Message Structure

All MQTT messages follow a standard envelope:

```typescript
interface MqttMessage<T> {
  body: T;
  meta: {
    id: string; // UUID
    source: string; // Sender Device ID
    ts: string; // ISO Timestamp
  };
}
```

## Device Roles

### Tablets (Controllers)

- **Docent App**: Used by staff to control the tour. Can trigger specific moments on the Basecamp display.
- **Overlook**: A customer-facing tablet that controls a specific video wall or interactive screen.

### Displays (Viewers)

- **Basecamp**: The main presentation display. Reacts to "beats" and "moments" triggered by the Docent.
- **Overlook**: A customer-facing tablet that controls a specific video wall or interactive screen.
- **Summit**: Another large format display, likely for ambient or specific journey maps.
- **Kiosks (01-03)**: Interactive touchscreen displays with static content per kiosk. All kiosks activate together when
  any tour starts (synchronized idle dismissal), but each displays its own unique content. Each kiosk has an integrated
  idle screen that fades out when the Docent loads a tour.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context
- **Real-time**: MQTT.js (v5)
- **MQTT Broker**: Mosquitto
