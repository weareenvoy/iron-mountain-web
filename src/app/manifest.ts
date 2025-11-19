export const dynamic = 'force-static';

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#ffffff',
    description: 'Iron Mountain experience',
    display: 'standalone',
    icons: [
      {
        sizes: '192x192',
        src: '/images/iron-mountain-logo-white.svg',
        type: 'image/svg+xml',
      },
      {
        sizes: '512x512',
        src: '/images/iron-mountain-logo-white.svg',
        type: 'image/svg+xml',
      },
    ],
    name: 'Iron Mountain',
    short_name: 'IM',
    start_url: '/',
    theme_color: '#0B2E4E',
  };
}
