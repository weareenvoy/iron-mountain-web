import { ARROW_FADE_DURATION_KIOSK1_SEC, ARROW_FADE_DURATION_SEC } from '@/app/(displays)/(kiosks)/_constants/timing';
import type { KioskConfig } from '@/app/(displays)/(kiosks)/_types/kiosk-config';

// Per-kiosk configuration objects. Centralizes all differences between the three kiosks (diamond mappings, arrow positioning, animation timings, etc.)

/**
 * Configuration for Kiosk 1.
 */
export const KIOSK_1_CONFIG: KioskConfig = {
  arrowConfig: {
    arrowGap: 'gap-[100px]',
    arrowHeight: 'h-[118px]',
    arrowWidth: 'w-[118px]',
    fadeDuration: ARROW_FADE_DURATION_KIOSK1_SEC,
    positionRight: 'right-[120px]',
    positionTop: 'top-[1945px]',
  },
  diamondMapping: {
    bottomLeft: 2,
    bottomRight: 3,
    center: 0,
    topLeft: undefined,
    topRight: 1,
  },
  kioskId: 'kiosk-1',
  usesAccordion: false,
};

/**
 * Configuration for Kiosk 2.
 */
export const KIOSK_2_CONFIG: KioskConfig = {
  arrowConfig: {
    arrowGap: 'gap-[100px]',
    arrowHeight: 'h-[140px]',
    arrowWidth: 'w-[120px]',
    fadeDuration: ARROW_FADE_DURATION_SEC,
    positionRight: 'right-[120px]',
    positionTop: 'top-[1536px]',
  },
  diamondMapping: {
    bottomLeft: 3,
    bottomRight: 4,
    center: 0,
    topLeft: 1,
    topRight: 2,
  },
  kioskId: 'kiosk-2',
  usesAccordion: false,
};

/**
 * Configuration for Kiosk 3.
 */
export const KIOSK_3_CONFIG: KioskConfig = {
  arrowConfig: {
    arrowGap: 'gap-[100px]',
    arrowHeight: 'h-[118px]',
    arrowWidth: 'w-[118px]',
    fadeDuration: ARROW_FADE_DURATION_SEC,
    positionRight: 'right-[120px]',
    positionTop: 'top-[1945px]',
  },
  diamondMapping: undefined, // Kiosk 3 uses accordion, not diamond grid
  kioskId: 'kiosk-3',
  usesAccordion: true,
};
