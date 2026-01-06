'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import {
  CAROUSEL_VISIBILITY_THRESHOLD,
  DEFAULT_LABELS,
  DIAMOND_KEY_PREFIX,
  DIAMOND_LABEL_INDEX,
  DIAMONDS_SETTLE_TIME,
} from './constants';
import Diamond from './Diamond';
import { getBulletItems, getDiamondPositionForSlide, getDiamondZIndex, shouldShowDiamondText } from './helpers';
import type { DiamondIndex, SlideIndex, ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Props for the AnimatedValueCarousel component.
 * This component renders an animated carousel with rotating diamonds and fading bullet points.
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
   */
  useEffect(() => {
    if (!shouldAnimate) return;

    const timer = setTimeout(() => {
      setDiamondsSettled(true);
    }, DIAMONDS_SETTLE_TIME);

    return () => clearTimeout(timer);
  }, [shouldAnimate]);

  return (
    <div className={cn('flex flex-col items-end gap-[80px]')} ref={containerRef}>
      <div className={cn('relative', hasCarouselSlides && 'left-0 w-[2200px]')}>
        <div className="flex min-h-[1600px] w-full flex-row gap-[220px] pr-[80px]">
          <div className="flex w-[920px] flex-col items-center gap-[71px]">
            {/* Render diamonds once - they rotate to new positions on slide change */}
            <div className="relative flex h-[565px] w-[920px] items-center">
              {slides[0]?.diamondCards?.map((_card, index) => {
                // Validate indices are within expected bounds
                if (currentSlideIndex < 0 || currentSlideIndex > 2 || index < 0 || index > 2) {
                  if (process.env.NODE_ENV === 'development') {
                    console.error(`Invalid carousel indices: slide=${currentSlideIndex}, diamond=${index}`);
                  }
                  return null;
                }

                const diamondIcon = diamondIcons[index] ?? null;
                const diamondLabel = diamondLabels[index] ?? '';

                const targetPosition = getDiamondPositionForSlide(
                  currentSlideIndex as SlideIndex,
                  index as DiamondIndex
                );
                const zIndexClass = getDiamondZIndex(currentSlideIndex as SlideIndex, index as DiamondIndex);
                const showText = shouldShowDiamondText(currentSlideIndex as SlideIndex, index as DiamondIndex);

                return (
                  <Diamond
                    currentSlideIndex={currentSlideIndex}
                    diamondIcon={diamondIcon}
                    diamondLabel={diamondLabel}
                    diamondsSettled={diamondsSettled}
                    index={index}
                    key={`${DIAMOND_KEY_PREFIX}-${index}`}
                    shouldAnimate={shouldAnimate}
                    showText={showText}
                    targetPosition={targetPosition}
                    zIndexClass={zIndexClass}
                  />
                );
              })}
            </div>
          </div>
          {/* Bullets fade in/out based on current slide */}
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              {slides.map((slide, slideIndex) => {
                if (slideIndex !== currentSlideIndex) return null;

                const bulletItems = getBulletItems(slide);
                const hasBullets = bulletItems.length > 0;
                const isFirstSlide = slideIndex === 0;

                if (!hasBullets) return null;

                // For first slide: only animate after diamonds settle and carousel is visible
                // For other slides: animate immediately
                const shouldShowBullets = !isFirstSlide || (shouldAnimate && diamondsSettled);

                return (
                  <motion.ul
                    animate={shouldShowBullets ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    className="text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#8a0d71]"
                    exit={{ opacity: 0, y: 40 }}
                    initial={{ opacity: 0, y: 40 }}
                    key={slide.id}
                    transition={{
                      duration: 0.6,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    {bulletItems.map((bullet, idx) => (
                      <li
                        className="relative mb-[80px] w-[840px] pl-[40px] last:mb-0"
                        key={`${slide.id}-bullet-${idx}`}
                      >
                        <span className="absolute top-[30px] left-0 size-[16px] -translate-y-1/2 rounded-full bg-[#8a0d71]" />
                        <span>{renderRegisteredMark(bullet)}</span>
                      </li>
                    ))}
                  </motion.ul>
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
