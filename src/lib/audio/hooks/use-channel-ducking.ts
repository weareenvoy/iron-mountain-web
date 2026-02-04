'use client';

import { useEffect } from 'react';
import { useAudio } from '@/components/providers/audio-provider';
import type { AudioChannel, DuckChannelOptions } from '@/lib/audio/types';

/**
 * Hook to duck (reduce volume of) a channel when a condition is active.
 * Uses the audio engine's built-in ducking system, which doesn't interfere
 * with channel volume settings from MQTT or other sources.
 *
 * @param channel - The audio channel to duck ('ambience' | 'music' | 'sfx')
 * @param isDucked - When true, ducks the channel; when false, restores to normal
 * @param options - Configuration options for ducking behavior
 * @param options.duckTo - Target volume multiplier when ducked (0..1, default: 0)
 * @param options.fadeMs - Fade duration in milliseconds (default: 300)
 *
 * @example
 * // Mute music when overlay is shown
 * useChannelDucking('music', showOverlay, { duckTo: 0, fadeMs: 300 });
 *
 * @example
 * // Duck music to 30% when modal is open
 * useChannelDucking('music', isModalOpen, { duckTo: 0.3, fadeMs: 500 });
 */
export function useChannelDucking(channel: AudioChannel, isDucked: boolean, options?: DuckChannelOptions) {
  const audio = useAudio();

  useEffect(() => {
    audio.duckChannel(channel, isDucked, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, channel, isDucked, options?.duckTo, options?.fadeMs]);
}
