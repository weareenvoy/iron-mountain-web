/**
 * Animation transform values for kiosk section title animations.
 * 
 * IMPORTANT: These exact pixel values match the motion comp specifications.
 * Do not modify without design team approval as they are precisely calibrated
 * for visual consistency across all kiosk sections.
 */
export const TITLE_ANIMATION_TRANSFORMS = {
  /** Challenge section - first element (subheadline) Y-transform */
  CHALLENGE_SUBHEADLINE: -450,
  /** Challenge section - second element (label) Y-transform */
  CHALLENGE_LABEL: 610,
  
  /** Solution, Value, Custom Interactive sections - uniform Y-transform */
  SECTION_HEADER: -1100,
  
  /** Initial screen - scale transform for sticky header */
  INITIAL_SCALE: 0.5,
  /** Initial screen - X-transform for sticky header */
  INITIAL_X: -540,
} as const;

