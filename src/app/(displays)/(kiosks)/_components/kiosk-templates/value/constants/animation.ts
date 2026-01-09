/**
 * Animation configuration constants for the Value Carousel.
 * All timing and easing values matched to Figma motion design specifications.
 */

import type { DiamondIndex } from '@/app/(displays)/(kiosks)/_types/value-types';

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
  /** Easing function for smooth motion (30 out, 60 in) */
  EASE: [0.3, 0, 0.6, 1] as const,
  /** Index of the last diamond (for calculating total animation time) */
  LAST_DIAMOND_INDEX: 2,
} as const;

/**
 * Animation configuration for diamond text fade transitions.
 * Controls the opacity animation when diamond text appears/disappears.
 */
export const DIAMOND_TEXT_ANIMATION = {
  /** Duration of text fade animation (in seconds) */
  DURATION: 0.4,
  /** Easing function for text transitions (30 out, 60 in) */
  EASE: [0.3, 0, 0.6, 1] as const,
} as const;

/**
 * Animation configuration for bullet point transitions.
 * Values matched to Figma motion design specifications.
 */
export const BULLET_ANIMATION = {
  /** Animation duration in seconds */
  DURATION: 0.6,
  /** Cubic bezier easing curve for smooth motion (30 out, 60 in) */
  EASE: [0.3, 0, 0.6, 1] as const,
  /** Vertical offset (in px) for fade-in animation */
  Y_OFFSET: 40,
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
 * IntersectionObserver threshold (0-1) for triggering carousel animations.
 * Animation begins when this percentage of the carousel is visible in viewport.
 * Set to 0.3 (30%) to ensure diamonds are sufficiently visible before animating,
 * providing a better user experience as the animation triggers when meaningfully in view.
 */
export const CAROUSEL_VISIBILITY_THRESHOLD = 0.3;
