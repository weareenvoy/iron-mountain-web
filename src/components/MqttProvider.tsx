"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import type { StateData, ToastData } from "@/types";
import { ToastType } from "@/types";
import { MqttError, MqttService } from "../lib/mqtt";
import { toast } from "sonner";

interface TourContextType {
  isConnected: boolean;
  error: MqttError | undefined;
  client: MqttService | undefined;
  currentState: StateData | undefined;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface MqttProviderProps {
  children: React.ReactNode;
}

export function MqttProvider({ children }: MqttProviderProps) {
  // return <>{children}</>;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<TourContextType["error"]>(undefined);
  const [client, setClient] = useState<MqttService | undefined>(undefined);
  const [currentState, setCurrentState] = useState<StateData | undefined>(
    undefined,
  );

  // const previousCurrentState = usePrevious(currentState);

  const value = useMemo(
    () => ({
      client,
      isConnected,
      error,
      currentState,
    }),
    [isConnected, error, client, currentState],
  );

  const handleReceiveState = useCallback((state: StateData) => {
    setCurrentState(state);
  }, []);

  const handleReceiveToast = useCallback((data: ToastData) => {
    switch (data.type as ToastType) {
      case ToastType.Error:
        toast.error(<p className="line-clamp-3">{data.message}</p>);
        break;
      case ToastType.Warning:
        toast.warning(<p className="line-clamp-3">{data.message}</p>);
        break;
      case ToastType.Success:
        toast.success(<p className="line-clamp-3">{data.message}</p>);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    const mqttService = new MqttService({
      onReceiveState: handleReceiveState,
      onReceiveToast: handleReceiveToast,
      onConnectionChange: setIsConnected,
      onError: setError,
    });

    setClient(mqttService);

    return () => {
      mqttService.disconnect();
    };
  }, [handleReceiveState, handleReceiveToast]);

  if (!isConnected) {
    return (
      <div className="h-full w-full place-content-center text-center">
        Connecting...
      </div>
    );
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useMqtt() {
  const context = useContext(TourContext);

  if (context === undefined) {
    throw new Error("useMqtt must be used within a MqttProvider");
  }

  return context;
}
