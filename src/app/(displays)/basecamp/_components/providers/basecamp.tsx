'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getBasecampData } from '@/lib/internal/data/get-basecamp';
import { isBasecampSection, type BasecampData, type ExhibitNavigationState, type Locale } from '@/lib/internal/types';
import type { ExhibitMqttStateBase } from '@/lib/mqtt/types';

interface BasecampContextType {
  data: BasecampData | null;
  error: null | string;
  exhibitState: ExhibitNavigationState;
  loading: boolean;
  locale: Locale;
  readyBeatId: null | string;
  setReadyBeatId: (beatId: null | string) => void;
}

export const BasecampContext = createContext<BasecampContextType | undefined>(undefined);

type BasecampProviderProps = PropsWithChildren<{
  readonly topic?: string; // placeholder for future props
}>;

export const useBasecamp = () => {
  const context = useContext(BasecampContext);
  if (context === undefined) {
    throw new Error('useBasecamp must be used within a BasecampProvider');
  }
  return context;
};

export const BasecampProvider = ({ children }: BasecampProviderProps) => {
  const { client } = useMqtt();

  // UI navigation state (local)
  const [exhibitState, setExhibitState] = useState<ExhibitNavigationState>({
    beatIdx: 0,
    momentId: 'ambient',
  });

  // Which beat's video is ready. Foreground compares its beatId to this.
  const [readyBeatId, setReadyBeatId] = useState<null | string>(null);

  // MQTT state (what we report to GEC)
  const [mqttState, setMqttState] = useState<ExhibitMqttStateBase>({
    'beat-id': 'ambient-1',
    'volume-level': 1.0,
    'volume-muted': false,
  });

  // Ref to access latest mqttState without causing dependency changes. Avoids re-subscription.
  const mqttStateRef = useRef(mqttState);
  mqttStateRef.current = mqttState;

  const [data, setData] = useState<BasecampData | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  // Fetch basecamp content data
  const fetchData = useCallback(async (id?: null | string) => {
    console.info('Fetching basecamp data for tour:', id);
    setLoading(true);

    try {
      const basecampData = await getBasecampData();
      setData(basecampData.data);
      setLocale(basecampData.locale);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching basecamp data:', err);
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
    (newState: Partial<ExhibitMqttStateBase>) => {
      if (!client) return;

      // Compute updated state first, update ref immediately for consistency
      const updatedState = { ...mqttStateRef.current, ...newState };
      mqttStateRef.current = updatedState;

      // Update React state (pure function - no side effects)
      setMqttState(prev => ({ ...prev, ...newState }));

      // Side effect runs outside the updater with fresh ref value
      client.reportExhibitState('basecamp', updatedState, {
        onError: err => console.error('Basecamp: Failed to report state:', err),
      });
    },
    [client]
  );

  // Subscribe to GEC commands (broadcasts to ALL exhibits)
  useEffect(() => {
    if (!client) return;

    // 1. Load tour command from GEC (broadcast to all exhibits)
    const handleLoadTour = async (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const tourId = msg.body?.['tour-id'];
        console.info('Basecamp received load-tour command:', tourId);

        if (tourId) {
          // Fetch tour-specific data for this tour
          // For now, just fetch the generic basecamp data
          const success = await fetchData(tourId);

          if (success) {
            // Only report loaded state after data is fetched
            setExhibitState({ beatIdx: 0, momentId: 'ambient' });
            reportState({
              'beat-id': 'ambient-1',
              'volume-level': 1.0,
              'volume-muted': false,
            });
          } else {
            console.error('Basecamp: Failed to fetch tour data for tour:', tourId);
          }
        }
      } catch (error) {
        console.error('Basecamp: Error parsing load-tour command:', error);
      }
    };

    // 2. End tour command (broadcast to all exhibits)
    const handleEndTour = () => {
      console.info('Basecamp received end-tour command');

      // Reset to ambient state with no tour
      setExhibitState({ beatIdx: 0, momentId: 'ambient' });
      reportState({
        'beat-id': 'ambient-1',
        'volume-level': 0.0,
        'volume-muted': false,
      });
    };

    // 3. Goto beat command (direct from Docent)
    const handleGotoBeat = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const beatId = msg.body?.['beat-id'];
        console.info('Basecamp received goto-beat command:', beatId);

        if (beatId) {
          // Parse beat-id format: ${moment}-${beatNumber} (e.g., "ambient-1", "welcome-3", "protect-2")
          const lastDashIndex = beatId.lastIndexOf('-');
          if (lastDashIndex === -1) {
            console.error('Invalid beat-id format:', beatId);
            return;
          }

          const momentId = beatId.substring(0, lastDashIndex);
          const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

          if (isNaN(beatNumber) || beatNumber < 1) {
            console.error('Invalid beat number in beat-id:', beatId);
            return;
          }

          // Validate that momentId is a valid BasecampSection
          if (!isBasecampSection(momentId)) {
            console.error('Invalid moment ID for Basecamp:', momentId);
            return;
          }

          // Convert 1-indexed beat number to 0-indexed
          const beatIdx = beatNumber - 1;

          console.info(`Parsed beat: moment=${momentId}, beatIdx=${beatIdx}`);
          setExhibitState({ beatIdx, momentId });

          // Report updated state with new beat-id
          reportState({ 'beat-id': beatId });
        }
      } catch (error) {
        console.error('Basecamp: Error parsing goto-beat command:', error);
      }
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic('cmd/dev/all/load-tour', handleLoadTour);
    client.subscribeToTopic('cmd/dev/all/end-tour', handleEndTour);
    // Also subscribe to basecamp-specific goto-beat (direct from Docent)
    client.subscribeToTopic('cmd/dev/basecamp/goto-beat', handleGotoBeat);

    return () => {
      client.unsubscribeFromTopic('cmd/dev/all/load-tour', handleLoadTour);
      client.unsubscribeFromTopic('cmd/dev/all/end-tour', handleEndTour);
      client.unsubscribeFromTopic('cmd/dev/basecamp/goto-beat', handleGotoBeat);
    };
  }, [client, fetchData, reportState]);

  // Subscribe to own state on boot (for restart/recovery)
  // This allows exhibit to restore state after refresh
  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: ExhibitMqttStateBase = msg.body;
        console.info('Basecamp: Received own state on boot:', state);

        // Update internal MQTT state
        setMqttState(state);

        // Parse beat-id to update UI navigation state
        if (state['beat-id']) {
          const lastDashIndex = state['beat-id'].lastIndexOf('-');
          if (lastDashIndex !== -1) {
            const momentId = state['beat-id'].substring(0, lastDashIndex);
            const beatNumber = parseInt(state['beat-id'].substring(lastDashIndex + 1), 10);

            // Validate that momentId is a valid BasecampSection before using it
            if (!isNaN(beatNumber) && beatNumber >= 1 && isBasecampSection(momentId)) {
              setExhibitState({ beatIdx: beatNumber - 1, momentId });
            } else {
              console.warn('Invalid beat-id format or moment ID:', state['beat-id']);
            }
          }
        }

        // Fetch content if we have a tour loaded
        fetchData();
        // We just need to get retained state once, so unsubscribe after we got the state
        client.unsubscribeFromTopic('state/basecamp', handleOwnState);
      } catch (error) {
        console.error('Basecamp: Error parsing own state:', error);
      }
    };

    // Subscribe once on mount to get retained state
    client.subscribeToTopic('state/basecamp', handleOwnState);

    return () => {
      client.unsubscribeFromTopic('state/basecamp', handleOwnState);
    };
  }, [client, fetchData]);

  const contextValue = {
    data,
    error,
    exhibitState,
    loading,
    locale,
    readyBeatId,
    setReadyBeatId,
  };

  return <BasecampContext.Provider value={contextValue}>{children}</BasecampContext.Provider>;
};

export default BasecampProvider;
