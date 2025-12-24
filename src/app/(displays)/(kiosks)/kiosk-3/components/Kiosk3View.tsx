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
import {
  ARROW_FADE_DURATION_SEC,
  ARROW_INITIAL_DELAY_MS,
  ARROW_TRANSITION_DELAY_MS,
  SCROLL_DURATION_MS,
} from '@/app/(displays)/(kiosks)/_constants/timing';
import { mapChallenges } from '@/app/(displays)/(kiosks)/_mappers/map-challenges';
import { mapCustomInteractiveKiosk3 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk3';
import { mapSolutionsWithAccordion } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-accordion';
import { mapValue } from '@/app/(displays)/(kiosks)/_mappers/map-value';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type {
  Ambient,
  ChallengeContent,
  CustomInteractiveContent,
  SolutionsAccordion,
  SolutionsMain,
  ValueContent,
} from '@/app/(displays)/(kiosks)/_types/content-types';

const Kiosk3View = () => {
  const { data: kioskData } = useKiosk();
  const [showArrows, setShowArrows] = useState(false);
  const [allowArrowsToShow, setAllowArrowsToShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (currentScrollTarget === 'value-description' && carouselHandlers?.canScrollNext()) {
      carouselHandlers.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, carouselHandlers, currentScrollTarget]);

  const handleNavigateUp = useCallback(() => {
    // If carousel can scroll back, let it handle the navigation
    if (currentScrollTarget === 'value-description' && carouselHandlers?.canScrollPrev()) {
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
    setAllowArrowsToShow(true);
  }, []);

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
              initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#00A88E' },
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

  // Track arrow color and persist it during fade transitions
  const [arrowColor, setArrowColor] = useState('#6DCFF6');
  const [wasInValueSection, setWasInValueSection] = useState(false);

  // All hooks must be called before any conditional returns
  useEffect(() => {
    // Track if we were in value section
    if (isValueSection) {
      setWasInValueSection(true);
    } else if (!currentScrollTarget || !currentScrollTarget.includes('customInteractive-')) {
      // Only clear the flag if we're not transitioning to customInteractive
      setWasInValueSection(false);
    }
  }, [isValueSection, currentScrollTarget]);

  useEffect(() => {
    // Only update color when arrows are visible AND not scrolling to customInteractive
    const isScrollingToCustomInteractive = currentScrollTarget && currentScrollTarget.includes('customInteractive-');

    if (showArrows && !isScrollingToCustomInteractive) {
      // Use current value section status
      setArrowColor(isValueSection ? '#58595B' : '#6DCFF6');
    } else if (showArrows && isScrollingToCustomInteractive && wasInValueSection) {
      // Preserve gray color when transitioning from value to customInteractive
      setArrowColor('#58595B');
    }
  }, [isValueSection, showArrows, currentScrollTarget, wasInValueSection]);

  // Reset arrow state when navigating back to initial screen
  useEffect(() => {
    if (isInitialScreen) {
      setShowArrows(false);
      setAllowArrowsToShow(false);
    }
  }, [isInitialScreen]);

  // Show arrows only after scroll completes (INITIAL APPEARANCE from button click)
  useEffect(() => {
    if (allowArrowsToShow && !isScrolling && currentScrollTarget === 'challenge-first-video') {
      // Delay before arrows first appear (after initial button click and scroll to challenge video)
      const timer = setTimeout(() => {
        setShowArrows(true);
      }, ARROW_INITIAL_DELAY_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [allowArrowsToShow, isScrolling, currentScrollTarget]);

  // Handle arrows reappearing after scrolling to videos in other sections (solution, value)
  const [wasScrollingToVideo, setWasScrollingToVideo] = useState(false);
  const [previousScrollTarget, setPreviousScrollTarget] = useState<null | string>(null);
  const [shouldResetOnInitial, setShouldResetOnInitial] = useState(false);

  // Track previous scroll target and detect leaving video for initial screen
  useEffect(() => {
    if (currentScrollTarget !== previousScrollTarget) {
      // If we're leaving the video and going to "nothing" (initial screen), AND we're at initial screen, set reset flag
      if (previousScrollTarget === 'challenge-first-video' && !currentScrollTarget && isInitialScreen) {
        setShouldResetOnInitial(true);
      }
      // Clear the flag if we go to any other scroll section
      else if (currentScrollTarget) {
        setShouldResetOnInitial(false);
      }

      setPreviousScrollTarget(currentScrollTarget);
    }
  }, [currentScrollTarget, previousScrollTarget, isInitialScreen]);

  // Reset arrow state when we arrive at initial screen AND the flag is set
  useEffect(() => {
    if (isInitialScreen && shouldResetOnInitial && showArrows) {
      setShowArrows(false);
      setAllowArrowsToShow(false);
      setShouldResetOnInitial(false);
    }
  }, [isInitialScreen, shouldResetOnInitial, showArrows]);

  useEffect(() => {
    const isScrollingToVideo =
      isScrolling &&
      currentScrollTarget &&
      (currentScrollTarget.includes('-video') ||
        currentScrollTarget.includes('-first-video') ||
        currentScrollTarget === 'value-carousel');

    // Also detect scrolling to customInteractive section
    const isScrollingToCustomInteractive =
      isScrolling && currentScrollTarget && currentScrollTarget.includes('customInteractive-');

    const shouldHideArrows = isScrollingToVideo || isScrollingToCustomInteractive;

    // Track when we START scrolling to a video or customInteractive section
    if (shouldHideArrows && !wasScrollingToVideo) {
      setWasScrollingToVideo(true);
      setShowArrows(false); // Hide arrows immediately when scrolling to video/customInteractive starts
    }

    // When scroll completes and we were scrolling to a video, reappear after delay (but NOT for customInteractive)
    if (
      wasScrollingToVideo &&
      !isScrolling &&
      currentScrollTarget &&
      (currentScrollTarget.includes('-video') ||
        currentScrollTarget.includes('-first-video') ||
        currentScrollTarget === 'value-carousel') &&
      !currentScrollTarget.includes('customInteractive-') && // Don't reappear for customInteractive
      allowArrowsToShow &&
      !isCustomInteractiveSection
    ) {
      // Delay before arrows reappear after scrolling to a new section video
      const timer = setTimeout(() => {
        setShowArrows(true);
        setWasScrollingToVideo(false);
      }, ARROW_TRANSITION_DELAY_MS);
      return () => clearTimeout(timer);
    }

    // Reset tracking state if we finish scrolling to customInteractive
    if (wasScrollingToVideo && !isScrolling && currentScrollTarget?.includes('customInteractive-')) {
      setWasScrollingToVideo(false);
    }
    return undefined;
  }, [isScrolling, currentScrollTarget, wasScrollingToVideo, allowArrowsToShow, isCustomInteractiveSection]);

  // Arrows should be visible when showArrows is true (controlled by the effects above)
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
            {slide.render(idx === topIndex)}
          </div>
        ))}
      </div>

      {/* Global Navigation Arrows */}
      <AnimatePresence>
        {shouldShowArrows && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-[1945px] right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]"
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
              style={{ '--arrow-color': arrowColor } as React.CSSProperties}
              tabIndex={0}
            >
              <ArrowUp
                aria-hidden="true"
                className="h-full w-full"
                focusable="false"
                strokeWidth={1.5}
                style={{ color: 'var(--arrow-color)' }}
              />
            </div>
            <div
              aria-label="Next"
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onKeyDown={handleDownArrowKeyDown}
              onPointerDown={handleNavigateDown}
              role="button"
              style={{ '--arrow-color': arrowColor } as React.CSSProperties}
              tabIndex={0}
            >
              <ArrowDown
                aria-hidden="true"
                className="h-full w-full"
                focusable="false"
                strokeWidth={1.5}
                style={{ color: 'var(--arrow-color)' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kiosk3View;
