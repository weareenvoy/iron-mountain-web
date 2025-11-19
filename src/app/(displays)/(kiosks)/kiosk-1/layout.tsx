import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk1Layout = ({ children }: LayoutProps<'/kiosk-1'>) => {
  return <MqttProvider topic="kiosk-01">{children}</MqttProvider>;
};

export default Kiosk1Layout;
