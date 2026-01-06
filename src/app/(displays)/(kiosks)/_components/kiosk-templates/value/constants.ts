/**
 * Animation and positioning constants for the Value Carousel component.
 * These values control the diamond animations and positioning behavior.
 */

import { createPosition, type DiamondIndex, type Position } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Initial spread positions (in px) for diamonds before they animate together.
 * Used on slide 1's initial animation when the carousel becomes visible.
 */
export const INITIAL_SPREAD_POSITIONS: readonly [Position, Position, Position] = [
  createPosition(660),
  createPosition(1230),
  createPosition(1785),
] as const;

/**
 * Maps diamond indices to their left positions for each slide.
 * Format: [slide][diamondIndex] = leftPositionInPx
 *
 * Slide 0: Operational (0), Economic (1), Strategic (2) at [165, 340, 500]
 * Slide 1: Strategic (2), Operational (0), Economic (1) at [165, 340, 500]
 * Slide 2: Economic (1), Strategic (2), Operational (0) at [165, 340, 500]
 */
export const POSITION_MAP: ReadonlyArray<readonly [Position, Position, Position]> = [
  [createPosition(165), createPosition(340), createPosition(500)], // Slide 0
  [createPosition(340), createPosition(500), createPosition(165)], // Slide 1 (Strategic featured)
  [createPosition(500), createPosition(165), createPosition(340)], // Slide 2 (Economic featured)
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
 * This diamond's text is visible at the start before any animations occur.
 */
export const INITIALLY_VISIBLE_DIAMOND_INDEX: DiamondIndex = 2;

/**
 * Index within each slide's diamondCards array where the label is stored.
 * All slides store their featured label at this index.
 */
export const DIAMOND_LABEL_INDEX: DiamondIndex = 2;

/**
 * Default diamond labels used when CMS data is unavailable.
 */
export const DEFAULT_LABELS = {
  ECONOMIC: 'Economic benefits',
  OPERATIONAL: 'Operational benefits',
  STRATEGIC: 'Strategic benefits',
} as const;

/**
 * IntersectionObserver threshold (0-1) for triggering carousel animations.
 * Animation begins when this percentage of the carousel is visible in viewport.
 * Set to 0.3 (30%) to ensure diamonds are sufficiently visible before animating,
 * providing a better user experience as the animation triggers when meaningfully in view.
 */
export const CAROUSEL_VISIBILITY_THRESHOLD = 0.3;

/**
 * Key prefix for diamond elements in the carousel.
 * Used to generate stable React keys for diamond components.
 */
export const DIAMOND_KEY_PREFIX = 'diamond-original';

/**
 * Maximum number of slides supported by the carousel.
 * Aligned with Figma design specifications.
 */
export const MAX_SLIDES = 3;

/**
 * Maximum number of diamonds per slide.
 * Aligned with Figma design specifications.
 */
export const MAX_DIAMONDS = 3;

/**
 * Animation configuration for bullet point transitions.
 * Values matched to Figma motion design specifications.
 */
export const BULLET_ANIMATION = {
  /** Animation duration in seconds */
  DURATION: 0.6,
  /** Cubic bezier easing curve for smooth motion */
  EASE: [0.4, 0, 0.2, 1] as const,
  /** Vertical offset (in px) for fade-in animation */
  Y_OFFSET: 40,
} as const;

/**
 * Layout configuration for bullet point styling.
 * All measurements derived from Figma design specifications.
 */
export const BULLET_LAYOUT = {
  /** Spacing between bullet items (px) - from Figma spacing system */
  ITEM_MARGIN: 80,
  /** Width of bullet text area (px) - from Figma frame width */
  ITEM_WIDTH: 840,
  /** Size of circular bullet marker (px) - from Figma component spec */
  MARKER_SIZE: 16,
  /** Top position of bullet marker (px) - from Figma marker positioning */
  MARKER_TOP: 30,
  /** Left padding for bullet text (px) - from Figma padding spec */
  TEXT_PADDING: 40,
} as const;

/**
 * Carousel layout dimensions from Figma design.
 * These values ensure pixel-perfect alignment with the design system.
 */
export const CAROUSEL_LAYOUT = {
  /** Gap between carousel sections (px) - from Figma spacing system */
  COLUMN_GAP: 220,
  /** Container gap for vertical spacing (px) - from Figma */
  CONTAINER_GAP: 80,
  /** Total width of carousel content area (px) - from Figma artboard */
  CONTENT_WIDTH: 2200,
  /** Minimum height of carousel container (px) - from Figma frame */
  MIN_HEIGHT: 1600,
  /** Right padding for content overflow (px) - from Figma padding spec */
  PADDING_RIGHT: 80,
} as const;

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
