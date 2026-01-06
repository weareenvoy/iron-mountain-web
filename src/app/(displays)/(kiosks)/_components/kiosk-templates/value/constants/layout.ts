/**
 * Layout and positioning constants for the Value Carousel.
 * All measurements derived from Figma design specifications.
 */

/**
 * Initial spread positions (in px) for diamonds before they animate together.
 * Used on slide 1's initial animation when the carousel becomes visible.
 */
export const INITIAL_SPREAD_POSITIONS: readonly [number, number, number] = [660, 1230, 1785] as const;

/**
 * Maps diamond indices to their left positions for each slide.
 * Format: [slide][diamondIndex] = leftPositionInPx
 *
 * Slide 0: Operational (0), Economic (1), Strategic (2) at [165, 340, 500]
 * Slide 1: Strategic (2), Operational (0), Economic (1) at [165, 340, 500]
 * Slide 2: Economic (1), Strategic (2), Operational (0) at [165, 340, 500]
 */
export const POSITION_MAP: ReadonlyArray<readonly [number, number, number]> = [
  [165, 340, 500], // Slide 0
  [340, 500, 165], // Slide 1 (Strategic featured)
  [500, 165, 340], // Slide 2 (Economic featured)
] as const;

/**
 * Maps diamond indices to their z-index classes for each slide.
 * Controls stacking order for visual depth.
 */
export const Z_INDEX_MAP: ReadonlyArray<readonly [string, string, string]> = [
  ['', '', ''], // Slide 0: no z-index classes
  ['z-2', 'z-3', ''], // Slide 1: diamond 0 z-2, diamond 1 z-3, diamond 2 default
  ['z-3', 'z-1', 'z-2'], // Slide 2: diamond 0 z-3, diamond 1 z-1, diamond 2 z-2
] as const;

/**
 * Maps diamond indices to text visibility for each slide.
 * The diamond at position 500px always shows its text.
 */
export const TEXT_VISIBILITY_MAP: ReadonlyArray<readonly [boolean, boolean, boolean]> = [
  [false, false, true], // Slide 0: only diamond 2 (at 500px)
  [false, true, false], // Slide 1: only diamond 1 (at 500px)
  [true, false, false], // Slide 2: only diamond 0 (at 500px)
] as const;

/**
 * Index within each slide's diamondCards array where the label is stored.
 * All slides store their featured label at this index.
 */
export const DIAMOND_LABEL_INDEX = 2;

/**
 * Default diamond labels used when CMS data is unavailable.
 */
export const DEFAULT_LABELS = {
  ECONOMIC: 'Economic benefits',
  OPERATIONAL: 'Operational benefits',
  STRATEGIC: 'Strategic benefits',
} as const;

/**
 * Key prefix for diamond elements in the carousel.
 * Used to generate stable React keys for diamond components.
 */
export const DIAMOND_KEY_PREFIX = 'diamond-original';

/**
 * Maximum number of slides expected in the carousel.
 * Aligned with Figma design specifications.
 */
export const MAX_SLIDES = 3;

/**
 * Maximum number of diamonds expected per slide.
 * Aligned with Figma design specifications.
 */
export const MAX_DIAMONDS = 3;

/**
 * Organized layout configuration for diamond positioning and visibility.
 * Use these instead of accessing the individual maps directly.
 */
export const LAYOUT = {
  /** Maps [slideIndex][diamondIndex] to left positions in pixels */
  POSITIONS: POSITION_MAP,
  /** Maps [slideIndex][diamondIndex] to Tailwind text visibility (opacity controlled) */
  TEXT_VISIBILITY: TEXT_VISIBILITY_MAP,
  /** Maps [slideIndex][diamondIndex] to Tailwind z-index classes */
  Z_INDICES: Z_INDEX_MAP,
} as const;
