import { MqttProvider } from '@/components/providers/mqtt-provider';
import DocentContent from './_components/layouts/docent-content';
import { DocentProvider } from './_components/providers/docent';

const DocentLayout = ({ children }: LayoutProps<'/docent'>) => {
  return (
    <MqttProvider topic="docent-app">
      <DocentProvider>
        <DocentContent>{children}</DocentContent>
      </DocentProvider>
    </MqttProvider>
  );
};

export default DocentLayout;
