# Iron Mountain overlook tablet app

A Next.js application for managing coffee station interactions with MQTT communication and dynamic video completion flows.

## Getting Started

Install dependencies

```bash
yarn install
```

Run the development server:

```bash
yarn run dev
```

For production builds:

```bash
yarn run build
yarn run start
```

The development server runs on port 3000 by default, while production starts on port 7776. You can change ports in `package.json` scripts or specify them when running: `yarn dev -p 3001` or `yarn start -p 8080`.

## Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_MQTT_BROKER_URL=XXX # wss://platinumtongue962:q84ECOGbpa...
NEXT_PUBLIC_ASSET_DOMAIN=XXX # ideal-ducks-0234b33c63.media.strapiapp.com
```

For Strapi URL whitelisting in `NEXT_PUBLIC_ASSET_DOMAIN`, use the domain without port numbers (e.g., `localhost` instead of `localhost:1337`).
