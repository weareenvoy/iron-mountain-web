/**
 * Section IDs for scroll navigation in Custom Interactive Kiosk 3
 */
export const SECTION_IDS = {
  FIRST_SCREEN: 'customInteractive-first-screen',
  SECOND_SCREEN: 'customInteractive-second-screen',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
