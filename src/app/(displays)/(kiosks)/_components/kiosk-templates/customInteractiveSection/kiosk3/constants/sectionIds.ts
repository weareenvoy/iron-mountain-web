/**
 * Section IDs for scroll navigation in Custom Interactive Kiosk 3
 */
export const SECTION_IDS = {
  FIRST_SCREEN: 'customInteractive-first-screen',
  SECOND_SCREEN: 'customInteractive-second-screen',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/**
 * Intersection Observer configuration for triggering animations.
 */
export const IN_VIEW_CONFIG = {
  /**
   * Alternative threshold for smaller screens or different content heights.
   * Can be used by passing to useInView options.
   */
  ALTERNATIVE_THRESHOLD: 0.5,

  /**
   * Default threshold for 4K kiosk displays.
   * Value represents the percentage of the element that must be visible.
   *
   * 0.3 (30%) chosen because:
   * - Kiosk screens are 4K resolution with tall content
   * - 30% ensures animations trigger when content is meaningfully visible
   * - Lower values (e.g., 0.1) would trigger too early
   * - Higher values (e.g., 0.5) might never trigger for below-fold content
   */
  DEFAULT_THRESHOLD: 0.3,
} as const;

/**
 * @deprecated Use IN_VIEW_CONFIG.DEFAULT_THRESHOLD instead
 */
export const IN_VIEW_THRESHOLD = IN_VIEW_CONFIG.DEFAULT_THRESHOLD;
