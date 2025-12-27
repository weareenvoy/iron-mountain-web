// This file contains all the timing constants for the Kiosk setup in milliseconds.

/**
 * Timing constants for kiosk navigation and UI transitions
 */

// ========== Arrow Navigation Delays ==========

/**
 * Delay before showing navigation arrows after the initial button click
 * on the welcome screen. Provides a brief pause for user orientation.
 */
export const ARROW_INITIAL_DELAY_MS = 1500;

/**
 * Delay before showing navigation arrows when transitioning between major
 * sections (Challenge → Solution → Value). Shorter delay for smoother UX.
 */
export const ARROW_TRANSITION_DELAY_MS = 300;

// ========== Scroll Navigation ==========

/**
 * Duration of smooth scroll animations when navigating between sections
 * using arrow keys or navigation buttons.
 */
export const SCROLL_DURATION_MS = 1200;

/**
 * Default scroll duration for paragraph navigation hook.
 */
export const PARAGRAPH_SCROLL_DURATION_MS = 150;

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
