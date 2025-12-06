import localFont from 'next/font/local';

// Font loaders with explicit literal values (Next.js requirement)
export const Interstate = localFont({
  display: 'swap',
  fallback: ['Georgia, sans-serif, system-ui'],
  preload: true,
  src: [
    {
      path: '../../../public/fonts/Interstate-Light.woff2',
      style: 'normal',
      weight: '300',
    },
    {
      path: '../../../public/fonts/InterstateRegular.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  style: 'normal',
  variable: '--font-interstate',
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
