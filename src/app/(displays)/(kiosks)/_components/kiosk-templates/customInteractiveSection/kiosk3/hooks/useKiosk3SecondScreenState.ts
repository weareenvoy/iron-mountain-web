import { useCallback, useReducer } from 'react';

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
  /** User clicked "Tap to begin" button - triggers button morph and carousel reveal */
  | { carouselIndex: number; type: 'SET_CAROUSEL_INDEX' }
  /** Carousel index changed (user navigated slides) - updates current slide tracking */
  | { isExiting: boolean; type: 'SET_IS_EXITING' }
  /** Carousel slide exit animation state changed - coordinates morphing diamond exit */
  | { type: 'HIDE_OVERLAY' }
  /** User dismissed demo overlay - returns to carousel view */
  | { type: 'SHOW_OVERLAY' }
  /** User clicked "Launch demo" button - shows fullscreen demo overlay */
  | { type: 'TAP_TO_BEGIN' };

const initialState: Kiosk3SecondScreenState = {
  carouselIndex: 0,
  isButtonTransitioning: false,
  isCarouselExiting: false,
  showCarousel: false,
  showOverlay: false,
};

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

  // Stable event handlers
  const handleTapToBegin = useCallback(() => {
    dispatch({ type: 'TAP_TO_BEGIN' });
  }, []);

  const handleShowOverlay = useCallback(() => {
    dispatch({ type: 'SHOW_OVERLAY' });
  }, []);

  const handleHideOverlay = useCallback(() => {
    dispatch({ type: 'HIDE_OVERLAY' });
  }, []);

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
