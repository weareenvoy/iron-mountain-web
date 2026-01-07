'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCWhiteDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

export type Step = {
  readonly label: string;
  readonly modal?: {
    readonly body?: string;
    readonly heading?: string;
    readonly imageAlt?: string;
    readonly imageSrc?: string;
  };
};

type EmblaApi = UseEmblaCarouselType[1];

type StepCarouselProps = {
  readonly onStepClick: (index: number) => void;
  readonly steps: readonly Step[];
};

const INITIAL_CENTER_INDEX = 2;
const EDGE_OFFSET = 2; // This helps to catch what the carousel items on the far left and right are since they're 2 spots away from the active item in the center. (5 items total). The items on the far left and right have specific sizes which this helps to adjust further in the code.

// Animation configuration for staggered diamond entrance
const DIAMOND_ANIMATION = {
  // Center diamond: minimal movement, shortest delay
  CENTER: { delay: 0.3, startY: -120 },
  // Animation duration and easing
  DURATION: 0.8,
  EASE: [0.4, 0, 0.2, 1] as const,
  // Next pair (±1): medium starting Y, medium delay
  MIDDLE: { delay: 0.15, startY: -350 },
  // Outermost diamonds (±2): highest starting Y, longest delay
  OUTER: { delay: 0, startY: -550 },
} as const;

