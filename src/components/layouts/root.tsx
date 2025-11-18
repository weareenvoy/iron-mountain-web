import '@/lib/tailwind/styles/globals.css';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import { Toaster } from '@/components/shadcn/sonner';
import type { PropsWithChildren } from 'react';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <MqttProvider>{children}</MqttProvider>
      <Toaster />
    </>
  );
};

export default RootLayout;
