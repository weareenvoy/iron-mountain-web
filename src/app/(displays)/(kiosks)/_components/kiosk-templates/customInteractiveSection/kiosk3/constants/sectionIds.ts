/**
 * Section IDs for scroll navigation in Custom Interactive Kiosk 3
 */
export const SECTION_IDS = {
  FIRST_SCREEN: 'customInteractive-first-screen',
  SECOND_SCREEN: 'customInteractive-second-screen',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

/**
 * Intersection Observer threshold for triggering animations.
 * Value represents the percentage of the element that must be visible.
 *
 * Current value (0.3 = 30%) chosen because:
 * - Kiosk screens are 4K resolution with tall content
 * - 30% ensures animations trigger when content is meaningfully visible
 * - Lower values (e.g., 0.1) would trigger too early, causing animations to complete before user sees them
 * - Higher values (e.g., 0.5) might never trigger for below-fold content
 */
export const IN_VIEW_THRESHOLD = 0.3;
