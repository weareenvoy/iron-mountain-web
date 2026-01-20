import { useMemo } from 'react';
import { useKiosk } from './kiosk-provider';
import type { KioskAudio } from '@/lib/internal/types';

/**
 * Audio URLs for kiosk sound effects and background music.
 * These are loaded from the kiosk JSON data and point to external assets.
 */
interface KioskAudioUrls {
  /** Background music tracks for different sections */
  readonly music: {
    readonly ambient: string;
    readonly challenge: string;
    readonly customInteractive: string;
    readonly solution: string;
    readonly value: string;
  };
  /** Sound effect URLs for user interactions */
  readonly sfx: {
    readonly back: string;
    readonly close: string;
    readonly next: string;
    readonly open: string;
  };
}

/**
 * Hook to access kiosk audio URLs from the kiosk data.
 * Returns sound effects (sfx) and background music URLs.
 *
 * @throws {Error} If used outside of KioskProvider
 * @returns Audio URLs for sound effects and background music
 *
 * @example
 * ```tsx
 * const { sfx, music } = useKioskAudio();
 * playSfx(sfx.back);
 * setMusic(music.ambient);
 * ```
 */
export const useKioskAudio = (): KioskAudioUrls => {
  const { data } = useKiosk();

  return useMemo<KioskAudioUrls>(() => {
    const audio: KioskAudio | undefined = data?.audio;

    // Log warning if audio data is missing
    if (!audio) {
      console.warn('[useKioskAudio] Audio data not available in kiosk data. Audio will not play until data is loaded.');
      console.warn('[useKioskAudio] Available data keys:', data ? Object.keys(data) : 'no data');
    }

    // Return URLs from data or empty strings as fallback
    return {
      music: {
        ambient: audio?.ambient ?? '',
        challenge: audio?.challenge ?? '',
        customInteractive: audio?.customInteractive ?? '',
        solution: audio?.solution ?? '',
        value: audio?.value ?? '',
      },
      sfx: {
        back: audio?.back ?? '',
        close: audio?.close ?? '',
        next: audio?.next ?? '',
        open: audio?.open ?? '',
      },
    };
  }, [data]);
};
