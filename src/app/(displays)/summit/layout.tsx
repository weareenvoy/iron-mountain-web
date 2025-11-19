import { MqttProvider } from '@/components/providers/mqtt-provider';

const SummitLayout = ({ children }: LayoutProps<'/summit'>) => {
  return <MqttProvider topic="summit">{children}</MqttProvider>;
};

export default SummitLayout;
