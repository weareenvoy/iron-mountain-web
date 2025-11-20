import { MqttProvider } from '@/components/providers/mqtt-provider';
import './_styles/globals.css';

const SummitLayout = ({ children }: LayoutProps<'/summit'>) => {
  return (
    <MqttProvider topic="summit">
      <div data-app="displays-summit">{children}</div>
    </MqttProvider>
  );
};

export default SummitLayout;
