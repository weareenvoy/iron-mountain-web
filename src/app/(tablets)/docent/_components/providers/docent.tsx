'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { type DocentAppState, type SyncState } from '@/app/(tablets)/docent/_types';
import {
  getTourIdFromGecState,
  isDocentRoute,
  parseBasecampBeatId,
  parseOverlookBeatId,
  parseSummitBeatId,
} from '@/app/(tablets)/docent/_utils';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getDocentData } from '@/lib/internal/data/get-docent';
import type {
  DocentData,
  ExhibitBeatId,
  ExhibitNavigationState,
  Locale,
  SummitRoomBeatId,
  Tour,
} from '@/lib/internal/types';

export interface DocentContextType {
  readonly basecampExhibitState: ExhibitNavigationState;
  readonly currentTour: null | Tour;
  readonly data: DocentData | null;
  // Full state from GEC (combines tour, UI mode, exhibit settings)
  readonly docentAppState: DocentAppState | null;
  readonly isConnected: boolean;
  readonly isGecStateLoading: boolean;
  readonly isSettingsOpen: boolean;
  readonly isTourDataLoading: boolean;
  readonly lastUpdated: Date | null;
  readonly locale: Locale;
  readonly overlookExhibitState: ExhibitNavigationState;
  readonly refreshData: () => Promise<void>;
  readonly setBasecampExhibitState: (state: Partial<ExhibitNavigationState>) => void;
  readonly setCurrentTour: (tour: null | Tour) => void;
  readonly setIsSettingsOpen: (open: boolean) => void;
  readonly setLocale: (locale: Locale) => void;
  readonly setOverlookExhibitState: (state: Partial<ExhibitNavigationState>) => void;
  readonly setOverlookPresentationMode: (presentationMode: boolean) => void;
  readonly setSummitRoomBeatId: (beatId: SummitRoomBeatId) => void;
  // Summit Room state - 'journey-intro' or 'journey-1' through 'journey-5'
  readonly summitRoomBeatId: SummitRoomBeatId;
}

