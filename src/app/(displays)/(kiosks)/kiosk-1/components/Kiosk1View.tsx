'use client';

/* eslint-disable react-hooks/refs */
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
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
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';

const Kiosk1View = () => {
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

  // Prepare data (with safe defaults for loading state)
  const kioskContent = kioskData as
    | null
    | undefined
    | {
        data?: {
          ambient?: unknown;
          challengeMain?: unknown;
          customInteractive1Main?: unknown;
          solutionGrid?: unknown;
          solutionMain?: unknown;
          valueMain?: unknown;
        };
      };

  const challenges: KioskChallenges | null =
    kioskContent?.data?.challengeMain && kioskContent.data.ambient
      ? parseKioskChallenges(mapChallenges(kioskContent.data.challengeMain, kioskContent.data.ambient), 'kiosk-1')
      : null;
  const solutions =
    kioskContent?.data?.solutionMain && kioskContent.data.solutionGrid && kioskContent.data.ambient
      ? (mapSolutions(
          kioskContent.data.solutionMain,
          kioskContent.data.solutionGrid,
          kioskContent.data.ambient
        ) as SolutionScreens)
      : null;
  const values =
    kioskContent?.data?.valueMain && kioskContent.data.ambient
      ? (mapValue(kioskContent.data.valueMain, kioskContent.data.ambient) as ValueScreens)
      : null;
  const hardCoded =
    kioskContent?.data?.customInteractive1Main && kioskContent.data.ambient
      ? (mapHardcoded(kioskContent.data.customInteractive1Main, kioskContent.data.ambient) as HardCodedScreens)
      : null;

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
        ]
      : [];

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

  // All hooks must be called before any conditional returns
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
    return undefined;
  }, [isScrolling, currentScrollTarget, wasScrollingToVideo, allowArrowsToShow, isHardcodedSection]);

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
            className="fixed top-[1945px] right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]"
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
  mainCTA?: string;
  quoteSource?: string;
  title?: string;
};

type ChallengeContent = {
  body?: string;
  featuredStat1?: string;
  featuredStat1Body?: string;
  featuredStat2?: string;
  featuredStat2Body?: string;
  item1Body?: string;
  item1Image?: string;
  item2Body?: string;
  item2Image?: string;
  mainVideo?: string;
};

type SolutionsMain = {
  body?: string;
  headline?: string;
  image?: string;
  mainVideo?: string;
  numberedList?: string[];
  numberedListHeadline?: string;
};

type SolutionsGrid = {
  diamondList?: string[];
  headline?: string;
  images?: string[];
};

type ValueContent = {
  body?: string;
  diamondBenefits?: { bullets?: string[]; label?: string }[];
  headline?: string;
  mainVideo?: string;
};

type HardcodedContent = {
  backCTA?: string;
  body2?: string;
  diamondCarouselItems?: string[];
  headline?: string;
  headline2?: string;
  image?: string;
  mainCTA?: string;
  ModalBody1?: string;
  ModalBody2?: string;
  ModalBody3?: string;
  ModalBody4?: string;
  ModalBody5?: string;
  ModalHeadline1?: string;
  ModalHeadline2?: string;
  ModalHeadline3?: string;
  ModalHeadline4?: string;
  ModalHeadline5?: string;
  secondaryCTA?: string;
};

const mapChallenges = (challenge: ChallengeContent, ambient: Ambient): KioskChallenges => ({
  firstScreen: {
    challengeLabel: 'Challenge',
    problemDescription: challenge.body ?? '',
    savingsAmount: challenge.featuredStat1 ?? '',
    savingsDescription: challenge.featuredStat1Body ?? '',
    subheadline: ambient.title ?? 'Rich media & cultural heritage',
    videoSrc: challenge.mainVideo ?? '',
  },
  initialScreen: {
    attribution: ambient.quoteSource ?? '- Michael Rohrabacher, Technical Director at the GRAMMY Museum',
    backgroundImage: ambient.backgroundImage ?? '',
    buttonText: ambient.mainCTA ?? 'Touch to explore',
    headline: ambient.headline ?? '',
    quote: ambient.body ?? '',
    subheadline: ambient.title ?? 'Rich media & cultural heritage',
  },
  secondScreen: {
    bottomDescription: '',
    bottomVideoSrc: '',
    largeIconSrc: challenge.item1Image ?? '',
    mainDescription: challenge.item1Body ?? '',
    statAmount: '',
    statDescription: '',
    subheadline: ambient.title ?? 'Rich media & cultural heritage',
    topImageSrc: challenge.item1Image ?? '',
  },
  thirdScreen: {
    description: challenge.item2Body ?? '',
    heroImageSrc: challenge.item2Image ?? '',
    largeIconCenterSrc: challenge.item2Image ?? '',
    largeIconTopSrc: challenge.item2Image ?? '',
    metricAmount: challenge.featuredStat2 ?? '',
    metricDescription: challenge.featuredStat2Body ?? '',
    metricImageSrc: challenge.item2Image ?? '',
    subheadline: ambient.title ?? 'Rich media & cultural heritage',
    videoSrc: '',
  },
});

