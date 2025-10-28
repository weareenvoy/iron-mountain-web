"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { MqttError, MqttService } from "@/lib/mqtt";

interface MqttContextType {
  isConnected: boolean;
  error: MqttError | undefined;
  client: MqttService | undefined;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

interface MqttProviderProps {
  children: React.ReactNode;
}

export function MqttProvider({ children }: MqttProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<MqttError | undefined>(undefined);
  const [client, setClient] = useState<MqttService | undefined>(undefined);

  useEffect(() => {
    const mqttService = new MqttService({
      onConnectionChange: setIsConnected,
      onError: setError,
    });

    setClient(mqttService);

    return () => {
      mqttService.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      client,
      isConnected,
      error,
    }),
    [client, isConnected, error],
  );

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}

export function useMqtt() {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error("useMqtt must be used within a MqttProvider");
  }
  return context;
}
