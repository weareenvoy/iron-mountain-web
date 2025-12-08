import { KioskControllerProvider } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk3Layout = ({ children }: LayoutProps<'/kiosk-3'>) => {
  return (
    <MqttProvider topic="kiosk-03">
      <KioskControllerProvider kioskId="kiosk-3">{children}</KioskControllerProvider>
    </MqttProvider>
  );
};

export default Kiosk3Layout;
