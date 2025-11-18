import localFont from 'next/font/local';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import { Toaster } from '@/components/shadcn/sonner';
import { cn } from '@/lib/tailwind/utils/cn';
import type { Metadata } from 'next';

// Font configurations
const interstate = localFont({
  src: [
    {
      path: '../fonts/InterstateRegular.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  variable: '--font-interstate',
});

const geometria = localFont({
  src: [
    {
      path: '../fonts/Geometria.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
  variable: '--font-geometria',
});

export const metadata: Metadata = {
  description: '',
  robots: {
    follow: false,
    index: false,
  },
  title: 'Iron Mountain Overlook Tablet',
};

export const viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html className="h-full" data-theme="dark" lang="en">
      <body
        className={cn(
          interstate.variable,
          geometria.variable,
          interstate.className,
          'text-foreground-primary bg-background-primary antialiased'
        )}
      >
        <MqttProvider>{children}</MqttProvider>

        {/* Toast Alerts */}
        <Toaster />
      </body>
    </html>
  );
}
