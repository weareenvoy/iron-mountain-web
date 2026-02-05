import { KioskOverlayProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-overlay-provider';
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk3Layout = ({ children }: LayoutProps<'/kiosk-3'>) => {
  return (
    <MqttProvider topic="kiosk-03">
      <AudioProvider appId="kiosk-03">
        <KioskProvider kioskId="kiosk_3">
          <KioskOverlayProvider>{children}</KioskOverlayProvider>
        </KioskProvider>
      </AudioProvider>
    </MqttProvider>
  );
};

export default Kiosk3Layout;
