'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Carousel, CarouselContent } from '@/components/shadcn/carousel';
import CarouselNavigation from './CarouselNavigation';
import DiamondCarouselItem from './DiamondCarouselItem';
import { useDiamondScaling } from '../hooks/useDiamondScaling';
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
 * Layout constants
 */
const LAYOUT = {
  DIAMOND_SIZE_EDGE: 440,
  DIAMOND_SIZE_MIDDLE: 640,
  INITIAL_CENTER_INDEX: 2,
} as const;

/**
 * Animation configuration for diamond transitions
 */
const DIAMOND_TRANSITION = {
  DURATION: 0.5,
  EASE: [0.3, 0, 0.4, 1] as const,
} as const;

/**
 * Distance from center to identify edge slides
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
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedIndexRef = useRef(selectedIndex);
  const isTransitioningRef = useRef(false);
  const totalSlides = steps.length;

  // Use diamond scaling hook for edge transforms
  const applyEdgeTransforms = useDiamondScaling(emblaApi, totalSlides);

  // Keep selectedIndexRef in sync
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Embla event listeners - update selectedIndex only on snap changes (not continuous scroll)
  useEffect(() => {
    if (!emblaApi) return undefined;
    const handleSelect = () => {
      const nextIndex = emblaApi.selectedScrollSnap();
      const prevIndex = selectedIndexRef.current;

      // Only update state if index actually changed
      if (nextIndex !== prevIndex) {
        setSelectedIndex(nextIndex);

        // Mark as transitioning when selection changes
        isTransitioningRef.current = true;

        // Clear any existing timeout
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }

        // Clear transition state after animation completes
        transitionTimeoutRef.current = setTimeout(
          () => {
            isTransitioningRef.current = false;
            transitionTimeoutRef.current = null;
          },
          DIAMOND_TRANSITION.DURATION * 1000 + 100
        );
      }
    };
    emblaApi.on('reInit', handleSelect);
    emblaApi.on('select', handleSelect);
    handleSelect(); // Initial call
    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleSelect);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [emblaApi]);

  // Initial alignment and transform application
  useEffect(() => {
    if (!emblaApi || totalSlides === 0 || hasAppliedInitialAlignment.current) return;
    const desiredIndex = Math.min(totalSlides - 1, LAYOUT.INITIAL_CENTER_INDEX);
    hasAppliedInitialAlignment.current = true;
    emblaApi.scrollTo(desiredIndex, true);

    // Apply edge transforms after scroll completes
    // Use RAF to ensure Embla has finished positioning
    requestAnimationFrame(() => {
      applyEdgeTransforms(desiredIndex);
    });
  }, [applyEdgeTransforms, emblaApi, totalSlides]);

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
      if (idx === selectedIndexRef.current && !isTransitioningRef.current) {
        onStepClick(idx);
      } else if (idx !== selectedIndexRef.current) {
        // Otherwise, navigate to this diamond
        if (!emblaApi) {
          return;
        }
        emblaApi.scrollTo(idx);
      }
    },
    [emblaApi, onStepClick]
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
        className="w-full overflow-visible [&_.embla__container]:overflow-visible [&_.embla__viewport]:overflow-visible [&>div]:overflow-visible"
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

            return (
              <DiamondCarouselItem
                idx={idx}
                inactiveSize={inactiveSize}
                isActive={isActive}
                isLeftEdge={isLeftEdge}
                isMiddle={isMiddle}
                isOuter={isOuter}
                isRightEdge={isRightEdge}
                key={`${idx}-${step.label}`}
                onClick={handleDiamondClickOrOpen}
                onPointerCancel={() => setPressedIndex(null)}
                onPointerDown={() => isActive && setPressedIndex(idx)}
                onPointerLeave={() => setPressedIndex(null)}
                onPointerUp={() => setPressedIndex(null)}
                pressedIndex={pressedIndex}
                shouldAnimate={shouldAnimate}
                step={step}
              />
            );
          })}
        </CarouselContent>
        <CarouselNavigation onNext={handleNext} onPrev={handlePrev} />
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
