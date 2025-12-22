import { AudioProvider } from '@/components/providers/audio-provider';
import { MqttProvider } from '@/components/providers/mqtt-provider';
import { BasecampProvider } from './_components/providers/basecamp';
import './_styles/globals.css';

const BasecampLayout = ({ children }: LayoutProps<'/basecamp'>) => {
  return (
    <MqttProvider topic="basecamp">
      <AudioProvider appId="basecamp">
        <BasecampProvider>
          <div data-app="displays-basecamp">{children}</div>
        </BasecampProvider>
      </AudioProvider>
    </MqttProvider>
  );
};

export default BasecampLayout;