const StepCarousel = ({ onStepClick, steps }: StepCarouselProps) => {
  const [emblaApi, setEmblaApi] = useState<EmblaApi | undefined>(undefined);
  const hasAppliedInitialAlignment = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(() => Math.min(steps.length - 1, INITIAL_CENTER_INDEX));
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = steps.length;

  // The function below takes the two diamonds in the diamond carousel and pushes them towards the center by 240px to have them overlap with the two diamonds that are directly to the left and right of the active center diamond. This keeps the intended layout in Figma.
  const applyEdgeTransforms = useCallback(
    (currentIndex: number) => {
      if (!emblaApi?.rootNode || totalSlides === 0) return;
      const root = emblaApi.rootNode();
      const slides = root.querySelectorAll<HTMLElement>('[data-slide-index], .embla__slide');
      const half = Math.floor(totalSlides / 2);
      const rootRect = root.getBoundingClientRect();
      const rootCenter = rootRect.left + rootRect.width / 2;

      let activeSlide: HTMLElement | null = null;
      let activeDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide: HTMLElement) => {
        const indexAttr =
          slide.dataset.slideIndex ??
          slide.getAttribute('data-embla-slide-index') ??
          slide.getAttribute('data-embla-index');
        const rawIndex = Number(indexAttr);
        if (Number.isNaN(rawIndex)) return;
        const normalizedIndex = ((rawIndex % totalSlides) + totalSlides) % totalSlides;
        if (normalizedIndex !== currentIndex) return;
        const slideRect = slide.getBoundingClientRect();
        const slideCenter = slideRect.left + slideRect.width / 2;
        const distance = Math.abs(slideCenter - rootCenter);
        if (distance < activeDistance) {
          activeDistance = distance;
          activeSlide = slide;
        }
      });

      slides.forEach((slide: HTMLElement) => {
        const indexAttr =
          slide.dataset.slideIndex ??
          slide.getAttribute('data-embla-slide-index') ??
          slide.getAttribute('data-embla-index');
        const rawIndex = Number(indexAttr);
        if (Number.isNaN(rawIndex)) {
          slide.style.transform = '';
          return;
        }
        const normalizedIndex = ((rawIndex % totalSlides) + totalSlides) % totalSlides;
        let delta = normalizedIndex - currentIndex;

        if (normalizedIndex === currentIndex && slide !== activeSlide) {
          const slideRect = slide.getBoundingClientRect();
          const slideCenter = slideRect.left + slideRect.width / 2;
          delta = slideCenter < rootCenter ? -EDGE_OFFSET : EDGE_OFFSET;
        }

        if (delta > half) {
          delta -= totalSlides;
        }
        if (delta < -half) {
          delta += totalSlides;
        }

        const transform =
          delta === -EDGE_OFFSET
            ? 'translate3d(240px, 0px, 0px)'
            : delta === EDGE_OFFSET
              ? 'translate3d(-240px, 0px, 0px)'
              : '';
        slide.style.transform = transform;
      });
    },
    [emblaApi, totalSlides]
  );

  useEffect(() => {
    if (!emblaApi) return undefined;
    const handleSelect = () => {
      const nextIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(nextIndex);
      applyEdgeTransforms(nextIndex);
    };
    emblaApi.on('reInit', handleSelect);
    emblaApi.on('scroll', handleSelect);
    emblaApi.on('select', handleSelect);
    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleSelect);
      emblaApi.off('scroll', handleSelect);
    };
  }, [applyEdgeTransforms, emblaApi]);

  useEffect(() => {
    applyEdgeTransforms(selectedIndex);
  }, [applyEdgeTransforms, selectedIndex]);

  useEffect(() => {
    if (!emblaApi) return undefined;
    const frame = requestAnimationFrame(() => {
      applyEdgeTransforms(selectedIndex);
    });
    return () => cancelAnimationFrame(frame);
  }, [applyEdgeTransforms, emblaApi, selectedIndex]);

  useEffect(() => {
    if (!emblaApi || totalSlides === 0 || hasAppliedInitialAlignment.current) return;
    const desiredIndex = Math.min(totalSlides - 1, INITIAL_CENTER_INDEX);
    hasAppliedInitialAlignment.current = true;
    emblaApi.scrollTo(desiredIndex, true);
  }, [applyEdgeTransforms, emblaApi, totalSlides]);

  // Detect when carousel becomes visible to trigger animations
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldAnimate(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3, // Trigger when 30% visible
      }
    );

    observer.observe(currentContainer);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Cleanup: Destroy Embla instance on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      emblaApi?.destroy();
    };
  }, [emblaApi]);

  const handlePrev = () => {
    if (!emblaApi || totalSlides === 0) return;
    const target = (selectedIndex - 1 + totalSlides) % totalSlides;
    emblaApi.scrollTo(target);
  };

  const handleNext = () => {
    if (!emblaApi || totalSlides === 0) return;
    const target = (selectedIndex + 1) % totalSlides;
    emblaApi.scrollTo(target);
  };

  const handleDiamondClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const idx = Number(event.currentTarget.dataset.idx);
      if (!emblaApi || Number.isNaN(idx)) return;
      emblaApi.scrollTo(idx);
    },
    [emblaApi]
  );

  const handlePlusClick = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      // Type guard for currentTarget
      if (!(event.currentTarget instanceof HTMLElement)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('currentTarget is not an HTMLElement');
        }
        return;
      }

      const target = event.currentTarget;
      const idx = Number(target.dataset.idx);
      if (Number.isNaN(idx)) return;

      event.stopPropagation();
      if ('key' in event && event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      if ('key' in event) {
        event.preventDefault();
      }
      onStepClick(idx);
    },
    [onStepClick]
  );

  return (
    <div className="absolute top-[1980px] left-0 w-full overflow-visible" ref={containerRef}>
      <Carousel
        className="w-full overflow-visible [&>div]:overflow-visible"
        opts={{
          align: 'center',
          containScroll: false,
          dragFree: false,
          loop: true,
          slidesToScroll: 1,
          startIndex: Math.min(steps.length - 1, INITIAL_CENTER_INDEX),
        }}
        setApi={setEmblaApi}
      >
        <CarouselContent className="flex items-center gap-[60px] overflow-visible px-0">
          {steps.map((step, idx) => {
            const isActive = idx === selectedIndex;
            const leftIndex = (selectedIndex - EDGE_OFFSET + totalSlides) % totalSlides;
            const rightIndex = (selectedIndex + EDGE_OFFSET) % totalSlides;
            const isLeftEdge = idx === leftIndex;
            const isRightEdge = idx === rightIndex;
            const inactiveSize = isLeftEdge || isRightEdge ? 440 : 640;
            const itemTransform = isLeftEdge
              ? 'translate3d(240px, 0px, 0px)'
              : isRightEdge
                ? 'translate3d(-240px, 0px, 0px)'
                : undefined;

            // Determine animation config based on position relative to center
            const leftMiddleIndex = (selectedIndex - 1 + totalSlides) % totalSlides;
            const rightMiddleIndex = (selectedIndex + 1) % totalSlides;
            const isMiddle = idx === leftMiddleIndex || idx === rightMiddleIndex;
            const isOuter = isLeftEdge || isRightEdge;

            const animConfig = isOuter
              ? DIAMOND_ANIMATION.OUTER
              : isMiddle
                ? DIAMOND_ANIMATION.MIDDLE
                : DIAMOND_ANIMATION.CENTER;

            return (
              <CarouselItem
                className="shrink-0 grow-0 basis-[560px] pl-0"
                data-slide-index={idx}
                key={step.label}
                style={
                  itemTransform || isActive
                    ? {
                        transform: itemTransform,
                        zIndex: isActive ? 10 : undefined,
                      }
                    : undefined
                }
                // These styles are inline because the transform values for the carousel are computed at runtime based on carousel position, conditional z indexes based on active state would also require complex class logic.
              >
                <motion.div
                  animate={shouldAnimate ? { y: 0 } : { y: animConfig.startY }}
                  className="flex flex-col items-center gap-[28px] will-change-transform"
                  initial={{ y: animConfig.startY }}
                  transition={{
                    delay: animConfig.delay,
                    duration: DIAMOND_ANIMATION.DURATION,
                    ease: DIAMOND_ANIMATION.EASE,
                  }}
                >
                  <button
                    className="relative z-1 flex items-center justify-center"
                    data-idx={idx}
                    onClick={handleDiamondClick}
                    type="button"
                  >
                    {isActive ? (
                      <HCWhiteDiamond aria-hidden="true" className="h-[880px] w-[880px]" focusable="false" />
                    ) : (
                      <HCBlueDiamond
                        aria-hidden="true"
                        className={inactiveSize === 440 ? 'h-[440px] w-[440px]' : 'h-[640px] w-[640px]'}
                        focusable="false"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                      <span
                        className={
                          isActive
                            ? 'w-[340px] text-[61px] leading-[1.3] tracking-[-3px] text-[#14477d]'
                            : 'w-[300px] text-[43px] leading-[1.3] tracking-[-2.1px] text-[#ededed]'
                        }
                      >
                        {renderRegisteredMark(step.label)}
                      </span>
                      {isActive ? (
                        <div
                          aria-label="Open details"
                          className="absolute inset-0 flex cursor-pointer items-center justify-center pt-[490px] pr-[5px]"
                          data-idx={idx}
                          onClick={handlePlusClick}
                          onKeyDown={handlePlusClick}
                          role="button"
                          tabIndex={0}
                        >
                          <CirclePlus className="h-[80px] w-[80px] text-[#14477d]" />
                        </div>
                      ) : null}
                    </div>
                  </button>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="pointer-events-none absolute inset-x-0 bottom-[-290px] flex items-center justify-center gap-[48px]">
          <button
            aria-label="Previous"
            className="pointer-events-auto mr-[25px] flex h-[102px] w-[102px] items-center justify-center text-white transition-transform duration-150 hover:scale-110"
            onClick={handlePrev}
            type="button"
          >
            <ChevronLeft className="h-[102px] w-[102px]" />
          </button>
          <button
            aria-label="Next"
            className="pointer-events-auto ml-[25px] flex h-[102px] w-[102px] items-center justify-center text-white transition-transform duration-150 hover:scale-110"
            onClick={handleNext}
            type="button"
          >
            <ChevronRight className="h-[102px] w-[102px]" />
          </button>
        </div>
      </Carousel>
    </div>
  );
};

export default StepCarousel;
