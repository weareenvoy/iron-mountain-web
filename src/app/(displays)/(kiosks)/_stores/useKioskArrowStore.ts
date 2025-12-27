import { create } from 'zustand';
import type { KioskId } from '../_types/kiosk-id';

// This file is used to manage arrow visibility, color, and animation states for the arrow nav in all three kiosks.

export type ArrowTheme = 'blue' | 'gray';

type KioskArrowState = {
  readonly allowArrowsToShow: boolean;
  readonly arrowTheme: ArrowTheme;
  readonly previousScrollTarget: null | string;
  readonly shouldResetOnInitial: boolean;
  readonly showArrows: boolean;
  readonly wasScrollingToVideo: boolean;
};

type Store = {
  // Actions
  readonly handleArrowThemeUpdate: (kioskId: KioskId, isValueSection: boolean, showArrows: boolean) => void;
  readonly handleButtonClick: (kioskId: KioskId) => void;
  readonly handleInitialScreenReset: (kioskId: KioskId, isInitialScreen: boolean) => void;
  readonly handleScrollComplete: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    isScrolling: boolean,
    isCustomInteractiveSection: boolean
  ) => void;
  readonly handleScrollStart: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    previousScrollTarget: null | string,
    isScrolling: boolean
  ) => void;
  readonly handleScrollTargetChange: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    previousScrollTarget: null | string,
    isInitialScreen: boolean
  ) => void;
  readonly kiosk1: KioskArrowState;
  readonly kiosk2: KioskArrowState;
  readonly kiosk3: KioskArrowState;
  readonly resetKiosk: (kioskId: KioskId) => void;
};

const defaultKioskState: KioskArrowState = {
  allowArrowsToShow: false,
  arrowTheme: 'blue',
  previousScrollTarget: null,
  shouldResetOnInitial: false,
  showArrows: false,
  wasScrollingToVideo: false,
};

// Helper to map KioskId to store key
const getStoreKey = (kioskId: KioskId): 'kiosk1' | 'kiosk2' | 'kiosk3' => {
  switch (kioskId) {
    case 'kiosk-1':
      return 'kiosk1';
    case 'kiosk-2':
      return 'kiosk2';
    case 'kiosk-3':
      return 'kiosk3';
  }
};

