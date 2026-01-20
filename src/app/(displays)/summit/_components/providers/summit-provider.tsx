'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getLocaleForTesting } from '@/flags/flags';
import { getSummitData } from '@/lib/internal/data/get-summit';
import { getSlideIndexFromBeatId, type Locale, type SummitRoomBeatId } from '@/lib/internal/types';
import { parseSummitBeatId } from '@/lib/internal/utils/parse-beat-id';
import { mqttCommands } from '@/lib/mqtt/constants';
import type { SummitData } from '@/app/(displays)/summit/_types';
import type { ExhibitMqttStateBase, ExhibitMqttStateSummit } from '@/lib/mqtt/types';

interface SummitContextValue {
  readonly data: null | SummitData;
  readonly error: null | string;
  readonly loading: boolean;
  readonly locale: Locale;
  readonly refetch: () => Promise<boolean>;
  readonly slideIdx: number;
  readonly summitBeatId: SummitRoomBeatId;
}

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
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>(getLocaleForTesting());

  // MQTT state. What we report to GEC + tracks current beat being displayed.
  const [mqttState, setMqttState] = useState<ExhibitMqttStateBase>({
    'beat-id': 'journey-intro',
    'volume-level': 1.0,
    'volume-muted': false,
  });

  // Ref to access latest mqttState without causing dependency changes. Avoids re-subscription.
  const mqttStateRef = useRef(mqttState);
  mqttStateRef.current = mqttState;

  // Extract beat-id for dependency tracking
  const beatId = mqttState['beat-id'];

  // Derive summitBeatId from mqttState
  const summitBeatId: SummitRoomBeatId = useMemo(() => {
    if (beatId) {
      const parsed = parseSummitBeatId(beatId);
      if (parsed) return parsed;
    }
    return 'journey-intro';
  }, [beatId]);

  // Derive slide index from beat ID
  const slideIdx = useMemo(() => {
    return getSlideIndexFromBeatId(summitBeatId);
  }, [summitBeatId]);

  const fetchData = useCallback(async (tourId?: null | string) => {
    console.info('Summit: fetching data for tour', tourId ?? 'default');
    setLoading(true);

    try {
      const fetchedData = await getSummitData(tourId ?? undefined);
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

      const updatedState = { ...mqttStateRef.current, ...newState };
      mqttStateRef.current = updatedState;

      setMqttState(prev => ({ ...prev, ...newState }));

      client.reportExhibitState('summit', updatedState, {
        onError: err => console.error('Summit: failed to report state:', err),
      });
    },
    [client]
  );

  // Refs for functions to avoid handler recreation
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;
  const reportStateRef = useRef(reportState);
  reportStateRef.current = reportState;

  useEffect(() => {
    if (!client) return;

    const handleLoadTour = async (message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const tourId = parsedMessage.body?.['tour-id'];
        console.info('Summit: received load-tour command:', tourId);

        if (!tourId) return;

        const success = await fetchDataRef.current(tourId);

        if (success) {
          reportStateRef.current({
            'beat-id': 'journey-intro',
            'volume-level': 1.0,
            'volume-muted': false,
          });
        } else {
          console.error('Summit: failed to fetch data for tour:', tourId);
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

        reportStateRef.current({
          'beat-id': 'idle',
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

        // Validate beat ID - journey-intro is valid, as are journey-1 through journey-N
        if (!parseSummitBeatId(beatId)) {
          console.error('Summit: invalid beat_id format:', beatId);
          return;
        }

        // Report state back to GEC - mqttState will be updated, which derives summitBeatId
        reportStateRef.current({ 'beat-id': beatId });
      } catch (err) {
        console.error('Summit: error parsing goto-beat command:', err);
      }
    };

    client.subscribeToTopic(mqttCommands.broadcast.loadTour, handleLoadTour);
    client.subscribeToTopic(mqttCommands.broadcast.goIdle, handleGoIdle);
    client.subscribeToTopic(mqttCommands.summit.gotoBeat, handleGotoBeat);

    return () => {
      client.unsubscribeFromTopic(mqttCommands.broadcast.loadTour, handleLoadTour);
      client.unsubscribeFromTopic(mqttCommands.broadcast.goIdle, handleGoIdle);
      client.unsubscribeFromTopic(mqttCommands.summit.gotoBeat, handleGotoBeat);
    };
  }, [client]);

  // Subscribe to own state for restart/recovery
  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const parsedMessage = JSON.parse(message.toString());
        const state: ExhibitMqttStateSummit = parsedMessage.body;
        console.info('Summit: received own state on boot:', state);

        // Update internal MQTT state - summitBeatId will be derived from this
        mqttStateRef.current = state;
        setMqttState(state);

        // Fetch content if we have a tour loaded
        if (state['tour-id']) {
          fetchDataRef.current(state['tour-id']);
        }
        // We just need to get retained state once, so unsubscribe after we got the state
        client.unsubscribeFromTopic('state/summit', handleOwnState);
      } catch (err) {
        console.error('Summit: error parsing own state:', err);
      }
    };

    // Subscribe on mount to get retained state + future updates
    client.subscribeToTopic('state/summit', handleOwnState);

    return () => {
      client.unsubscribeFromTopic('state/summit', handleOwnState);
    };
  }, [client]);

  const contextValue = useMemo<SummitContextValue>(
    () => ({
      data,
      error,
      loading,
      locale,
      refetch: fetchData,
      slideIdx,
      summitBeatId,
    }),
    [data, error, fetchData, loading, locale, slideIdx, summitBeatId]
  );

  return <SummitContext.Provider value={contextValue}>{children}</SummitContext.Provider>;
};

export default SummitProvider;
