'use client';

import { useEffect } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { useAudio } from '@/components/providers/audio-provider';

// Plays text appear SFX at specified delays
export const useAppearSfx = (delaysMs: readonly number[]): void => {
  const audio = useAudio();
  const { data } = useBasecamp();
  const sfxUrl = data?.sfx.text;

  useEffect(() => {
    if (!sfxUrl) return;

    const timers = delaysMs.map(delay => setTimeout(() => audio.playSfx(sfxUrl), delay));

    return () => timers.forEach(clearTimeout);
  }, [audio, delaysMs, sfxUrl]);
};
