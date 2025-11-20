import localFont from 'next/font/local';

// Font loaders with explicit literal values (Next.js requirement)
export const Interstate = localFont({
  display: 'swap',
  fallback: ['Georgia, sans-serif, system-ui'],
  preload: true,
  src: [
    {
      path: '../../../public/fonts/InterstateRegular.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  style: 'normal',
  variable: '--font-interstate',
  weight: '400',
});

export const Geometria = localFont({
  display: 'swap',
  fallback: ['Arial, sans-serif, system-ui'],
  preload: true,
  src: [
    {
      path: '../../../public/fonts/Geometria.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  variable: '--font-geometria',
});
