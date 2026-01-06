'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { createMqttMessage } from '@/lib/mqtt/utils/create-mqtt-message';
import type { ExhibitMqttState } from '@/lib/mqtt/types';

interface WelcomeWallContextType {
  showTour: boolean; // true = TourView, false = AmbientView
  tourId: null | string;
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

  // MQTT state (what we report to GEC)
  const [mqttState, setMqttState] = useState<ExhibitMqttState>({
    'beat-id': 'ambient-1',
    'tour-id': null,
    'volume-level': 0.0, // Welcome wall doesn't have audio
    'volume-muted': false,
  });

  // Ref to access latest mqttState without causing dependency changes. Avoids re-subscription.
  const mqttStateRef = useRef(mqttState);

  // Update ref when state changes (in effect to avoid render-time ref updates)
  useEffect(() => {
    mqttStateRef.current = mqttState;
  }, [mqttState]);

  // Derive view state from tour-id: if tour-id exists, show TourView; otherwise show AmbientView
  const showTour = mqttState['tour-id'] !== null;

  // Helper to report full exhibit state to MQTT
  // Note: reportExhibitState() doesn't support 'welcome-wall', so we use generic publish
  const reportState = useCallback(
    (newState: Partial<ExhibitMqttState>) => {
      if (!client) return;

      // Compute updated state first, update ref immediately for consistency
      const updatedState = { ...mqttStateRef.current, ...newState };
      mqttStateRef.current = updatedState;

      // Update React state (pure function - no side effects)
      setMqttState(prev => ({ ...prev, ...newState }));

      // Publish to state/welcome-wall using generic publish method
      const message = createMqttMessage('welcome-wall', updatedState);
      client.publish(
        'state/welcome-wall',
        JSON.stringify(message),
        { qos: 1, retain: true },
        {
          onError: err => console.error('Welcome Wall: Failed to report state:', err),
          onSuccess: () => console.info('Welcome Wall: State reported successfully'),
        }
      );
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
        console.info('Welcome Wall received load-tour command:', tourId);

        if (tourId) {
          // Switch to TourView and report state
          reportState({
            'beat-id': 'tour-1',
            'tour-id': tourId,
          });
        }
      } catch (error) {
        console.error('Welcome Wall: Error parsing load-tour command:', error);
      }
    };

    // 2. End tour command (broadcast to all exhibits)
    const handleEndTour = () => {
      console.info('Welcome Wall received end-tour command');

      // Switch back to AmbientView and report state
      reportState({
        'beat-id': 'ambient-1',
        'tour-id': null,
      });
    };

    // Subscribe to broadcast commands (all exhibits listen to same topics)
    client.subscribeToTopic('cmd/dev/all/load-tour', handleLoadTour);
    client.subscribeToTopic('cmd/dev/all/end-tour', handleEndTour);

    return () => {
      client.unsubscribeFromTopic('cmd/dev/all/load-tour', handleLoadTour);
      client.unsubscribeFromTopic('cmd/dev/all/end-tour', handleEndTour);
    };
  }, [client, reportState]);

  // Subscribe to own state on boot (for restart/recovery)
  // This allows exhibit to restore state after refresh
  useEffect(() => {
    if (!client) return;

    const handleOwnState = (message: Buffer) => {
      try {
        const msg = JSON.parse(message.toString());
        const state: ExhibitMqttState = msg.body;
        console.info('Welcome Wall: Received own state on boot:', state);

        // Update internal MQTT state
        setMqttState(state);

        // View state will automatically update based on tour-id
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
  }, [client]);

  const contextValue = {
    showTour,
    tourId: mqttState['tour-id'] ?? null,
  };

  return <WelcomeWallContext.Provider value={contextValue}>{children}</WelcomeWallContext.Provider>;
};

export default WelcomeWallProvider;
