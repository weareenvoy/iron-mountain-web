'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/refs */
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeTemplate';
import {
  buildHardcodedSlides,
  type HardCodedScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/hardCodedTemplate';
import { useGlobalParagraphNavigation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useGlobalParagraphNavigation';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import {
  buildSolutionSlides,
  type SolutionScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionTemplate';
import {
  buildValueSlides,
  type ValueScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueTemplate';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';

const Kiosk2View = () => {
  const controller: Controller = useKioskController();
  const { data: kioskData } = useKiosk();
  const [topIndex, setTopIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [allowArrowsToShow, setAllowArrowsToShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store carousel handlers for value section
  const carouselHandlersRef = useRef<null | {
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
    duration: 800,
  });

  // Wrap navigation handlers to check carousel first
  const handleNavigateDown = useCallback(() => {
    // If we're at value-description and carousel can scroll, let carousel handle it
    if (currentScrollTarget === 'value-description' && carouselHandlersRef.current?.canScrollNext()) {
      carouselHandlersRef.current.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, currentScrollTarget]);

  const handleNavigateUp = useCallback(() => {
    // If carousel can scroll back, let it handle the navigation
    if (currentScrollTarget === 'value-description' && carouselHandlersRef.current?.canScrollPrev()) {
      carouselHandlersRef.current.scrollPrev();
      return;
    }

    baseHandleNavigateUp();
  }, [baseHandleNavigateUp, currentScrollTarget]);

  // Parse data from provider (kiosk-2 has flat structure with 'challenges' at root)
  const challenges: KioskChallenges | null = kioskData
    ? parseKioskChallenges((kioskData as any).challenges, 'kiosk-2')
    : null;
  const solutions = kioskData ? ((kioskData as any).solutions as SolutionScreens) : null;
  const values = kioskData ? ((kioskData as any).value as ValueScreens) : null;
  const hardCoded = kioskData ? ((kioskData as any).hardcoded as HardCodedScreens) : null;

  // Pass the global handlers to all templates
  const globalHandlers = {
    onNavigateDown: handleNavigateDown,
    onNavigateUp: handleNavigateUp,
  };

  const slides: Slide[] =
    challenges && solutions && values && hardCoded
      ? [
          ...buildChallengeSlides(
            challenges,
            'kiosk-2',
            { ...controller, ...globalHandlers },
            {
              initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#8DC13F' },
              onInitialButtonClick: () => {
                // Start the scroll, arrows will appear after scroll completes
                setAllowArrowsToShow(true);
              },
            }
          ),
          ...buildSolutionSlides(solutions, 'kiosk-2', { ...controller, ...globalHandlers }),
          ...buildValueSlides(
            values,
            'kiosk-2',
            { ...controller, ...globalHandlers },
            {
              onRegisterCarouselHandlers: handlers => {
                carouselHandlersRef.current = handlers;
              },
            }
          ),
          ...buildHardcodedSlides(hardCoded, 'kiosk-2', scrollToSectionById),
        ]
      : [];

  // Determine current section based on slide ID
  const currentSlide = slides[topIndex];
  const currentSection = currentSlide?.id.split('-')[0] || 'challenge';
  const isInitialScreen = currentSlide?.id === 'challenge-initial';
  const isValueSection =
    currentSection === 'value' || (currentScrollTarget && currentScrollTarget.startsWith('value-'));
  const isHardcodedSection =
    currentSection === 'hardcoded' || (currentScrollTarget && currentScrollTarget.startsWith('hardcoded-'));

  // Show arrows only after scroll completes (INITIAL APPEARANCE from button click)
  useEffect(() => {
    if (allowArrowsToShow && !isScrolling && currentScrollTarget === 'challenge-first-video') {
      // Delay before arrows first appear (after initial button click and scroll to challenge video)
      const timer = setTimeout(() => {
        setShowArrows(true);
      }, 1500); // INITIAL DELAY: Adjust this to control first appearance after button click
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

  // All hooks must be called before any conditional returns
  useEffect(() => {
    const isScrollingToVideo =
      isScrolling &&
      currentScrollTarget &&
      (currentScrollTarget.includes('-video') ||
        currentScrollTarget.includes('-first-video') ||
        currentScrollTarget === 'value-carousel');

    const shouldHideArrows = isScrollingToVideo;

    // Track when we START scrolling to a video
    if (shouldHideArrows && !wasScrollingToVideo) {
      setWasScrollingToVideo(true);
      setShowArrows(false); // Hide arrows immediately when scrolling to video starts
    }

    // When scroll completes and we were scrolling to a video, reappear after delay
    if (
      wasScrollingToVideo &&
      !isScrolling &&
      currentScrollTarget &&
      (currentScrollTarget.includes('-video') ||
        currentScrollTarget.includes('-first-video') ||
        currentScrollTarget === 'value-carousel') &&
      allowArrowsToShow
    ) {
      // Delay before arrows reappear after scrolling to a new section video
      const timer = setTimeout(() => {
        setShowArrows(true);
        setWasScrollingToVideo(false);
      }, 1000); // SECTION TRANSITION DELAY: Adjust this to control reappearance between sections (Challenge ? Solution ? Value)
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isScrolling, currentScrollTarget, wasScrollingToVideo, allowArrowsToShow]);

  // Track arrow color and persist it during fade transitions
  const [arrowColor, setArrowColor] = useState('#6DCFF6');

  useEffect(() => {
    // Only update color when arrows are visible (not during fade out)
    if (showArrows) {
      setArrowColor(isValueSection ? '#58595B' : '#6DCFF6');
    }
  }, [isValueSection, showArrows]);

  // Arrows should be visible when showArrows is true (controlled by the effects above)
  const shouldShowArrows = showArrows && !isHardcodedSection;

  const scrollToSlide = useCallback((index: number) => {
    if (!containerRef.current) return;

    const slideHeight = containerRef.current.clientHeight;
    const targetScroll = slideHeight * index;

    containerRef.current.scrollTo({
      behavior: 'smooth',
      top: targetScroll,
    });

    setTopIndex(index);
  }, []);

  useEffect(() => {
    // Override controller navigation with paragraph navigation
    controller.setRootHandlers({
      goTo: (i: number) => {
        const targetIndex = Math.max(0, Math.min(i, slides.length - 1));
        scrollToSlide(targetIndex);
        return true;
      },
      next: handleNavigateDown,
      prev: handleNavigateUp,
    });

    return () => controller.setRootHandlers(null);
  }, [controller, handleNavigateDown, handleNavigateUp, scrollToSlide, slides.length]);

  return (
    <div
      // className={styles.root}
      className="relative h-screen w-full overflow-y-auto scroll-smooth"
      ref={containerRef}
    >
      <div className="flex w-full flex-col" data-top-index={topIndex}>
        {/* Render ALL slides, always visible, stacked vertically */}
        {slides.map((slide, idx) => (
          <div className="h-screen w-full flex-shrink-0" data-slide-index={idx} key={slide.id}>
            {slide.render(idx === topIndex)}
          </div>
        ))}
      </div>
      <div
        // className={styles.debugControls}
        className="absolute right-[12px] bottom-[12px] z-[1000] flex gap-2"
      >
        <button onClick={() => controller.prev()}>Prev</button>
        <button onClick={() => controller.next()}>Next</button>
      </div>

      {/* Global Navigation Arrows */}
      <AnimatePresence>
        {shouldShowArrows && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-[30%] right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]"
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div
              aria-label="Previous"
              className="flex h-[140px] w-[120px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleNavigateUp();
                }
              }}
              onPointerDown={handleNavigateUp}
              role="button"
              tabIndex={0}
            >
              <ArrowUp
                aria-hidden="true"
                className="h-full w-full"
                focusable="false"
                strokeWidth={1.5}
                style={{ color: arrowColor }}
              />
            </div>
            <div
              aria-label="Next"
              className="flex h-[140px] w-[120px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleNavigateDown();
                }
              }}
              onPointerDown={handleNavigateDown}
              role="button"
              tabIndex={0}
            >
              <ArrowDown
                aria-hidden="true"
                className="h-full w-full"
                focusable="false"
                strokeWidth={1.5}
                style={{ color: isValueSection ? '#58595B' : '#6DCFF6' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Kiosk2View.displayName = 'Kiosk2View';

export default Kiosk2View;
