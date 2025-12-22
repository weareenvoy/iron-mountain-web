import { SummitProvider } from '@/app/(displays)/summit/_components/providers/summit-provider';
import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import './_styles/globals.css';

const SummitLayout = ({ children }: LayoutProps<'/summit'>) => {
  return (
    <MqttProvider topic="summit">
      <AudioProvider appId="summit">
        <SummitProvider>
          <div data-app="displays-summit">{children}</div>
        </SummitProvider>
      </AudioProvider>
    </MqttProvider>
  );
};

export default SummitLayout;
