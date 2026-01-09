/**
 * Constants for scroll section IDs used throughout the kiosk navigation system.
 * These IDs are used with the `data-scroll-section` attribute to identify scrollable regions.
 */

// Challenge section IDs
export const SCROLL_SECTION_CHALLENGE_FIRST_VIDEO = 'challenge-first-video';
export const SCROLL_SECTION_CHALLENGE_FIRST_BODY = 'challenge-first-body';
export const SCROLL_SECTION_CHALLENGE_SECOND = 'challenge-second-item';
export const SCROLL_SECTION_CHALLENGE_THIRD = 'challenge-third-item';

// Solution section IDs
export const SCROLL_SECTION_SOLUTION_FIRST_VIDEO = 'solution-first-video';
export const SCROLL_SECTION_SOLUTION_FIRST_BODY = 'solution-first-body';
export const SCROLL_SECTION_SOLUTION_SECOND_GROUP = 'solution-second-group';
export const SCROLL_SECTION_SOLUTION_THIRD_TITLE = 'solution-third-title';
export const SCROLL_SECTION_SOLUTION_FOURTH_TITLE = 'solution-fourth-title';

// Value section IDs
export const SCROLL_SECTION_VALUE_CAROUSEL = 'value-carousel';

// Custom Interactive section IDs
export const SCROLL_SECTION_CUSTOM_INTERACTIVE_FIRST = 'custom-interactive-first';
export const SCROLL_SECTION_CUSTOM_INTERACTIVE_SECOND = 'custom-interactive-second';
export const SCROLL_SECTION_CUSTOM_INTERACTIVE_THIRD = 'custom-interactive-third';
export const SCROLL_SECTION_CUSTOM_INTERACTIVE_FOURTH = 'custom-interactive-fourth';

/**
 * Type for all valid scroll section IDs
 */
export type ScrollSectionId =
  | typeof SCROLL_SECTION_CHALLENGE_FIRST_BODY
  | typeof SCROLL_SECTION_CHALLENGE_FIRST_VIDEO
  | typeof SCROLL_SECTION_CHALLENGE_SECOND
  | typeof SCROLL_SECTION_CHALLENGE_THIRD
  | typeof SCROLL_SECTION_CUSTOM_INTERACTIVE_FIRST
  | typeof SCROLL_SECTION_CUSTOM_INTERACTIVE_FOURTH
  | typeof SCROLL_SECTION_CUSTOM_INTERACTIVE_SECOND
  | typeof SCROLL_SECTION_CUSTOM_INTERACTIVE_THIRD
  | typeof SCROLL_SECTION_SOLUTION_FIRST_BODY
  | typeof SCROLL_SECTION_SOLUTION_FIRST_VIDEO
  | typeof SCROLL_SECTION_SOLUTION_FOURTH_TITLE
  | typeof SCROLL_SECTION_SOLUTION_SECOND_GROUP
  | typeof SCROLL_SECTION_SOLUTION_THIRD_TITLE
  | typeof SCROLL_SECTION_VALUE_CAROUSEL;

// Slide ID constants
export const SLIDE_ID_CHALLENGE_INITIAL = 'challenge-initial';

// Section prefix constants
export const SECTION_PREFIX_CHALLENGE = 'challenge';
export const SECTION_PREFIX_CUSTOM_INTERACTIVE = 'customInteractive';
export const SECTION_PREFIX_SOLUTION = 'solution';
export const SECTION_PREFIX_VALUE = 'value';
