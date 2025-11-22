import ScaleWrapper from '@/components/kiosk-controller/ScaleWrapper';
import { KioskControllerProvider } from '@/components/kiosk-controller/KioskController';
import config from './kiosk.config.json';
import type { PropsWithChildren } from 'react';
import './_styles/globals.css';

const KiosksRootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ScaleWrapper targetWidth={config.width} targetHeight={config.height}>
      <KioskControllerProvider>
        <div data-app="displays-kiosks">{children}</div>
      </KioskControllerProvider>
    </ScaleWrapper>
  );
};

export default KiosksRootLayout;