const mapSolutions = (
  solutionsMain: SolutionsMain,
  solutionsGrid: SolutionsGrid,
  ambient: Ambient
): SolutionScreens => ({
  firstScreen: {
    backgroundVideoSrc: solutionsMain.mainVideo ?? '',
    description: solutionsMain.body ?? '',
    subheadline: ambient.title,
    title: solutionsMain.headline ?? '',
  },
  secondScreen: {
    heroImageSrc: solutionsMain.image ?? '',
    solutionLabel: 'Solution',
    stepFourDescription: solutionsMain.numberedList?.[3] ?? '',
    stepFourLabel: '04.',
    stepOneDescription: solutionsMain.numberedList?.[0] ?? '',
    stepOneLabel: '01.',
    stepThreeDescription: solutionsMain.numberedList?.[2] ?? '',
    stepThreeLabel: '03.',
    stepTwoDescription: solutionsMain.numberedList?.[1] ?? '',
    stepTwoLabel: '02.',
    subheadline: ambient.title,
    title: solutionsMain.numberedListHeadline ?? 'Together, we:',
  },
  thirdScreen: {
    bottomLeftLabel: solutionsGrid.diamondList?.[2] ?? '',
    bottomRightLabel: solutionsGrid.diamondList?.[3] ?? '',
    centerLabel: solutionsGrid.diamondList?.[0] ?? '',
    mediaDiamondLeftSrc: solutionsGrid.images?.[0] ?? '',
    mediaDiamondRightSrc: solutionsGrid.images?.[1] ?? '',
    solutionLabel: 'Solution',
    subheadline: ambient.title,
    title: solutionsGrid.headline ?? '',
    topLeftLabel: undefined,
    topRightLabel: solutionsGrid.diamondList?.[1] ?? '',
  },
});

const mapValue = (value: ValueContent, ambient: Ambient): ValueScreens => {
  const heroVideoSrc = value.mainVideo;
  const description = value.body;
  const headline = value.headline;

  const benefits = value.diamondBenefits ?? [];
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
        eyebrow: ambient.title,
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
        eyebrow: ambient.title,
        headline,
        labelText: 'Value',
        slides: carouselSlides,
      },
    ],
  };
};

const mapHardcoded = (hardcoded: HardcodedContent, ambient: Ambient): HardCodedScreens => ({
  firstScreen: {
    eyebrow: ambient.title,
    heroImageAlt: 'Visitors smiling while viewing content',
    heroImageSrc: hardcoded.image,
    primaryCtaLabel: hardcoded.mainCTA,
    secondaryCtaLabel: hardcoded.secondaryCTA,
  },
  secondScreen: {
    eyebrow: ambient.title,
    headline: hardcoded.headline2 ?? 'From archive\nto access',
    steps: hardcoded.diamondCarouselItems?.map((item, index) => {
      const modalBodyKey = `ModalBody${index + 1}` as keyof HardcodedContent;
      const modalHeadlineKey = `ModalHeadline${index + 1}` as keyof HardcodedContent;
      const modalBody = hardcoded[modalBodyKey] as string | undefined;
      const modalHeadline = hardcoded[modalHeadlineKey] as string | undefined;
      return {
        label: item,
        modal: {
          body: modalBody ?? 'Description not available.',
          heading: modalHeadline ?? item,
          imageAlt: `${item} illustration`,
          imageSrc: `https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/Rich+Media+%26+Cultural+Heritage/04+-+Custom+Interactive/Illustrations/${item.replace(/\s+/g, '+')}.webp`,
        },
      };
    }),
  },
  thirdScreen: {
    cardLabel: 'Virtual walkthrough',
    demoIframeSrc: 'https://example.com/demo-walkthrough',
    endTourLabel: 'End tour',
    headline: 'Experience our solution\nin action',
  },
});
