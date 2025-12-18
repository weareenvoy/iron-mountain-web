'use client';

import kioskContent from '@public/api/kiosk-1.json';
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
// import styles from './kiosk-1.module.css';

const Kiosk1View = () => {
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

  const challenges: KioskChallenges = parseKioskChallenges(
    mapChallenges(kioskContent.data.challenge, kioskContent.data.ambient),
    'kiosk-1'
  );
  const solutions = mapSolutions(kioskContent.data.solutions) as SolutionScreens;
  const values = mapValue(kioskContent.data.value) as ValueScreens;
  const hardCoded = kioskContent.data.hardcoded as HardCodedScreens;

  // Pass the global handlers to all templates
  const globalHandlers = {
    onNavigateDown: handleNavigateDown,
    onNavigateUp: handleNavigateUp,
  };

  const slides: Slide[] = [
    ...buildChallengeSlides(
      challenges,
      'kiosk-1',
      { ...controller, ...globalHandlers },
      {
        onInitialButtonClick: () => {
          // Start the scroll, arrows will appear after scroll completes
          setAllowArrowsToShow(true);
        },
      }
    ),
    ...buildSolutionSlides(solutions, 'kiosk-1', { ...controller, ...globalHandlers }),
    ...buildValueSlides(
      values,
      'kiosk-1',
      { ...controller, ...globalHandlers },
      {
        onRegisterCarouselHandlers: handlers => {
          carouselHandlersRef.current = handlers;
        },
      }
    ),
    ...buildHardcodedSlides(hardCoded, 'kiosk-1', scrollToSectionById),
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
            transition={{ duration: 0.6, ease: 'easeOut' }}
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

Kiosk1View.displayName = 'Kiosk1View';

export default Kiosk1View;

type Ambient = {
  backgroundImage?: string;
  body?: string;
  headline?: string;
  quoteSource?: string;
  title?: string;
};

type ChallengeScreen = {
  body?: string;
  slideTitle?: string;
  statBody?: string;
  staticAsset?: string;
  statTitle?: string;
  videoAsset?: string;
};

type ChallengeContent = {
  firstScreen?: ChallengeScreen;
  secondScreen?: ChallengeScreen;
  thirdScreen?: ChallengeScreen;
};

type SolutionsContent = {
  firstScreen?: {
    body?: string;
    headline?: string;
    slideTitle?: string;
    videoAsset?: string;
  };
  secondScreen?: {
    headline?: string;
    numberedList?: string[];
    slideTitle?: string;
    staticAsset?: string;
  };
  thirdScreen?: {
    diamondText?: string[];
    groupedAssets?: string[];
    headline?: string;
    slideTitle?: string;
  };
};

type ValueContent = {
  main?: {
    body?: string;
    diamondBenefits?: { bullets?: string[]; label?: string }[];
    headline?: string;
    slideTitle?: string;
    videoAsset?: string;
  };
};

const splitLines = (value?: string) => (value ? value.split('\n') : undefined);

const mapChallenges = (challenge: ChallengeContent, ambient: Ambient): KioskChallenges => ({
  firstScreen: {
    challengeLabel: 'Challenge',
    problemDescription: challenge.firstScreen?.body ?? '',
    savingsAmount: challenge.firstScreen?.statTitle ?? '',
    savingsDescription: challenge.firstScreen?.statBody ?? '',
    subheadline: splitLines(challenge.firstScreen?.slideTitle) ?? 'Rich media & cultural heritage',
    videoSrc: challenge.firstScreen?.videoAsset ?? '',
  },
  initialScreen: {
    attribution: ambient.quoteSource ?? '- Michael Rohrabacher, Technical Director at the GRAMMY Museum',
    backgroundImage: ambient.backgroundImage ?? '',
    buttonText: 'Touch to explore',
    headline: ambient.headline ?? '',
    quote: ambient.body ?? '',
    subheadline: splitLines(ambient.title) ?? 'Rich media & cultural heritage',
  },
  secondScreen: {
    bottomDescription: '',
    bottomVideoSrc: challenge.secondScreen?.videoAsset ?? '',
    largeIconSrc: challenge.secondScreen?.staticAsset ?? '',
    mainDescription: challenge.secondScreen?.body ?? '',
    statAmount: challenge.secondScreen?.statTitle ?? '',
    statDescription: challenge.secondScreen?.statBody ?? '',
    subheadline: splitLines(challenge.secondScreen?.slideTitle) ?? 'Rich media & cultural heritage',
    topImageSrc: challenge.secondScreen?.staticAsset ?? '',
  },
  thirdScreen: {
    description: challenge.thirdScreen?.body ?? '',
    heroImageSrc: challenge.thirdScreen?.staticAsset ?? '',
    largeIconCenterSrc: challenge.thirdScreen?.staticAsset ?? '',
    largeIconTopSrc: challenge.thirdScreen?.staticAsset ?? '',
    metricAmount: challenge.thirdScreen?.statTitle ?? '',
    metricDescription: challenge.thirdScreen?.statBody ?? '',
    metricImageSrc: challenge.thirdScreen?.staticAsset ?? '',
    subheadline: splitLines(challenge.thirdScreen?.slideTitle) ?? 'Rich media & cultural heritage',
    videoSrc: challenge.thirdScreen?.videoAsset ?? '',
  },
});

const mapSolutions = (solutions: SolutionsContent): SolutionScreens => ({
  firstScreen: solutions.firstScreen
    ? {
        backgroundVideoSrc: solutions.firstScreen.videoAsset,
        description: solutions.firstScreen.body,
        subheadline: splitLines(solutions.firstScreen.slideTitle),
        title: solutions.firstScreen.headline,
      }
    : undefined,
  secondScreen: solutions.secondScreen
    ? {
        heroImageSrc: solutions.secondScreen.staticAsset,
        solutionLabel: 'Solution',
        stepFourDescription: solutions.secondScreen.numberedList?.[3],
        stepFourLabel: '04.',
        stepOneDescription: solutions.secondScreen.numberedList?.[0],
        stepOneLabel: '01.',
        stepThreeDescription: solutions.secondScreen.numberedList?.[2],
        stepThreeLabel: '03.',
        stepTwoDescription: solutions.secondScreen.numberedList?.[1],
        stepTwoLabel: '02.',
        subheadline: splitLines(solutions.secondScreen.slideTitle),
        title: solutions.secondScreen.headline,
      }
    : undefined,
  thirdScreen: solutions.thirdScreen
    ? {
        bottomLeftLabel: solutions.thirdScreen.diamondText?.[2],
        bottomRightLabel: solutions.thirdScreen.diamondText?.[3],
        centerLabel: solutions.thirdScreen.diamondText?.[0],
        mediaDiamondLeftSrc: solutions.thirdScreen.groupedAssets?.[0],
        mediaDiamondRightSrc: solutions.thirdScreen.groupedAssets?.[1],
        solutionLabel: 'Solution',
        subheadline: splitLines(solutions.thirdScreen.slideTitle),
        title: solutions.thirdScreen.headline,
        topLeftLabel: undefined,
        topRightLabel: solutions.thirdScreen.diamondText?.[1],
      }
    : undefined,
});

const mapValue = (value: ValueContent): ValueScreens => {
  const main = value.main;
  if (!main) return { valueScreens: [] };

  const eyebrow = splitLines(main.slideTitle);
  const heroVideoSrc = main.videoAsset;
  const description = main.body;
  const headline = main.headline;

  const benefits = main.diamondBenefits ?? [];
  const overviewCards = [
    { color: '#8a0d71', label: 'Operational benefits' },
    { color: '#1b75bc', label: 'Economic benefits' },
    { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
  ];

  const buildDiamondCards = (label?: string) => {
    const normalized = (label ?? '').toLowerCase();
    if (normalized.includes('operational')) {
      return [
        { color: '#f26522', label: '', textColor: '#4a154b' },
        { color: '#1b75bc', label: '' },
        { color: '#8a0d71', label: 'Operational benefits' },
      ];
    }
    if (normalized.includes('economic') || normalized.includes('economical')) {
      return [
        { color: '#8a0d71', label: '' },
        { color: '#f26522', label: '', textColor: '#4a154b' },
        { color: '#1b75bc', label: 'Economic benefits' },
      ];
    }
    // Strategic fallback
    return [
      { color: '#1b75bc', label: '' },
      { color: '#8a0d71', label: '' },
      { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
    ];
  };

  const carouselSlides = benefits.map(benefit => ({
    badgeLabel: benefit.label,
    bullets: benefit.bullets,
    diamondCards: buildDiamondCards(benefit.label),
    id: `value-${(benefit.label ?? '').toLowerCase().replace(/\s+/g, '-')}`,
  }));

  return {
    valueScreens: [
      {
        carouselId: 'kiosk-1-value-overview',
        description,
        eyebrow,
        headline,
        heroVideoSrc,
        labelText: 'Value',
        slides: [
          {
            badgeLabel: 'Operational · Economic · Strategic',
            diamondCards: overviewCards,
            id: 'value-trio-overview',
          },
        ],
      },
      {
        carouselId: 'kiosk-1-value-carousel',
        description,
        eyebrow,
        headline,
        labelText: 'Value',
        slides: carouselSlides,
      },
    ],
  };
};
