import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk3Layout = ({ children }: LayoutProps<'/kiosk-3'>) => {
  return <MqttProvider topic="kiosk-03">{children}</MqttProvider>;
};

export default Kiosk3Layout;
