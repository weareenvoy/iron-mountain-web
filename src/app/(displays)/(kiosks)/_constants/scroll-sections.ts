/**
 * Constants for scroll section IDs used throughout the kiosk navigation system.
 * These IDs are used with the `data-scroll-section` attribute to identify scrollable regions.
 */

// Value section IDs
export const SCROLL_SECTION_VALUE_CAROUSEL = 'value-carousel';

/**
 * Type for all valid scroll section IDs
 */
export type ScrollSectionId = typeof SCROLL_SECTION_VALUE_CAROUSEL;

// Slide ID constants
export const SLIDE_ID_CHALLENGE_INITIAL = 'challenge-initial';

// Section prefix constants
export const SECTION_PREFIX_CHALLENGE = 'challenge';
export const SECTION_PREFIX_CUSTOM_INTERACTIVE = 'customInteractive';
export const SECTION_PREFIX_VALUE = 'value';
