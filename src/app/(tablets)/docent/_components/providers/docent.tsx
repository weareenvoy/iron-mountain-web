'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { DocentAppState, type SyncState } from '@/app/(tablets)/docent/_types';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getTours } from '@/lib/internal/data/get-tours';
import type { ExhibitNavigationState, Tour } from '@/lib/internal/types';
import type { Route } from 'next';

const isDocentRoute = (path: string): path is Route => {
  return /^\/docent\/tour\/[^/]+(?:\/(?:basecamp|overlook|summit-room))?$/.test(path);
};

export interface DocentContextType {
  readonly allTours: Tour[];
  readonly basecampExhibitState: ExhibitNavigationState;
  readonly currentTour: null | Tour;
  // Full state from GEC (combines tour, UI mode, exhibit settings)
  readonly docentAppState: DocentAppState | null;
  // Exhibit availability status
  readonly exhibitAvailability: {
    readonly basecamp: boolean;
    readonly overlook: boolean;
    readonly overlookTablet: boolean;
    readonly summit: boolean;
  };
  readonly isConnected: boolean;
  readonly isGecStateLoading: boolean;
  readonly isSettingsOpen: boolean;
  readonly isSummitRoomJourneyMapLaunched: boolean;
  readonly isTourDataLoading: boolean;

  readonly lastUpdated: Date | null;
  readonly overlookExhibitState: ExhibitNavigationState;
  readonly refreshTours: () => Promise<void>;
  readonly setBasecampExhibitState: (state: Partial<ExhibitNavigationState>) => void;

  readonly setCurrentTour: (tour: null | Tour) => void;
  readonly setIsSettingsOpen: (open: boolean) => void;
  readonly setIsSummitRoomJourneyMapLaunched: (launched: boolean) => void;
  readonly setOverlookExhibitState: (state: Partial<ExhibitNavigationState>) => void;

  readonly setSummitRoomSlideIdx: (idx: number) => void;

  // Summit Room state
  readonly summitRoomSlideIdx: number;
}

const DocentContext = createContext<DocentContextType | undefined>(undefined);

type DocentProviderProps = PropsWithChildren<{
  readonly topic?: string; // placeholder for future props
}>;

export const useDocent = () => {
  const context = useContext(DocentContext);
  if (context === undefined) {
    throw new Error('useDocent must be used within a DocentProvider');
  }
  return context;
};

