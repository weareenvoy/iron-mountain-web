import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createArrowActions, defaultKioskArrowState, type KioskArrowState } from './arrowSlice';
import { ARROW_THEME_BLUE } from '../_constants/themes';
import { getSectionFromScrollTarget, getStoreKey } from './kioskStoreUtils';
import type { KioskId } from '../_types/kiosk-id';

// Zustand store managing arrow visibility, theme, and animation state.

/**
 * Zustand store for managing arrow visibility, theme, and animation states.
 * Refactored into slices for better maintainability and testability.
 *
 * This store manages:
 * - Arrow visibility (show/hide)
 * - Arrow theme (blue/gray based on section)
 * - Scroll state tracking
 * - Section transitions
 */

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
  // State
  readonly kiosk1: KioskArrowState;
  readonly kiosk2: KioskArrowState;
  readonly kiosk3: KioskArrowState;
  readonly resetKiosk: (kioskId: KioskId) => void;
};

export const useKioskArrowStore = create<Store>()(
  devtools(
    (set, get) => {
      const actions = createArrowActions(get);

      return {
        // High-level action handlers (called by components)
        handleArrowThemeUpdate: (kioskId: KioskId, isValueSection: boolean, showArrows: boolean) => {
          const update = actions.updateArrowTheme(kioskId, isValueSection, showArrows);
          if (update) set(update);
        },

        handleButtonClick: (kioskId: KioskId) => {
          const update = actions.handleButtonClick(kioskId);
          set(update);
        },

        handleInitialScreenReset: (kioskId: KioskId, isInitialScreen: boolean) => {
          const update = actions.resetOnInitialScreen(kioskId, isInitialScreen);
          if (update) set(update);
        },

        handleScrollComplete: (
          kioskId: KioskId,
          currentScrollTarget: null | string,
          isScrolling: boolean,
          isCustomInteractiveSection: boolean
        ) => {
          if (isScrolling) return;

          const key = getStoreKey(kioskId);
          const state = get()[key];

          console.info('[handleScrollComplete]', {
            allowArrowsToShow: state.allowArrowsToShow,
            currentScrollTarget,
            kioskId,
            wasScrollingToVideo: state.wasScrollingToVideo,
          });

          // Get section for initial/customInteractive check
          const section = getSectionFromScrollTarget(currentScrollTarget);
          const isInitialOrCustomInteractive =
            section === 'initial' || (section === 'customInteractive' && isCustomInteractiveSection);

          // Always hide on initial or custom interactive
          if (isInitialOrCustomInteractive) {
            const update = actions.hideArrows(kioskId);
            set(update);
            return;
          }

          // Only handle show/hide if we were scrolling to video
          if (state.wasScrollingToVideo && state.allowArrowsToShow) {
            const delay = actions.calculateArrowShowDelay(kioskId, currentScrollTarget, isCustomInteractiveSection);

            if (delay !== null) {
              // Show arrows after delay (use functional update to get fresh state)
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
              // Reset flag if we're not showing arrows
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

          const update = actions.hideArrowsOnScrollStart(kioskId, currentScrollTarget, previousScrollTarget);
          if (update) set(update);
        },

        handleScrollTargetChange: (
          kioskId: KioskId,
          currentScrollTarget: null | string,
          previousScrollTarget: null | string,
          isInitialScreen: boolean
        ) => {
          const update = actions.updateScrollTarget(
            kioskId,
            currentScrollTarget,
            previousScrollTarget,
            isInitialScreen
          );
          if (update) set(update);
        },

        // Initial state
        kiosk1: { ...defaultKioskArrowState, arrowTheme: ARROW_THEME_BLUE },
        kiosk2: { ...defaultKioskArrowState, arrowTheme: ARROW_THEME_BLUE },
        kiosk3: { ...defaultKioskArrowState, arrowTheme: ARROW_THEME_BLUE },

        // Reset action
        resetKiosk: (kioskId: KioskId) => {
          const key = getStoreKey(kioskId);
          set({
            [key]: {
              ...defaultKioskArrowState,
              arrowTheme: ARROW_THEME_BLUE,
            },
          });
        },
      };
    },
    { name: 'KioskArrowStore' }
  )
);
