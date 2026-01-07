'use client';

import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { getWelcomeWallData } from '@/lib/internal/data/get-welcome-wall';
import { type Locale, type WelcomeWallData } from '@/lib/internal/types';
import type { WelcomeWallMqttState } from '@/lib/mqtt/types';

interface WelcomeWallContextType {
  data: null | WelcomeWallData;
  error: null | string;
  loading: boolean;
  locale: Locale;
  showTour: boolean;
}

export const WelcomeWallContext = createContext<undefined | WelcomeWallContextType>(undefined);

type WelcomeWallProviderProps = PropsWithChildren<{
  readonly topic?: string; // placeholder for future props
}>;

export const useWelcomeWall = () => {
  const context = useContext(WelcomeWallContext);
  if (context === undefined) {
    throw new Error('useWelcomeWall must be used within a WelcomeWallProvider');
  }
  return context;
};

export const WelcomeWallProvider = ({ children }: WelcomeWallProviderProps) => {
  const { client } = useMqtt();

  const [data, setData] = useState<null | WelcomeWallData>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [showTour, setShowTour] = useState<boolean>(false);

  // Fetch content data
  const fetchData = useCallback(async (id?: null | string) => {
    console.info('Fetching welcome wall data for tour:', id);
    setLoading(true);

    try {
      const welcomeWallData = await getWelcomeWallData();
      setData(welcomeWallData.data);
      setLocale(welcomeWallData.locale);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching welcome wall data:', err);
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
    (newState: Partial<WelcomeWallMqttState>) => {
      if (!client) return;

      client.reportWelcomeWallState('welcome-wall', newState as WelcomeWallMqttState, {
        onError: err => console.error('Welcome Wall: Failed to report state:', err),
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
        console.info('Welcome Wall: received load-tour command:', tourId);

        if (tourId) {
          // Fetch tour-specific data for this tour
          // For now, just fetch the generic basecamp data
          const success = await fetchData(tourId);

          if (success) {
            // Tour content loaded successfully - show tour state
            setShowTour(true);

            // Only report loaded state after data is fetched
            reportState({
              state: 'tour',
            });
          } else {
            console.error('Welcome Wall: Failed to fetch tour data for tour:', tourId);
          }
        }
      } catch (error) {
        console.error('Welcome Wall: Error parsing load-tour command:', error);
      }
    };

    // 2. End tour command (broadcast to all exhibits)
    const handleEndTour = () => {
      console.info('Welcome Wall received end-tour command');
      setShowTour(false);

      // Reset to ambient state
      reportState({
        state: 'idle',
      });
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    // TODO Confirm with Lucas. Currently not receiving anything from these topics.
    client.subscribeToTopic('cmd/dev/all/load-tour', handleLoadTour);
    client.subscribeToTopic('cmd/dev/all/end-tour', handleEndTour);

    return () => {
      client.unsubscribeFromTopic('cmd/dev/all/load-tour', handleLoadTour);
      client.unsubscribeFromTopic('cmd/dev/all/end-tour', handleEndTour);
    };
  }, [client, fetchData, reportState]);

  // Subscribe to own state on boot (for restart/recovery)
  // This allows exhibit to restore state after refresh
  useEffect(() => {
    if (!client) return;

    const handleOwnState = async (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: WelcomeWallMqttState = msg.body;
        console.info('Welcome Wall: Received own state on boot:', state);

        if (state.state === 'tour') {
          const success = await fetchData();
          if (success) {
            setShowTour(true);
          }
        } else {
          setShowTour(false);
        }

        // We just need to get retained state once, so unsubscribe after we got the state
        client.unsubscribeFromTopic('state/welcome-wall', handleOwnState);
      } catch (error) {
        console.error('Welcome Wall: Error parsing own state:', error);
      }
    };

    // Subscribe once on mount to get retained state
    client.subscribeToTopic('state/welcome-wall', handleOwnState);

    return () => {
      client.unsubscribeFromTopic('state/welcome-wall', handleOwnState);
    };
  }, [client, fetchData]);

  const contextValue = {
    data,
    error,
    loading,
    locale,
    showTour,
  };

  return <WelcomeWallContext.Provider value={contextValue}>{children}</WelcomeWallContext.Provider>;
};

export default WelcomeWallProvider;