export const DocentProvider = ({ children }: DocentProviderProps) => {
  const { client, isConnected } = useMqtt();
  const router = useRouter();
  const pathname = usePathname();
  const [allTours, setAllTours] = useState<Tour[]>([]);
  const [currentTour, setCurrentTour] = useState<null | Tour>(null);
  const [isTourDataLoading, setIsTourDataLoading] = useState(true);
  const [isGecStateLoading, setIsGecStateLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Beats for basecamp overlook, and slides for summit room.
  const [basecampExhibitState, setBasecampExhibitStateRaw] = useState<ExhibitNavigationState>({
    beatIdx: 0,
    momentId: 'ambient',
  });
  const [overlookExhibitState, setOverlookExhibitStateRaw] = useState<ExhibitNavigationState>({
    beatIdx: 0,
    momentId: 'ambient',
  });
  const [summitRoomSlideIdx, setSummitRoomSlideIdx] = useState(0);
  const [isSummitRoomJourneyMapLaunched, setIsSummitRoomJourneyMapLaunched] = useState(false);

  // Full state from GEC
  const [docentAppState, setDocentAppState] = useState<DocentAppState | null>(null);

  // Derive exhibit availability from GEC state
  const exhibitAvailability = {
    basecamp: !!docentAppState?.exhibits?.basecamp,
    overlook: !!docentAppState?.exhibits?.overlook,
    overlookTablet: !!docentAppState?.exhibits?.summit,
    summit: !!docentAppState?.exhibits?.summit,
  };

  const setBasecampExhibitState = (state: Partial<ExhibitNavigationState>) => {
    setBasecampExhibitStateRaw(prev => ({ ...prev, ...state }));
  };
  const setOverlookExhibitState = (state: Partial<ExhibitNavigationState>) => {
    setOverlookExhibitStateRaw(prev => ({ ...prev, ...state }));
  };

  // Get tour data.
  const fetchTours = useCallback(async () => {
    setIsTourDataLoading(true);
    try {
      const tours: Tour[] = await getTours();
      setAllTours(tours);
      setLastUpdated(new Date());
      if (currentTour && !tours.find(tour => tour.id === currentTour.id)) {
        setCurrentTour(null);
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setIsTourDataLoading(false);
    }
  }, [currentTour]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  // Request sync from GEC when MQTT connects
  useEffect(() => {
    if (!client || !isConnected) return;

    client.sendSync({
      onError: (err: Error) => console.error('Docent: Failed to send sync', err),
      onSuccess: () => console.info('Docent: Sync request sent'),
    });
  }, [client, isConnected]);

  // Subscribe to GEC full state
  useEffect(() => {
    if (!client) return;

    const handleDocentAppState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: DocentAppState = msg.body;
        console.info('Docent: Received GEC state:', state);

        // Save the full state
        setDocentAppState(state);

        // Update tour if provided and different from current
        // Get tour-id from any exhibit (they should all match)
        const tourId =
          state.exhibits?.basecamp?.['tour-id'] ||
          state.exhibits?.overlook?.['tour-id'] ||
          state.exhibits?.summit?.['tour-id'];

        if (tourId && allTours.length > 0) {
          const tour = allTours.find(t => t.id === tourId);
          if (tour && tour.id !== currentTour?.id) {
            console.info(`Tour sync: GEC tour (${tourId}) differs from current tour (${currentTour?.id}), updating...`);
            setCurrentTour(tour);

            // Update URL if we're on a tour page
            // Example: /docent/tour/tour-002/basecamp → /docent/tour/tour-004/basecamp
            if (pathname.includes('/tour/')) {
              const tourPathRegex = /\/tour\/[^\/]+/;
              const newPathname = pathname.replace(tourPathRegex, `/tour/${tourId}`);
              if (newPathname !== pathname && isDocentRoute(newPathname)) {
                console.info(`Updating URL from ${pathname} to ${newPathname}`);
                startTransition(() => {
                  router.replace(newPathname);
                });
              }
            }
          }
        }

        setIsGecStateLoading(false);
      } catch (error) {
        console.error('Docent: Error parsing state:', error);
        setIsGecStateLoading(false);
      }
    };

    client.subscribeToTopic('state/docent-app', handleDocentAppState);

    return () => {
      client.unsubscribeFromTopic('state/docent-app', handleDocentAppState);
    };
  }, [client, allTours, currentTour?.id, pathname, router]);

  // TBD Subscribe to GEC errors
  useEffect(() => {
    if (!client) return;

    const handleError = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const errorBody = msg.body;
        console.error('Docent: Received GEC error:', errorBody);

        // Show error toast or handle error UI
        // errorBody contains: code, detail, tour-id
        alert(`Error: ${errorBody.code}\n${errorBody.detail}`);
      } catch (error) {
        console.error('Docent: Error parsing error message:', error);
      }
    };

    client.subscribeToTopic('state/docent-app/error', handleError);

    return () => {
      client.unsubscribeFromTopic('state/docent-app/error', handleError);
    };
  }, [client]);

  // Subscribe to CMS sync status from CTRL
  useEffect(() => {
    if (!client) return;

    const handleSync = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const syncState: SyncState = msg.body;
        console.info('Docent: Received sync status:', syncState);

        if (syncState.status === 'sync-complete') {
          // Refetch tours after sync completes
          fetchTours();
        } else if (syncState.status === 'sync-in-progress') {
          console.info('Sync in progress...');
          // Could show a loading indicator here
        }
      } catch (error) {
        console.error('Docent: Error parsing sync message:', error);
      }
    };

    client.subscribeToTopic('state/sync', handleSync);

    return () => {
      client.unsubscribeFromTopic('state/sync', handleSync);
    };
  }, [client, fetchTours]);

  // Reset navigation states when currentTour changes
  useEffect(() => {
    if (currentTour) {
      setBasecampExhibitStateRaw({ beatIdx: 0, momentId: 'ambient' });
      setOverlookExhibitStateRaw({ beatIdx: 0, momentId: 'ambient' });
      setSummitRoomSlideIdx(0);
      setIsSummitRoomJourneyMapLaunched(false);
    }
  }, [currentTour]);

  return (
    <DocentContext.Provider
      value={{
        allTours,
        basecampExhibitState,
        currentTour,
        docentAppState,
        exhibitAvailability,
        isConnected,
        isGecStateLoading,
        isSettingsOpen,
        isSummitRoomJourneyMapLaunched,
        isTourDataLoading,
        lastUpdated,
        overlookExhibitState,
        refreshTours: fetchTours,
        setBasecampExhibitState,
        setCurrentTour,
        setIsSettingsOpen,
        setIsSummitRoomJourneyMapLaunched,
        setOverlookExhibitState,
        setSummitRoomSlideIdx,
        // Summit Room state
        summitRoomSlideIdx,
      }}
    >
      {children}
    </DocentContext.Provider>
  );
};

export default DocentProvider;
