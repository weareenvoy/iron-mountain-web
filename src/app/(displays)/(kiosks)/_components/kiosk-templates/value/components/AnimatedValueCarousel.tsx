'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import {
  DIAMONDS_SETTLE_TIME,
  POSITION_MAP,
  TEXT_VISIBILITY_MAP,
  Z_INDEX_MAP,
  type DiamondIndex,
  type SlideIndex,
} from './constants';
import Diamond from './Diamond';
import type { ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

type AnimatedValueCarouselProps = {
  readonly hasCarouselSlides?: boolean;
  readonly registerCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly slides: readonly ValueCarouselSlide[];
};

/**
 * Gets the left position (in px) for a diamond on a specific slide.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond being positioned (0-2)
 * @returns The left position in pixels
 */
function getDiamondPositionForSlide(slideIndex: number, diamondIndex: number): number {
  return POSITION_MAP[slideIndex as SlideIndex][diamondIndex as DiamondIndex];
}

/**
 * Gets the z-index class for a diamond on a specific slide.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond being styled (0-2)
 * @returns Tailwind z-index class string (e.g., 'z-2') or empty string
 */
function getDiamondZIndex(slideIndex: number, diamondIndex: number): string {
  return Z_INDEX_MAP[slideIndex as SlideIndex][diamondIndex as DiamondIndex];
}

/**
 * Determines if a diamond's text should be visible on a specific slide.
 * The diamond at position 500px always shows its text.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond to check (0-2)
 * @returns True if text should be visible
 */
function shouldShowDiamondText(slideIndex: number, diamondIndex: number): boolean {
  return TEXT_VISIBILITY_MAP[slideIndex as SlideIndex][diamondIndex as DiamondIndex];
}

const AnimatedValueCarousel = ({ hasCarouselSlides, registerCarouselHandlers, slides }: AnimatedValueCarouselProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [diamondsSettled, setDiamondsSettled] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getBulletItems = (slide: ValueCarouselSlide) =>
    slide.bullets?.filter(entry => entry && entry.trim().length > 0) ?? [];

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
   * Triggers the initial diamond animation when 30% of the carousel is visible.
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
        threshold: 0.3,
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
              {slides[0]?.diamondCards?.map((card, index) => {
                const diamondIcon = getDiamondIcon(card) || null;
                const targetPosition = getDiamondPositionForSlide(currentSlideIndex, index);
                const zIndexClass = getDiamondZIndex(currentSlideIndex, index);
                const showText = shouldShowDiamondText(currentSlideIndex, index);

                // Get the label for this diamond from each slide's data
                // Each slide has its label at index [2] of diamondCards
                const diamondLabels = [
                  slides[2]?.diamondCards?.[2]?.label || 'Strategic benefits',
                  slides[1]?.diamondCards?.[2]?.label || 'Economic benefits',
                  slides[0]?.diamondCards?.[2]?.label || 'Operational benefits',
                ];
                const diamondLabel = diamondLabels[index] || '';

                return (
                  <Diamond
                    currentSlideIndex={currentSlideIndex}
                    diamondIcon={diamondIcon}
                    diamondLabel={diamondLabel}
                    diamondsSettled={diamondsSettled}
                    index={index}
                    key={`diamond-original-${index}`}
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

AnimatedValueCarousel.displayName = 'AnimatedValueCarousel';

export default AnimatedValueCarousel;
