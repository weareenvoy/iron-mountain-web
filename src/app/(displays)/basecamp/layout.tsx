import { MqttProvider } from '@/components/providers/mqtt-provider';
import { BasecampProvider } from './_components/providers/basecamp';

const BasecampLayout = ({ children }: LayoutProps<'/basecamp'>) => {
  return (
    <MqttProvider topic="basecamp">
      <BasecampProvider>{children}</BasecampProvider>
    </MqttProvider>
  );
};

export default BasecampLayout;
