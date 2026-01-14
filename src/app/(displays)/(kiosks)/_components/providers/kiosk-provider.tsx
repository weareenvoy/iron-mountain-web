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
  type RefObject,
} from 'react';
import { DEFAULT_KIOSK_BEAT_ID, type KioskId, type KioskMqttState } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import { useAudio } from '@/components/providers/audio-provider';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getKioskData } from '@/lib/internal/data/get-kiosk';
import { useExhibitSetVolume } from '@/lib/mqtt/utils/use-exhibit-set-volume';
import type { KioskData } from '@/lib/internal/types';
import type { ExhibitMqttStateBase } from '@/lib/mqtt/types';

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
        onError: err => console.error(`${kioskId}: Failed to report state:`, err),
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

    try {
      const kioskData = await getKioskData(kioskId);

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

      // TODO: Replace with proper logging service (DataDog, Sentry, etc.)
      // For now, errors are tracked via the error state and can be logged at a higher level
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      // Don't update loading state if aborted
      if (!abortController.signal.aborted) {
        setLoading(false);
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
        console.warn(`${kioskId}: Ignoring loadTour - already loading tour`);
        return;
      }

      try {
        const msg = JSON.parse(message.toString());
        const tourId = msg.body?.['tour-id'];

        console.info(`${kioskId}: Received load-tour command (tour: ${tourId}) - activating kiosk`);

        // Mark as loading to prevent concurrent operations
        isLoadingTourRef.current = true;

        // Fetch fresh kiosk data
        const success = await fetchData();

        // Report active state only after successful fetch (Fix #8)
        if (success) {
          reportStateRef.current({ 'beat-id': 'kiosk-active' });
        } else {
          console.error(`${kioskId}: Failed to load tour data`);
        }
      } catch (error) {
        console.error(`${kioskId}: Error handling load-tour command:`, error);
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
        console.warn(`${kioskId}: Delaying endTour - tour is still loading`);

        // Wait for load to complete before ending tour
        const checkInterval = setInterval(() => {
          if (!isLoadingTourRef.current) {
            clearInterval(checkInterval);
            performEndTour();
          }
        }, 50);

        return;
      }

      performEndTour();
    };

    const performEndTour = () => {
      console.info(`${kioskId}: Received end-tour command - resetting kiosk`);

      // Report idle state before refresh (tour has ended, returning to attract screen)
      reportStateRef.current({ 'beat-id': DEFAULT_KIOSK_BEAT_ID }); // 'kiosk-idle'

      // Brief delay to ensure MQTT message is sent before refresh interrupts connection
      // Fix #9: Use constant instead of magic number
      setTimeout(() => {
        window.location.reload();
      }, MQTT_STATE_REPORT_GRACE_PERIOD_MS);
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic('cmd/dev/all/load-tour', handleLoadTour);
    client.subscribeToTopic('cmd/dev/all/end-tour', handleEndTour);

    return () => {
      client.unsubscribeFromTopic('cmd/dev/all/load-tour', handleLoadTour);
      client.unsubscribeFromTopic('cmd/dev/all/end-tour', handleEndTour);

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
    reportStateRef: reportStateRef as RefObject<(next: Partial<ExhibitMqttStateBase>) => void>,
    stateRef: mqttStateRef as RefObject<ExhibitMqttStateBase>,
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
