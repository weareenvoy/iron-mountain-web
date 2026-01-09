'use client';

import { useInView } from 'framer-motion';
import { memo, useCallback, useRef, useState } from 'react';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import CarouselState from './components/CarouselState';
import InitialState from './components/InitialState';
import MorphingDiamond from './components/MorphingDiamond';
import { IN_VIEW_THRESHOLD, SECTION_IDS } from './constants';
import type { CarouselSlide } from './components/CircularCarousel';

/**
 * Props for the combined second screen template for Kiosk 3.
 * This template combines what were originally separate "tap to begin" and "carousel" screens
 * into a single, seamless experience with morphing animations.
 */
export type Kiosk3SecondScreenProps = {
  /** Label for the back button */
  readonly backLabel?: string;
  /** URL for the demo iframe */
  readonly demoIframeSrc?: string;
  /** Description text shown in initial state */
  readonly description?: string;
  /** Eyebrow text */
  readonly eyebrow?: string;
  /** Main headline */
  readonly headline?: string;
  /** Callback when back button is clicked */
  readonly onBack?: () => void;
  /** Demo overlay configuration */
  readonly overlay?: {
    readonly cardLabel?: string;
    readonly endTourLabel?: string;
    readonly headline?: string;
    readonly heroImageAlt?: string;
    readonly heroImageSrc?: string;
  };
  /** Array of carousel slides */
  readonly slides?: CarouselSlide[];
  /** Label for the "Tap to begin" button */
  readonly tapToBeginLabel?: string;
  /** Video asset for the morphing background */
  readonly videoAsset?: string;
};

/**
 * Combined second and third screen template for Kiosk 3 Custom Interactive.
 *
 * ## Animation Flow
 * 1. **Initial State**: Shows headline, description, rings, dots, and "Tap to begin" button
 * 2. **Transition**: When button is clicked, the background video morphs from full-screen
 *    into the first carousel slide's primary diamond
 * 3. **Carousel State**: Displays carousel content with slides, bullets, and "Launch demo" button
 * 4. **Overlay**: Demo overlay can be shown on top of carousel
 *
 * ## State Machine
 * - `showCarousel`: false → true (one-way transition, triggered by "Tap to begin")
 * - `showOverlay`: toggles demo overlay on/off
 * - `carouselIndex`: tracks current slide (0-based)
 * - `isCarouselExiting`: tracks if current slide is exiting (for morphing diamond exit animation)
 * - `isButtonTransitioning`: triggers "Tap to begin" button morph animation
 *
 * ## Performance Optimizations
 * - Main component wrapped in memo
 * - Child components (InitialState, CarouselState, MorphingDiamond, etc.) also memoized
 * - Event handlers wrapped in useCallback
 * - CSS class computations memoized in child components
 *
 * @see InitialState - The pre-carousel state
 * @see CarouselState - The carousel and content display
 * @see MorphingDiamond - The transitioning background video
 */
const Kiosk3SecondScreenTemplate = memo(
  ({
    backLabel,
    demoIframeSrc,
    description,
    eyebrow,
    headline,
    onBack,
    overlay,
    slides,
    tapToBeginLabel,
    videoAsset,
  }: Kiosk3SecondScreenProps) => {
    // State management for the complex animation flow
    const [showCarousel, setShowCarousel] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isCarouselExiting, setIsCarouselExiting] = useState(false);
    const [isButtonTransitioning, setIsButtonTransitioning] = useState(false);

    const safeSlides = slides ?? [];
    const hasValidVideo = videoAsset && videoAsset.trim().length > 0;

    const ref = useRef(null);
    const isInView = useInView(ref, { amount: IN_VIEW_THRESHOLD, once: true });

    // Stable event handlers to prevent useEffect dependency issues
    const handleTapToBegin = useCallback(() => {
      setIsButtonTransitioning(true);
      setShowCarousel(true);
    }, []);

    const handleShowOverlay = useCallback(() => {
      setShowOverlay(true);
    }, []);

    const handleHideOverlay = useCallback(() => {
      setShowOverlay(false);
    }, []);

    const handleIndexChange = useCallback((index: number) => {
      setCarouselIndex(index);
    }, []);

    const handleIsExitingChange = useCallback((isExiting: boolean) => {
      setIsCarouselExiting(isExiting);
    }, []);

    // Early return for invalid data - no cleanup needed as component won't mount
    if (safeSlides.length === 0 || !headline || !hasValidVideo) {
      console.warn('[Kiosk3SecondScreen] Missing required data:', {
        hasHeadline: !!headline,
        hasSlides: safeSlides.length > 0,
        hasValidVideo,
        videoAsset,
      });
      return null;
    }

    return (
      <div
        className="relative flex h-screen w-full flex-col overflow-hidden"
        data-scroll-section={SECTION_IDS.SECOND_SCREEN}
        ref={ref}
      >
        <div className="absolute inset-0 bg-transparent" />

        {/* Diamond video background - Morphs into first carousel slide */}
        <MorphingDiamond
          carouselIndex={carouselIndex}
          isCarouselExiting={isCarouselExiting}
          showCarousel={showCarousel}
          videoAsset={videoAsset!}
        />

        {/* Carousel state - Lazy loaded when carousel is shown to prevent loading all videos on mount */}
        {showCarousel && (
          <CarouselState
            headline={headline}
            onIndexChange={handleIndexChange}
            onIsExitingChange={handleIsExitingChange}
            onShowOverlay={handleShowOverlay}
            showCarousel={showCarousel}
            slides={safeSlides}
          />
        )}

        {/* Initial state - Rings, dots, "Tap to begin" - Fades to opacity 0 */}
        <InitialState
          backLabel={backLabel}
          description={description}
          eyebrow={eyebrow}
          headline={headline}
          isButtonTransitioning={isButtonTransitioning}
          isInView={isInView}
          onBack={onBack}
          onTapToBegin={handleTapToBegin}
          showCarousel={showCarousel}
          tapToBeginLabel={tapToBeginLabel}
        />

        {/* Demo overlay */}
        {showOverlay && (
          <div className="absolute inset-0 z-[9999] animate-in duration-700 fade-in">
            <CustomInteractiveDemoScreenTemplate
              cardLabel={overlay?.cardLabel}
              demoIframeSrc={demoIframeSrc}
              endTourLabel={overlay?.endTourLabel}
              headline={overlay?.headline}
              heroImageAlt={overlay?.heroImageAlt}
              heroImageSrc={overlay?.heroImageSrc}
              onEndTour={handleHideOverlay}
            />
          </div>
        )}
      </div>
    );
  }
);

export default Kiosk3SecondScreenTemplate;
