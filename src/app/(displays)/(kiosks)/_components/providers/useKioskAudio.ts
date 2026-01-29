import { useMemo } from 'react';
import { useKiosk } from './kiosk-provider';
import type { KioskAudio } from '@/lib/internal/types';

/**
 * Audio URLs for kiosk sound effects and background music.
 * These are loaded from the kiosk JSON data and point to external assets.
 * URLs will be undefined if the kiosk data hasn't loaded yet.
 */
interface KioskAudioUrls {
  /** Background music tracks for different sections */
  readonly music: {
    readonly ambient: string | undefined;
    readonly challenge: string | undefined;
    readonly customInteractive: string | undefined;
    readonly solution: string | undefined;
    readonly value: string | undefined;
  };
  /** Sound effect URLs for user interactions */
  readonly sfx: {
    readonly back: string | undefined;
    readonly close: string | undefined;
    readonly next: string | undefined;
    readonly open: string | undefined;
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
    const audio = data?.audio as KioskAudio | undefined;

    // Return URLs from data or undefined if not available
    return {
      music: {
        ambient: audio?.ambient,
        challenge: audio?.challenge,
        customInteractive: audio?.customInteractive,
        solution: audio?.solution,
        value: audio?.value,
      },
      sfx: {
        back: audio?.back,
        close: audio?.close,
        next: audio?.next,
        open: audio?.open,
      },
    };
  }, [data]);
};
