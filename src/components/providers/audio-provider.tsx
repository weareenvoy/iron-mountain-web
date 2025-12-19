'use client';

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { AudioEngine } from '@/lib/audio/audio-engine';
import type { AudioController, AudioSettings } from '@/lib/audio/types';
import type { ExhibitMqttState } from '@/lib/mqtt/types';

type ExhibitDeviceId = 'basecamp' | 'overlook' | 'summit';

interface AudioContextValue {
  readonly controller: AudioController;
  readonly settings: AudioSettings;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

type AudioProviderProps = PropsWithChildren<{
  readonly appId: ExhibitDeviceId;
}>;

export const useAudio = (): AudioController => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context.controller;
};

export const useAudioSettings = (): AudioSettings => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioSettings must be used within an AudioProvider');
  }
  return context.settings;
};

export const useAmbience = () => {
  const audio = useAudio();
  return {
    setAmbience: audio.setAmbience,
  };
};

export const useMusic = () => {
  const audio = useAudio();
  return {
    setMusic: audio.setMusic,
  };
};

export const useSfx = () => {
  const audio = useAudio();
  return {
    playSfx: audio.playSfx,
  };
};

export const AudioProvider = ({ appId, children }: AudioProviderProps) => {
  const { client } = useMqtt();

  const [controller] = useState(() => new AudioEngine());
  const [settings, setSettings] = useState<AudioSettings>(() => controller.getSettings());

  // Keep React state in sync with engine settings.
  useEffect(() => {
    return controller.subscribeToSettings(next => setSettings(next));
  }, [controller]);

  // Attempt to unlock audio on first user gesture.
  useEffect(() => {
    const unlock = () => {
      void controller.unlock();
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
    };

    window.addEventListener('keydown', unlock);
    window.addEventListener('pointerdown', unlock);

    return () => {
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
    };
  }, [controller]);

  // Bind MQTT state to master audio settings (per exhibit/app).
  useEffect(() => {
    if (!client) return;

    const topic = `state/${appId}`;

    const handler = (message: Buffer) => {
      try {
        const parsed = JSON.parse(message.toString());
        const state: ExhibitMqttState = parsed.body;

        const muted = state['volume-muted'];
        const volume = state['volume-level'];

        if (typeof muted === 'boolean') {
          controller.setMasterMuted(muted);
        }

        if (typeof volume === 'number') {
          controller.setMasterVolume(volume);
        }
      } catch (error) {
        console.error(`AudioProvider: failed to parse ${topic} message`, error);
      }
    };

    client.subscribeToTopic(topic, handler);

    return () => {
      client.unsubscribeFromTopic(topic, handler);
    };
  }, [appId, client, controller]);

  const value = useMemo<AudioContextValue>(
    () => ({
      controller,
      settings,
    }),
    [controller, settings]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
