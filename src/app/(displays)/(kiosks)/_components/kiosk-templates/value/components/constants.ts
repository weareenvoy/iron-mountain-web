/**
 * Animation and positioning constants for the Value Carousel component.
 * These values control the diamond animations and positioning behavior.
 */

/**
 * Initial spread positions (in px) for diamonds before they animate together.
 * Used on slide 1's initial animation when the carousel becomes visible.
 */
export const INITIAL_SPREAD_POSITIONS = [660, 1230, 1785] as const;

/**
 * Maps diamond indices to their left positions for each slide.
 * Format: [slide][diamondIndex] = leftPositionInPx
 *
 * Slide 0: Operational (0), Economic (1), Strategic (2) at [165, 340, 500]
 * Slide 1: Strategic (2), Operational (0), Economic (1) at [165, 340, 500]
 * Slide 2: Economic (1), Strategic (2), Operational (0) at [165, 340, 500]
 */
export const POSITION_MAP = [
  [165, 340, 500], // Slide 0: diamond 0 at 165, diamond 1 at 340, diamond 2 at 500
  [340, 500, 165], // Slide 1: diamond 0 at 340, diamond 1 at 500, diamond 2 at 165 (Strategic featured)
  [500, 165, 340], // Slide 2: diamond 0 at 500, diamond 1 at 165, diamond 2 at 340 (Economic featured)
] as const;

/**
 * Maps diamond indices to their z-index classes for each slide.
 * Controls stacking order for visual depth.
 */
export const Z_INDEX_MAP = [
  ['', '', ''], // Slide 0: no z-index classes
  ['z-2', 'z-3', ''], // Slide 1: diamond 0 z-2, diamond 1 z-3, diamond 2 default
  ['z-3', 'z-1', 'z-2'], // Slide 2: diamond 0 z-3, diamond 1 z-1, diamond 2 z-2
] as const;

/**
 * Maps diamond indices to text visibility for each slide.
 * The diamond at position 500px always shows its text.
 */
export const TEXT_VISIBILITY_MAP = [
  [false, false, true], // Slide 0: only diamond 2 (at 500px)
  [false, true, false], // Slide 1: only diamond 1 (at 500px)
  [true, false, false], // Slide 2: only diamond 0 (at 500px)
] as const;

/**
 * Animation timing constants for diamond stagger effect on slide 1.
 */
export const DIAMOND_ANIMATION = {
  /** Delay increment between each diamond (in seconds) */
  DELAY_INCREMENT: 0.2,
  /** Duration of each diamond's animation on slide 1 (in seconds) */
  DURATION_FIRST_SLIDE: 0.8,
  /** Duration of diamond animations on subsequent slides (in seconds) */
  DURATION_OTHER_SLIDES: 0.6,
  /** Easing function for smooth motion */
  EASE: [0.4, 0, 0.2, 1] as const,
  /** Index of the last diamond (for calculating total animation time) */
  LAST_DIAMOND_INDEX: 2,
} as const;

/**
 * Calculated total time (in ms) for all diamonds to settle on slide 1.
 * Formula: (lastDiamondIndex * delayIncrement + duration) * 1000
 */
export const DIAMONDS_SETTLE_TIME =
  (DIAMOND_ANIMATION.LAST_DIAMOND_INDEX * DIAMOND_ANIMATION.DELAY_INCREMENT + DIAMOND_ANIMATION.DURATION_FIRST_SLIDE) *
  1000;

/**
 * Index of the diamond that should be initially visible (Strategic benefits on slide 1).
 */
export const INITIALLY_VISIBLE_DIAMOND_INDEX = 2;

/**
 * Valid slide indices (0-based).
 */
export type SlideIndex = 0 | 1 | 2;

/**
 * Valid diamond indices (0-based).
 */
export type DiamondIndex = 0 | 1 | 2;

/**
 * Default position fallback if slideIndex or diamondIndex is out of bounds.
 */
export const DEFAULT_DIAMOND_POSITION = 165;
