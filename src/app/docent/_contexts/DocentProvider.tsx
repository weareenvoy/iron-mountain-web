"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMqtt } from "@/providers/MqttProvider";
import { useRouter, usePathname } from "next/navigation";
import {
  Tour,
  ExhibitNavigationState,
  DocentAppState,
  SyncState,
} from "@/types";

export interface DocentContextType {
  allTours: Tour[];
  currentTour: Tour | null;
  isTourDataLoading: boolean;
  isGecStateLoading: boolean;
  lastUpdated: Date | null;
  isConnected: boolean;
  setCurrentTour: (tour: Tour | null) => void;
  refreshTours: () => Promise<void>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  basecampExhibitState: ExhibitNavigationState;
  overlookExhibitState: ExhibitNavigationState;
  setBasecampExhibitState: (state: Partial<ExhibitNavigationState>) => void;
  setOverlookExhibitState: (state: Partial<ExhibitNavigationState>) => void;

  // Summit Room state
  summitRoomSlideIdx: number;
  setSummitRoomSlideIdx: (idx: number) => void;
  isSummitRoomJourneyMapLaunched: boolean;
  setIsSummitRoomJourneyMapLaunched: (launched: boolean) => void;

  // Exhibit availability status
  exhibitAvailability: {
    basecamp: boolean;
    overlook: boolean;
    overlookTablet: boolean;
  };

  // Full state from GEC (combines tour, UI mode, exhibit settings)
  docentAppState: DocentAppState | null;
}

const DocentContext = createContext<DocentContextType | undefined>(undefined);

interface DocentProviderProps {
  children: ReactNode;
}

