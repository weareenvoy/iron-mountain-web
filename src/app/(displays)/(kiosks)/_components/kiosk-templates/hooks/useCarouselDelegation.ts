import { useCallback, useState } from 'react';
import { SCROLL_SECTION_VALUE_DESCRIPTION } from '@/app/(displays)/(kiosks)/_constants/scroll-sections';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';

// This hook decides when the carousels and lists should use their own navigation instead of global paragraph navigation since they're both tied to the main navigation arrows.

/**
 * Hook for managing carousel and list delegation logic.
 * Handles registration of carousel and list handlers and determines when to delegate
 * navigation to them instead of global navigation.
 *
 * This encapsulates the delegation pattern used in value sections (carousel) and solution sections (list).
 */

type UseCarouselDelegationConfig = {
  readonly baseHandleNavigateDown: () => void;
  readonly baseHandleNavigateUp: () => void;
  readonly currentScrollTarget: null | string;
};

type ListHandlers = {
  canScrollNext: () => boolean;
  canScrollPrev: () => boolean;
  scrollNext: () => void;
  scrollPrev: () => void;
};

type UseCarouselDelegationReturn = {
  readonly handleNavigateDown: () => void;
  readonly handleNavigateUp: () => void;
  readonly handleRegisterCarouselHandlers: (handlers: CarouselHandlers) => void;
  readonly handleRegisterListHandlers: (handlers: ListHandlers) => void;
};

export const useCarouselDelegation = ({
  baseHandleNavigateDown,
  baseHandleNavigateUp,
  currentScrollTarget,
}: UseCarouselDelegationConfig): UseCarouselDelegationReturn => {
  const [carouselHandlers, setCarouselHandlers] = useState<CarouselHandlers | null>(null);
  const [listHandlers, setListHandlers] = useState<ListHandlers | null>(null);

  // Register carousel handlers (called by carousel component)
  const handleRegisterCarouselHandlers = useCallback((handlers: CarouselHandlers) => {
    setCarouselHandlers(handlers);
  }, []);

  // Register list handlers (called by list component)
  const handleRegisterListHandlers = useCallback((handlers: ListHandlers) => {
    setListHandlers(handlers);
  }, []);

  // Navigation with list and carousel delegation
  const handleNavigateDown = useCallback(() => {
    // Check if we should delegate to list first (solution section)
    const shouldDelegateToList =
      currentScrollTarget === 'solution-second-group' && listHandlers !== null && listHandlers.canScrollNext();

    if (shouldDelegateToList) {
      listHandlers!.scrollNext();
      return;
    }

    // Check if we should delegate to carousel (value section)
    const shouldDelegateToCarousel =
      currentScrollTarget === SCROLL_SECTION_VALUE_DESCRIPTION &&
      carouselHandlers !== null &&
      carouselHandlers.canScrollNext();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, carouselHandlers, currentScrollTarget, listHandlers]);

  const handleNavigateUp = useCallback(() => {
    // Check if list can handle the navigation (solution section)
    const shouldDelegateToList =
      currentScrollTarget === 'solution-second-group' && listHandlers !== null && listHandlers.canScrollPrev();

    if (shouldDelegateToList) {
      listHandlers!.scrollPrev();
      return;
    }

    // Check if carousel can handle the navigation (value section)
    const shouldDelegateToCarousel =
      currentScrollTarget === SCROLL_SECTION_VALUE_DESCRIPTION &&
      carouselHandlers !== null &&
      carouselHandlers.canScrollPrev();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollPrev();
      return;
    }

    baseHandleNavigateUp();
  }, [baseHandleNavigateUp, carouselHandlers, currentScrollTarget, listHandlers]);

  return {
    handleNavigateDown,
    handleNavigateUp,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
  };
};
