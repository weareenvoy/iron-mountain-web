# Iron Mountain

A Next.js 16 application for managing coffee station interactions with MQTT communication and dynamic video completion
flows.

## Documentation

- [**Architecture Overview**](./docs/architecture.md): System design, MQTT topics, and device roles.
- [**Coding Patterns**](./docs/patterns.md): State management, component guidelines, and styling.
- [**Kiosk Deployment**](./docs/kiosk-deployment.md): Production deployment guide with systemd, PM2, and Docker options.

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm

### Installation

```bash
pnpm install
```

### Development

Run the development server:

```bash
pnpm dev
```

The development server runs on port 3000 by default.

### Production

```bash
pnpm build
pnpm start
```

### Kiosk Deployment

For kiosk hardware deployment, launch Chrome/Chromium with these flags to enable autoplay audio without user gestures:

```bash
chromium-browser \
  --kiosk \
  --autoplay-policy=no-user-gesture-required \
  --user-data-dir="/tmp/chrome_signage" \
  --disable-features=TranslateUI \
  --no-first-run \
  --fast \
  --fast-start \
  --disable-infobars \
  --disable-session-crashed-bubble \
  http://localhost:3000/kiosk-1
```

Replace `kiosk-1` with `kiosk-2` or `kiosk-3` as needed.

**Required flag for audio**: `--autoplay-policy=no-user-gesture-required` allows background music and sound effects to
play immediately when triggered by MQTT commands (e.g., when the idle video dismisses).

## Project Structure

- **`src/app`**: Next.js App Router pages.
  - **`(displays)`**: Routes for screens (`basecamp`, `summit`, `kiosks`, `overlook`).
  - **`(tablets)`**: Routes for controllers (`docent`, `overlook`).
- **`src/components`**: React components.
  - **`shadcn`**: Reusable UI primitives (Buttons, Inputs, etc.).
  - **`ui`**: Custom components.
  - **`providers`**: Global context providers (MQTT, Theme).
  - **`layouts`**: Shared layout wrappers.
- **`src/lib`**: Core logic and utilities.
  - **`mqtt`**: MQTT client setup, types, and constants.
  - **`internal`**: Domain-specific constants, types, and data fetching.
  - **`shadcn`**: Shadcn utilities.
  - **`tailwind`**: Styling utilities and global CSS.
- **`src/hooks`**: Custom React hooks (e.g., `useMomentsNavigation`).
- **`src/flags`**: Feature flags configuration.

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Required: MQTT broker WebSocket URL for real-time communication
NEXT_PUBLIC_MQTT_BROKER_URL=wss://...

# Optional: Use GEC (Global Experience Controller) relay for MQTT messages
# - true: Send to GEC, which relays to exhibits (production)
# - false: Direct broadcast to exhibits (development, default)
NEXT_PUBLIC_USE_GEC=false

# Optional: API and CDN configuration
NEXT_PUBLIC_API_BASE_URL=https://...
NEXT_PUBLIC_CDN_HOST_NAME=https://...

# Optional: Kiosk offline-first mode
NEXT_PUBLIC_KIOSK_OFFLINE_FIRST=true
```

**Note**: `NEXT_PUBLIC_MQTT_BROKER_URL` is required for exhibits (Kiosks, Basecamp, Summit) and controllers (Docent,
Overlook) to communicate. See [Architecture Overview](./docs/architecture.md) for details on MQTT topics and message
flow.
