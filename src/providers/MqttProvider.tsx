"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
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

// Determine device ID based on the current route
const getDeviceIdFromPath = (pathname: string): string => {
  // Check if we're on a specific exhibit page
  if (pathname.startsWith("/basecamp")) {
    return "basecamp";
  }
  if (pathname.startsWith("/kiosk-1")) {
    return "kiosk-01";
  }

  // Default to docent-app for all other routes (/docent, /, etc.)
  return "docent-app";
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
    console.log(`MQTT: Connecting as ${deviceId}`);

    const mqttService = new MqttService({
      deviceId,
      onConnectionChange: setIsConnected,
      onError: setError,
    });

    setClient(mqttService);

    return () => {
      console.log(`MQTT: Disconnecting ${deviceId}`);
      mqttService.disconnect();
    };
  }, [deviceId]); // Only runs when deviceId changes!

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
