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
  const { client } = useMqtt();

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

  // Get kiosk-specific app ID for MQTT (kiosk-1 → kiosk-01)
  const appId = `kiosk-0${kioskId.replace('kiosk-', '')}` as 'kiosk-01' | 'kiosk-02' | 'kiosk-03';

  // Report state to MQTT
  const reportState = useCallback(
    (next: Partial<KioskMqttState>) => {
      if (!client) return;

      const updated = { ...mqttStateRef.current, ...next } as KioskMqttState;
      mqttStateRef.current = updated;
      setMqttState(updated);

      // Report state using the centralized method
      client.reportExhibitState(appId, updated, {
        onError: err => console.error(`${kioskId}: Failed to report state:`, err),
      });
    },
    [appId, client, kioskId]
  );

  const reportStateRef = useRef(reportState);
  reportStateRef.current = reportState;

  // Fetch kiosk content data
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const kioskData = await getKioskData(kioskId);
      setData(kioskData.data);
      setError(null);
      return true;
    } catch (err) {
      // TODO: Replace with proper logging service (DataDog, Sentry, etc.)
      // For now, errors are tracked via the error state and can be logged at a higher level
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [kioskId]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to MQTT commands (load-tour, end-tour)
  // Note: Kiosks are standalone exhibits - each kioskId is treated as its own tour-id
  useEffect(() => {
    if (!client) return;

    // 1. Load tour command
    // When Docent loads ANY tour, ALL kiosks activate (fetch data, report state)
    const handleLoadTour = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const tourId = msg.body?.['tour-id'];

        console.info(`${kioskId}: Received load-tour command (tour: ${tourId}) - activating kiosk`);

        // Fetch fresh kiosk data
        fetchData();

        // Report state with initial beat-id
        reportStateRef.current({ 'beat-id': DEFAULT_KIOSK_BEAT_ID });
      } catch (error) {
        console.error(`${kioskId}: Error parsing load-tour command:`, error);
      }
    };

    // 2. End tour command
    // Full page refresh returns kiosk to pristine idle state (vs stateful reset)
    // This ensures: idle overlay restored, scroll position reset, all nested state cleared
    const handleEndTour = () => {
      console.info(`${kioskId}: Received end-tour command - resetting kiosk`);

      // Report state before refresh
      reportStateRef.current({ 'beat-id': DEFAULT_KIOSK_BEAT_ID });

      // Brief delay to ensure MQTT message is sent before refresh interrupts connection
      setTimeout(() => {
        window.location.reload();
      }, 100);
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic('cmd/dev/all/load-tour', handleLoadTour);
    client.subscribeToTopic('cmd/dev/all/end-tour', handleEndTour);

    return () => {
      client.unsubscribeFromTopic('cmd/dev/all/load-tour', handleLoadTour);
      client.unsubscribeFromTopic('cmd/dev/all/end-tour', handleEndTour);
    };
  }, [client, fetchData, kioskId]);

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
