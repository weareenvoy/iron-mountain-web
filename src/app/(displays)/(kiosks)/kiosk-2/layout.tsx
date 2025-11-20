import { MqttProvider } from '@/components/providers/mqtt-provider';

const Kiosk2Layout = ({ children }: LayoutProps<'/kiosk-2'>) => {
  return <MqttProvider topic="kiosk-02">{children}</MqttProvider>;
};

export default Kiosk2Layout;
