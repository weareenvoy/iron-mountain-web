"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useMqtt } from "@/providers/MqttProvider";
import { usePathname } from "next/navigation";
import { Tour, ExhibitState } from "@/types";

export interface DocentContextType {
  allTours: Tour[];
  currentTour: Tour | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  isConnected: boolean;
  setCurrentTour: (tour: Tour | null) => void;
  refreshTours: () => Promise<void>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // TODO store 3 exhibits' states here?
  basecampExhibitState: ExhibitState;
  overlookExhibitState: ExhibitState;
  summitRoomSlideIdx: number;
  setBasecampExhibitState: (state: Partial<ExhibitState>) => void;
  setOverlookExhibitState: (state: Partial<ExhibitState>) => void;
  setSummitRoomSlideIdx: (idx: number) => void;
}

const DocentContext = createContext<DocentContextType | undefined>(undefined);

interface DocentProviderProps {
  children: ReactNode;
}

export function DocentProvider({ children }: DocentProviderProps) {
  const { isConnected } = useMqtt();
  const pathname = usePathname();
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [currentTour, setCurrentTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Beats for basecamp overlook, and slides for summit room.
  const [basecampExhibitState, setBasecampExhibitStateRaw] =
    useState<ExhibitState>({ momentId: "ambient", beatIdx: 0 });
  const [overlookExhibitState, setOverlookExhibitStateRaw] =
    useState<ExhibitState>({ momentId: "ambient", beatIdx: 0 });
  const [summitRoomSlideIdx, setSummitRoomSlideIdx] = useState(0);

  const setBasecampExhibitState = (state: Partial<ExhibitState>) => {
    setBasecampExhibitStateRaw((prev) => ({ ...prev, ...state }));
  };
  const setOverlookExhibitState = (state: Partial<ExhibitState>) => {
    setOverlookExhibitStateRaw((prev) => ({ ...prev, ...state }));
  };

  // Get tour data.
  const fetchTours = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Auto-recover currentTour from URL when tours are loaded
  useEffect(() => {
    if (isLoading || currentTour || allTours.length === 0) {
      return;
    }

    // Extract tourId from pathname: /docent/tour/[tourId]/...
    const pathParts = pathname.split("/");
    const tourIdIndex = pathParts.findIndex((part) => part === "tour") + 1;
    const tourId = pathParts[tourIdIndex];

    if (tourId) {
      const tour = allTours.find((t) => t.id === tourId);
      if (tour) {
        console.log("Auto-setting currentTour from URL:", tour);
        setCurrentTour(tour);
      }
    }
  }, [pathname, allTours, currentTour, isLoading]);

  // Reset navigation states when currentTour changes
  useEffect(() => {
    if (currentTour) {
      console.log("Tour changed, resetting navigation states");
      setBasecampExhibitStateRaw({ momentId: "ambient", beatIdx: 0 });
      setOverlookExhibitStateRaw({ momentId: "ambient", beatIdx: 0 });
      setSummitRoomSlideIdx(0);
    }
  }, [currentTour]);

  return (
    <DocentContext.Provider
      value={{
        allTours,
        currentTour,
        isLoading,
        lastUpdated,
        isConnected,
        setCurrentTour,
        refreshTours: fetchTours,
        isSettingsOpen,
        setIsSettingsOpen,
        basecampExhibitState,
        overlookExhibitState,
        summitRoomSlideIdx,
        setBasecampExhibitState,
        setOverlookExhibitState,
        setSummitRoomSlideIdx,
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
