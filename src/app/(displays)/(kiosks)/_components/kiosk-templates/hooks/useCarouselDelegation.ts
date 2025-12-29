import { useCallback, useState } from 'react';
import { SCROLL_SECTION_VALUE_DESCRIPTION } from '@/app/(displays)/(kiosks)/_constants/scroll-sections';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';

/**
 * Hook for managing carousel delegation logic.
 * Handles registration of carousel handlers and determines when to delegate
 * navigation to the carousel instead of global navigation.
 *
 * This encapsulates the carousel delegation pattern used in value sections.
 */

type UseCarouselDelegationConfig = {
  readonly baseHandleNavigateDown: () => void;
  readonly baseHandleNavigateUp: () => void;
  readonly currentScrollTarget: null | string;
};

export const useCarouselDelegation = ({
  baseHandleNavigateDown,
  baseHandleNavigateUp,
  currentScrollTarget,
}: UseCarouselDelegationConfig) => {
  const [carouselHandlers, setCarouselHandlers] = useState<CarouselHandlers | null>(null);

  // Register carousel handlers (called by carousel component)
  const handleRegisterCarouselHandlers = useCallback((handlers: CarouselHandlers) => {
    setCarouselHandlers(handlers);
  }, []);

  // Navigation with carousel delegation
  const handleNavigateDown = useCallback(() => {
    const shouldDelegateToCarousel =
      currentScrollTarget === SCROLL_SECTION_VALUE_DESCRIPTION &&
      carouselHandlers !== null &&
      carouselHandlers.canScrollNext();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, carouselHandlers, currentScrollTarget]);

  const handleNavigateUp = useCallback(() => {
    const shouldDelegateToCarousel =
      currentScrollTarget === SCROLL_SECTION_VALUE_DESCRIPTION &&
      carouselHandlers !== null &&
      carouselHandlers.canScrollPrev();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollPrev();
      return;
    }

    baseHandleNavigateUp();
  }, [baseHandleNavigateUp, carouselHandlers, currentScrollTarget]);

  return {
    handleNavigateDown,
    handleNavigateUp,
    handleRegisterCarouselHandlers,
  };
};
