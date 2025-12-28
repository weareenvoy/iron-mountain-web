'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeSlides';
import {
  buildCustomInteractiveSlides,
  type CustomInteractiveScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import { useGlobalParagraphNavigation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useGlobalParagraphNavigation';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import {
  buildSolutionSlides,
  type SolutionScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionSlides';
import {
  buildValueSlides,
  type ValueScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueSlides';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { SCROLL_SECTION_VALUE_DESCRIPTION } from '@/app/(displays)/(kiosks)/_constants/scroll-sections';
import { ARROW_FADE_DURATION_SEC, SCROLL_DURATION_MS } from '@/app/(displays)/(kiosks)/_constants/timing';
import { mapChallenges } from '@/app/(displays)/(kiosks)/_mappers/map-challenges';
import { mapCustomInteractiveKiosk3 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk3';
import { mapSolutionsWithAccordion } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-accordion';
import { mapValue } from '@/app/(displays)/(kiosks)/_mappers/map-value';
import { useKioskArrowStore } from '@/app/(displays)/(kiosks)/_stores/useKioskArrowStore';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type {
  Ambient,
  ChallengeContent,
  CustomInteractiveContent,
  SolutionsAccordion,
  SolutionsMain,
  ValueContent,
} from '@/app/(displays)/(kiosks)/_types/content-types';

// Main component for displaying Kiosk 3 content.

const Kiosk3View = () => {
  const { data: kioskData } = useKiosk();
  const containerRef = useRef<HTMLDivElement>(null);

  // Zustand store for arrow state
  const kioskState = useKioskArrowStore(state => state.kiosk3);
  const handleButtonClick = useKioskArrowStore(state => state.handleButtonClick);
  const handleScrollTargetChange = useKioskArrowStore(state => state.handleScrollTargetChange);
  const handleInitialScreenReset = useKioskArrowStore(state => state.handleInitialScreenReset);
  const handleScrollStart = useKioskArrowStore(state => state.handleScrollStart);
  const handleScrollComplete = useKioskArrowStore(state => state.handleScrollComplete);
  const handleArrowThemeUpdate = useKioskArrowStore(state => state.handleArrowThemeUpdate);

  const { arrowTheme, showArrows } = kioskState;

  // Store carousel handlers for value section
  const [carouselHandlers, setCarouselHandlers] = useState<null | {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }>(null);

  // Global paragraph navigation
  const {
    currentScrollTarget,
    handleNavigateDown: baseHandleNavigateDown,
    handleNavigateUp: baseHandleNavigateUp,
    isScrolling,
    scrollToSectionById,
  } = useGlobalParagraphNavigation({
    containerRef,
    duration: SCROLL_DURATION_MS,
  });

  // Wrap navigation handlers to check carousel first
  const handleNavigateDown = useCallback(() => {
    // If we're at value-description and carousel can scroll, let carousel handle it
    if (currentScrollTarget === SCROLL_SECTION_VALUE_DESCRIPTION && carouselHandlers?.canScrollNext()) {
      carouselHandlers.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, carouselHandlers, currentScrollTarget]);

  const handleNavigateUp = useCallback(() => {
    // If carousel can scroll back, let it handle the navigation
    if (currentScrollTarget === SCROLL_SECTION_VALUE_DESCRIPTION && carouselHandlers?.canScrollPrev()) {
      carouselHandlers.scrollPrev();
      return;
    }

    baseHandleNavigateUp();
  }, [baseHandleNavigateUp, carouselHandlers, currentScrollTarget]);

  // Parse data from provider (kiosk-3 now uses new flat structure)
  const kioskContent = kioskData as
    | null
    | undefined
    | {
        ambient?: Ambient;
        challengeMain?: ChallengeContent;
        customInteractive3?: CustomInteractiveContent;
        demoMain?: unknown;
        solutionAccordion?: SolutionsAccordion;
        solutionMain?: SolutionsMain;
        valueMain?: ValueContent;
      };

  const challenges: KioskChallenges | null =
    kioskContent?.challengeMain && kioskContent.ambient
      ? parseKioskChallenges(mapChallenges(kioskContent.challengeMain, kioskContent.ambient))
      : null;
  const solutions =
    kioskContent?.solutionMain && kioskContent.solutionAccordion && kioskContent.ambient
      ? (mapSolutionsWithAccordion(
          kioskContent.solutionMain,
          kioskContent.solutionAccordion,
          kioskContent.ambient
        ) as SolutionScreens)
      : null;
  const values =
    kioskContent?.valueMain && kioskContent.ambient
      ? (mapValue(kioskContent.valueMain, kioskContent.ambient, 'kiosk-3') as ValueScreens)
      : null;
  const customInteractive =
    kioskContent?.customInteractive3 && kioskContent.ambient
      ? (mapCustomInteractiveKiosk3(
          kioskContent.customInteractive3,
          kioskContent.ambient,
          kioskContent.demoMain as
            | undefined
            | { demoText?: string; headline?: string; iframeLink?: string; mainCTA?: string }
        ) as CustomInteractiveScreens)
      : null;

  // Pass the global handlers to all templates
  // Pass the global handlers to all templates
  const globalHandlers = useMemo(
    () => ({
      onNavigateDown: handleNavigateDown,
      onNavigateUp: handleNavigateUp,
    }),
    [handleNavigateDown, handleNavigateUp]
  );

  // Stable callbacks to avoid ref access during render
  const handleInitialButtonClick = useCallback(() => {
    handleButtonClick('kiosk-3');
  }, [handleButtonClick]);

  const handleContainerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Prevent default arrow key scrolling to avoid jump before smooth scroll
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (event.key === 'ArrowDown') {
          handleNavigateDown();
        } else {
          handleNavigateUp();
        }
      }
    },
    [handleNavigateDown, handleNavigateUp]
  );

  const handleUpArrowKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNavigateUp();
      }
    },
    [handleNavigateUp]
  );

  const handleDownArrowKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleNavigateDown();
      }
    },
    [handleNavigateDown]
  );

  const handleRegisterCarouselHandlers = useCallback(
    (handlers: {
      canScrollNext: () => boolean;
      canScrollPrev: () => boolean;
      scrollNext: () => void;
      scrollPrev: () => void;
    }) => {
      setCarouselHandlers(handlers);
    },
    []
  );

  const slides: Slide[] = useMemo(
    () =>
      challenges && solutions && values && customInteractive
        ? [
            ...buildChallengeSlides(challenges, 'kiosk-3', globalHandlers, {
              onInitialButtonClick: handleInitialButtonClick,
            }),
            ...buildSolutionSlides(solutions, 'kiosk-3', globalHandlers),
            ...buildValueSlides(values, 'kiosk-3', globalHandlers, {
              onRegisterCarouselHandlers: handleRegisterCarouselHandlers,
            }),
            ...buildCustomInteractiveSlides(customInteractive, 'kiosk-3', scrollToSectionById),
          ]
        : [],
    [
      challenges,
      customInteractive,
      globalHandlers,
      handleInitialButtonClick,
      handleRegisterCarouselHandlers,
      scrollToSectionById,
      solutions,
      values,
    ]
  );

  // Determine current section based on scroll target
  const topIndex = slides.findIndex(slide => slide.id === currentScrollTarget);
  const currentSlide = slides[topIndex >= 0 ? topIndex : 0];
  const currentSection = currentSlide?.id.split('-')[0] || 'challenge';
  const isInitialScreen = currentSlide?.id === 'challenge-initial';

  // Also check if current scroll target is in value section
  const isValueSection =
    currentSection === 'value' || (currentScrollTarget && currentScrollTarget.startsWith('value-'));
  const isCustomInteractiveSection = currentSection === 'customInteractive';

  // Track if we were in value section for color persistence (using ref to avoid setState-in-effect)
  const wasInValueSectionRef = useRef(false);

  useEffect(() => {
    // Track if we were in value section
    if (isValueSection) {
      wasInValueSectionRef.current = true;
    } else if (!currentScrollTarget || !currentScrollTarget.includes('customInteractive-')) {
      // Only clear the flag if we're not transitioning to customInteractive
      wasInValueSectionRef.current = false;
    }
  }, [isValueSection, currentScrollTarget]);

  // Handle arrow theme updates
  useEffect(() => {
    const isScrollingToCustomInteractive = currentScrollTarget && currentScrollTarget.includes('customInteractive-');

    if (showArrows && !isScrollingToCustomInteractive) {
      handleArrowThemeUpdate('kiosk-3', Boolean(isValueSection), showArrows);
    } else if (showArrows && isScrollingToCustomInteractive && wasInValueSectionRef.current) {
      // Preserve gray theme when transitioning from value to customInteractive
      // This is handled in the component, not the store
    }
  }, [isValueSection, showArrows, currentScrollTarget, handleArrowThemeUpdate]);

  // Reset arrow state when navigating back to initial screen (Kiosk3-specific behavior)
  useEffect(() => {
    if (isInitialScreen) {
      handleInitialScreenReset('kiosk-3', isInitialScreen);
    }
  }, [isInitialScreen, handleInitialScreenReset]);

  // Handle scroll target changes
  useEffect(() => {
    handleScrollTargetChange('kiosk-3', currentScrollTarget, kioskState.previousScrollTarget, isInitialScreen);
  }, [currentScrollTarget, kioskState.previousScrollTarget, isInitialScreen, handleScrollTargetChange]);

  // Handle scroll start (hiding arrows)
  useEffect(() => {
    handleScrollStart('kiosk-3', currentScrollTarget, kioskState.previousScrollTarget, isScrolling);
  }, [isScrolling, currentScrollTarget, kioskState.previousScrollTarget, handleScrollStart]);

  // Handle scroll complete (showing arrows)
  useEffect(() => {
    handleScrollComplete('kiosk-3', currentScrollTarget, isScrolling, isCustomInteractiveSection);
  }, [isScrolling, currentScrollTarget, isCustomInteractiveSection, handleScrollComplete]);

  // Arrows should be visible when showArrows is true (controlled by the store)
  const shouldShowArrows = showArrows && !isCustomInteractiveSection;

  // Focus container on mount to capture keyboard events
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  // Show loading state if no slides are available
  if (slides.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-2xl">Loading kiosk data...</p>
          <p className="mt-4 text-sm opacity-60">{!kioskData ? 'Fetching data...' : 'Processing content...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full overflow-y-auto scroll-smooth"
      onKeyDown={handleContainerKeyDown}
      ref={containerRef}
      tabIndex={-1}
    >
      <div className="flex w-full flex-col overflow-x-hidden">
        {/* Render ALL slides, always visible, stacked vertically */}
        {slides.map((slide, idx) => (
          <div className="h-screen w-full flex-shrink-0" data-slide-index={idx} key={slide.id}>
            {slide.render()}
          </div>
        ))}
      </div>

      {/* Global Navigation Arrows */}
      <AnimatePresence>
        {shouldShowArrows && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-[1945px] right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]"
            data-arrow-theme={arrowTheme}
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ARROW_FADE_DURATION_SEC, ease: 'easeOut' }}
          >
            <div
              aria-label="Previous"
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onKeyDown={handleUpArrowKeyDown}
              onPointerDown={handleNavigateUp}
              role="button"
              tabIndex={0}
            >
              <ArrowUp
                aria-hidden="true"
                className="h-full w-full data-[arrow-theme=blue]:text-[#6DCFF6] data-[arrow-theme=gray]:text-[#58595B]"
                data-arrow-theme={arrowTheme}
                focusable="false"
                strokeWidth={1.5}
              />
            </div>
            <div
              aria-label="Next"
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onKeyDown={handleDownArrowKeyDown}
              onPointerDown={handleNavigateDown}
              role="button"
              tabIndex={0}
            >
              <ArrowDown
                aria-hidden="true"
                className="h-full w-full data-[arrow-theme=blue]:text-[#6DCFF6] data-[arrow-theme=gray]:text-[#58595B]"
                data-arrow-theme={arrowTheme}
                focusable="false"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kiosk3View;
