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
import { useAudio } from '@/components/providers/audio-provider';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getBasecampData } from '@/lib/internal/data/get-basecamp';
import {
  type BasecampBeatId,
  type BasecampData,
  type BasecampSection,
  type ExhibitNavigationState,
  type Locale,
} from '@/lib/internal/types';
import { parseBasecampBeatId } from '@/lib/internal/utils/parse-beat-id';
import { mqttCommands } from '@/lib/mqtt/constants';
import { useExhibitSetVolume } from '@/lib/mqtt/utils/use-exhibit-set-volume';
import type { ExhibitMqttStateBase } from '@/lib/mqtt/types';

interface BasecampContextType {
  readonly data: BasecampData | null;
  readonly error: null | string;
  readonly exhibitState: ExhibitNavigationState;
  readonly loading: boolean;
  readonly locale: Locale;
  readonly readyBeatId: BasecampBeatId | null;
  readonly setReadyBeatId: (beatId: BasecampBeatId | null) => void;
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
  const audio = useAudio();

  const { client } = useMqtt();

  // Which beat's video is ready. Foreground compares its beatId to this.
  const [readyBeatId, setReadyBeatId] = useState<BasecampBeatId | null>(null);

  // MQTT state. What we report to GEC + tracks current beat being displayed.
  const [mqttState, setMqttState] = useState<ExhibitMqttStateBase>({
    'beat-id': 'ambient-1',
    'volume-level': 1.0,
    'volume-muted': false,
  });

  // Wait for actual MQTT state before playing music.
  // We don't want default 'ambient' music to play before we receive actual beat.
  const [hasReceivedMqttState, setHasReceivedMqttState] = useState(false);

  // Ref to access latest mqttState without causing dependency changes. Avoids re-subscription.
  const mqttStateRef = useRef(mqttState);
  mqttStateRef.current = mqttState;

  // Extract beat-id for dependency tracking
  const beatId = mqttState['beat-id'];

  // Derive exhibitState from mqttState
  const exhibitState: ExhibitNavigationState = useMemo(() => {
    if (beatId) {
      const parsed = parseBasecampBeatId(beatId);
      if (parsed) return parsed;
    }
    // Fallback to default
    return { beatIdx: 0, momentId: 'ambient' };
  }, [beatId]);

  const [data, setData] = useState<BasecampData | null>(null);

  // Background music. 1 music per moment.
  const currentMusicUrlRef = useRef<null | string>(null);

  useEffect(() => {
    // Wait for actual MQTT state before playing music
    if (!hasReceivedMqttState) return;
    // Wait for data to load before playing music
    if (!data?.music) return;

    const momentId = exhibitState.momentId as BasecampSection;
    const musicUrl = data.music[momentId];

    // Only call setMusic if URL changed
    if (musicUrl === currentMusicUrlRef.current) return;

    currentMusicUrlRef.current = musicUrl ?? null;
    if (musicUrl) {
      console.info(`[Music] Playing: ${momentId}`);
      audio.setMusic(musicUrl, { fadeMs: 1000 });
    } else {
      audio.setMusic(null, { fadeMs: 1000 });
    }
  }, [audio, data?.music, exhibitState.momentId, hasReceivedMqttState]);

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

  // Refs for functions to avoid handler recreation
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;
  const reportStateRef = useRef(reportState);
  reportStateRef.current = reportState;

  // Shared hook for handling set-volume commands
  useExhibitSetVolume({
    appId: 'basecamp',
    audio,
    client,
    reportStateRef,
    stateRef: mqttStateRef,
  });

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
          const success = await fetchDataRef.current(tourId);

          if (success) {
            // Docent will send set-volume cmd after load tour cmd, so we only need to focus on beat here.
            reportStateRef.current({ 'beat-id': 'ambient-1' });
            setHasReceivedMqttState(true);
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
      reportStateRef.current({ 'beat-id': 'ambient-1' });
      setHasReceivedMqttState(true);
    };

    // 3. Goto beat command (direct from Docent)
    const handleGotoBeat = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const beatId = msg.body?.['beat-id'];
        console.info('Basecamp received goto-beat command:', beatId);

        if (beatId) {
          // Validate beat-id format
          const parsed = parseBasecampBeatId(beatId);
          if (!parsed) {
            console.error('Invalid beat-id format:', beatId);
            return;
          }

          // Report updated state with new beat-id - exhibitState will be derived from this
          reportStateRef.current({ 'beat-id': beatId });
          setHasReceivedMqttState(true);
        }
      } catch (error) {
        console.error('Basecamp: Error parsing goto-beat command:', error);
      }
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic(mqttCommands.broadcast.loadTour, handleLoadTour);
    client.subscribeToTopic(mqttCommands.broadcast.endTour, handleEndTour);
    // Subscribe to basecamp-specific commands (direct from Docent)
    client.subscribeToTopic(mqttCommands.basecamp.gotoBeat, handleGotoBeat);

    return () => {
      client.unsubscribeFromTopic(mqttCommands.broadcast.loadTour, handleLoadTour);
      client.unsubscribeFromTopic(mqttCommands.broadcast.endTour, handleEndTour);
      client.unsubscribeFromTopic(mqttCommands.basecamp.gotoBeat, handleGotoBeat);
    };
  }, [audio, client]);

  // Subscribe to own state for restart/recovery
  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: ExhibitMqttStateBase = msg.body;
        console.info('Basecamp: Received own state on boot:', state);

        // Apply retained volume/mute to audio engine
        audio.setMasterMuted(state['volume-muted']);
        audio.setMasterVolume(state['volume-level']);

        // Update internal MQTT state - exhibitState will be derived from this
        mqttStateRef.current = state;
        setMqttState(state);
        setHasReceivedMqttState(true);

        // Fetch content if we have a tour loaded
        fetchData();
        // We just need to get retained state once, so unsubscribe after we got the state
        client.unsubscribeFromTopic('state/basecamp', handleOwnState);
      } catch (error) {
        console.error('Basecamp: Error parsing own state:', error);
      }
    };

    // Subscribe on mount to get retained state + future updates
    client.subscribeToTopic('state/basecamp', handleOwnState);

    return () => {
      client.unsubscribeFromTopic('state/basecamp', handleOwnState);
    };
  }, [audio, client, fetchData]);

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
