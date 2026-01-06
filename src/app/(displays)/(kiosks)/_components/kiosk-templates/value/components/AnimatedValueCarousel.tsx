'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import { cn } from '@/lib/tailwind/utils/cn';
import BulletList from './BulletList';
import { CAROUSEL_VISIBILITY_THRESHOLD, DIAMONDS_SETTLE_TIME } from '../constants/animation';
import { DEFAULT_LABELS, DIAMOND_LABEL_INDEX } from '../constants/layout';
import DiamondContainer from './DiamondContainer';
import { getBulletItems } from '../utils/helpers';
import type { ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Props for the AnimatedValueCarousel component.
 */
type AnimatedValueCarouselProps = {
  /** Whether the carousel has valid slides with bullet points */
  readonly hasCarouselSlides?: boolean;
  /** Callback to register navigation handlers for parent control */
  readonly registerCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  /** Array of carousel slides with diamond cards and bullet points */
  readonly slides: readonly ValueCarouselSlide[];
};

/**
 * AnimatedValueCarousel - Interactive carousel component with animated diamonds and bullet points.
 *
 * ## Overview
 * This component displays a multi-slide carousel showcasing value propositions with animated
 * diamond icons and corresponding bullet point lists. It features sophisticated animations
 * including diamond rotation, position transitions, and text fade effects.
 *
 * ## Animation Sequence
 * 1. **Initial Load**: Diamonds start in spread positions (660px, 1230px, 1785px apart)
 * 2. **On Visibility**: When 30% visible, diamonds animate to stacked positions with stagger effect
 * 3. **After Settlement**: Bullet points fade in from below for first slide
 * 4. **Navigation**: Diamonds rotate positions, text fades in/out, bullets transition
 *
 * ## When to Use
 * - Use `AnimatedValueCarousel` when `mainVideo` is provided and slides have content
 * - Falls back to `ValueCarousel` (static) when no video or animation is not needed
 * - Optimized for kiosk displays at 2160x5120px resolution
 *
 * ## Technical Details
 * - Uses Framer Motion for declarative animations
 * - IntersectionObserver triggers initial animation at 30% visibility
 * - Memoizes expensive calculations (icons, labels) for performance
 * - All positioning values aligned with Figma design specifications
 *
 * @component
 */

const AnimatedValueCarousel = ({ hasCarouselSlides, registerCarouselHandlers, slides }: AnimatedValueCarouselProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [diamondsSettled, setDiamondsSettled] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Memoize diamond icons to avoid recalculating on every render
  const diamondIcons = useMemo(
    () => slides[0]?.diamondCards?.map(card => getDiamondIcon(card) ?? null) ?? [],
    [slides]
  );

  // Memoize diamond labels to avoid recalculating inside map loop
  const diamondLabels = useMemo(() => {
    const strategicCard = slides[2]?.diamondCards?.[DIAMOND_LABEL_INDEX];
    const economicCard = slides[1]?.diamondCards?.[DIAMOND_LABEL_INDEX];
    const operationalCard = slides[0]?.diamondCards?.[DIAMOND_LABEL_INDEX];

    return [
      strategicCard?.label ?? DEFAULT_LABELS.STRATEGIC,
      economicCard?.label ?? DEFAULT_LABELS.ECONOMIC,
      operationalCard?.label ?? DEFAULT_LABELS.OPERATIONAL,
    ];
  }, [slides]);

  // Memoize current slide's bullet items to prevent unnecessary BulletList re-renders
  const currentBulletItems = useMemo(() => {
    const currentSlide = slides[currentSlideIndex] ?? slides[0];
    if (!currentSlide) return [];
    return getBulletItems(currentSlide);
  }, [slides, currentSlideIndex]);

  // Navigation handlers
  const canScrollNext = useCallback(() => currentSlideIndex < slides.length - 1, [currentSlideIndex, slides.length]);
  const canScrollPrev = useCallback(() => currentSlideIndex > 0, [currentSlideIndex]);
  const scrollNext = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, slides.length]);
  const scrollPrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  /**
   * Detect when the component becomes visible using IntersectionObserver.
   * Triggers the initial diamond animation when the visibility threshold is met.
   */
  useEffect(() => {
    const currentContainer = containerRef.current;

    if (!currentContainer) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: CAROUSEL_VISIBILITY_THRESHOLD,
      }
    );

    observerRef.current.observe(currentContainer);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  /**
   * Register carousel navigation handlers with the parent component.
   */
  useEffect(() => {
    if (registerCarouselHandlers) {
      registerCarouselHandlers({
        canScrollNext,
        canScrollPrev,
        scrollNext,
        scrollPrev,
      });
    }
  }, [canScrollNext, canScrollPrev, registerCarouselHandlers, scrollNext, scrollPrev]);

  /**
   * Trigger bullet fade-in after all diamonds have settled into position.
   * Uses calculated timing based on diamond animation configuration.
   * Ensures cleanup on unmount to prevent memory leaks and state updates on unmounted components.
   */
  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = setTimeout(() => {
      setDiamondsSettled(true);
    }, DIAMONDS_SETTLE_TIME);

    return () => {
      clearTimeout(timer);
      setDiamondsSettled(false);
    };
  }, [shouldAnimate]);

  return (
    <div className={cn('flex flex-col items-end gap-[80px]')} ref={containerRef}>
      <div className={cn('relative', hasCarouselSlides && 'left-0 w-[2200px]')}>
        <div className="flex min-h-[1600px] w-full flex-row gap-[220px] pr-[80px]">
          <div className="flex w-[920px] flex-col items-center gap-[71px]">
            {/* Render diamonds once - they rotate to new positions on slide change */}
            <DiamondContainer
              currentSlideIndex={currentSlideIndex}
              diamondCount={slides[0]?.diamondCards?.length ?? 0}
              diamondIcons={diamondIcons}
              diamondLabels={diamondLabels}
              diamondsSettled={diamondsSettled}
              shouldAnimate={shouldAnimate}
            />
          </div>
          {/* Bullets fade in/out based on current slide */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              {slides.map((slide, slideIndex) => {
                if (slideIndex !== currentSlideIndex) return null;

                const hasBullets = currentBulletItems.length > 0;
                const isFirstSlide = slideIndex === 0;

                if (!hasBullets) return null;

                // For first slide: only animate after diamonds settle and carousel is visible
                // For other slides: animate immediately
                const shouldShowBullets = !isFirstSlide || (shouldAnimate && diamondsSettled);

                return (
                  <BulletList
                    bulletItems={currentBulletItems}
                    key={slide.id}
                    shouldShow={shouldShowBullets}
                    slideId={slide.id}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedValueCarousel;