export const useKioskArrowStore = create<Store>((set, get) => ({
  handleArrowThemeUpdate: (kioskId: KioskId, isValueSection: boolean, showArrows: boolean) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    // Only update theme when arrows are visible
    if (showArrows) {
      const newTheme: ArrowTheme = isValueSection ? 'gray' : 'blue';

      if (state.arrowTheme !== newTheme) {
        set({
          [key]: {
            ...state,
            arrowTheme: newTheme,
          },
        });
      }
    }
  },
  handleButtonClick: (kioskId: KioskId) => {
    const key = getStoreKey(kioskId);
    set(state => ({
      [key]: {
        ...state[key],
        allowArrowsToShow: true,
      },
    }));
  },
  handleInitialScreenReset: (kioskId: KioskId, isInitialScreen: boolean) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    if (isInitialScreen && state.shouldResetOnInitial && state.showArrows) {
      set({
        [key]: {
          ...state,
          allowArrowsToShow: false,
          shouldResetOnInitial: false,
          showArrows: false,
        },
      });
    }
  },

  handleScrollComplete: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    isScrolling: boolean,
    isCustomInteractiveSection: boolean
  ) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    if (isScrolling) return;

    // Helper to get section name from target
    const getSection = (target: null | string): string => {
      if (!target) return 'initial';
      if (target === 'challenge-initial') return 'initial';
      if (target.startsWith('challenge-')) return 'challenge';
      if (target.startsWith('solution-')) return 'solution';
      if (target.startsWith('value-')) return 'value';
      if (target.includes('customInteractive-')) return 'customInteractive';
      // Challenge section scroll targets without prefix
      if (
        target === 'description' ||
        target === 'main-description' ||
        target === 'bottom-description' ||
        target === 'metrics-description'
      )
        return 'challenge';
      return 'unknown';
    };

    const currentSection = getSection(currentScrollTarget);

    // Don't show arrows on initial screen or custom interactive
    if (currentSection === 'initial' || (currentSection === 'customInteractive' && isCustomInteractiveSection)) {
      set({
        [key]: {
          ...state,
          showArrows: false,
          wasScrollingToVideo: false,
        },
      });
      return;
    }

    // If we just hid arrows due to section transition, show them again after delay
    // (for Challenge, Solution, and Value sections only)
    if (state.wasScrollingToVideo && state.allowArrowsToShow) {
      const shouldShowArrows =
        currentSection === 'challenge' || currentSection === 'solution' || currentSection === 'value';

      if (shouldShowArrows) {
        // Use longer delay for first appearance, shorter for subsequent
        const delay = currentScrollTarget === 'challenge-first-video' ? 1500 : 300;
        setTimeout(() => {
          set(currentState => ({
            [key]: {
              ...currentState[key],
              showArrows: true,
              wasScrollingToVideo: false,
            },
          }));
        }, delay);
      } else {
        // Reset the flag if we're not showing arrows
        set({
          [key]: {
            ...state,
            wasScrollingToVideo: false,
          },
        });
      }
    }
  },

  handleScrollStart: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    previousScrollTarget: null | string,
    isScrolling: boolean
  ) => {
    if (!isScrolling) return;

    const key = getStoreKey(kioskId);
    const state = get()[key];

    // Helper to get section name from target
    const getSection = (target: null | string): string => {
      if (!target) return 'initial';
      if (target === 'challenge-initial') return 'initial';
      if (target.startsWith('challenge-')) return 'challenge';
      if (target.startsWith('solution-')) return 'solution';
      if (target.startsWith('value-')) return 'value';
      if (target.includes('customInteractive-')) return 'customInteractive';
      // Challenge section scroll targets without prefix
      if (
        target === 'description' ||
        target === 'main-description' ||
        target === 'bottom-description' ||
        target === 'metrics-description'
      )
        return 'challenge';
      return 'unknown';
    };

    const currentSection = getSection(currentScrollTarget);
    const previousSection = getSection(previousScrollTarget);

    // Hide arrows when crossing section boundaries (entering a new major section)
    const isCrossingSectionBoundary = currentSection !== previousSection;
    const isEnteringInitial = currentSection === 'initial';
    const isEnteringSolution = currentSection === 'solution';
    const isEnteringValue = currentSection === 'value';
    const isEnteringChallenge = currentSection === 'challenge' && previousSection !== 'challenge';
    const isEnteringCustomInteractive = currentSection === 'customInteractive';

    // Hide arrows when entering any new section (check target, not current position)
    const shouldHideArrows =
      isEnteringInitial ||
      (isCrossingSectionBoundary && (isEnteringSolution || isEnteringValue || isEnteringChallenge)) ||
      isEnteringCustomInteractive; // Removed isCustomInteractiveSection check - target determines hiding

    if (shouldHideArrows) {
      set({
        [key]: {
          ...state,
          showArrows: false,
          wasScrollingToVideo: true,
        },
      });
    }
  },

  handleScrollTargetChange: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    previousScrollTarget: null | string,
    isInitialScreen: boolean
  ) => {
    if (currentScrollTarget === previousScrollTarget) return;

    const key = getStoreKey(kioskId);
    const shouldResetOnInitial =
      previousScrollTarget === 'challenge-first-video' && !currentScrollTarget && isInitialScreen;

    const shouldClearReset = Boolean(currentScrollTarget);

    set(state => ({
      [key]: {
        ...state[key],
        previousScrollTarget: currentScrollTarget,
        shouldResetOnInitial: shouldResetOnInitial || (!shouldClearReset && state[key].shouldResetOnInitial),
      },
    }));
  },

  kiosk1: { ...defaultKioskState, arrowTheme: 'blue' },

  kiosk2: { ...defaultKioskState, arrowTheme: 'blue' },

  kiosk3: { ...defaultKioskState, arrowTheme: 'blue' },

  resetKiosk: (kioskId: KioskId) => {
    const key = getStoreKey(kioskId);

    set({
      [key]: {
        ...defaultKioskState,
        arrowTheme: 'blue',
      },
    });
  },
}));
