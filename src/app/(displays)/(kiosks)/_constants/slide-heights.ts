/**
 * Configuration for slide heights across all kiosk sections.
 * Heights are in pixels and represent the actual rendered height of each slide template.
 * 
 * These values are used to calculate dynamic gradient background heights
 * that adapt to which templates are present in the content.
 */

import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Standard screen height (100vh equivalent in pixels at 2160p)
 */
export const SCREEN_HEIGHT = 2160;

/**
 * Heights for Challenge section templates
 * Note: These values include content that extends beyond viewport height
 */
export const CHALLENGE_HEIGHTS: Record<KioskId, {
  /** Height of the initial/cover screen */
  initialScreen: number;
  /** Height of the first screen (with video header) */
  firstScreen: number;
  /** Height of the second screen */
  secondScreen: number;
  /** Height of the third screen */
  thirdScreen: number;
}> = {
  'kiosk-1': {
    initialScreen: SCREEN_HEIGHT,
    firstScreen: 4780,
    secondScreen: 4780,
    thirdScreen: 4780,
  },
  'kiosk-2': {
    initialScreen: SCREEN_HEIGHT,
    firstScreen: 4780,
    secondScreen: 4780,
    thirdScreen: 4830,
  },
  'kiosk-3': {
    initialScreen: SCREEN_HEIGHT,
    firstScreen: 4780,
    secondScreen: 4780,
    thirdScreen: 4780,
  },
};

/**
 * Heights for Solution section templates
 * Note: These are averaged heights based on typical content configurations
 * Actual heights will vary based on number of secondScreen instances
 */
export const SOLUTION_HEIGHTS: Record<KioskId, {
  /** Height of the first screen */
  firstScreen: number;
  /** Height of each second screen (numbered list) */
  secondScreen: number;
  /** Height of the third screen (diamond grid) */
  thirdScreen: number;
  /** Height of the fourth screen (accordion) */
  fourthScreen: number;
}> = {
  'kiosk-1': {
    firstScreen: 4230,
    secondScreen: 3644,
    thirdScreen: 6695,
    fourthScreen: 5215,
  },
  'kiosk-2': {
    firstScreen: 4230,
    secondScreen: 3644,
    thirdScreen: 6645,
    fourthScreen: 5210,
  },
  'kiosk-3': {
    firstScreen: 4230,
    secondScreen: 3644,
    thirdScreen: 6695,
    fourthScreen: 5210,
  },
};

/**
 * Heights for Custom Interactive section templates
 * Note: Custom interactives can have multiple instances (1-3)
 * Each instance has first and second screens
 */
export const CUSTOM_INTERACTIVE_HEIGHTS: Record<KioskId, {
  /** Height of the first screen */
  firstScreen: number;
  /** Height of the second screen (varies by kiosk type) */
  secondScreen: number;
}> = {
  'kiosk-1': {
    firstScreen: 5215,
    secondScreen: 5215,
  },
  'kiosk-2': {
    firstScreen: 5215,
    secondScreen: 5215,
  },
  'kiosk-3': {
    firstScreen: 5215,
    secondScreen: 5215,
  },
};

/**
 * Heights for Value section templates
 * Note: Value section has dynamic height based on carousel type
 */
export const VALUE_HEIGHTS: Record<KioskId, {
  /** Base height with header */
  baseHeight: number;
  /** Height for animated carousel variant */
  animatedCarouselHeight: number;
  /** Height for static carousel variant */
  staticCarouselHeight: number;
}> = {
  'kiosk-1': {
    baseHeight: 1060,
    animatedCarouselHeight: 4150,
    staticCarouselHeight: 9360,
  },
  'kiosk-2': {
    baseHeight: 1060,
    animatedCarouselHeight: 4150,
    staticCarouselHeight: 9360,
  },
  'kiosk-3': {
    baseHeight: 1060,
    animatedCarouselHeight: 4150,
    staticCarouselHeight: 9360,
  },
};

/**
 * Gradient start positions (top offset) for each section
 * These determine where the gradient background begins
 */
export const GRADIENT_START_POSITIONS: Record<string, Record<KioskId, number>> = {
  challenge: {
    'kiosk-1': 1290,
    'kiosk-2': 1290,
    'kiosk-3': 1290,
  },
  solution: {
    'kiosk-1': 1060,
    'kiosk-2': 1060,
    'kiosk-3': 1060,
  },
  customInteractive: {
    'kiosk-1': 0,
    'kiosk-2': 0,
    'kiosk-3': 0,
  },
  value: {
    'kiosk-1': 1060,
    'kiosk-2': 1060,
    'kiosk-3': 1060,
  },
};
