import { SummitProvider } from '@/app/(displays)/summit/_components/providers/summit-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import './_styles/globals.css';

const SummitLayout = ({ children }: LayoutProps<'/summit'>) => {
  return (
    <MqttProvider topic="summit">
      <SummitProvider>
        <div data-app="displays-summit">{children}</div>
      </SummitProvider>
    </MqttProvider>
  );
};

export default SummitLayout;
