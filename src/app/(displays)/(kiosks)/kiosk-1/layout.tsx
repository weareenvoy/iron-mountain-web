import { KioskControllerProvider } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk1Layout = ({ children }: LayoutProps<'/kiosk-1'>) => {
  return (
    <MqttProvider topic="kiosk-01">
      <KioskControllerProvider kioskId="kiosk-1">{children}</KioskControllerProvider>
    </MqttProvider>
  );
};

export default Kiosk1Layout;
