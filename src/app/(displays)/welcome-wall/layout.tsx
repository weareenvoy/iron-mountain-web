import { MqttProvider } from '@/components/providers/mqtt-provider';
import { WelcomeWallProvider } from './_components/providers/welcome-wall';
import './_styles/globals.css';

const WelcomeWallLayout = ({ children }: LayoutProps<'/welcome-wall'>) => {
  return (
    <MqttProvider topic="welcome-wall">
      <WelcomeWallProvider>
        <div data-app="displays-welcome-wall">{children}</div>
      </WelcomeWallProvider>
    </MqttProvider>
  );
};

export default WelcomeWallLayout;
