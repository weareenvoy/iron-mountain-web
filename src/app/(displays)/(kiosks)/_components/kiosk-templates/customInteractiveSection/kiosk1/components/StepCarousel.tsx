'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCWhiteDiamond';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

/**
 * Step configuration for carousel items
 * @property label - Display text shown inside the diamond
 * @property modal - Optional modal content displayed when step is clicked
 * @property modal.heading - Modal title (defaults to step label if not provided)
 * @property modal.body - Modal description text
 * @property modal.imageSrc - Optional image path for modal illustration
 * @property modal.imageAlt - Alt text for modal image
 */
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

/**
 * Layout constants derived from Figma designs
 * @see https://www.figma.com/design/o8KgGrIbWc0tdC32VpZ8gO/-i--Iron-Mountain-EIC-Production?node-id=5893-7489&m=dev (Custom Interactive Section)
 */
const LAYOUT = {
  /** Size of active diamond in center */
  DIAMOND_SIZE_ACTIVE: 880,
  /** Size of diamonds at left/right edges (±2 from center) */
  DIAMOND_SIZE_EDGE: 440,
  /** Size of diamonds adjacent to center (±1 from center) */
  DIAMOND_SIZE_MIDDLE: 640,
  /** Offset to push edge diamonds toward center for overlap effect */
  EDGE_TRANSFORM_X: 240,
  /** Starting carousel index (0-based) */
  INITIAL_CENTER_INDEX: 2,
} as const;

/**
 * Animation configuration for staggered diamond entrance
 * Diamonds animate from high Y positions (off-screen above) to their natural positions
 */
const DIAMOND_ANIMATION = {
  /** Center diamond: minimal movement, shortest delay */
  CENTER: { delay: 0.3, startY: -120 },
  /** Animation duration for all diamonds */
  DURATION: 0.8,
  /** Cubic bezier easing (30 out 60 in) */
  EASE: [0.3, 0, 0.4, 1] as const,
  /** Middle pair (±1): medium starting Y, medium delay */
  MIDDLE: { delay: 0.15, startY: -350 },
  /** Outermost diamonds (±2): highest starting Y, longest delay */
  OUTER: { delay: 0, startY: -550 },
} as const;

/**
 * Animation configuration for diamond color/size transitions (active/inactive)
 */
const DIAMOND_TRANSITION = {
  /** Duration for diamond size/color/opacity transitions */
  DURATION: 0.5,
  /** Cubic bezier easing (30 out 60 in) */
  EASE: [0.3, 0, 0.4, 1] as const,
  /** Duration for pressed state color change */
  PRESS_DURATION: 0.2,
} as const;

/**
 * Diamond color palette
 */
const DIAMOND_COLORS = {
  /** Active state (when pressed/clicked) */
  ACTIVE_PRESSED: '#78d5f7',
  /** Inactive state */
  INACTIVE: '#EDEDED',
  /** Active text color */
  TEXT_ACTIVE: '#14477d',
  /** Inactive text color */
  TEXT_INACTIVE: '#ededed',
} as const;

/**
 * Font size configuration for diamond labels
 * Using scale transform instead of fontSize for better performance
 */
const LABEL_SCALE = {
  ACTIVE: 1, // 61px equivalent (base font is 61px)
  INACTIVE: 0.7049, // 43px equivalent (43/61 ≈ 0.7049)
} as const;

/**
 * Distance from center to identify edge slides
 * With 5 total items, edge offset of 2 catches items at ±2 positions
 */
const EDGE_OFFSET = 2;

/**
 * StepCarousel - Horizontally scrolling carousel of diamond-shaped steps
 * Features staggered entrance animations, size/color transitions, and modal integration
 */
