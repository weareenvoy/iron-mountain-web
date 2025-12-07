import { SummitProvider } from '@/app/(displays)/summit/_components/providers/summit-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';

const SummitSlidesLayout = ({ children }: LayoutProps<'/summit/slides'>) => {
  return (
    <MqttProvider topic="summit">
      <SummitProvider>{children}</SummitProvider>
    </MqttProvider>
  );
};

export default SummitSlidesLayout;
