import { KioskOverlayProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-overlay-provider';
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk2Layout = ({ children }: LayoutProps<'/kiosk-2'>) => {
  return (
    <MqttProvider topic="kiosk-02">
      <AudioProvider appId="kiosk-02">
        <KioskProvider kioskId="kiosk-2">
          <KioskOverlayProvider>{children}</KioskOverlayProvider>
        </KioskProvider>
      </AudioProvider>
    </MqttProvider>
  );
};

export default Kiosk2Layout;
