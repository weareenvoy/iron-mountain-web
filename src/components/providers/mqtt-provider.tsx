'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MqttService } from '@/lib/mqtt/utils/mqtt-service';
import type { MqttError } from '@/lib/mqtt/types';

interface MqttContextType {
  client: MqttService | undefined;
  error: MqttError | undefined;
  isConnected: boolean;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

interface MqttProviderProps {
  children: React.ReactNode;
}

// Determine device ID based on the current route
const getDeviceIdFromPath = (pathname: string): string => {
  // Check if we're on a specific exhibit page
  if (pathname.startsWith('/basecamp')) {
    return 'basecamp';
  }
  if (pathname.startsWith('/kiosk-1')) {
    return 'kiosk-01';
  }

  // Default to docent-app for all other routes (/docent, /, etc.)
  return 'docent-app';
};

export function MqttProvider({ children }: MqttProviderProps) {
  const pathname = usePathname();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<MqttError | undefined>(undefined);
  const [client, setClient] = useState<MqttService | undefined>(undefined);

  // Compute device ID from pathname - memoized so effect only runs when this changes
  const deviceId = useMemo(() => {
    const id = getDeviceIdFromPath(pathname);
    return id;
  }, [pathname]);

  useEffect(() => {
    console.info(`MQTT: Connecting as ${deviceId}`);

    const mqttService = new MqttService({
      deviceId,
      onConnectionChange: connected => {
        setIsConnected(connected);
        setClient(mqttService);
      },
      onError: setError,
    });

    return () => {
      console.info(`MQTT: Disconnecting ${deviceId}`);
      mqttService.disconnect();
    };
  }, [deviceId]); // Only runs when deviceId changes!

  const value = useMemo(
    () => ({
      client,
      error,
      isConnected,
    }),
    [client, error, isConnected]
  );

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}

export function useMqtt() {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error('useMqtt must be used within a MqttProvider');
  }
  return context;
}
