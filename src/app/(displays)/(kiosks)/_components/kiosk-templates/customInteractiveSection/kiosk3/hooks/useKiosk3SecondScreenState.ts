import { useCallback, useState } from 'react';

/**
 * Custom hook that encapsulates the state management logic for Kiosk 3 Second Screen.
 *
 * Manages the complex state machine for the morphing animation sequence:
 * 1. Initial state (rings, dots, "Tap to begin")
 * 2. Carousel state (slides with media)
 * 3. Demo overlay state
 *
 * @returns State values and stable event handlers
 */
export function useKiosk3SecondScreenState() {
  // Core animation states
  const [showCarousel, setShowCarousel] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselExiting, setIsCarouselExiting] = useState(false);
  const [isButtonTransitioning, setIsButtonTransitioning] = useState(false);

  // Stable event handlers (setState functions are stable, so empty deps are safe)
  const handleTapToBegin = useCallback(() => {
    setIsButtonTransitioning(true);
    setShowCarousel(true);
  }, []);

  const handleShowOverlay = useCallback(() => {
    setShowOverlay(true);
  }, []);

  const handleHideOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const handleIndexChange = useCallback((index: number) => {
    setCarouselIndex(index);
  }, []);

  const handleIsExitingChange = useCallback((isExiting: boolean) => {
    setIsCarouselExiting(isExiting);
  }, []);

  return {
    carouselIndex,
    handleHideOverlay,
    handleIndexChange,
    handleIsExitingChange,
    handleShowOverlay,
    handleTapToBegin,
    isButtonTransitioning,
    isCarouselExiting,
    showCarousel,
    showOverlay,
  };
}
