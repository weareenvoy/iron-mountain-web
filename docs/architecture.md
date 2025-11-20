# Architecture Overview

## System Overview

The Iron Mountain system is a distributed interactive experience composed of multiple devices communicating in
real-time. The core architecture revolves around a **Controller-Display** model where tablet devices ("Controllers")
send commands to large screen displays ("Viewers") via MQTT.

## Communication (MQTT)

The system uses MQTT v5 over WebSockets for real-time communication.

### Topic Structure

Topics generally follow the pattern: `site/device/action` or `state/device`.

- **Commands**: `cmd/<target-device>/<action>`
  - Example: `cmd/basecamp/goto-beat` payload: `{ "id": "intro-1" }`
- **State**: `state/<device>`
  - Devices publish their full state here on change.
  - Example: `state/basecamp` payload: `{ "slide": "idle", "volume-level": 0.8 }`

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
- **Kiosks (01-03)**: Standalone or synchronized interactive stations.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context
- **Real-time**: MQTT.js (v5)
- **MQTT Broker**: Mosquitto
