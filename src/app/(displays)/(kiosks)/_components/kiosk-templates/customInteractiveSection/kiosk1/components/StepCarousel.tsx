'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import CarouselNavigation from './CarouselNavigation';
import DiamondCarouselItem from './DiamondCarouselItem';

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
  EASE: [0.3, 0, 0.6, 1] as const,
} as const;

/**
 * StepCarousel - Horizontally scrolling carousel of diamond-shaped steps
 * Features staggered entrance animations, size/color transitions, and modal integration
 */
const StepCarousel = ({ onStepClick, steps }: StepCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(() => Math.min(steps.length - 1, LAYOUT.INITIAL_CENTER_INDEX));
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<null | number>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedIndexRef = useRef(selectedIndex);
  const isTransitioningRef = useRef(false);
  const totalSlides = steps.length;

  // Keep selectedIndexRef in sync
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // Track transition state when selectedIndex changes
  useEffect(() => {
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

  const handlePrev = useCallback(() => {
    if (totalSlides === 0) return;
    setSelectedIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    if (totalSlides === 0) return;
    setSelectedIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

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
        setSelectedIndex(idx);
      }
    },
    [onStepClick]
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
      <div className="relative flex w-full items-center justify-center">
        <div className="relative flex h-[800px] w-full items-center justify-center">
          {steps.map((step, idx) => {
            // Calculate circular position relative to selected index
            let relativePos = idx - selectedIndex;
            
            // Wrap around: normalize to range -2 to +2
            if (relativePos > 2) relativePos -= totalSlides;
            if (relativePos < -2) relativePos += totalSlides;
            
            const isActive = relativePos === 0;
            const isLeftEdge = relativePos === -2;
            const isRightEdge = relativePos === 2;
            const isMiddle = relativePos === -1 || relativePos === 1;
            const inactiveSize = isLeftEdge || isRightEdge ? LAYOUT.DIAMOND_SIZE_EDGE : LAYOUT.DIAMOND_SIZE_MIDDLE;
            const isOuter = isLeftEdge || isRightEdge;
            
            // Calculate horizontal offset based on position
            const getOffset = () => {
              switch (relativePos) {
                case -2: return -1000;
                case -1: return -600;
                case 0: return 0;
                case 1: return 600;
                case 2: return 1000;
                default: return 0;
              }
            };

            return (
              <div
                key={`${idx}-${step.label}`}
                className="absolute left-1/2"
                style={{
                  opacity: relativePos >= -2 && relativePos <= 2 ? 1 : 0,
                  pointerEvents: relativePos >= -2 && relativePos <= 2 ? 'auto' : 'none',
                  transform: `translateX(calc(-50% + ${getOffset()}px))`,
                  transition: 'transform 0.5s cubic-bezier(0.3, 0, 0.6, 1), opacity 0.5s cubic-bezier(0.3, 0, 0.6, 1)',
                  zIndex: isActive ? 10 : isOuter ? 5 : 1,
                }}
              >
                <DiamondCarouselItem
                  idx={idx}
                  inactiveSize={inactiveSize}
                  isActive={isActive}
                  isLeftEdge={isLeftEdge}
                  isMiddle={isMiddle}
                  isOuter={isOuter}
                  isRightEdge={isRightEdge}
                  onClick={handleDiamondClickOrOpen}
                  onPointerCancel={() => setPressedIndex(null)}
                  onPointerDown={() => isActive && setPressedIndex(idx)}
                  onPointerLeave={() => setPressedIndex(null)}
                  onPointerUp={() => setPressedIndex(null)}
                  pressedIndex={pressedIndex}
                  shouldAnimate={shouldAnimate}
                  step={step}
                />
              </div>
            );
          })}
        </div>
        <CarouselNavigation onNext={handleNext} onPrev={handlePrev} />
      </div>
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
