import { ARROW_THEME_BLUE, ARROW_THEME_GRAY, type ArrowTheme } from '../_constants/themes';
import { getSectionFromScrollTarget, getStoreKey } from './kioskStoreUtils';
import type { KioskId } from '../_types/kiosk-id';

/**
 * Arrow state slice for a single kiosk.
 * Encapsulates all arrow-related state and logic.
 */

export type KioskArrowState = {
  readonly allowArrowsToShow: boolean;
  readonly arrowTheme: ArrowTheme;
  readonly previousScrollTarget: null | string;
  readonly shouldResetOnInitial: boolean;
  readonly showArrows: boolean;
  readonly wasScrollingToVideo: boolean;
};

export const defaultKioskArrowState: KioskArrowState = {
  allowArrowsToShow: false,
  arrowTheme: ARROW_THEME_BLUE,
  previousScrollTarget: null,
  shouldResetOnInitial: false,
  showArrows: false,
  wasScrollingToVideo: false,
};

/**
 * Actions for managing arrow state.
 */

export const createArrowActions = (get: () => { [K in 'kiosk1' | 'kiosk2' | 'kiosk3']: KioskArrowState }) => ({
  /**
   * Shows arrows after scroll completes (with delay for smooth UX).
   * Returns delay in ms if arrows should be shown, null otherwise.
   */
  calculateArrowShowDelay: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    isCustomInteractiveSection: boolean
  ): null | number => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    const currentSection = getSectionFromScrollTarget(currentScrollTarget);

    // Never show arrows on initial or custom interactive
    if (currentSection === 'initial' || (currentSection === 'customInteractive' && isCustomInteractiveSection)) {
      return null;
    }

    // Only show if we were scrolling to video and arrows are allowed
    if (!state.wasScrollingToVideo || !state.allowArrowsToShow) {
      return null;
    }

    // Calculate appropriate delay
    const isChallenge = currentSection === 'challenge';
    const isSolution = currentSection === 'solution';
    const isValue = currentSection === 'value';

    if (isChallenge || isSolution || isValue) {
      // Longer delay for first appearance after initial screen
      return currentScrollTarget === 'challenge-first-video' ? 1500 : 300;
    }

    return null;
  },

  /**
   * Enables arrow visibility after initial button click.
   */
  handleButtonClick: (kioskId: KioskId) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    return {
      [key]: {
        ...state,
        allowArrowsToShow: true,
      },
    };
  },

  /**
   * Hides arrows and resets scroll-to-video flag.
   */
  hideArrows: (kioskId: KioskId) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    return {
      [key]: {
        ...state,
        showArrows: false,
        wasScrollingToVideo: false,
      },
    };
  },

  /**
   * Hides arrows when scrolling starts (section transitions).
   */
  hideArrowsOnScrollStart: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    previousScrollTarget: null | string
  ) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    const currentSection = getSectionFromScrollTarget(currentScrollTarget);
    const previousSection = getSectionFromScrollTarget(previousScrollTarget);

    const isCrossingSectionBoundary = currentSection !== previousSection;
    const isEnteringInitial = currentSection === 'initial';
    const isEnteringSolution = currentSection === 'solution';
    const isEnteringValue = currentSection === 'value';
    const isEnteringChallenge = currentSection === 'challenge' && previousSection !== 'challenge';
    const isEnteringCustomInteractive = currentSection === 'customInteractive';

    const shouldHideArrows =
      isEnteringInitial ||
      (isCrossingSectionBoundary && (isEnteringSolution || isEnteringValue || isEnteringChallenge)) ||
      isEnteringCustomInteractive;

    if (!shouldHideArrows) return null;

    return {
      [key]: {
        ...state,
        showArrows: false,
        wasScrollingToVideo: true,
      },
    };
  },

  /**
   * Resets arrow state when returning to initial screen.
   */
  resetOnInitialScreen: (kioskId: KioskId, isInitialScreen: boolean) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    if (!isInitialScreen || !state.shouldResetOnInitial || !state.showArrows) {
      return null;
    }

    return {
      [key]: {
        ...state,
        allowArrowsToShow: false,
        shouldResetOnInitial: false,
        showArrows: false,
      },
    };
  },

  /**
   * Shows arrows immediately (no delay).
   */
  showArrowsImmediately: (kioskId: KioskId) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    return {
      [key]: {
        ...state,
        showArrows: true,
        wasScrollingToVideo: false,
      },
    };
  },

  /**
   * Updates arrow theme based on current section.
   */
  updateArrowTheme: (kioskId: KioskId, isValueSection: boolean, showArrows: boolean) => {
    if (!showArrows) return null;

    const key = getStoreKey(kioskId);
    const state = get()[key];
    const newTheme: ArrowTheme = isValueSection ? ARROW_THEME_GRAY : ARROW_THEME_BLUE;

    if (state.arrowTheme === newTheme) return null;

    return {
      [key]: {
        ...state,
        arrowTheme: newTheme,
      },
    };
  },

  /**
   * Tracks scroll target changes for state management.
   */
  updateScrollTarget: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    previousScrollTarget: null | string,
    isInitialScreen: boolean
  ) => {
    if (currentScrollTarget === previousScrollTarget) return null;

    const key = getStoreKey(kioskId);
    const state = get()[key];

    const shouldResetOnInitial =
      previousScrollTarget === 'challenge-first-video' && !currentScrollTarget && isInitialScreen;

    const shouldClearReset = Boolean(currentScrollTarget);

    return {
      [key]: {
        ...state,
        previousScrollTarget: currentScrollTarget,
        shouldResetOnInitial: shouldResetOnInitial || (!shouldClearReset && state.shouldResetOnInitial),
      },
    };
  },
});
