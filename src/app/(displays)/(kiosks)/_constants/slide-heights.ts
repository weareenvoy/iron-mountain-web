/**
 * Configuration for slide heights across all kiosk sections.
 * Heights are in pixels and represent the actual rendered height of each slide template.
 *
 * These values are used to calculate dynamic gradient background heights
 * that adapt to which templates are present in the content.
 *
 * ARCHITECTURE DECISION: Dynamic Gradient Heights via CMS Content
 *
 * Dynamic Gradient heights are in place to have the build respond to CMS content being added or removed from the API payload.
 *  
 * Future Improvements:
 * - Consider IntersectionObserver-based dynamic measurement
 * - Add validation/warnings for missing or outdated height values
 * - Document measurement process for designers/developers
 */

import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Section identifiers for gradient positioning
 */
export type GradientSection = 'challenge' | 'customInteractive' | 'solution' | 'value';

/**
 * Custom Interactive identifier (string for JSON compatibility)
 * Uses string literals '1', '2', '3' instead of numbers to match:
 * - JSON content structure where customInteractive1/2/3 are keys
 * - Regex extraction from slide IDs (e.g., "customInteractive-0-first-ci3")
 * - CMS field naming conventions
 */
export type CustomInteractiveNumber = '1' | '2' | '3';

/**
 * Standard screen height (100vh equivalent in pixels at 2160p)
 */
export const SCREEN_HEIGHT = 2160;

/**
 * Heights for Challenge section templates
 * Note: These values include content that extends beyond viewport height
 */
const CHALLENGE_HEIGHTS_COMMON = {
  firstScreen: 4780,
  initialScreen: SCREEN_HEIGHT,
  secondScreen: 4780,
  thirdScreen: 4780,
};

export const CHALLENGE_HEIGHTS: Record<
  KioskId,
  {
    /** Height of the first screen (with video header) */
    firstScreen: number;
    /** Height of the initial/cover screen */
    initialScreen: number;
    /** Height of the second screen */
    secondScreen: number;
    /** Height of the third screen */
    thirdScreen: number;
  }
> = {
  'kiosk-1': CHALLENGE_HEIGHTS_COMMON,
  'kiosk-2': {
    ...CHALLENGE_HEIGHTS_COMMON,
    thirdScreen: 4830, // Override: Kiosk 2 has slightly taller third screen
  },
  'kiosk-3': CHALLENGE_HEIGHTS_COMMON,
};

/**
 * Heights for Solution section templates
 * Note: These are averaged heights based on typical content configurations
 * Actual heights will vary based on number of secondScreen instances
 */
const SOLUTION_HEIGHTS_COMMON = {
  firstScreen: 4230,
  fourthScreen: 5210,
  secondScreen: 5130,
  thirdScreen: 6695,
};

export const SOLUTION_HEIGHTS: Record<
  KioskId,
  {
    /** Height of the first screen */
    firstScreen: number;
    /** Height of the fourth screen (accordion) */
    fourthScreen: number;
    /** Height of each second screen (numbered list) */
    secondScreen: number;
    /** Height of the third screen (diamond grid) */
    thirdScreen: number;
  }
> = {
  'kiosk-1': {
    ...SOLUTION_HEIGHTS_COMMON,
    fourthScreen: 5215, // Override: Kiosk 1 has slightly taller accordion
    thirdScreen: 6695, // Override: Kiosk 1 has taller grid
  },
  'kiosk-2': {
    ...SOLUTION_HEIGHTS_COMMON,
    secondScreen: 5080, // Override: Kiosk 2 secondScreen when accordion/grid not present
    thirdScreen: 6645, // Override: Kiosk 2 has shorter grid
  },
  'kiosk-3': {
    ...SOLUTION_HEIGHTS_COMMON,
    // NOTE: thirdScreen value is also used for fourthScreen (accordion) height when grid is not present
    // This is determined by the calculation logic in calculateSolutionGradientHeight
    // When accordion appears WITHOUT grid: uses thirdScreen value (5130)
    // When both grid and accordion appear: uses fourthScreen value (5210) for accordion
    thirdScreen: 5130,
  },
};

/**
 * Heights for Custom Interactive section templates
 * Organized by custom interactive number (1, 2, 3) since each custom interactive
 * has its own specific heights regardless of which kiosk it's displayed on
 *
 * Note: All custom interactives currently share the same height values, but are
 * separated to allow future customization per interactive without code changes
 */
const CUSTOM_INTERACTIVE_HEIGHTS_COMMON = {
  firstScreen: 5215,
  secondScreen: 5215,
};

export const CUSTOM_INTERACTIVE_HEIGHTS: Record<
  CustomInteractiveNumber,
  {
    /** Height of the first screen */
    firstScreen: number;
    /** Height of the second screen */
    secondScreen: number;
  }
> = {
  '1': CUSTOM_INTERACTIVE_HEIGHTS_COMMON,
  '2': CUSTOM_INTERACTIVE_HEIGHTS_COMMON,
  '3': CUSTOM_INTERACTIVE_HEIGHTS_COMMON,
};

/**
 * Heights for Value section templates
 * Note: Value section has dynamic height based on carousel type
 * All kiosks currently share identical value section heights
 */
const VALUE_HEIGHTS_COMMON = {
  animatedCarouselHeight: 4150,
  baseHeight: 1060,
  staticCarouselHeight: 9360,
};

export const VALUE_HEIGHTS: Record<
  KioskId,
  {
    /** Height for animated carousel variant */
    animatedCarouselHeight: number;
    /** Base height with header */
    baseHeight: number;
    /** Height for static carousel variant */
    staticCarouselHeight: number;
  }
> = {
  'kiosk-1': VALUE_HEIGHTS_COMMON,
  'kiosk-2': VALUE_HEIGHTS_COMMON,
  'kiosk-3': VALUE_HEIGHTS_COMMON,
};

/**
 * Gradient start positions (top offset) for each section
 * These determine where the gradient background begins
 */
export const GRADIENT_START_POSITIONS: Record<GradientSection, Record<KioskId, number>> = {
  challenge: {
    'kiosk-1': 1290,
    'kiosk-2': 1290,
    'kiosk-3': 1290,
  },
  customInteractive: {
    'kiosk-1': 0,
    'kiosk-2': 0,
    'kiosk-3': 0,
  },
  solution: {
    'kiosk-1': 1060,
    'kiosk-2': 1060,
    'kiosk-3': 1060,
  },
  value: {
    'kiosk-1': 1060,
    'kiosk-2': 1060,
    'kiosk-3': 1060,
  },
};
