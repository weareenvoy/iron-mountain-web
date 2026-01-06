'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import DiamondStack from '../DiamondStack';
import type { ValueCarouselSlide, ValueDiamondCard } from '@/app/(displays)/(kiosks)/_types/value-types';

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
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const [diamondsSettled, setDiamondsSettled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getBulletItems = (slide: ValueCarouselSlide) =>
    slide.bullets?.filter(entry => entry && entry.trim().length > 0) ?? [];

  // Detect when the component becomes visible
  useEffect(() => {
    const currentContainer = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !animationStarted) {
          setIsVisible(true);
          setAnimationStarted(true);
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
  }, [animationStarted]);

  useEffect(() => {
    if (emblaApi && onRegisterCarouselHandlers) {
      onRegisterCarouselHandlers({
        canScrollNext: () => emblaApi.canScrollNext(),
        canScrollPrev: () => emblaApi.canScrollPrev(),
        scrollNext: () => emblaApi.scrollNext(),
        scrollPrev: () => emblaApi.scrollPrev(),
      });
    }

    // Cleanup: Destroy Embla instance on unmount to prevent memory leaks
    return () => {
      emblaApi?.destroy();
    };
  }, [emblaApi, onRegisterCarouselHandlers]);

  // Trigger bullets fade-in after diamonds settle
  useEffect(() => {
    if (!isVisible) return;

    // Animation timing:
    // - Last diamond (index 2) starts at 0.4s delay
    // - Animates for 0.8s (finishes at 1.2s)
    // Set diamondsSettled after all animations complete
    const timer = setTimeout(() => {
      setDiamondsSettled(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <div className={cn('flex flex-col items-end gap-[80px]')} ref={containerRef}>
      <div className={cn('overflow-hidden', hasCarouselSlides && 'relative left-0 w-[2200px]')} ref={emblaRef}>
        <div className="flex w-full">
          {slides.map((slide, slideIndex) => {
            const cards: readonly ValueDiamondCard[] = slide.diamondCards ?? [];
            const bulletItems = getBulletItems(slide);
            const hasBullets = bulletItems.length > 0;
            const isFirstSlide = slideIndex === 0;

            return (
              <div className="flex min-h-[1600px] w-full min-w-full flex-row gap-[220px] pr-[80px]" key={slide.id}>
                <div className="flex w-[920px] flex-col items-center gap-[71px]">
                  {/* Animate slide 1 diamonds from spread positions to stacked positions */}
                  {isFirstSlide && isVisible ? (
                    <div className="relative flex h-[565px] w-[920px] items-center">
                      {cards.map((card, index) => {
                        const Icon = getDiamondIcon(card);
                        // Starting positions (spread out to the right)
                        const initialPositions = [660, 1230, 1785];
                        // Ending positions (carousel stacked positions)
                        const targetPositions = [165, 340, 500];
                        const leftOffset = initialPositions[index] ?? 660;
                        const targetPosition = targetPositions[index] ?? 335;

                        // Stagger delays so they finish in order
                        const animationDuration = 0.8;
                        const staggerDelay = index * 0.2;

                        return (
                          <motion.div
                            animate={{
                              left: targetPosition,
                            }}
                            className="absolute h-[550px] w-[550px] rotate-45 rounded-[80px]"
                            initial={{
                              left: leftOffset,
                            }}
                            key={card.label || `diamond-${index}`}
                            transition={{
                              delay: staggerDelay,
                              duration: animationDuration,
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
                  ) : (
                    <DiamondStack cards={cards} variant="carousel" />
                  )}
                </div>
                {hasBullets ? (
                  <motion.ul
                    animate={{
                      opacity: isFirstSlide && diamondsSettled ? 1 : 0,
                      y: isFirstSlide && diamondsSettled ? 0 : 40,
                    }}
                    className="flex-1 text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#8a0d71]"
                    initial={{ opacity: 0, y: 40 }}
                    transition={{
                      delay: isFirstSlide ? 0 : 0,
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
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnimatedValueCarousel;
