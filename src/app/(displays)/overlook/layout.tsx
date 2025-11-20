import { MqttProvider } from '@/components/providers/mqtt-provider';
import './_styles/globals.css';

const OverlookLayout = ({ children }: LayoutProps<'/overlook'>) => {
  return (
    <MqttProvider topic="overlook">
      <div data-app="displays-overlook">{children}</div>
    </MqttProvider>
  );
};

export default OverlookLayout;
