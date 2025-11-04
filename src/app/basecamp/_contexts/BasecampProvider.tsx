"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  BasecampData,
  ExhibitNavigationState,
  ExhibitMqttState,
} from "@/types";
import { useMqtt } from "@/providers/MqttProvider";

interface BasecampContextType {
  exhibitState: ExhibitNavigationState;
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

  // UI navigation state (local)
  const [exhibitState, setExhibitState] = useState<ExhibitNavigationState>({
    momentId: "ambient",
    beatIdx: 0,
  });

  // MQTT state (what we report to GEC)
  const [mqttState, setMqttState] = useState<ExhibitMqttState>({
    "tour-id": null,
    slide: "idle",
    "volume-level": 1.0,
    "volume-muted": false,
  });

  const [data, setData] = useState<BasecampData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch basecamp content data
  const fetchData = useCallback(async (tourId?: string | null) => {
    setLoading(true);
    try {
      // TODO use actual API once it's ready. For now no tourId is needed in params.
      const response = await fetch("/api/basecamp");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch basecamp data");
      }
      const basecampData = await response.json();
      setData(basecampData);
      setError(null);
      console.log("Fetched basecamp data");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Error fetching basecamp data:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper to report full exhibit state to MQTT
  const reportState = useCallback(
    (newState: Partial<ExhibitMqttState>) => {
      if (!client) return;

      const updatedState = { ...mqttState, ...newState };
      setMqttState(updatedState);

      client.reportExhibitState("basecamp", updatedState, {
        onSuccess: () => console.log("Basecamp: Reported state:", updatedState),
        onError: (err) =>
          console.error("Basecamp: Failed to report state:", err),
      });
    },
    [client, mqttState],
  );

  // Subscribe to GEC commands (broadcasts to ALL exhibits)
  useEffect(() => {
    if (!client) return;

    // 1. Load tour command from GEC (broadcast to all exhibits)
    const handleLoadTour = async (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const tourId = msg.body?.["tour-id"];
        console.log("Basecamp received load-tour command:", tourId);

        if (tourId) {
          // Report loading state immediately
          reportState({
            "tour-id": tourId,
            slide: "loading",
            "volume-level": 1.0,
            "volume-muted": false,
          });

          // Fetch tour-specific data for this tour
          // For now, just fetch the generic basecamp data
          const success = await fetchData(tourId);

          if (success) {
            // Only report loaded state after data is fetched
            setExhibitState({ momentId: "ambient", beatIdx: 0 });
            reportState({
              "tour-id": tourId,
              slide: "ambient-1",
              "volume-level": 1.0,
              "volume-muted": false,
            });
          } else {
            // Report error state if fetch failed
            reportState({
              "tour-id": tourId,
              slide: "error",
              "volume-level": 0.0,
              "volume-muted": false,
            });
          }
        }
      } catch (error) {
        console.error("Basecamp: Error parsing load-tour command:", error);
      }
    };

    // 2. Go idle command (broadcast to all exhibits)
    const handleGoIdle = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const reason = msg.body?.reason;
        console.log("Basecamp received go-idle command:", reason);

        // Reset to idle state
        setExhibitState({ momentId: "ambient", beatIdx: 0 });
        reportState({
          "tour-id": null,
          slide: "idle",
          "volume-level": 0.0,
          "volume-muted": false,
        });
      } catch (error) {
        console.error("Basecamp: Error parsing go-idle command:", error);
      }
    };

    // 3. Goto beat command (direct from Docent)
    const handleGotoBeat = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const beatId = msg.body?.beat_id;
        console.log("Basecamp received goto-beat command:", beatId);

        if (beatId) {
          // Parse beat_id format: ${moment}-${beatNumber} (e.g., "ambient-1", "welcome-3", "protect-2")
          const lastDashIndex = beatId.lastIndexOf("-");
          if (lastDashIndex === -1) {
            console.error("Invalid beat_id format:", beatId);
            return;
          }

          const momentId = beatId.substring(0, lastDashIndex);
          const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

          if (isNaN(beatNumber) || beatNumber < 1) {
            console.error("Invalid beat number in beat_id:", beatId);
            return;
          }

          // Convert 1-indexed beat number to 0-indexed
          const beatIdx = beatNumber - 1;

          console.log(`Parsed beat: moment=${momentId}, beatIdx=${beatIdx}`);
          setExhibitState({ momentId, beatIdx });

          // Report updated state with new slide
          reportState({ slide: beatId });
        }
      } catch (error) {
        console.error("Basecamp: Error parsing goto-beat command:", error);
      }
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic(`cmd/dev/all/load-tour`, handleLoadTour);
    client.subscribeToTopic(`cmd/dev/all/go-idle`, handleGoIdle);

    // Also subscribe to basecamp-specific goto-beat (direct from Docent)
    client.subscribeToTopic(`cmd/dev/basecamp/goto-beat`, handleGotoBeat);

    return () => {
      client.unsubscribeFromTopic(`cmd/dev/all/load-tour`);
      client.unsubscribeFromTopic(`cmd/dev/all/go-idle`);
      client.unsubscribeFromTopic(`cmd/dev/basecamp/goto-beat`);
    };
  }, [client, fetchData, reportState]);

  // Subscribe to own state on boot (for restart/recovery)
  // This allows exhibit to restore state after refresh
  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: ExhibitMqttState = msg.body;
        console.log("Basecamp: Received own state on boot:", state);

        // Update internal MQTT state
        setMqttState(state);

        // Parse slide to update UI navigation state
        if (state.slide && state.slide !== "idle") {
          const lastDashIndex = state.slide.lastIndexOf("-");
          if (lastDashIndex !== -1) {
            const momentId = state.slide.substring(0, lastDashIndex);
            const beatNumber = parseInt(
              state.slide.substring(lastDashIndex + 1),
              10,
            );
            if (!isNaN(beatNumber) && beatNumber >= 1) {
              setExhibitState({ momentId, beatIdx: beatNumber - 1 });
            }
          }
        }

        // Fetch content if we have a tour loaded
        if (state["tour-id"]) {
          fetchData();
        }
      } catch (error) {
        console.error("Basecamp: Error parsing own state:", error);
      }
    };

    // Subscribe once on mount to get retained state
    client.subscribeToTopic(`state/basecamp`, handleOwnState);

    return () => {
      client.unsubscribeFromTopic(`state/basecamp`);
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
