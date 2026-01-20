import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk1Layout = ({ children }: LayoutProps<'/kiosk-1'>) => {
  return (
    <MqttProvider topic="kiosk-01">
      <AudioProvider appId="kiosk-01">
        <KioskProvider kioskId="kiosk-1">{children}</KioskProvider>
      </AudioProvider>
    </MqttProvider>
  );
};

export default Kiosk1Layout;
