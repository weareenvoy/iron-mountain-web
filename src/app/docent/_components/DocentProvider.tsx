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
import { Tour } from "@/types";

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
  // Do we store navigation state here?
  basecampMomentIdx: number;
  basecampBeatIdx: number;
  overlookMomentIdx: number;
  overlookBeatIdx: number;
  summitRoomSlideIdx: number;
  setBasecampMomentIdx: (idx: number) => void;
  setBasecampBeatIdx: (idx: number) => void;
  setOverlookMomentIdx: (idx: number) => void;
  setOverlookBeatIdx: (idx: number) => void;
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

  // Navigation state
  // TODO. Do they live here? Or when we click something, we send to GEC, and GEC stores them.
  const [basecampMomentIdx, setBasecampMomentIdx] = useState(0);
  const [basecampBeatIdx, setBasecampBeatIdx] = useState(0);
  const [overlookMomentIdx, setOverlookMomentIdx] = useState(0);
  const [overlookBeatIdx, setOverlookBeatIdx] = useState(0);
  const [summitRoomSlideIdx, setSummitRoomSlideIdx] = useState(0);

  // Get tour data.
  const fetchTours = async () => {
    setIsLoading(true);
    try {
      // TODO fetch schedule tours. Endpoint name and data structure is TBD.
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
      setBasecampMomentIdx(0);
      setBasecampBeatIdx(0);
      setOverlookMomentIdx(0);
      setOverlookBeatIdx(0);
      setSummitRoomSlideIdx(0);
    }
  }, [
    currentTour,
    setBasecampMomentIdx,
    setBasecampBeatIdx,
    setOverlookMomentIdx,
    setOverlookBeatIdx,
    setSummitRoomSlideIdx,
  ]);

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

        // Same question as above. Do they live here.
        basecampMomentIdx,
        basecampBeatIdx,
        overlookMomentIdx,
        overlookBeatIdx,
        summitRoomSlideIdx,
        setBasecampMomentIdx,
        setBasecampBeatIdx,
        setOverlookMomentIdx,
        setOverlookBeatIdx,
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
