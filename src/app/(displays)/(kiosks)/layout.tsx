import ScaleWrapper from '@/app/(displays)/(kiosks)/_components/kiosk-controller/ScaleWrapper';
import config from './kiosk.config.json';
import type { PropsWithChildren } from 'react';
import './_styles/globals.css';

const KiosksRootLayout = ({ children }: PropsWithChildren) => {
  return (
    <ScaleWrapper targetHeight={config.height} targetWidth={config.width}>
      <div data-app="displays-kiosks">{children}</div>
    </ScaleWrapper>
  );
};

export default KiosksRootLayout;
