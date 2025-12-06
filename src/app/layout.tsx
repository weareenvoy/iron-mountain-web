import './globals.css';
import SwRegister from '@/components/providers/sw-register';
import { ThemeProvider } from '@/components/providers/theme';
import { Toaster } from '@/components/shadcn/sonner';
import { Geometria, Interstate } from '@/lib/internal/fonts';
import { cn } from '@/lib/tailwind/utils/cn';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  description: '',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Iron Mountain',
};

export const viewport: Viewport = {
  initialScale: 1,
  interactiveWidget: 'resizes-content',
  maximumScale: 1,
  minimumScale: 1,
  themeColor: '#0B2E4E',
  userScalable: false,
  width: 'device-width',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  // Access env vars on server side to avoid Turbopack HMR issues in client components
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const offlineFirst = (process.env.NEXT_PUBLIC_KIOSK_OFFLINE_FIRST ?? 'true') === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-interstate antialiased', Interstate.variable, Geometria.variable)}>
        <SwRegister apiBase={apiBase} offlineFirst={offlineFirst} />
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
          themes={['dark', 'light']}
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
