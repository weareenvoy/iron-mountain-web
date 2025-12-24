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
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';

const Kiosk1View = () => {
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
    duration: 1200,
  });

  // Wrap navigation handlers to check carousel first
  const handleNavigateDown = useCallback(() => {
    // Check if we should delegate to carousel
    const shouldDelegateToCarousel =
      currentScrollTarget === 'value-description' && carouselHandlers !== null && carouselHandlers.canScrollNext();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollNext();
      return;
    }

    baseHandleNavigateDown();
  }, [baseHandleNavigateDown, carouselHandlers, currentScrollTarget]);

  const handleNavigateUp = useCallback(() => {
    // Check if carousel can handle the navigation
    const shouldDelegateToCarousel =
      currentScrollTarget === 'value-description' && carouselHandlers !== null && carouselHandlers.canScrollPrev();

    if (shouldDelegateToCarousel) {
      carouselHandlers!.scrollPrev();
      return;
    }

    baseHandleNavigateUp();
  }, [baseHandleNavigateUp, carouselHandlers, currentScrollTarget]);

  // Prepare data (with safe defaults for loading state)
  const kioskContent = kioskData as
    | null
    | undefined
    | {
        ambient?: unknown;
        challengeMain?: unknown;
        customInteractive1Main?: unknown;
        demoMain?: unknown;
        solutionGrid?: unknown;
        solutionMain?: unknown;
        valueMain?: unknown;
      };

  const challenges: KioskChallenges | null =
    kioskContent?.challengeMain && kioskContent.ambient
      ? parseKioskChallenges(mapChallenges(kioskContent.challengeMain, kioskContent.ambient))
      : null;

  const solutions =
    kioskContent?.solutionMain && kioskContent.solutionGrid && kioskContent.ambient
      ? (mapSolutions(kioskContent.solutionMain, kioskContent.solutionGrid, kioskContent.ambient) as SolutionScreens)
      : null;
  const values =
    kioskContent?.valueMain && kioskContent.ambient
      ? (mapValue(kioskContent.valueMain, kioskContent.ambient) as ValueScreens)
      : null;
  const customInteractive =
    kioskContent?.customInteractive1Main && kioskContent.ambient
      ? (mapCustomInteractive(
          kioskContent.customInteractive1Main,
          kioskContent.ambient,
          kioskContent.demoMain as undefined | { headline?: string; iframeLink?: string; mainCTA?: string }
        ) as CustomInteractiveScreens)
      : null;

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
            ...buildChallengeSlides(challenges, 'kiosk-1', globalHandlers, {
              onInitialButtonClick: handleInitialButtonClick,
            }),
            ...buildSolutionSlides(solutions, 'kiosk-1', globalHandlers),
            ...buildValueSlides(values, 'kiosk-1', globalHandlers, {
              onRegisterCarouselHandlers: handleRegisterCarouselHandlers,
            }),
            ...buildCustomInteractiveSlides(customInteractive, 'kiosk-1', scrollToSectionById),
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
      }, 300); // SECTION TRANSITION DELAY: Adjust this to control reappearance between sections (Challenge → Solution → Value)
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
            transition={{ duration: 0.6, ease: 'easeOut' }}
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
  labelText?: string;
  mainVideo?: string;
};

type SolutionsMain = {
  body?: string;
  headline?: string;
  image?: string;
  labelText?: string;
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
  labelText?: string;
  mainVideo?: string;
};

type CustomInteractiveContent = {
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
    labelText: challenge.labelText ?? 'Challenge',
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
    labelText: challenge.labelText ?? 'Challenge',
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
    labelText: challenge.labelText ?? 'Challenge',
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
    labelText: solutionsMain.labelText ?? 'Solution',
    subheadline: ambient.title,
    title: solutionsMain.headline ?? '',
  },
  secondScreen: {
    heroImageSrc: solutionsMain.image ?? '',
    labelText: solutionsMain.labelText ?? 'Solution',
    stepFourDescription: solutionsMain.numberedList?.[3] ?? '',
    stepFourLabel: '04.',
    stepOneDescription: solutionsMain.numberedList?.[0] ?? '',
    stepOneLabel: '01.',
    stepThreeDescription: solutionsMain.numberedList?.[2] ?? '',
    stepThreeLabel: '03.',
    stepTwoDescription: solutionsMain.numberedList?.[1] ?? '',
    stepTwoLabel: '02.',
    subheadline: ambient.title,
    title: solutionsMain.numberedListHeadline,
  },
  thirdScreen: {
    bottomLeftLabel: solutionsGrid.diamondList?.[2] ?? '',
    bottomRightLabel: solutionsGrid.diamondList?.[3] ?? '',
    centerLabel: solutionsGrid.diamondList?.[0] ?? '',
    labelText: solutionsMain.labelText ?? 'Solution',
    mediaDiamondLeftSrc: solutionsGrid.images?.[0] ?? '',
    mediaDiamondRightSrc: solutionsGrid.images?.[1] ?? '',
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
        labelText: value.labelText ?? 'Value',
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
        labelText: value.labelText ?? 'Value',
        slides: carouselSlides,
      },
    ],
  };
};

const mapCustomInteractive = (
  customInteractive: CustomInteractiveContent,
  ambient: Ambient,
  demo?: { demoText?: string; headline?: string; iframeLink?: string; mainCTA?: string }
): CustomInteractiveScreens => ({
  firstScreen: {
    demoIframeSrc: demo?.iframeLink,
    eyebrow: ambient.title,
    headline: customInteractive.headline,
    heroImageAlt: 'Visitors smiling while viewing content',
    heroImageSrc: customInteractive.image,
    overlayCardLabel: demo?.demoText,
    overlayEndTourLabel: demo?.mainCTA,
    overlayHeadline: demo?.headline,
    primaryCtaLabel: customInteractive.mainCTA,
    secondaryCtaLabel: customInteractive.secondaryCTA,
  },
  secondScreen: {
    backLabel: customInteractive.backCTA,
    demoIframeSrc: demo?.iframeLink,
    eyebrow: ambient.title,
    headline: customInteractive.headline2 ?? 'From archive\nto access',
    heroImageAlt: 'Archive visualization',
    heroImageSrc: customInteractive.image,
    overlayCardLabel: demo?.demoText,
    overlayEndTourLabel: demo?.mainCTA,
    overlayHeadline: demo?.headline,
    secondaryCtaLabel: customInteractive.secondaryCTA,
    steps: customInteractive.diamondCarouselItems?.map((item, index) => {
      const modalBodyKey = `ModalBody${index + 1}` as keyof CustomInteractiveContent;
      const modalHeadlineKey = `ModalHeadline${index + 1}` as keyof CustomInteractiveContent;
      const modalBody = customInteractive[modalBodyKey] as string | undefined;
      const modalHeadline = customInteractive[modalHeadlineKey] as string | undefined;
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
    cardLabel: demo?.demoText,
    demoIframeSrc: demo?.iframeLink,
    endTourLabel: demo?.mainCTA,
    headline: demo?.headline,
    heroImageAlt: 'Digital transformation showcase',
    heroImageSrc: customInteractive.image,
  },
});
