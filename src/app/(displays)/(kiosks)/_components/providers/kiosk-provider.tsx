'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { DEFAULT_KIOSK_BEAT_ID, type KioskId, type KioskMqttState } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import { useAudio } from '@/components/providers/audio-provider';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getKioskData } from '@/lib/internal/data/get-kiosk';
import { mqttCommands } from '@/lib/mqtt/constants';
import { useExhibitSetVolume } from '@/lib/mqtt/utils/use-exhibit-set-volume';
import type { KioskData } from '@/lib/internal/types';

// This file is used to access data from the Kiosk Provider and make it available to components in the Kiosk setup.

/**
 * Grace period before page reload to ensure MQTT state message is published.
 * MQTT QoS 1 typically delivers within 50-100ms on local network.
 * 100ms ensures message is sent before connection closes during reload.
 */
const MQTT_STATE_REPORT_GRACE_PERIOD_MS = 100;

interface KioskContextType {
  readonly data: KioskData | null;
  readonly error: null | string;
  readonly kioskId: KioskId;
  readonly loading: boolean;
  readonly refetch: () => Promise<boolean>;
}

const KioskContext = createContext<KioskContextType | undefined>(undefined);

export const useKiosk = () => {
  const context = useContext(KioskContext);
  if (context === undefined) {
    throw new Error('useKiosk must be used within a KioskProvider');
  }
  return context;
};

type KioskProviderProps = PropsWithChildren<{
  readonly kioskId: KioskId;
}>;

