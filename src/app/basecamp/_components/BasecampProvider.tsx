"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { BasecampData, ExhibitState } from "@/types";
import { useMqtt } from "@/providers/MqttProvider";

interface BasecampContextType {
  exhibitState: ExhibitState;
  data: BasecampData | null;
  loading: boolean;
  error: string | null;
}

const BasecampContext = createContext<BasecampContextType | undefined>(
  undefined,
);

export function useBasecamp() {
  const context = useContext(BasecampContext);
  if (context === undefined) {
    throw new Error("useBasecamp must be used within a BasecampProvider");
  }
  return context;
}

interface BasecampProviderProps {
  children: React.ReactNode;
}

export function BasecampProvider({ children }: BasecampProviderProps) {
  const { client } = useMqtt();

  const [exhibitState, setExhibitState] = useState<ExhibitState>({
    momentId: "ambient",
    beatIdx: 0,
  });
  const [data, setData] = useState<BasecampData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch basecamp content data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // TBD how to get basecamp data.
      const response = await fetch("/api/basecamp");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch basecamp data");
      }
      const basecampData = await response.json();
      setData(basecampData);
      setError(null);
      console.log("Fetched basecamp data");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching basecamp data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  // Subscribe to MQTT topics for basecamp control
  useEffect(() => {
    if (!client) return;

    // 1. Navigation topic - moment/beat changes from docent app
    const handleNavigation = (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        const { momentId, beatIdx } = data;
        console.log("Basecamp received navigation:", { momentId, beatIdx });

        // Validate inputs
        if (
          typeof momentId !== "string" ||
          typeof beatIdx !== "number" ||
          isNaN(beatIdx)
        ) {
          console.error("Invalid MQTT data:", { momentId, beatIdx });
          return;
        }

        setExhibitState({ momentId, beatIdx });
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
    };

    // 2. Refresh topic - refresh data when GEC tells us to
    const handleRefresh = (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Basecamp received refresh command:", data);
        fetchData();
      } catch (error) {
        console.error("Error parsing refresh message:", error);
      }
    };

    // 3. Tour end topic - end tour and show ambient state
    const handleTourEnd = (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        console.log("Basecamp received tour end command:", data);

        // Reset to ambient state
        setExhibitState({ momentId: "ambient", beatIdx: 0 });
      } catch (error) {
        console.error("Error parsing tour end message:", error);
      }
    };

    // Topic names are all TBD. And not sure if there are multiple topics.
    // TODO  If all the apps need to subscribe to refresh and end topics, does it still make sense to do it here?
    client.subscribeToTopic("navigation/basecamp", handleNavigation);
    client.subscribeToTopic("tour/refresh", handleRefresh);
    client.subscribeToTopic("tour/end", handleTourEnd);

    return () => {
      client.unsubscribeFromTopic("navigation/basecamp");
      client.unsubscribeFromTopic("tour/refresh");
      client.unsubscribeFromTopic("tour/end");
    };
  }, [client, fetchData]);

  const contextValue = {
    exhibitState,
    data,
    loading,
    error,
  };

  return (
    <BasecampContext.Provider value={contextValue}>
      {children}
    </BasecampContext.Provider>
  );
}