export function DocentProvider({ children }: DocentProviderProps) {
  const { isConnected, client } = useMqtt();
  const router = useRouter();
  const pathname = usePathname();
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [isTourDataLoading, setIsTourDataLoading] = useState(true);
  const [isGecStateLoading, setIsGecStateLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Beats for basecamp overlook, and slides for summit room.
  const [basecampExhibitState, setBasecampExhibitStateRaw] =
    useState<ExhibitNavigationState>({ momentId: "ambient", beatIdx: 0 });
  const [overlookExhibitState, setOverlookExhibitStateRaw] =
    useState<ExhibitNavigationState>({ momentId: "ambient", beatIdx: 0 });
  const [summitRoomSlideIdx, setSummitRoomSlideIdx] = useState(0);
  const [isSummitRoomJourneyMapLaunched, setIsSummitRoomJourneyMapLaunched] =
    useState(false);

  // Full state from GEC
  const [docentAppState, setDocentAppState] = useState<DocentAppState | null>(
    null,
  );

  // Derive exhibit availability from GEC state
  const exhibitAvailability = {
    basecamp: !!docentAppState?.exhibits?.basecamp,
    overlook: !!docentAppState?.exhibits?.overlook,
    overlookTablet: !!docentAppState?.exhibits?.summit,
  };

  const setBasecampExhibitState = (state: Partial<ExhibitNavigationState>) => {
    setBasecampExhibitStateRaw((prev) => ({ ...prev, ...state }));
  };
  const setOverlookExhibitState = (state: Partial<ExhibitNavigationState>) => {
    setOverlookExhibitStateRaw((prev) => ({ ...prev, ...state }));
  };

  // Get tour data.
  const fetchTours = async () => {
    setIsTourDataLoading(true);
    try {
      // fetch schedule tours. Endpoint name and data structure is TBD.
      const response = await fetch("/api/tours", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch tours");
      }
      const tours: Tour[] = await response.json();
      setAllTours(tours);
      setLastUpdated(new Date());
      if (currentTour && !tours.find((tour) => tour.id === currentTour.id)) {
        setCurrentTour(null);
      }
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setIsTourDataLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Request sync from GEC when MQTT connects
  useEffect(() => {
    if (!client || !isConnected) return;

    console.log("Docent: Requesting sync from GEC");
    client.sendSync({
      onSuccess: () => console.log("Docent: Sync request sent"),
      onError: (err) => console.error("Docent: Failed to send sync", err),
    });
  }, [client, isConnected]);

  // Subscribe to GEC full state
  useEffect(() => {
    if (!client) return;

    const handleDocentAppState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: DocentAppState = msg.body;
        console.log("Docent: Received GEC state:", state);

        // Save the full state
        setDocentAppState(state);

        // Update tour if provided and different from current
        // Get tour-id from any exhibit (they should all match)
        const tourId =
          state?.exhibits?.basecamp?.["tour-id"] ||
          state?.exhibits?.overlook?.["tour-id"] ||
          state?.exhibits?.summit?.["tour-id"];

        if (tourId && allTours.length > 0) {
          const tour = allTours.find((t) => t.id === tourId);
          if (tour && tour.id !== currentTour?.id) {
            console.log(
              `Tour sync: GEC tour (${tourId}) differs from current tour (${currentTour?.id}), updating...`,
            );
            setCurrentTour(tour);

            // Update URL if we're on a tour page
            // Example: /docent/tour/tour-002/basecamp → /docent/tour/tour-004/basecamp
            if (pathname.includes("/tour/")) {
              const tourPathRegex = /\/tour\/[^\/]+/;
              const newPathname = pathname.replace(
                tourPathRegex,
                `/tour/${tourId}`,
              );
              if (newPathname !== pathname) {
                console.log(`Updating URL from ${pathname} to ${newPathname}`);
                router.replace(newPathname);
              }
            }
          }
        }

        setIsGecStateLoading(false);
      } catch (error) {
        console.error("Docent: Error parsing state:", error);
        setIsGecStateLoading(false);
      }
    };

    client.subscribeToTopic(`state/docent-app`, handleDocentAppState);

    return () => {
      client.unsubscribeFromTopic(`state/docent-app`);
    };
  }, [client, allTours, currentTour?.id]);

  // TBD Subscribe to GEC errors
  useEffect(() => {
    if (!client) return;

    const handleError = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const errorBody = msg.body;
        console.error("Docent: Received GEC error:", errorBody);

        // Show error toast or handle error UI
        // errorBody contains: code, detail, tour-id
        alert(`Error: ${errorBody.code}\n${errorBody.detail}`);
      } catch (error) {
        console.error("Docent: Error parsing error message:", error);
      }
    };

    client.subscribeToTopic(`state/docent-app/error`, handleError);

    return () => {
      client.unsubscribeFromTopic(`state/docent-app/error`);
    };
  }, [client]);

  // Subscribe to CMS sync status from CTRL
  useEffect(() => {
    if (!client) return;

    const handleSync = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const syncState: SyncState = msg.body;
        console.log("Docent: Received sync status:", syncState);

        if (syncState.status === "sync-complete") {
          // Refetch tours after sync completes
          console.log("Sync complete, refetching tours...");
          fetchTours();
        } else if (syncState.status === "sync-in-progress") {
          console.log("Sync in progress...");
          // Could show a loading indicator here
        }
      } catch (error) {
        console.error("Docent: Error parsing sync message:", error);
      }
    };

    client.subscribeToTopic(`state/sync`, handleSync);

    return () => {
      client.unsubscribeFromTopic(`state/sync`);
    };
  }, [client, fetchTours]);

  // Reset navigation states when currentTour changes
  useEffect(() => {
    if (currentTour) {
      console.log("Tour changed, resetting navigation states");
      setBasecampExhibitStateRaw({ momentId: "ambient", beatIdx: 0 });
      setOverlookExhibitStateRaw({ momentId: "ambient", beatIdx: 0 });
      setSummitRoomSlideIdx(0);
      setIsSummitRoomJourneyMapLaunched(false);
    }
  }, [currentTour]);

  return (
    <DocentContext.Provider
      value={{
        allTours,
        currentTour,
        isTourDataLoading,
        isGecStateLoading,
        lastUpdated,
        isConnected,
        setCurrentTour,
        refreshTours: fetchTours,
        isSettingsOpen,
        setIsSettingsOpen,
        basecampExhibitState,
        overlookExhibitState,
        setBasecampExhibitState,
        setOverlookExhibitState,
        // Summit Room state (local UI, user can swipe slides)
        summitRoomSlideIdx,
        setSummitRoomSlideIdx,
        isSummitRoomJourneyMapLaunched,
        setIsSummitRoomJourneyMapLaunched,
        exhibitAvailability,
        docentAppState,
      }}
    >
      {children}
    </DocentContext.Provider>
  );
}

export function useDocent() {
  const context = useContext(DocentContext);
  if (context === undefined) {
    throw new Error("useDocent must be used within a DocentProvider");
  }
  return context;
}