export const DocentContext = createContext<DocentContextType | undefined>(undefined);

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
  const [dataByLocale, setDataByLocale] = useState<{ en: DocentData | null; pt: DocentData | null }>({
    en: null,
    pt: null,
  });
  const [locale, setLocale] = useState<Locale>('en');
  const [currentTour, setCurrentTour] = useState<null | Tour>(null);
  const [isTourDataLoading, setIsTourDataLoading] = useState(true);
  const [isGecStateLoading, setIsGecStateLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Full state from GEC
  const [docentAppState, setDocentAppState] = useState<DocentAppState | null>(null);

  // Derive beat states from GEC state (always listen to state/gec updates)
  const basecampBeatId = docentAppState?.exhibits?.basecamp['beat-id'];
  const basecampExhibitState: ExhibitNavigationState = useMemo(() => {
    if (basecampBeatId) {
      const parsed = parseBasecampBeatId(basecampBeatId);
      if (parsed) return parsed;
    }
    return { beatIdx: 0, momentId: 'ambient' };
  }, [basecampBeatId]);

  const overlookBeatId = docentAppState?.exhibits?.['overlook-wall']?.['beat-id'];
  const overlookExhibitState: ExhibitNavigationState = useMemo(() => {
    if (overlookBeatId) {
      const parsed = parseOverlookBeatId(overlookBeatId);
      if (parsed) return parsed;
    }
    return { beatIdx: 0, momentId: 'ambient' };
  }, [overlookBeatId]);

  const summitBeatId = docentAppState?.exhibits?.summit?.['beat-id'];
  const summitRoomBeatId: SummitRoomBeatId = useMemo(() => {
    if (summitBeatId) {
      const parsed = parseSummitBeatId(summitBeatId);
      if (parsed) return parsed;
    }
    return 'journey-intro';
  }, [summitBeatId]);

  // Setters only send MQTT commands - state will be updated via state/gec
  const setBasecampExhibitState = useCallback(
    (state: Partial<ExhibitNavigationState>) => {
      // Find the beat handle from the state
      const data = dataByLocale[locale];
      if (!data?.basecampMoments || !client) return;

      const moment = data.basecampMoments.find(m => m.handle === state.momentId);
      if (!moment || state.beatIdx === undefined) return;

      const beat = moment.beats[state.beatIdx];
      if (!beat) return;

      // Send MQTT command - GEC will update state/gec which will update our derived state
      client.gotoBeat('basecamp', beat.handle as ExhibitBeatId, {
        onError: (err: Error) => console.error('Failed to send goto-beat to basecamp:', err),
        onSuccess: () => console.info(`Sent goto-beat: ${beat.handle} to basecamp`),
      });
    },
    [client, dataByLocale, locale]
  );

  const setOverlookExhibitState = useCallback(
    (state: Partial<ExhibitNavigationState>) => {
      // Find the beat handle from the state
      const data = dataByLocale[locale];
      if (!data?.overlookMoments || !client) return;

      const moment = data.overlookMoments.find(m => m.handle === state.momentId);
      if (!moment || state.beatIdx === undefined) return;

      const beat = moment.beats[state.beatIdx];
      if (!beat) return;

      // Send MQTT command with presentation-mode: false when clicking a real beat
      // GEC will update state/gec which will update our derived state
      client.gotoBeat(
        'overlook-wall',
        beat.handle as ExhibitBeatId,
        {
          onError: (err: Error) => console.error('Failed to send goto-beat to overlook:', err),
          onSuccess: () => console.info(`Sent goto-beat: ${beat.handle} to overlook`),
        },
        false
      );
    },
    [client, dataByLocale, locale]
  );

  const setOverlookPresentationMode = useCallback(
    (presentationMode: boolean) => {
      if (!client) return;

      // Send MQTT command with only presentation-mode (no beat-id)
      // GEC will update state/gec which will update our derived state
      client.setPresentationMode('overlook-wall', presentationMode, {
        onError: (err: Error) => console.error('Failed to send presentation-mode to overlook:', err),
        onSuccess: () => console.info(`Sent presentation-mode: ${presentationMode} to overlook`),
      });
    },
    [client]
  );

  const setSummitRoomBeatId = useCallback(
    (beatId: SummitRoomBeatId) => {
      if (!client) return;

      // Send MQTT command - GEC will update state/gec which will update our derived state
      client.gotoBeat('summit', beatId, {
        onError: (err: Error) => console.error('Failed to send goto-beat to summit:', err),
        onSuccess: () => console.info(`Sent goto-beat: ${beatId} to summit`),
      });
    },
    [client]
  );

  // Fetch all docent data (includes tours and slides)
  const fetchDocentData = useCallback(async () => {
    setIsTourDataLoading(true);
    try {
      const docentData = await getDocentData();
      setDataByLocale({
        en: docentData.data.en,
        pt: docentData.data.pt,
      });
      setLastUpdated(new Date());

      const currentData = docentData.data[locale];
      if (currentTour && !currentData.tours.find(tour => tour.id === currentTour.id)) {
        setCurrentTour(null);
      }
    } catch (error) {
      console.error('Failed to fetch docent data:', error);
    } finally {
      setIsTourDataLoading(false);
    }
  }, [currentTour, locale]);

  useEffect(() => {
    fetchDocentData();
  }, [fetchDocentData]);

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

        // TODO TBD still under discussion what topic to use to get the data. Or do we even use a topic.
        // Save the full state - beat states are derived from this via useMemo
        setDocentAppState(state);

        // Update tour if provided and different from current
        // Get tour-id from any exhibit (they should all match)
        const tourId = getTourIdFromGecState(state);
        const allTours = dataByLocale[locale]?.tours ?? [];

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

    client.subscribeToTopic('state/gec', handleDocentAppState);

    return () => {
      client.unsubscribeFromTopic('state/gec', handleDocentAppState);
    };
  }, [client, dataByLocale, locale, currentTour?.id, pathname, router]);

  // Subscribe to sync state
  useEffect(() => {
    if (!client) return;

    const handleSync = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const syncState: SyncState = msg.body;
        console.info('Docent: Received sync status:', syncState);

        if (syncState.status === 'sync-complete') {
          // Refetch docent data after sync completes
          fetchDocentData();
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
  }, [client, fetchDocentData]);

  // Note: Beat states are now derived from GEC state, so they will automatically
  // update when GEC publishes new state. No need to reset on tour changes.

  // Get current locale's data
  const data = dataByLocale[locale];

  const contextValue = {
    basecampExhibitState,
    currentTour,
    data,
    docentAppState,
    isConnected,
    isGecStateLoading,
    isSettingsOpen,
    isTourDataLoading,
    lastUpdated,
    locale,
    overlookExhibitState,
    refreshData: fetchDocentData,
    setBasecampExhibitState,
    setCurrentTour,
    setIsSettingsOpen,
    setLocale,
    setOverlookExhibitState,
    setOverlookPresentationMode,
    setSummitRoomBeatId,
    summitRoomBeatId,
  };

  return <DocentContext.Provider value={contextValue}>{children}</DocentContext.Provider>;
};

export default DocentProvider;
