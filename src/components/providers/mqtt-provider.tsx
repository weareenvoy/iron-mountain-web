'use client';

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { MqttService } from '@/lib/mqtt/utils/mqtt-service';
import type { DeviceId, MqttError } from '@/lib/mqtt/types';

interface MqttContextType {
  readonly client: MqttService | undefined;
  readonly error: MqttError | undefined;
  readonly isConnected: boolean;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

type MqttProviderProps = PropsWithChildren<{ readonly topic: DeviceId }>;

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
};

export const MqttProvider = ({ children, topic }: MqttProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<MqttError | undefined>(undefined);
  const [client, setClient] = useState<MqttService | undefined>(undefined);

  useEffect(() => {
    console.info(`MQTT: Connecting as ${topic}`);

    const mqttService = new MqttService({
      deviceId: topic,
      onConnectionChange: connected => {
        setIsConnected(connected);
        setClient(mqttService);
      },
      onError: setError,
    });

    return () => {
      console.info(`MQTT: Disconnecting ${topic}`);
      mqttService.disconnect();
    };
  }, [topic]); // Only runs when deviceId changes!

  const value = useMemo(
    () => ({
      client,
      error,
      isConnected,
    }),
    [client, error, isConnected]
  );

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
};
