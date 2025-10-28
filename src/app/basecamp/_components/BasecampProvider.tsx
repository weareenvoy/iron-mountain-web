"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { BasecampData } from "@/types";
import { useMqtt } from "@/providers/MqttProvider";

interface BasecampContextType {
  currentMoment: string;
  currentBeatIdx: number;
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
  const [currentMoment, setCurrentMoment] = useState<string>("ambient");
  const [currentBeatIdx, setCurrentBeatIdx] = useState<number>(0);
  const [data, setData] = useState<BasecampData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch basecamp content data with tourId
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get tourId from URL pathname
        const pathname = window.location.pathname;
        const tourIdMatch = pathname.match(/\/docent\/tour\/([^\/]+)/);
        const tourId = tourIdMatch ? tourIdMatch[1] : null;

        if (!tourId) {
          throw new Error("No tourId found in URL path");
        }

        const response = await fetch(`/api/basecamp?tourId=${tourId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch basecamp data");
        }
        const basecampData = await response.json();
        setData(basecampData);
        setError(null);
        console.log(`Fetched basecamp data for tourId: ${tourId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching basecamp data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Subscribe to MQTT basecamp topic to get current moment and beat from Docent App.
  useEffect(() => {
    if (!client) return;

    const handleNavigation = (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        const { momentId, beatIdx } = data;
        console.log("Raw MQTT message:", message.toString());
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

        setCurrentMoment(momentId);
        setCurrentBeatIdx(beatIdx);
      } catch (error) {
        console.error("Error parsing MQTT message:", error);
      }
    };

    client.subscribeToTopic("basecamp/navigation", handleNavigation);
    return () => {
      client.unsubscribeFromTopic("basecamp/navigation");
    };
  }, [client]);

  const contextValue = {
    currentMoment,
    currentBeatIdx,
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
