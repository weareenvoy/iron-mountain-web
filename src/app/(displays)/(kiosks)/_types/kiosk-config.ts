import type { DiamondMapping } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-grid';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// Configuration type for kiosk-specific settings. This eliminates duplication across KioskView components by extracting all per-kiosk differences into a single config object.

/**
 * Configuration for arrow positioning and styling per kiosk.
 */
export type KioskArrowConfig = {
  readonly arrowGap: string;
  readonly arrowHeight: string;
  readonly arrowWidth: string;
  readonly fadeDuration: number;
  readonly positionRight: string;
  readonly positionTop: string;
};

/**
 * Complete configuration object for a single kiosk instance.
 * Contains all kiosk-specific settings that differ between Kiosk 1, 2, and 3.
 */
export type KioskConfig = {
  readonly arrowConfig: KioskArrowConfig;
  readonly diamondMapping?: DiamondMapping;
  readonly kioskId: KioskId;
};
