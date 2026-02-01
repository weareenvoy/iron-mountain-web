import { useCallback, useEffect, useReducer } from 'react';
import { useKioskAudio } from '@/app/(displays)/(kiosks)/_components/providers/useKioskAudio';
import { useAudio, useSfx } from '@/components/providers/audio-provider';

/**
 * State for Kiosk 3 Second Screen animation sequence
 */
type Kiosk3SecondScreenState = {
  /** Current carousel slide index (0-based) */
  carouselIndex: number;
  /** Whether "Tap to begin" button is transitioning/morphing */
  isButtonTransitioning: boolean;
  /** Whether current carousel slide is exiting */
  isCarouselExiting: boolean;
  /** Whether carousel is visible (main animation state) */
  showCarousel: boolean;
  /** Whether demo overlay is visible */
  showOverlay: boolean;
};

/**
 * Actions for state machine transitions.
 * Each action represents a specific user interaction or animation state change.
 */
type Kiosk3SecondScreenAction =
  /** Button morph animation completed - finalizes transition state */
  | { carouselIndex: number; type: 'SET_CAROUSEL_INDEX' }
  /** Carousel slide exit animation state changed - coordinates morphing diamond exit */
  | { isExiting: boolean; type: 'SET_IS_EXITING' }
  /** Carousel index changed (user navigated slides) - updates current slide tracking */
  | { type: 'BUTTON_TRANSITION_COMPLETE' }
  /** User dismissed demo overlay - returns to carousel view */
  | { type: 'HIDE_OVERLAY' }
  /** User clicked "Launch demo" button - shows fullscreen demo overlay */
  | { type: 'SHOW_OVERLAY' }
  /** User clicked "Tap to begin" button - triggers button morph and carousel reveal */
  | { type: 'TAP_TO_BEGIN' };

const initialState: Kiosk3SecondScreenState = {
  carouselIndex: 0,
  isButtonTransitioning: false,
  isCarouselExiting: false,
  showCarousel: false,
  showOverlay: false,
};

/**
 * Button transition animation duration (ms)
 * Matches TRANSITIONS.FADE duration from constants
 */
const BUTTON_TRANSITION_DURATION_MS = 500;

/**
 * Custom hook that encapsulates the state management logic for Kiosk 3 Second Screen.
 *
 * Manages the complex state machine for the morphing animation sequence:
 * 1. Initial state (rings, dots, "Tap to begin")
 * 2. Carousel state (slides with media)
 * 3. Demo overlay state
 *
 * Uses useReducer for better state transition management and prevention of impossible states.
 *
 * @returns State values and stable event handlers
 */
export function useKiosk3SecondScreenState() {
  const [state, dispatch] = useReducer(kiosk3SecondScreenReducer, initialState);
  const { sfx } = useKioskAudio();
  const { playSfx } = useSfx();
  const audioController = useAudio();

  // Complete button transition after animation duration
  useEffect(() => {
    if (!state.isButtonTransitioning) return undefined;

    const timer = setTimeout(() => {
      dispatch({ type: 'BUTTON_TRANSITION_COMPLETE' });
    }, BUTTON_TRANSITION_DURATION_MS);

    return () => clearTimeout(timer);
  }, [state.isButtonTransitioning]);

  // Smoothly fade background music when demo overlay is active
  useEffect(() => {
    const targetVolume = state.showOverlay ? 0 : 1;
    const fadeMs = 300; // Fade duration in milliseconds
    const steps = 20; // Number of steps for the fade
    const stepDuration = fadeMs / steps;
    const startVolume = state.showOverlay ? 1 : 0;
    const volumeStep = Math.abs(targetVolume - startVolume) / steps;

    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = state.showOverlay 
        ? Math.max(0, startVolume - volumeStep * currentStep)
        : Math.min(1, startVolume + volumeStep * currentStep);
      
      audioController.setChannelVolume('music', newVolume);

      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        // Ensure final volume is set correctly
        audioController.setChannelVolume('music', targetVolume);
      }
    }, stepDuration);

    return () => {
      clearInterval(fadeInterval);
      // Immediately set target volume on cleanup to prevent partial fade states
      audioController.setChannelVolume('music', targetVolume);
    };
  }, [audioController, state.showOverlay]);

  // Stable event handlers
  const handleTapToBegin = useCallback(() => {
    dispatch({ type: 'TAP_TO_BEGIN' });
  }, []);

  const handleShowOverlay = useCallback(() => {
    if (sfx.open) {
      playSfx(sfx.open);
    }
    dispatch({ type: 'SHOW_OVERLAY' });
  }, [playSfx, sfx.open]);

  const handleHideOverlay = useCallback(() => {
    if (sfx.close) {
      playSfx(sfx.close);
    }
    dispatch({ type: 'HIDE_OVERLAY' });
  }, [playSfx, sfx.close]);

  const handleIndexChange = useCallback((index: number) => {
    dispatch({ carouselIndex: index, type: 'SET_CAROUSEL_INDEX' });
  }, []);

  const handleIsExitingChange = useCallback((isExiting: boolean) => {
    dispatch({ isExiting, type: 'SET_IS_EXITING' });
  }, []);

  return {
    carouselIndex: state.carouselIndex,
    handleHideOverlay,
    handleIndexChange,
    handleIsExitingChange,
    handleShowOverlay,
    handleTapToBegin,
    isButtonTransitioning: state.isButtonTransitioning,
    isCarouselExiting: state.isCarouselExiting,
    showCarousel: state.showCarousel,
    showOverlay: state.showOverlay,
  };
}

/**
 * Reducer for Kiosk 3 Second Screen state machine.
 * Ensures state transitions are predictable and prevent impossible states.
 */
function kiosk3SecondScreenReducer(
  state: Kiosk3SecondScreenState,
  action: Kiosk3SecondScreenAction
): Kiosk3SecondScreenState {
  switch (action.type) {
    case 'BUTTON_TRANSITION_COMPLETE':
      return {
        ...state,
        isButtonTransitioning: false,
      };

    case 'HIDE_OVERLAY':
      return {
        ...state,
        showOverlay: false,
      };

    case 'SET_CAROUSEL_INDEX':
      return {
        ...state,
        carouselIndex: action.carouselIndex,
      };

    case 'SET_IS_EXITING':
      return {
        ...state,
        isCarouselExiting: action.isExiting,
      };

    case 'SHOW_OVERLAY':
      return {
        ...state,
        showOverlay: true,
      };

    case 'TAP_TO_BEGIN':
      return {
        ...state,
        isButtonTransitioning: true,
        showCarousel: true,
      };

    default:
      return state;
  }
}
