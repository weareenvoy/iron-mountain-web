'use client';

import type { SummitData } from '@/app/(displays)/summit/_types';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getSummitData } from '@/lib/internal/data/get-summit';
import type { ExhibitNavigationState } from '@/lib/internal/types';
import type { ExhibitMqttState } from '@/lib/mqtt/types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

interface SummitContextValue {
  readonly data: SummitData | null;
  readonly error: string | null;
  readonly exhibitState: ExhibitNavigationState;
  readonly loading: boolean;
  readonly refetch: () => Promise<boolean>;
}

const DEFAULT_EXHIBIT_STATE: ExhibitNavigationState = {
  beatIdx: 0,
  momentId: 'primary',
};

const SummitContext = createContext<SummitContextValue | undefined>(undefined);

export const useSummit = () => {
  const context = useContext(SummitContext);
  if (!context) {
    throw new Error('useSummit must be used within a SummitProvider');
  }
  return context;
};

export const SummitProvider = ({ children }: PropsWithChildren) => {
  const { client } = useMqtt();
  const [data, setData] = useState<SummitData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exhibitState, setExhibitState] = useState<ExhibitNavigationState>(DEFAULT_EXHIBIT_STATE);
  const [loading, setLoading] = useState(true);
  const [mqttState, setMqttState] = useState<ExhibitMqttState>({
    'slide': 'idle',
    'tour-id': null,
    'volume-level': 1.0,
    'volume-muted': false,
  });

  const fetchData = useCallback(async (tourId?: null | string) => {
    console.info('Summit: fetching data for tour', tourId ?? 'default');
    setLoading(true);

    try {
      const fetchedData = await getSummitData();
      setData(fetchedData);
      setError(null);
      return true;
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unknown summit error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reportState = useCallback(
    (newState: Partial<ExhibitMqttState>) => {
      if (!client) return;

      const updatedState = {
        ...mqttState,
        ...newState,
      };
      setMqttState(updatedState);

      client.reportExhibitState(
        'summit',
        {
          'slide': updatedState.slide,
          'tour-id': updatedState['tour-id'],
          'volume-level': updatedState['volume-level'],
          'volume-muted': updatedState['volume-muted'],
        },
        {
          onError: err => console.error('Summit: failed to report state:', err),
          onSuccess: () => console.info('Summit: reported state:', updatedState),
        }
      );
    },
    [client, mqttState]
  );

  useEffect(() => {
    if (!client) return;

    const handleLoadTour = async (message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const tourId = parsedMessage.body?.['tour-id'];
        console.info('Summit: received load-tour command:', tourId);

        if (!tourId) return;

        reportState({
          'slide': 'loading',
          'tour-id': tourId,
          'volume-level': 1.0,
          'volume-muted': false,
        });

        const success = await fetchData(tourId);

        if (success) {
          setExhibitState(DEFAULT_EXHIBIT_STATE);
          reportState({
            'slide': 'primary-1',
            'tour-id': tourId,
            'volume-level': 1.0,
            'volume-muted': false,
          });
        } else {
          reportState({
            'slide': 'error',
            'tour-id': tourId,
            'volume-level': 0.0,
            'volume-muted': true,
          });
        }
      } catch (err) {
        console.error('Summit: error parsing load-tour command:', err);
      }
    };

    const handleGoIdle = (message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const reason = parsedMessage.body?.reason;
        console.info('Summit: received go-idle command:', reason);

        setExhibitState(DEFAULT_EXHIBIT_STATE);
        reportState({
          'slide': 'idle',
          'tour-id': null,
          'volume-level': 0.0,
          'volume-muted': true,
        });
      } catch (err) {
        console.error('Summit: error parsing go-idle command:', err);
      }
    };

    const handleGotoBeat = (message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const beatId = parsedMessage.body?.beat_id;
        console.info('Summit: received goto-beat command:', beatId);

        if (!beatId) return;

        const lastDashIndex = beatId.lastIndexOf('-');
        if (lastDashIndex === -1) {
          console.error('Summit: invalid beat_id format:', beatId);
          return;
        }

        const momentId = beatId.substring(0, lastDashIndex);
        const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

        if (Number.isNaN(beatNumber) || beatNumber < 1) {
          console.error('Summit: invalid beat number in beat_id:', beatId);
          return;
        }

        setExhibitState({
          beatIdx: beatNumber - 1,
          momentId,
        });

        reportState({ slide: beatId });
      } catch (err) {
        console.error('Summit: error parsing goto-beat command:', err);
      }
    };

    client.subscribeToTopic('cmd/dev/all/load-tour', handleLoadTour);
    client.subscribeToTopic('cmd/dev/all/go-idle', handleGoIdle);
    client.subscribeToTopic('cmd/dev/summit/goto-beat', handleGotoBeat);

    return () => {
      client.unsubscribeFromTopic('cmd/dev/all/load-tour');
      client.unsubscribeFromTopic('cmd/dev/all/go-idle');
      client.unsubscribeFromTopic('cmd/dev/summit/goto-beat');
    };
  }, [client, fetchData, reportState]);

  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const state: ExhibitMqttState = parsedMessage.body;
        console.info('Summit: received own state:', state);

        setMqttState(state);

        if (state.slide && state.slide !== 'idle') {
          const lastDashIndex = state.slide.lastIndexOf('-');
          if (lastDashIndex !== -1) {
            const momentId = state.slide.substring(0, lastDashIndex);
            const beatNumber = parseInt(state.slide.substring(lastDashIndex + 1), 10);
            if (!Number.isNaN(beatNumber) && beatNumber >= 1) {
              setExhibitState({
                beatIdx: beatNumber - 1,
                momentId,
              });
            }
          }
        }

        if (state['tour-id']) {
          fetchData(state['tour-id']);
        }
      } catch (err) {
        console.error('Summit: error parsing own state:', err);
      }
    };

    client.subscribeToTopic('state/summit', handleOwnState);

    return () => {
      client.unsubscribeFromTopic('state/summit');
    };
  }, [client, fetchData]);

  const contextValue = useMemo<SummitContextValue>(
    () => ({
      data,
      error,
      exhibitState,
      loading,
      refetch: fetchData,
    }),
    [data, error, exhibitState, fetchData, loading]
  );

  return <SummitContext.Provider value={contextValue}>{children}</SummitContext.Provider>;
};

export default SummitProvider;
