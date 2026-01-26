'use client';

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { AudioEngine } from '@/lib/audio/audio-engine';
import type { AudioController, AudioSettings } from '@/lib/audio/types';

type ExhibitDeviceId = 'basecamp' | 'kiosk-01' | 'kiosk-02' | 'kiosk-03' | 'overlook-wall' | 'summit';

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
  return useMemo(
    () => ({
      setAmbience: audio.setAmbience.bind(audio),
    }),
    [audio]
  );
};

export const useMusic = () => {
  const audio = useAudio();
  return useMemo(
    () => ({
      setMusic: audio.setMusic.bind(audio),
    }),
    [audio]
  );
};

export const useSfx = () => {
  const audio = useAudio();
  return useMemo(
    () => ({
      playSfx: audio.playSfx.bind(audio),
    }),
    [audio]
  );
};

export const AudioProvider = ({ appId, children }: AudioProviderProps) => {
  // Not used for now.
  void appId;

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

  // MQTT logic for mute/mute is very similar to goto-beat. So move it to exhibit where goto-beat is handled.

  const value = useMemo<AudioContextValue>(
    () => ({
      controller,
      settings,
    }),
    [controller, settings]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
