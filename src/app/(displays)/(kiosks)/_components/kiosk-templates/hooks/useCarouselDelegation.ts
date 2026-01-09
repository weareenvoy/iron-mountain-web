import { useCallback, useState } from 'react';
import { SCROLL_SECTION_VALUE_CAROUSEL } from '@/app/(displays)/(kiosks)/_constants/scroll-sections';
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
  readonly handleRegisterListHandlers: (scrollSectionId: string, handlers: ListHandlers) => void;
};

export const useCarouselDelegation = ({
  baseHandleNavigateDown,
  baseHandleNavigateUp,
  currentScrollTarget,
}: UseCarouselDelegationConfig): UseCarouselDelegationReturn => {
  const [carouselHandlers, setCarouselHandlers] = useState<CarouselHandlers | null>(null);
  const [listHandlersMap, setListHandlersMap] = useState<Map<string, ListHandlers>>(new Map());

  // Register carousel handlers (called by carousel component)
  const handleRegisterCarouselHandlers = useCallback((handlers: CarouselHandlers) => {
    setCarouselHandlers(handlers);
  }, []);

  // Register list handlers (called by list component)
  const handleRegisterListHandlers = useCallback((scrollSectionId: string, handlers: ListHandlers) => {
    setListHandlersMap(prev => new Map(prev).set(scrollSectionId, handlers));
  }, []);

  // Navigation with list and carousel delegation
  const handleNavigateDown = useCallback(() => {
    // Check if we should delegate to list first (solution section)
    // Supports both legacy 'solution-second-group' and new pattern 'solution-second-group-{idx}'
    if (currentScrollTarget?.startsWith('solution-second-group')) {
      const currentListHandlers = listHandlersMap.get(currentScrollTarget);
      if (currentListHandlers && currentListHandlers.canScrollNext()) {
        currentListHandlers.scrollNext();
        return;
      }
    }

    // Check if we should delegate to carousel (value section)
    const shouldDelegateToCarousel =
      currentScrollTarget === SCROLL_SECTION_VALUE_CAROUSEL &&
      carouselHandlers !== null &&
      carouselHandlers.canScrollNext();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, carouselHandlers, currentScrollTarget, listHandlersMap]);

  const handleNavigateUp = useCallback(() => {
    // Check if list can handle the navigation (solution section)
    // Supports both legacy 'solution-second-group' and new pattern 'solution-second-group-{idx}'
    if (currentScrollTarget?.startsWith('solution-second-group')) {
      const currentListHandlers = listHandlersMap.get(currentScrollTarget);
      if (currentListHandlers && currentListHandlers.canScrollPrev()) {
        currentListHandlers.scrollPrev();
        return;
      }
    }

    // Check if carousel can handle the navigation (value section)
    const shouldDelegateToCarousel =
      currentScrollTarget === SCROLL_SECTION_VALUE_CAROUSEL &&
      carouselHandlers !== null &&
      carouselHandlers.canScrollPrev();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollPrev();
      return;
    }

    baseHandleNavigateUp();
  }, [baseHandleNavigateUp, carouselHandlers, currentScrollTarget, listHandlersMap]);

  return {
    handleNavigateDown,
    handleNavigateUp,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
  };
};
