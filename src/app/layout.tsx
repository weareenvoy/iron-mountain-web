import '@/lib/tailwind/styles/globals.css';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import { ThemeProvider } from '@/components/providers/theme';
import { Toaster } from '@/components/shadcn/sonner';
import { geometria, interstate } from '@/lib/internal/fonts';
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
  userScalable: false,
  width: 'device-width',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('antialiased', interstate.variable, geometria.variable)}>
        <MqttProvider>
          <ThemeProvider
            defaultTheme="system"
            disableTransitionOnChange
            enableColorScheme
            enableSystem
            themes={['dark', 'light']}
          >
            {children}
          </ThemeProvider>
        </MqttProvider>
        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
