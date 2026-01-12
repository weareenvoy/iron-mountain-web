// This file contains all the timing constants for the Kiosk setup in milliseconds.

/**
 * Timing constants for kiosk navigation and UI transitions
 */

// ========== Scroll Navigation ==========

/**
 * Duration of the scroll animation when navigating between sections using arrow keys
 * or navigation buttons. Powered by Framer Motion's animate() for precise control.
 * Value in milliseconds (e.g., 1200 = 1.2 second scroll animation).
 */
export const SCROLL_DURATION_MS = 1500;

/**
 * Vertical offset from viewport top for text elements (paragraphs, headings)
 * when navigating. Positions text lower on screen for better readability.
 * Videos and full-screen divs use 0 offset for exact positioning.
 */
export const TEXT_ELEMENT_SCROLL_OFFSET_PX = 800;

// ========== Observer & Detection Delays ==========

/**
 * Delay before retrying to set up the MutationObserver when the container
 * is not yet available in the DOM.
 */
export const OBSERVER_SETUP_RETRY_MS = 50;

/**
 * Delay before retrying paragraph detection when no scroll sections are found.
 */
export const PARAGRAPH_DETECTION_RETRY_MS = 100;

// ========== Framer Motion Transitions ==========

/**
 * Duration for arrow button fade-in animation (Kiosk 2 & 3).
 */
export const ARROW_FADE_DURATION_SEC = 0.4;

/**
 * Duration for arrow button fade-in animation (Kiosk 1 only).
 */
export const ARROW_FADE_DURATION_KIOSK1_SEC = 0.6;