export const KioskProvider = ({ children, kioskId }: KioskProviderProps) => {
  const audio = useAudio();
  const { client, isConnected } = useMqtt();

  const [data, setData] = useState<KioskData | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  // MQTT state for volume control and beat tracking
  const [mqttState, setMqttState] = useState<KioskMqttState>({
    'beat-id': DEFAULT_KIOSK_BEAT_ID,
    'volume-level': 1.0,
    'volume-muted': false,
  });

  const mqttStateRef = useRef(mqttState);
  mqttStateRef.current = mqttState;

  // Guard flag to prevent concurrent loadTour operations (Fix #2)
  const isLoadingTourRef = useRef(false);

  // AbortController for cancellable fetch operations (Fix #4)
  const abortControllerRef = useRef<AbortController | null>(null);

  // Track endTour polling interval for cleanup
  const endTourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get kiosk-specific app ID for MQTT (kiosk-1 → kiosk-01)
  const appId = `kiosk-0${kioskId.replace('kiosk-', '')}` as 'kiosk-01' | 'kiosk-02' | 'kiosk-03';

  // Report state to MQTT
  const reportState = useCallback(
    (next: Partial<KioskMqttState>) => {
      if (!client || !isConnected) return; // Fix #11: Always check both

      const updated = { ...mqttStateRef.current, ...next } as KioskMqttState;
      mqttStateRef.current = updated;
      setMqttState(updated);

      // Report state using the centralized method
      client.reportExhibitState(appId, updated, {
        onError: err => {
          if (process.env.NODE_ENV === 'development') {
            console.error(`${kioskId}: Failed to report state:`, err);
          }
        },
      });
    },
    [appId, client, isConnected, kioskId]
  );

  const reportStateRef = useRef(reportState);
  reportStateRef.current = reportState;

  // Fetch kiosk content data with abort support (Fix #4)
  const fetchData = useCallback(async (): Promise<boolean> => {
    // Cancel any in-flight fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this fetch
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[${kioskId}] Starting fetchData...`);
    }

    try {
      // Pass abort signal to getKioskData for proper cancellation
      const kioskData = await getKioskData(kioskId, abortController.signal);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[${kioskId}] Data fetched successfully`);
      }

      // Check if this fetch was aborted (component unmounted or new fetch started)
      if (abortController.signal.aborted) {
        return false;
      }

      setData(kioskData.data);
      setError(null);
      return true;
    } catch (err) {
      // Don't update state if fetch was aborted
      if (abortController.signal.aborted) {
        return false;
      }

      if (process.env.NODE_ENV === 'development') {
        console.error(`[${kioskId}] fetchData error:`, err);
      }

      // TODO: Replace with proper logging service (DataDog, Sentry, etc.)
      // For now, errors are tracked via the error state and can be logged at a higher level
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      // Don't update loading state if aborted
      if (!abortController.signal.aborted) {
        setLoading(false);
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${kioskId}] fetchData completed, loading=false`);
        }
      }
      // Clean up controller reference
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [kioskId]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to MQTT commands (load-tour, end-tour)
  // Note: Kiosks are standalone exhibits - each kioskId is treated as its own tour-id
  useEffect(() => {
    if (!client || !isConnected) return undefined; // Fix #11: Always check both

    // 1. Load tour command
    // When Docent loads ANY tour, ALL kiosks activate (fetch data, report state)
    // Fix #2: Guard against concurrent loadTour operations
    const handleLoadTour = async (message: Buffer) => {
      // Prevent concurrent loadTour operations (Fix #2)
      if (isLoadingTourRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`${kioskId}: Ignoring loadTour - already loading tour`);
        }
        return;
      }

      try {
        const msg = JSON.parse(message.toString());
        const tourId = msg.body?.['tour-id'];

        if (process.env.NODE_ENV === 'development') {
          console.info(`${kioskId}: Received load-tour command (tour: ${tourId}) - activating kiosk`);
        }

        // Mark as loading to prevent concurrent operations
        isLoadingTourRef.current = true;

        // Fetch fresh kiosk data
        const success = await fetchData();

        // Report active state only after successful fetch (Fix #8)
        if (success) {
          reportStateRef.current({ 'beat-id': 'kiosk-active' });
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error(`${kioskId}: Failed to load tour data`);
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`${kioskId}: Error handling load-tour command:`, error);
        }
      } finally {
        // Always clear loading flag
        isLoadingTourRef.current = false;
      }
    };

    // 2. End tour command
    // Full page refresh returns kiosk to pristine idle state (vs stateful reset)
    // This ensures: idle overlay restored, scroll position reset, all nested state cleared
    const handleEndTour = () => {
      // Fix #3: Check if tour is currently loading
      if (isLoadingTourRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`${kioskId}: Delaying endTour - tour is still loading`);
        }

        // Clear any existing interval before creating a new one
        if (endTourIntervalRef.current) {
          clearInterval(endTourIntervalRef.current);
        }

        // Wait for load to complete before ending tour
        endTourIntervalRef.current = setInterval(() => {
          if (!isLoadingTourRef.current) {
            if (endTourIntervalRef.current) {
              clearInterval(endTourIntervalRef.current);
              endTourIntervalRef.current = null;
            }
            performEndTour();
          }
        }, 50);

        return;
      }

      performEndTour();
    };

    const performEndTour = () => {
      if (process.env.NODE_ENV === 'development') {
        console.info(`${kioskId}: Received end-tour command - resetting kiosk`);
      }

      // Report idle state before refresh (tour has ended, returning to attract screen)
      reportStateRef.current({ 'beat-id': DEFAULT_KIOSK_BEAT_ID }); // 'kiosk-idle'

      // Brief delay to ensure MQTT message is sent before refresh interrupts connection
      // Fix #9: Use constant instead of magic number
      setTimeout(() => {
        window.location.reload();
      }, MQTT_STATE_REPORT_GRACE_PERIOD_MS);
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic(mqttCommands.broadcast.loadTour, handleLoadTour);
    client.subscribeToTopic(mqttCommands.broadcast.endTour, handleEndTour);

    return () => {
      client.unsubscribeFromTopic(mqttCommands.broadcast.loadTour, handleLoadTour);
      client.unsubscribeFromTopic(mqttCommands.broadcast.endTour, handleEndTour);

      // Clear endTour polling interval if active
      if (endTourIntervalRef.current) {
        clearInterval(endTourIntervalRef.current);
        endTourIntervalRef.current = null;
      }

      // Cancel any in-flight fetch on unmount (Fix #4)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [client, fetchData, isConnected, kioskId]);

  // Shared hook for handling set-volume commands
  useExhibitSetVolume({
    appId,
    audio,
    client,
    reportStateRef,
    stateRef: mqttStateRef,
  });

  const contextValue = useMemo<KioskContextType>(
    () => ({
      data,
      error,
      kioskId,
      loading,
      refetch: fetchData,
    }),
    [data, error, fetchData, kioskId, loading]
  );

  return <KioskContext.Provider value={contextValue}>{children}</KioskContext.Provider>;
};

export default KioskProvider;
