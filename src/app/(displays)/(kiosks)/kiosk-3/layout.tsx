import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk3Layout = ({ children }: LayoutProps<'/kiosk-3'>) => {
  return (
    <MqttProvider topic="kiosk-03">
      <KioskProvider kioskId="kiosk-3">{children}</KioskProvider>
    </MqttProvider>
  );
};

export default Kiosk3Layout;
