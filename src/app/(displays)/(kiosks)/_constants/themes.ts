// The main navigation arrows change colors based on the section they're in. This keeps those colors consistent.

/**
 * Constants for arrow and UI themes used in the kiosk displays.
 */

export const ARROW_THEME_BLUE = 'blue' as const;
export const ARROW_THEME_GRAY = 'gray' as const;

/**
 * Type for all valid arrow themes
 */
export type ArrowTheme = typeof ARROW_THEME_BLUE | typeof ARROW_THEME_GRAY;

/**
 * Accordion color themes
 */
export const ACCORDION_COLOR_WHITE = 'white' as const;
export const ACCORDION_COLOR_LIGHT_BLUE = 'lightBlue' as const;
export const ACCORDION_COLOR_BLUE = 'blue' as const;
export const ACCORDION_COLOR_NAVY = 'navy' as const;

/**
 * Type for all valid accordion colors
 */
export type AccordionColor =
  | typeof ACCORDION_COLOR_BLUE
  | typeof ACCORDION_COLOR_LIGHT_BLUE
  | typeof ACCORDION_COLOR_NAVY
  | typeof ACCORDION_COLOR_WHITE;
