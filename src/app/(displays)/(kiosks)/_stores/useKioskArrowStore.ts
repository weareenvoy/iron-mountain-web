import { create } from 'zustand';
import type { KioskId } from '../_types/kiosk-id';

type KioskArrowState = {
  readonly allowArrowsToShow: boolean;
  readonly arrowColor: string;
  readonly previousScrollTarget: null | string;
  readonly shouldResetOnInitial: boolean;
  readonly showArrows: boolean;
  readonly wasScrollingToVideo: boolean;
};

type Store = {
  // Actions
  readonly handleArrowColorUpdate: (kioskId: KioskId, isValueSection: boolean, showArrows: boolean) => void;
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
    isScrolling: boolean,
    isCustomInteractiveSection: boolean
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
  arrowColor: '#6DCFF6',
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
  handleArrowColorUpdate: (kioskId: KioskId, isValueSection: boolean, showArrows: boolean) => {
    const key = getStoreKey(kioskId);
    const state = get()[key];

    // Only update color when arrows are visible
    if (showArrows) {
      const defaultColors: Record<KioskId, string> = {
        'kiosk-1': '#6DCFF6',
        'kiosk-2': '#6DCFF6',
        'kiosk-3': '#F7931E',
      };

      const newColor = isValueSection ? '#58595B' : defaultColors[kioskId];

      if (state.arrowColor !== newColor) {
        set({
          [key]: {
            ...state,
            arrowColor: newColor,
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

    if (isScrolling || !currentScrollTarget) return;

    // Initial appearance after button click
    if (state.allowArrowsToShow && currentScrollTarget === 'challenge-first-video') {
      setTimeout(() => {
        set(currentState => ({
          [key]: {
            ...currentState[key],
            showArrows: true,
          },
        }));
      }, 1500); // ARROW_INITIAL_DELAY_MS
      return;
    }

    // Reappear after scrolling to video (but not customInteractive)
    const isVideoTarget =
      currentScrollTarget.includes('-video') ||
      currentScrollTarget.includes('-first-video') ||
      currentScrollTarget === 'value-carousel';

    const isCustomInteractiveTarget = currentScrollTarget.includes('customInteractive-');

    if (
      state.wasScrollingToVideo &&
      isVideoTarget &&
      !isCustomInteractiveTarget &&
      state.allowArrowsToShow &&
      !isCustomInteractiveSection
    ) {
      setTimeout(() => {
        set(currentState => ({
          [key]: {
            ...currentState[key],
            showArrows: true,
            wasScrollingToVideo: false,
          },
        }));
      }, 300); // ARROW_TRANSITION_DELAY_MS
      return;
    }

    // Reset tracking if finished scrolling to customInteractive
    if (state.wasScrollingToVideo && isCustomInteractiveTarget) {
      set({
        [key]: {
          ...state,
          wasScrollingToVideo: false,
        },
      });
    }
  },

  handleScrollStart: (
    kioskId: KioskId,
    currentScrollTarget: null | string,
    isScrolling: boolean,
    isCustomInteractiveSection: boolean
  ) => {
    if (!isScrolling || !currentScrollTarget) return;

    const key = getStoreKey(kioskId);
    const isScrollingToVideo =
      currentScrollTarget.includes('-video') ||
      currentScrollTarget.includes('-first-video') ||
      currentScrollTarget === 'value-carousel';

    const isScrollingToCustomInteractive = currentScrollTarget.includes('customInteractive-');
    const shouldHideArrows = isScrollingToVideo || (isScrollingToCustomInteractive && isCustomInteractiveSection);

    const state = get()[key];

    if (shouldHideArrows && !state.wasScrollingToVideo) {
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

  kiosk1: { ...defaultKioskState, arrowColor: '#6DCFF6' },

  kiosk2: { ...defaultKioskState, arrowColor: '#6DCFF6' },

  kiosk3: { ...defaultKioskState, arrowColor: '#F7931E' },

  resetKiosk: (kioskId: KioskId) => {
    const key = getStoreKey(kioskId);
    const defaultColors: Record<KioskId, string> = {
      'kiosk-1': '#6DCFF6',
      'kiosk-2': '#6DCFF6',
      'kiosk-3': '#F7931E',
    };

    set({
      [key]: {
        ...defaultKioskState,
        arrowColor: defaultColors[kioskId],
      },
    });
  },
}));
