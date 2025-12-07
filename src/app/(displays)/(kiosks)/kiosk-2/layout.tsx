import { KioskControllerProvider } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk2Layout = ({ children }: LayoutProps<'/kiosk-2'>) => {
  return (
    <MqttProvider topic="kiosk-02">
      <KioskControllerProvider kioskId="kiosk-2">{children}</KioskControllerProvider>
    </MqttProvider>
  );
};

export default Kiosk2Layout;