const StepCarousel = ({ onStepClick, steps }: StepCarouselProps) => {
  const [emblaApi, setEmblaApi] = useState<EmblaApi | undefined>(undefined);
  const hasAppliedInitialAlignment = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(() => Math.min(steps.length - 1, LAYOUT.INITIAL_CENTER_INDEX));
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<null | number>(null);
  const [transitioningIndex, setTransitioningIndex] = useState<null | number>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesCacheRef = useRef<HTMLElement[]>([]);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = steps.length;

  /**
   * Applies transform to edge diamonds to create overlap effect
   * Cached slide references for performance
   * Improved error logging with context
   */
  const applyEdgeTransforms = useCallback(
    (currentIndex: number) => {
      if (!emblaApi?.rootNode || totalSlides === 0) {
        return;
      }

      const root = emblaApi.rootNode();

      // Use cached slides or refresh cache if needed
      if (slidesCacheRef.current.length === 0) {
        slidesCacheRef.current = Array.from(root.querySelectorAll<HTMLElement>('[data-slide-index], .embla__slide'));
      }

      const slides = slidesCacheRef.current;
      const half = Math.floor(totalSlides / 2);
      const rootRect = root.getBoundingClientRect();
      const rootCenter = rootRect.left + rootRect.width / 2;

      let activeSlide: HTMLElement | null = null;
      let activeDistance = Number.POSITIVE_INFINITY;

      // Find the active slide closest to center
      slides.forEach((slide: HTMLElement) => {
        const indexAttr =
          slide.dataset.slideIndex ??
          slide.getAttribute('data-embla-slide-index') ??
          slide.getAttribute('data-embla-index');
        const rawIndex = Number(indexAttr);
        if (Number.isNaN(rawIndex)) {
          return;
        }
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

      // Apply transforms to push edge diamonds toward center
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
            ? `translate3d(${LAYOUT.EDGE_TRANSFORM_X}px, 0px, 0px)`
            : delta === EDGE_OFFSET
              ? `translate3d(-${LAYOUT.EDGE_TRANSFORM_X}px, 0px, 0px)`
              : null;
        slide.style.transform = transform ?? '';
      });
    },
    [emblaApi, totalSlides]
  );

  // Embla event listeners
  useEffect(() => {
    if (!emblaApi) return undefined;
    const handleSelect = () => {
      const nextIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(nextIndex);
      // Don't call applyEdgeTransforms synchronously - RAF effect handles it
    };
    emblaApi.on('reInit', () => {
      // Refresh cache on reInit
      slidesCacheRef.current = [];
      handleSelect();
    });
    emblaApi.on('scroll', handleSelect);
    emblaApi.on('select', handleSelect);
    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleSelect);
      emblaApi.off('scroll', handleSelect);
    };
  }, [emblaApi]);

  // Remove duplicate synchronous call, keep only RAF version
  useEffect(() => {
    if (!emblaApi) return undefined;
    const frame = requestAnimationFrame(() => {
      applyEdgeTransforms(selectedIndex);
    });
    return () => cancelAnimationFrame(frame);
  }, [applyEdgeTransforms, emblaApi, selectedIndex]);

  // Initial alignment
  useEffect(() => {
    if (!emblaApi || totalSlides === 0 || hasAppliedInitialAlignment.current) return;
    const desiredIndex = Math.min(totalSlides - 1, LAYOUT.INITIAL_CENTER_INDEX);
    hasAppliedInitialAlignment.current = true;
    emblaApi.scrollTo(desiredIndex, true);
  }, [emblaApi, totalSlides]);

  /**
   * Clear timeout when selectedIndex changes or on unmount
   * Timeout fallback prevents stuck transitions if animation is interrupted
   */
  useEffect(() => {
    // Cleanup on unmount or index change
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [selectedIndex]);

  /**
   * Detect when carousel becomes visible to trigger animations
   * Properly handles unmount/remount cycles with mounted flag to prevent memory leaks
   * Threshold of 0.3 ensures animation starts when carousel is reasonably visible
   * (approximately 1/3 of viewport height for 1080p displays)
   */
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    let isMounted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isMounted) return;
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

    observer.observe(currentContainer);

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  // Cleanup: Destroy Embla instance on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      emblaApi?.destroy();
      slidesCacheRef.current = []; // Clear cache on unmount
    };
  }, [emblaApi]);

  const handlePrev = useCallback(() => {
    if (!emblaApi || totalSlides === 0) return;
    const target = (selectedIndex - 1 + totalSlides) % totalSlides;
    emblaApi.scrollTo(target);
  }, [emblaApi, selectedIndex, totalSlides]);

  const handleNext = useCallback(() => {
    if (!emblaApi || totalSlides === 0) return;
    const target = (selectedIndex + 1) % totalSlides;
    emblaApi.scrollTo(target);
  }, [emblaApi, selectedIndex, totalSlides]);

  /**
   * Handle diamond click - navigates to inactive diamonds, opens modal for active
   */
  const handleDiamondClickOrOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const idx = Number(event.currentTarget.dataset.idx);
      if (Number.isNaN(idx)) {
        return;
      }

      // If this is the active diamond, open the modal (if not transitioning)
      if (idx === selectedIndex) {
        if (transitioningIndex !== null) {
          return;
        }
        onStepClick(idx);
      } else {
        // Otherwise, navigate to this diamond
        if (!emblaApi) {
          return;
        }
        emblaApi.scrollTo(idx);
      }
    },
    [emblaApi, onStepClick, selectedIndex, transitioningIndex]
  );

  // Early return for empty steps (after all hooks)
  if (steps.length === 0) {
    return (
      <div className="absolute top-[1980px] left-0 flex w-full items-center justify-center">
        <p className="text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#ededed]">No steps available</p>
      </div>
    );
  }

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
          startIndex: Math.min(steps.length - 1, LAYOUT.INITIAL_CENTER_INDEX),
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
            const inactiveSize = isLeftEdge || isRightEdge ? LAYOUT.DIAMOND_SIZE_EDGE : LAYOUT.DIAMOND_SIZE_MIDDLE;

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
                className={cn(
                  'shrink-0 grow-0 basis-[560px] pl-0',
                  isLeftEdge && 'translate-x-[240px]',
                  isRightEdge && '-translate-x-[240px]',
                  isActive && 'z-10'
                )}
                data-slide-index={idx}
                key={step.label}
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
                  <div className="relative flex h-[880px] w-[880px] items-center justify-center">
                    <button
                      aria-label={isActive ? 'Open details' : `Select ${step.label}`}
                      className="relative z-[1] flex cursor-pointer items-center justify-center"
                      data-idx={idx}
                      onClick={handleDiamondClickOrOpen}
                      onPointerCancel={() => setPressedIndex(null)}
                      onPointerDown={() => isActive && setPressedIndex(idx)}
                      onPointerLeave={() => setPressedIndex(null)}
                      onPointerUp={() => setPressedIndex(null)}
                      type="button"
                    >
                      {/* Fixed outer container prevents layout shift, inner container animates size */}
                      <div className="flex h-[880px] w-[880px] items-center justify-center">
                        <motion.div
                          animate={{
                            height: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                            width: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                          }}
                          className="relative flex items-center justify-center"
                          initial={{
                            height: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                            width: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                          }}
                          onAnimationComplete={() => {
                            setTransitioningIndex(null);
                            if (transitionTimeoutRef.current) {
                              clearTimeout(transitionTimeoutRef.current);
                              transitionTimeoutRef.current = null;
                            }
                          }}
                          onAnimationStart={() => {
                            setTransitioningIndex(idx);
                            // Fallback timeout to clear transition state if animation never completes
                            if (transitionTimeoutRef.current) {
                              clearTimeout(transitionTimeoutRef.current);
                            }
                            transitionTimeoutRef.current = setTimeout(
                              () => {
                                setTransitioningIndex(null);
                                transitionTimeoutRef.current = null;
                              },
                              DIAMOND_TRANSITION.DURATION * 1000 + 100
                            ); // Add 100ms buffer
                          }}
                          transition={{
                            duration: DIAMOND_TRANSITION.DURATION,
                            ease: DIAMOND_TRANSITION.EASE,
                          }}
                        >
                          {/* Use HCWhiteDiamond component instead of inline SVG */}
                          {/* White Diamond (Active) - cross-fades in when active, color changes when pressed */}
                          <motion.div
                            animate={{ opacity: isActive ? 1 : 0 }}
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: isActive ? 1 : 0 }}
                            transition={{
                              duration: DIAMOND_TRANSITION.DURATION,
                              ease: DIAMOND_TRANSITION.EASE,
                            }}
                          >
                            <HCWhiteDiamond
                              aria-hidden="true"
                              className="h-full w-full"
                              fill={pressedIndex === idx ? DIAMOND_COLORS.ACTIVE_PRESSED : DIAMOND_COLORS.INACTIVE}
                              focusable="false"
                            />
                          </motion.div>
                          {/* Blue Diamond (Inactive) - cross-fades in when inactive */}
                          <motion.div
                            animate={{ opacity: isActive ? 0 : 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: isActive ? 0 : 1 }}
                            transition={{
                              duration: DIAMOND_TRANSITION.DURATION,
                              ease: DIAMOND_TRANSITION.EASE,
                            }}
                          >
                            <HCBlueDiamond aria-hidden="true" className="h-full w-full" focusable="false" />
                          </motion.div>
                        </motion.div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                        {/* Use scale transform instead of fontSize animation. origin-center controls the scale animation anchor point for diamond labels */}
                        <motion.span
                          animate={{
                            color: isActive ? DIAMOND_COLORS.TEXT_ACTIVE : DIAMOND_COLORS.TEXT_INACTIVE,
                            scale: isActive ? LABEL_SCALE.ACTIVE : LABEL_SCALE.INACTIVE,
                          }}
                          className={
                            isActive
                              ? 'w-[340px] origin-center text-[61px] leading-[1.3] tracking-[-3px]'
                              : 'w-[300px] origin-center text-[61px] leading-[1.3] tracking-[-2.1px]'
                          }
                          transition={{
                            duration: DIAMOND_TRANSITION.DURATION,
                            ease: DIAMOND_TRANSITION.EASE,
                          }}
                        >
                          {renderRegisteredMark(step.label)}
                        </motion.span>
                      </div>
                    </button>
                  </div>
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

/**
 * Memoized to prevent unnecessary re-renders when parent state changes
 * Only re-renders when steps or onStepClick change
 * Exported as named export for better tree-shaking
 */
const MemoizedStepCarousel = memo(StepCarousel);
export { MemoizedStepCarousel as StepCarousel };
