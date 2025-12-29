import {
  SECTION_PREFIX_CHALLENGE,
  SECTION_PREFIX_CUSTOM_INTERACTIVE,
  SECTION_PREFIX_VALUE,
  SLIDE_ID_CHALLENGE_INITIAL,
} from '@/app/(displays)/(kiosks)/_constants/scroll-sections';
import type { Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';

/**
 * Utility functions for determining the current section and screen state
 * in the kiosk navigation system.
 */

type SectionInfo = {
  readonly currentSection: string;
  readonly isCustomInteractiveSection: boolean;
  readonly isInitialScreen: boolean;
  readonly isValueSection: boolean;
};

/**
 * Determines the current section and related boolean flags based on the
 * current slide and scroll target.
 *
 * This consolidates complex boolean logic that was previously duplicated
 * and hard to maintain.
 *
 * @param currentSlide - The current slide object (may be undefined)
 * @param currentScrollTarget - The current scroll target ID (may be null)
 * @returns Object containing section info and boolean flags
 */
export const determineCurrentSection = (
  currentSlide: Slide | undefined,
  currentScrollTarget: null | string
): SectionInfo => {
  const currentSection = currentSlide?.id.split('-')[0] || SECTION_PREFIX_CHALLENGE;

  const isInitialScreen = currentSlide?.id === SLIDE_ID_CHALLENGE_INITIAL;

  const isValueSection =
    currentSection === SECTION_PREFIX_VALUE ||
    Boolean(currentScrollTarget && currentScrollTarget.startsWith(`${SECTION_PREFIX_VALUE}-`));

  const isCustomInteractiveSection = currentSection === SECTION_PREFIX_CUSTOM_INTERACTIVE;

  return {
    currentSection,
    isCustomInteractiveSection,
    isInitialScreen,
    isValueSection,
  };
};
