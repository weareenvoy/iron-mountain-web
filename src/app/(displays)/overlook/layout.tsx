import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import './_styles/globals.css';

const OverlookLayout = ({ children }: LayoutProps<'/overlook'>) => {
  return (
    <MqttProvider topic="overlook">
      <AudioProvider appId="overlook">
        <div data-app="displays-overlook">{children}</div>
      </AudioProvider>
    </MqttProvider>
  );
};

export default OverlookLayout;
