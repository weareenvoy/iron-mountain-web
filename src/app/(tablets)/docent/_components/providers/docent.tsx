'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { type DocentAppState, type SyncState } from '@/app/(tablets)/docent/_types';
import { getTourIdFromGecState, isDocentRoute, requireDocentData } from '@/app/(tablets)/docent/_utils';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getBasecampData } from '@/lib/internal/data/get-basecamp';
import { getDocentInitialData } from '@/lib/internal/data/get-docent';
import { getToursData } from '@/lib/internal/data/get-tours';
import type { ApiTour, BasecampData, DocentData, Locale } from '@/lib/internal/types';

export interface DocentContextType {
  // Basecamp data (for summit room journey-1 title)
  readonly basecampData: BasecampData | null;
  // Derived from tourId + tours
  readonly currentTour: ApiTour | null;
  readonly data: DocentData | null;
  // Full state from GEC (combines tour, UI mode, exhibit settings)
  readonly docentAppState: DocentAppState | null;
  readonly isConnected: boolean;
  readonly isGecStateLoading: boolean;
  readonly isSettingsOpen: boolean;
  readonly isTourDataLoading: boolean;
  readonly lastUpdated: Date | null;
  readonly locale: Locale;
  readonly refreshData: () => Promise<void>;
  readonly setIsSettingsOpen: (open: boolean) => void;
  readonly setLocale: (locale: Locale) => void;
  // Tour ID from GEC - source of truth
  readonly tourId: null | string;
  // Tours from /api/tours endpoint
  readonly tours: readonly ApiTour[];
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
  // Tours from separate endpoint (not locale-dependent)
  const [tours, setTours] = useState<readonly ApiTour[]>([]);
  // Basecamp data (for summit room journey-1 title)
  const [basecampData, setBasecampData] = useState<BasecampData | null>(null);
  // Tour ID from GEC - source of truth (string for GEC compatibility)
  const [tourId, setTourId] = useState<null | string>(null);
  const [isTourDataLoading, setIsTourDataLoading] = useState(true);
  const [isGecStateLoading, setIsGecStateLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Full state from GEC
  const [docentAppState, setDocentAppState] = useState<DocentAppState | null>(null);

  // Ref to keep latest pathname without triggering re-subscriptions
  const pathnameRef = useRef(pathname);

  // Keep ref in sync with latest pathname
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Fetch all docent data (initial config + tours + basecamp from separate endpoints)
  const fetchDocentData = useCallback(async () => {
    setIsTourDataLoading(true);
    try {
      // Fetch docent endpoints in parallel. Basecamp is best-effort and should not block docent.
      const [initialData, toursData] = await Promise.all([getDocentInitialData(), getToursData()]);
      const basecampResult = await getBasecampData().catch(error => {
        console.error('Failed to fetch basecamp data:', error);
        return null;
      });

      // Validate CMS data at the boundary - fail fast if required fields are missing
      // This ensures components can trust data is complete without optional chaining
      const validatedEn = requireDocentData(initialData.data.en);
      const validatedPt = requireDocentData(initialData.data.pt);

      setDataByLocale({
        en: validatedEn,
        pt: validatedPt,
      });
      setTours(toursData.tours);
      setBasecampData(basecampResult?.data ?? null);
      setLastUpdated(new Date());

      // Clear tourId if the tour no longer exists in the data
      // Tour IDs from API are numbers, but GEC uses strings - compare as strings
      if (tourId && !toursData.tours.find(tour => String(tour.id) === tourId)) {
        console.info(`Tour ${tourId} no longer exists in data, clearing...`);
        setTourId(null);
      }
    } catch (error) {
      console.error('Failed to fetch docent data:', error);
    } finally {
      setIsTourDataLoading(false);
    }
  }, [tourId]);

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
        // Batch all state updates to prevent interleaving if GEC sends rapid updates
        startTransition(() => {
          // Save the full state - beat states are derived from this via useMemo
          setDocentAppState(state);

          // Get tour-id from GEC state - this is the source of truth
          const gecTourId = getTourIdFromGecState(state);
          setTourId(gecTourId);

          setIsGecStateLoading(false);
        });
      } catch (error) {
        console.error('Docent: Error parsing state:', error);
        setIsGecStateLoading(false);
      }
    };

    client.subscribeToTopic('state/gec', handleDocentAppState);

    return () => {
      client.unsubscribeFromTopic('state/gec', handleDocentAppState);
    };
  }, [client]);

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

  // Derive currentTour from tourId + tours
  // Tour IDs from API are numbers, but GEC uses strings - compare as strings
  const currentTour = useMemo(() => {
    if (!tourId || tours.length === 0) return null;
    return tours.find(t => String(t.id) === tourId) ?? null;
  }, [tourId, tours]);

  // Track previous tourId for navigation
  const prevTourIdRef = useRef<null | string>(null);

  // Navigate when tourId changes (GEC confirms a tour)
  useEffect(() => {
    // Skip if tourId hasn't changed or is null
    if (tourId === prevTourIdRef.current || !tourId) {
      prevTourIdRef.current = tourId;
      return;
    }

    // Validate tour exists in data
    // Tour IDs from API are numbers, but GEC uses strings - compare as strings
    if (!tours.find(t => String(t.id) === tourId)) {
      console.warn(`Tour ${tourId} not found in data, skipping navigation`);
      prevTourIdRef.current = tourId;
      return;
    }

    const currentPathname = pathnameRef.current;
    if (currentPathname.includes('/tour/')) {
      // Update URL if we're on a tour page
      // Example: /docent/tour/tour-002/basecamp → /docent/tour/tour-004/basecamp
      const tourPathRegex = /\/tour\/[^\/]+/;
      const newPathname = currentPathname.replace(tourPathRegex, `/tour/${tourId}`);
      if (newPathname !== currentPathname && isDocentRoute(newPathname)) {
        console.info(`Updating URL from ${currentPathname} to ${newPathname}`);
        startTransition(() => {
          router.replace(newPathname);
        });
      }
    } else {
      // Navigate to tour overview when GEC confirms a tour and we're not on a tour page
      console.info(`Navigating to tour overview for tour ${tourId}`);
      startTransition(() => {
        router.push(`/docent/tour/${tourId}`);
      });
    }

    prevTourIdRef.current = tourId;
  }, [router, tourId, tours]);

  const contextValue = {
    basecampData,
    currentTour,
    data,
    docentAppState,
    isConnected,
    isGecStateLoading,
    isSettingsOpen,
    isTourDataLoading,
    lastUpdated,
    locale,
    refreshData: fetchDocentData,
    setIsSettingsOpen,
    setLocale,
    tourId,
    tours,
  };

  return <DocentContext.Provider value={contextValue}>{children}</DocentContext.Provider>;
};

export default DocentProvider;
