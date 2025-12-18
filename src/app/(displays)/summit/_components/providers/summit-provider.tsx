'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getLocaleForTesting } from '@/flags/flags';
import { getSummitData } from '@/lib/internal/data/get-summit';
import { isSection, type ExhibitNavigationState, type Locale } from '@/lib/internal/types';
import type { SummitData } from '@/app/(displays)/summit/_types';
import type { ExhibitMqttStateBase } from '@/lib/mqtt/types';

interface SummitContextValue {
  readonly data: null | SummitData;
  readonly error: null | string;
  readonly exhibitState: ExhibitNavigationState;
  readonly loading: boolean;
  readonly locale: Locale;
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
  const [data, setData] = useState<null | SummitData>(null);
  const [error, setError] = useState<null | string>(null);
  const [exhibitState, setExhibitState] = useState<ExhibitNavigationState>(DEFAULT_EXHIBIT_STATE);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>(getLocaleForTesting());
  const [mqttState, setMqttState] = useState<ExhibitMqttStateBase>({
    'beat-id': 'idle',
    'tour-id': null,
    'volume-level': 1.0,
    'volume-muted': false,
  });

  const fetchData = useCallback(async (tourId?: null | string) => {
    console.info('Summit: fetching data for tour', tourId ?? 'default');
    setLoading(true);

    try {
      const fetchedData = await getSummitData();
      setData(fetchedData.data);
      setError(null);
      setLocale(fetchedData.locale);
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
    (newState: Partial<ExhibitMqttStateBase>) => {
      if (!client) return;

      const updatedState: ExhibitMqttStateBase = {
        ...mqttState,
        ...newState,
      };
      setMqttState(updatedState);

      client.reportExhibitState('summit', updatedState, {
        onError: err => console.error('Summit: failed to report state:', err),
        onSuccess: () => console.info('Summit: reported state:', updatedState),
      });
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
          'beat-id': 'loading',
          'tour-id': tourId,
          'volume-level': 1.0,
          'volume-muted': false,
        });

        const success = await fetchData(tourId);

        if (success) {
          setExhibitState(DEFAULT_EXHIBIT_STATE);
          reportState({
            'beat-id': 'primary-1',
            'tour-id': tourId,
            'volume-level': 1.0,
            'volume-muted': false,
          });
        } else {
          reportState({
            'beat-id': 'error',
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
          'beat-id': 'idle',
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
        const beatId = parsedMessage.body?.['beat-id'];
        console.info('Summit: received goto-beat command:', beatId);

        if (!beatId) return;

        const lastDashIndex = beatId.lastIndexOf('-');
        if (lastDashIndex === -1) {
          console.error('Summit: invalid beat_id format:', beatId);
          return;
        }

        const momentId = beatId.substring(0, lastDashIndex);
        const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

        if (Number.isNaN(beatNumber) || beatNumber < 1 || !isSection(momentId)) {
          console.error('Summit: invalid beat number in beat_id:', beatId);
          return;
        }

        setExhibitState({
          beatIdx: beatNumber - 1,
          momentId,
        });

        reportState({ 'beat-id': beatId });
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
        const state: ExhibitMqttStateBase = parsedMessage.body;
        console.info('Summit: received own state:', state);

        setMqttState(state);

        if (state['beat-id'] && state['beat-id'] !== 'idle') {
          const lastDashIndex = state['beat-id'].lastIndexOf('-');
          if (lastDashIndex !== -1) {
            const momentId = state['beat-id'].substring(0, lastDashIndex);
            const beatNumber = parseInt(state['beat-id'].substring(lastDashIndex + 1), 10);
            if (!Number.isNaN(beatNumber) && beatNumber >= 1 && isSection(momentId)) {
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
      locale,
      refetch: fetchData,
    }),
    [data, error, exhibitState, fetchData, loading, locale]
  );

  return <SummitContext.Provider value={contextValue}>{children}</SummitContext.Provider>;
};

export default SummitProvider;
