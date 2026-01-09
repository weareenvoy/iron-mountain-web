'use client';

import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import { cn } from '@/lib/tailwind/utils/cn';
import BulletList from './BulletList';
import { CAROUSEL_VISIBILITY_THRESHOLD, DIAMONDS_SETTLE_TIME } from '../constants/animation';
import { DEFAULT_LABELS } from '../constants/layout';
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
  const slideIndexRef = useRef(0);

  // Memoize diamond icons to avoid recalculating on every render
  const diamondIcons = useMemo(
    () => slides[0]?.diamondCards?.map(card => getDiamondIcon(card) ?? null) ?? [],
    [slides]
  );

  // Memoize diamond labels - validate CMS provides all required labels
  const diamondLabels = useMemo(() => {
    const labels = slides[0]?.diamondCards?.map(card => card.label).filter(Boolean) ?? [];
    if (labels.length !== 3) {
      // Fall back to default labels if CMS data is incomplete
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AnimatedValueCarousel] Expected 3 diamond labels from CMS, got:', labels.length);
      }
      return [DEFAULT_LABELS.STRATEGIC, DEFAULT_LABELS.ECONOMIC, DEFAULT_LABELS.OPERATIONAL];
    }
    return labels as string[];
  }, [slides]);

  // Sync ref with state for stable handler callbacks
  useEffect(() => {
    slideIndexRef.current = currentSlideIndex;
  }, [currentSlideIndex]);

  // Memoize current slide's bullet items to prevent unnecessary BulletList re-renders
  const currentBulletItems = useMemo(() => {
    const currentSlide = slides[currentSlideIndex] ?? slides[0];
    if (!currentSlide) return [];
    return getBulletItems(currentSlide);
  }, [slides, currentSlideIndex]);

  // Stable navigation handlers using ref to avoid handler churn
  const canScrollNext = useCallback(() => slideIndexRef.current < slides.length - 1, [slides.length]);
  const canScrollPrev = useCallback(() => slideIndexRef.current > 0, []);
  const scrollNext = useCallback(() => {
    setCurrentSlideIndex(prev => (prev < slides.length - 1 ? prev + 1 : prev));
  }, [slides.length]);
  const scrollPrev = useCallback(() => {
    setCurrentSlideIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

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
   * Only clear timer on cleanup - do not set state during unmount.
   */
  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = setTimeout(() => {
      setDiamondsSettled(true);
    }, DIAMONDS_SETTLE_TIME);

    return () => {
      clearTimeout(timer);
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

                // Generate stable key even if slide.id is missing
                const key = slide.id ?? `value-slide-${slideIndex}`;

                return (
                  <BulletList bulletItems={currentBulletItems} key={key} shouldShow={shouldShowBullets} slideId={key} />
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
