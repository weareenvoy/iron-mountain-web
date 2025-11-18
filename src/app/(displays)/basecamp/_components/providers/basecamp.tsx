'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import type { BasecampData } from '@/app/(displays)/basecamp/_types';
import type { ExhibitNavigationState } from '@/lib/_internal/types';
import type { ExhibitMqttState } from '@/lib/mqtt/types';

interface BasecampContextType {
  data: BasecampData | null;
  error: null | string;
  exhibitState: ExhibitNavigationState;
  loading: boolean;
}

const BasecampContext = createContext<BasecampContextType | undefined>(undefined);

interface BasecampProviderProps {
  children: React.ReactNode;
}

export function useBasecamp() {
  const context = useContext(BasecampContext);
  if (context === undefined) {
    throw new Error('useBasecamp must be used within a BasecampProvider');
  }
  return context;
}

export function BasecampProvider({ children }: BasecampProviderProps) {
  const { client } = useMqtt();

  // UI navigation state (local)
  const [exhibitState, setExhibitState] = useState<ExhibitNavigationState>({
    beatIdx: 0,
    momentId: 'ambient',
  });

  // MQTT state (what we report to GEC)
  const [mqttState, setMqttState] = useState<ExhibitMqttState>({
    'slide': 'idle',
    'tour-id': null,
    'volume-level': 1.0,
    'volume-muted': false,
  });

  const [data, setData] = useState<BasecampData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  // Fetch basecamp content data
  const fetchData = useCallback(async (_id?: null | string) => {
    setLoading(true);
    try {
      // TODO use actual API once it's ready. For now no tourId is needed in params.
      const response = await fetch('/api/basecamp');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch basecamp data');
      }
      const basecampData = await response.json();
      setData(basecampData);
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
    (newState: Partial<ExhibitMqttState>) => {
      if (!client) return;

      const updatedState = { ...mqttState, ...newState };
      setMqttState(updatedState);

      client.reportExhibitState('basecamp', updatedState, {
        onError: err => console.error('Basecamp: Failed to report state:', err),
        onSuccess: () => console.info('Basecamp: Reported state:', updatedState),
      });
    },
    [client, mqttState]
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
          // Report loading state immediately
          reportState({
            'slide': 'loading',
            'tour-id': tourId,
            'volume-level': 1.0,
            'volume-muted': false,
          });

          // Fetch tour-specific data for this tour
          // For now, just fetch the generic basecamp data
          const success = await fetchData(tourId);

          if (success) {
            // Only report loaded state after data is fetched
            setExhibitState({ beatIdx: 0, momentId: 'ambient' });
            reportState({
              'slide': 'ambient-1',
              'tour-id': tourId,
              'volume-level': 1.0,
              'volume-muted': false,
            });
          } else {
            // Report error state if fetch failed
            reportState({
              'slide': 'error',
              'tour-id': tourId,
              'volume-level': 0.0,
              'volume-muted': false,
            });
          }
        }
      } catch (error) {
        console.error('Basecamp: Error parsing load-tour command:', error);
      }
    };

    // 2. Go idle command (broadcast to all exhibits)
    const handleGoIdle = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const reason = msg.body?.reason;
        console.info('Basecamp received go-idle command:', reason);

        // Reset to idle state
        setExhibitState({ beatIdx: 0, momentId: 'ambient' });
        reportState({
          'slide': 'idle',
          'tour-id': null,
          'volume-level': 0.0,
          'volume-muted': false,
        });
      } catch (error) {
        console.error('Basecamp: Error parsing go-idle command:', error);
      }
    };

    // 3. Goto beat command (direct from Docent)
    const handleGotoBeat = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const beatId = msg.body?.beat_id;
        console.info('Basecamp received goto-beat command:', beatId);

        if (beatId) {
          // Parse beat_id format: ${moment}-${beatNumber} (e.g., "ambient-1", "welcome-3", "protect-2")
          const lastDashIndex = beatId.lastIndexOf('-');
          if (lastDashIndex === -1) {
            console.error('Invalid beat_id format:', beatId);
            return;
          }

          const momentId = beatId.substring(0, lastDashIndex);
          const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

          if (isNaN(beatNumber) || beatNumber < 1) {
            console.error('Invalid beat number in beat_id:', beatId);
            return;
          }

          // Convert 1-indexed beat number to 0-indexed
          const beatIdx = beatNumber - 1;

          console.info(`Parsed beat: moment=${momentId}, beatIdx=${beatIdx}`);
          setExhibitState({ beatIdx, momentId });

          // Report updated state with new slide
          reportState({ slide: beatId });
        }
      } catch (error) {
        console.error('Basecamp: Error parsing goto-beat command:', error);
      }
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic(`cmd/dev/all/load-tour`, handleLoadTour);
    client.subscribeToTopic(`cmd/dev/all/go-idle`, handleGoIdle);

    // Also subscribe to basecamp-specific goto-beat (direct from Docent)
    client.subscribeToTopic(`cmd/dev/basecamp/goto-beat`, handleGotoBeat);

    return () => {
      client.unsubscribeFromTopic(`cmd/dev/all/load-tour`);
      client.unsubscribeFromTopic(`cmd/dev/all/go-idle`);
      client.unsubscribeFromTopic(`cmd/dev/basecamp/goto-beat`);
    };
  }, [client, fetchData, reportState]);

  // Subscribe to own state on boot (for restart/recovery)
  // This allows exhibit to restore state after refresh
  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: ExhibitMqttState = msg.body;
        console.info('Basecamp: Received own state on boot:', state);

        // Update internal MQTT state
        setMqttState(state);

        // Parse slide to update UI navigation state
        if (state.slide && state.slide !== 'idle') {
          const lastDashIndex = state.slide.lastIndexOf('-');
          if (lastDashIndex !== -1) {
            const momentId = state.slide.substring(0, lastDashIndex);
            const beatNumber = parseInt(state.slide.substring(lastDashIndex + 1), 10);
            if (!isNaN(beatNumber) && beatNumber >= 1) {
              setExhibitState({ beatIdx: beatNumber - 1, momentId });
            }
          }
        }

        // Fetch content if we have a tour loaded
        if (state['tour-id']) {
          fetchData();
        }
      } catch (error) {
        console.error('Basecamp: Error parsing own state:', error);
      }
    };

    // Subscribe once on mount to get retained state
    client.subscribeToTopic(`state/basecamp`, handleOwnState);

    return () => {
      client.unsubscribeFromTopic(`state/basecamp`);
    };
  }, [client, fetchData]);

  const contextValue = {
    data,
    error,
    exhibitState,
    loading,
  };

  return <BasecampContext.Provider value={contextValue}>{children}</BasecampContext.Provider>;
}
