'use client';

import kioskContent from '@public/api/kiosk-3.json';
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
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-3.module.css';

const Kiosk3View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [allowArrowsToShow, setAllowArrowsToShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store carousel handlers for value section
  const carouselHandlersRef = useRef<{
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  } | null>(null);

  // Global paragraph navigation
  const {
    handleNavigateDown: baseHandleNavigateDown,
    handleNavigateUp: baseHandleNavigateUp,
    scrollToSectionById,
    isScrolling,
    currentScrollTarget,
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

  const challenges: KioskChallenges = parseKioskChallenges(kioskContent.challenges, 'kiosk-3');
  const solutions = kioskContent.solutions as SolutionScreens;
  const values = kioskContent.value as ValueScreens;
  const hardCoded = kioskContent.hardcoded as HardCodedScreens;

  // Pass the global handlers to all templates
  const globalHandlers = {
    onNavigateDown: handleNavigateDown,
    onNavigateUp: handleNavigateUp,
  };

  const slides: Slide[] = [
    ...buildChallengeSlides(
      challenges,
      'kiosk-3',
      { ...controller, ...globalHandlers },
      {
      initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#00A88E' },
        onInitialButtonClick: () => {
          // Start the scroll, arrows will appear after scroll completes
          setAllowArrowsToShow(true);
        },
      }
    ),
    ...buildSolutionSlides(solutions, 'kiosk-3', { ...controller, ...globalHandlers }),
    ...buildValueSlides(
      values,
      'kiosk-3',
      { ...controller, ...globalHandlers },
      {
        onRegisterCarouselHandlers: handlers => {
          carouselHandlersRef.current = handlers;
        },
      }
    ),
    ...buildHardcodedSlides(hardCoded, 'kiosk-3', scrollToSectionById),
  ];

  // Determine current section based on scroll target (more accurate than topIndex)
  const currentSlide = slides[topIndex];
  const currentSection = currentSlide?.id.split('-')[0] || 'challenge';
  const isInitialScreen = currentSlide?.id === 'challenge-initial';

  // Also check if current scroll target is in value section
  const isValueSection =
    currentSection === 'value' || (currentScrollTarget && currentScrollTarget.startsWith('value-'));
  const isHardcodedSection = currentSection === 'hardcoded';

  // Track arrow color and persist it during fade transitions
  const [arrowColor, setArrowColor] = useState('#6DCFF6');
  const [wasInValueSection, setWasInValueSection] = useState(false);

  useEffect(() => {
    // Track if we were in value section
    if (isValueSection) {
      setWasInValueSection(true);
    } else if (!currentScrollTarget || !currentScrollTarget.includes('hardcoded-')) {
      // Only clear the flag if we're not transitioning to hardcoded
      setWasInValueSection(false);
    }
  }, [isValueSection, currentScrollTarget]);

  useEffect(() => {
    // Only update color when arrows are visible AND not scrolling to hardcoded
    const isScrollingToHardcoded = currentScrollTarget && currentScrollTarget.includes('hardcoded-');
    
    if (showArrows && !isScrollingToHardcoded) {
      // Use current value section status
      setArrowColor(isValueSection ? '#58595B' : '#6DCFF6');
    } else if (showArrows && isScrollingToHardcoded && wasInValueSection) {
      // Preserve gray color when transitioning from value to hardcoded
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
      }, 1500); // INITIAL DELAY: Adjust this to control first appearance after button click
      return () => clearTimeout(timer);
    }
  }, [allowArrowsToShow, isScrolling, currentScrollTarget]);

  // Handle arrows reappearing after scrolling to videos in other sections (solution, value)
  const [wasScrollingToVideo, setWasScrollingToVideo] = useState(false);
  const [previousScrollTarget, setPreviousScrollTarget] = useState<string | null>(null);
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

    // Also detect scrolling to hardcoded section
    const isScrollingToHardcoded = isScrolling && currentScrollTarget && currentScrollTarget.includes('hardcoded-');

    const shouldHideArrows = isScrollingToVideo || isScrollingToHardcoded;

    // Track when we START scrolling to a video or hardcoded section
    if (shouldHideArrows && !wasScrollingToVideo) {
      setWasScrollingToVideo(true);
      setShowArrows(false); // Hide arrows immediately when scrolling to video/hardcoded starts
    }

    // When scroll completes and we were scrolling to a video, reappear after delay (but NOT for hardcoded)
    if (
      wasScrollingToVideo &&
      !isScrolling &&
      currentScrollTarget &&
      (currentScrollTarget.includes('-video') ||
        currentScrollTarget.includes('-first-video') ||
        currentScrollTarget === 'value-carousel') &&
      !currentScrollTarget.includes('hardcoded-') && // Don't reappear for hardcoded
      allowArrowsToShow &&
      !isHardcodedSection
    ) {
      // Delay before arrows reappear after scrolling to a new section video
      const timer = setTimeout(() => {
        setShowArrows(true);
        setWasScrollingToVideo(false);
      }, 1000); // SECTION TRANSITION DELAY: Adjust this to control reappearance between sections (Challenge → Solution → Value)
      return () => clearTimeout(timer);
    }

    // Reset tracking state if we finish scrolling to hardcoded
    if (wasScrollingToVideo && !isScrolling && currentScrollTarget?.includes('hardcoded-')) {
      setWasScrollingToVideo(false);
    }
  }, [isScrolling, currentScrollTarget, wasScrollingToVideo, allowArrowsToShow, isHardcodedSection]);

  // Check if we're scrolling to or at a video
  const isScrollingToVideo =
    isScrolling &&
    currentScrollTarget &&
    (currentScrollTarget.includes('-video') || currentScrollTarget.includes('-first-video'));

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
            className="fixed top-[37.5%] right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]"
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div
              aria-label="Previous"
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
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
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
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
                style={{ color: arrowColor }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Kiosk3View.displayName = 'Kiosk3View';

export default Kiosk3View;
