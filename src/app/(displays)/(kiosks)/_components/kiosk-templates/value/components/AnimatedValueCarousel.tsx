'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

type AnimatedValueCarouselProps = {
  readonly hasCarouselSlides?: boolean;
  readonly onRegisterCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly slides: readonly ValueCarouselSlide[];
};

const AnimatedValueCarousel = ({
  hasCarouselSlides,
  onRegisterCarouselHandlers,
  slides,
}: AnimatedValueCarouselProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [diamondsSettled, setDiamondsSettled] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initial spread positions for slide 1 animation
  const INITIAL_SPREAD_POSITIONS = [660, 1230, 1785];

  // Map which diamond index should be at which position for each slide
  // This tells us: for slide X, diamond Y should move to position Z
  const getDiamondPositionForSlide = (slideIndex: number, diamondIndex: number): number => {
    // Slide 0: Operational (0), Economic (1), Strategic (2) at [165, 340, 500]
    // Slide 1: Economic (1), Strategic (2), Operational (0) at [165, 340, 500]
    // Slide 2: Strategic (2), Operational (0), Economic (1) at [165, 340, 500]

    const positionMap = [
      [165, 340, 500], // Slide 0: diamond 0 at 165, diamond 1 at 340, diamond 2 at 500
      [500, 165, 340], // Slide 1: diamond 0 at 500, diamond 1 at 165, diamond 2 at 340 (Economic to front)
      [340, 500, 165], // Slide 2: diamond 0 at 340, diamond 1 at 500, diamond 2 at 165 (Strategic to front)
    ];

    return positionMap[slideIndex]?.[diamondIndex] ?? 165;
  };

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

  // Detect when the component becomes visible
  useEffect(() => {
    const currentContainer = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          // Start animation when visible
          setShouldAnimate(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3, // Trigger when 30% of the element is visible
      }
    );

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []); // Only run once on mount

  // Register navigation handlers
  useEffect(() => {
    if (onRegisterCarouselHandlers) {
      onRegisterCarouselHandlers({
        canScrollNext,
        canScrollPrev,
        scrollNext,
        scrollPrev,
      });
    }
  }, [canScrollNext, canScrollPrev, onRegisterCarouselHandlers, scrollNext, scrollPrev]);

  // Trigger bullets fade-in after diamonds settle
  useEffect(() => {
    if (!shouldAnimate) return;

    // Animation timing:
    // - Last diamond (index 2) starts at 0.4s delay
    // - Animates for 0.8s (finishes at 1.2s)
    // Set diamondsSettled after all animations complete
    const timer = setTimeout(() => {
      setDiamondsSettled(true);
    }, 1200);

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
                // Keep the same SVG from slide 1, just rotate its position
                const Icon = getDiamondIcon(card);
                const targetPosition = getDiamondPositionForSlide(currentSlideIndex, index);
                const isFirstSlide = currentSlideIndex === 0;

                // Initial position: spread if first slide and hasn't animated yet, otherwise target
                const initialPosition =
                  isFirstSlide && !shouldAnimate ? INITIAL_SPREAD_POSITIONS[index] : targetPosition;

                return (
                  <motion.div
                    animate={{
                      left: shouldAnimate ? targetPosition : initialPosition,
                    }}
                    className="absolute h-[550px] w-[550px] rotate-45 rounded-[80px]"
                    initial={false}
                    key={`diamond-original-${index}`}
                    style={{
                      left: initialPosition,
                    }}
                    transition={{
                      delay: isFirstSlide && shouldAnimate && !diamondsSettled ? index * 0.2 : 0,
                      duration: isFirstSlide && shouldAnimate && !diamondsSettled ? 0.8 : 0.6,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-full -rotate-45">
                        {Icon ? <Icon aria-hidden className="h-full w-full" focusable="false" /> : null}
                      </div>
                    </div>
                    {card.label ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-[320px] w-[320px] -rotate-45 items-center justify-center px-10 text-center text-[48px] leading-[1.4] font-normal tracking-[-2.4px] text-[#ededed]">
                          {renderRegisteredMark(card.label)}
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
          {/* Bullets fade in/out based on current slide */}
          <div className="relative flex-1">
            <AnimatePresence initial={false} mode="wait">
              {slides.map((slide, slideIndex) => {
                if (slideIndex !== currentSlideIndex) return null;

                const bulletItems = getBulletItems(slide);
                const hasBullets = bulletItems.length > 0;
                const isFirstSlide = slideIndex === 0;

                if (!hasBullets) return null;

                return (
                  <motion.ul
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#8a0d71]"
                    exit={{ opacity: 0, y: 40 }}
                    initial={{ opacity: 0, y: 40 }}
                    key={slide.id}
                    transition={{
                      delay: isFirstSlide && !diamondsSettled ? 0 : 0,
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
