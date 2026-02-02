import { useEffect, useRef } from 'react';
import { useAudio } from '@/components/providers/audio-provider';

const AUDIO_FADE_DURATION_MS = 300;
const AUDIO_FADE_STEPS = 20;

/**
 * Custom hook to smoothly fade audio volume when a condition changes.
 * Prevents race conditions and cleanup issues by properly managing fade state.
 *
 * @param isActive - When true, fades volume to targetVolumeWhenActive; when false, fades to targetVolumeWhenInactive
 * @param options - Configuration options
 * @param options.targetVolumeWhenActive - Target volume when active (default: 0)
 * @param options.targetVolumeWhenInactive - Target volume when inactive (default: 1)
 * @param options.fadeMs - Fade duration in milliseconds (default: 300)
 * @param options.steps - Number of fade steps for smoothness (default: 20)
 *
 * @example
 * // Mute music when overlay is shown
 * useAudioFade(showOverlay);
 *
 * @example
 * // Fade to 50% when active
 * useAudioFade(isDimmed, { targetVolumeWhenActive: 0.5 });
 */
export function useAudioFade(
  isActive: boolean,
  options?: {
    fadeMs?: number;
    steps?: number;
    targetVolumeWhenActive?: number;
    targetVolumeWhenInactive?: number;
  }
) {
  const audioController = useAudio();
  const animationFrameRef = useRef<null | number>(null);
  const currentVolumeRef = useRef<number>(1);

  const {
    fadeMs = AUDIO_FADE_DURATION_MS,
    steps = AUDIO_FADE_STEPS,
    targetVolumeWhenActive = 0,
    targetVolumeWhenInactive = 1,
  } = options ?? {};

  useEffect(() => {
    const targetVolume = isActive ? targetVolumeWhenActive : targetVolumeWhenInactive;
    const startVolume = currentVolumeRef.current;

    if (startVolume === targetVolume) return;

    const volumeStep = Math.abs(targetVolume - startVolume) / steps;
    const direction = targetVolume > startVolume ? 1 : -1;
    const stepDuration = fadeMs / steps;

    let currentStep = 0;
    let startTime: null | number = null;

    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Calculate current step based on elapsed time
      const targetStep = Math.floor(elapsed / stepDuration);

      if (targetStep > currentStep) {
        currentStep = targetStep;
        const newVolume = Math.max(0, Math.min(1, startVolume + direction * volumeStep * currentStep));

        audioController.setChannelVolume('music', newVolume);
        currentVolumeRef.current = newVolume;
      }

      if (currentStep >= steps) {
        // Animation complete - ensure we hit the exact target
        audioController.setChannelVolume('music', targetVolume);
        currentVolumeRef.current = targetVolume;
        animationFrameRef.current = null;
      } else {
        // Continue animation
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, audioController, fadeMs, steps, targetVolumeWhenActive, targetVolumeWhenInactive]);
}
