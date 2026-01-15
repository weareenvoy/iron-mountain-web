'use client';

import { useEffect, useRef } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { getMomentPrefix } from '@/app/(displays)/basecamp/_utils';
import { useAudio } from '@/components/providers/audio-provider';
import type { BasecampBeatId } from '@/lib/internal/types';

// Plays SFX when beat transitions occur.
// - Moment change (e.g., welcome-4 → problem-1) → moment sfx
// - Beat change within same moment (e.g., problem-1 → problem-2) → beat sfx
export const useTransitionSfx = (displayedBeatId: BasecampBeatId | null): void => {
  const audio = useAudio();
  const { data } = useBasecamp();
  const sfx = data?.sfx;
  const prevBeatIdRef = useRef<BasecampBeatId | null>(null);

  useEffect(() => {
    const prevBeatId = prevBeatIdRef.current;
    prevBeatIdRef.current = displayedBeatId;

    // Skip on initial mount or no change
    if (prevBeatId === null || displayedBeatId === null) return;
    if (prevBeatId === displayedBeatId) return;

    const prevMoment = getMomentPrefix(prevBeatId);
    const currentMoment = getMomentPrefix(displayedBeatId);

    // Moment changed, play moment sfx
    if (prevMoment !== currentMoment) {
      if (sfx?.moment) audio.playSfx(sfx.moment);
    }
    // Beat changed within same moment, play beat sfx
    else {
      if (sfx?.beat) audio.playSfx(sfx.beat);
    }
  }, [audio, displayedBeatId, sfx]);
};
