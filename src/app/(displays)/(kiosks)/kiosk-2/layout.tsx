import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk2Layout = ({ children }: LayoutProps<'/kiosk-2'>) => {
  return (
    <MqttProvider topic="kiosk-02">
      <KioskProvider kioskId="kiosk-2">{children}</KioskProvider>
    </MqttProvider>
  );
};

export default Kiosk2Layout;
