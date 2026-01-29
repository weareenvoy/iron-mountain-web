'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useKioskAudio } from '@/app/(displays)/(kiosks)/_components/providers/useKioskAudio';
import { useSfx } from '@/components/providers/audio-provider';
import { ANIMATION_DURATION_MS, type SlideId } from '../constants';

export type CarouselSlide = {
  readonly bullets: readonly string[];
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly id: SlideId;
  readonly primaryImageAlt: string;
  readonly primaryImageSrc: string;
  readonly primaryVideoSrc?: string;
  readonly secondaryImageAlt: string;
  readonly secondaryImageSrc?: string;
  readonly sectionTitle: string;
};

type CircularCarouselProps = {
  readonly children: (props: {
    current: CarouselSlide;
    index: number;
    isExiting: boolean;
    total: number;
  }) => React.ReactNode;
  readonly onIndexChange?: (index: number) => void;
  readonly onIsExitingChange?: (isExiting: boolean) => void;
  /**
   * Array of carousel slides to display.
   * IMPORTANT: This prop must be stable (memoized) to prevent unnecessary re-renders
   * and callback recreations. Use useMemo() in the parent component.
   */
  readonly slides: readonly CarouselSlide[];
};

/**
 * Error fallback component for carousel configuration issues
 */
const CarouselConfigError = ({ slideCount }: { readonly slideCount: number }) => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="max-w-[800px] rounded-lg bg-red-900/20 p-8 text-center">
      <h3 className="mb-4 text-[48px] font-semibold text-red-400">Configuration Error</h3>
      <p className="mb-2 text-[32px] text-white">
        Expected exactly 6 slides for circular carousel layout, but received {slideCount}.
      </p>
      <p className="text-[24px] text-white/70">Please check CMS content configuration.</p>
    </div>
  </div>
);

const CircularCarousel = ({ children, onIndexChange, onIsExitingChange, slides }: CircularCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const { sfx } = useKioskAudio();
  const { playSfx } = useSfx();
  const total = slides.length;
  const currentIndex = total > 0 ? index % total : 0;
  const current = slides[currentIndex];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    onIsExitingChange?.(isExiting);
  }, [isExiting, onIsExitingChange]);

  const goNext = useCallback(() => {
    // Prevent rapid clicks during transition
    if (isTransitioning) return;

    if (sfx.next) {
      playSfx(sfx.next);
    }
    setIsTransitioning(true);
    setIsExiting(true);

    // Capture slides.length in closure to prevent race condition if slides change during animation
    const slideCount = slides.length;
    timeoutRef.current = window.setTimeout(() => {
      setIndex(i => (i + 1) % slideCount);
      setIsExiting(false);
      setIsTransitioning(false);
    }, ANIMATION_DURATION_MS.CAROUSEL);
  }, [isTransitioning, playSfx, sfx.next, slides.length]);

  const goPrev = useCallback(() => {
    // Prevent rapid clicks during transition
    if (isTransitioning) return;

    if (sfx.back) {
      playSfx(sfx.back);
    }
    setIsTransitioning(true);
    setIsExiting(true);

    // Capture slides.length in closure to prevent race condition if slides change during animation
    const slideCount = slides.length;
    timeoutRef.current = window.setTimeout(() => {
      setIndex(i => (i - 1 + slideCount) % slideCount);
      setIsExiting(false);
      setIsTransitioning(false);
    }, ANIMATION_DURATION_MS.CAROUSEL);
  }, [isTransitioning, playSfx, sfx.back, slides.length]);

  // Enforce 6-slide contract - UI is designed for exactly 6 dots in specific positions
  // NOTE: Positions are hardcoded for 6-slide circular layout.
  // Each dot is positioned at specific coordinates around the circle for the design.
  // If you need dynamic dot counts, refactor to calculate positions programmatically.
  // Validation after hooks to comply with Rules of Hooks
  if (slides.length !== 6) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        '[CircularCarousel] Expected exactly 6 slides for circular dot layout, got',
        slides.length,
        '. Fix CMS data or update carousel UI to support dynamic slide counts.'
      );
    }
    return <CarouselConfigError slideCount={slides.length} />;
  }

  if (!current) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      {children({ current, index, isExiting, total })}

      {/* Circle carousel control */}
      <div className="absolute top-[1670px] right-[120px] z-1 h-[520px] w-[520px]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full border-8 border-[#6dcff6]/20" />
          <div className="absolute inset-[18px] rounded-full border-12 border-transparent" />
          <div className="absolute inset-[44px] rounded-full border-[6px] border-transparent" />

          <div className="absolute inset-0 flex items-center justify-center text-[60px] leading-[1.4] font-semibold tracking-[-3px] text-white">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Dots - Progressive opacity based on current slide */}
          {/* Dot 1 - Top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ opacity: currentIndex >= 0 ? 1 : 0.2 }}
              className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]"
              initial={{ opacity: 0.2 }}
              transition={{ duration: currentIndex >= 0 ? 0.06 : 0.03, ease: [0.3, 0, 0.6, 1] }}
            />
          </div>
          {/* Dot 2 - Top Right */}
          <div className="absolute top-[28%] left-[95%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ opacity: currentIndex >= 1 ? 1 : 0.2 }}
              className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]"
              initial={{ opacity: 0.2 }}
              transition={{ duration: currentIndex >= 1 ? 0.06 : 0.03, ease: [0.3, 0, 0.6, 1] }}
            />
          </div>
          {/* Dot 3 - Bottom Right */}
          <div className="absolute top-[73%] left-[94%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ opacity: currentIndex >= 2 ? 1 : 0.2 }}
              className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]"
              initial={{ opacity: 0.2 }}
              transition={{ duration: currentIndex >= 2 ? 0.06 : 0.03, ease: [0.3, 0, 0.6, 1] }}
            />
          </div>
          {/* Dot 4 - Bottom */}
          <div className="absolute top-full left-[52%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ opacity: currentIndex >= 3 ? 1 : 0.2 }}
              className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]"
              initial={{ opacity: 0.2 }}
              transition={{ duration: currentIndex >= 3 ? 0.06 : 0.03, ease: [0.3, 0, 0.6, 1] }}
            />
          </div>
          {/* Dot 5 - Bottom Left */}
          <div className="absolute top-[73%] left-[7%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ opacity: currentIndex >= 4 ? 1 : 0.2 }}
              className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]"
              initial={{ opacity: 0.2 }}
              transition={{ duration: currentIndex >= 4 ? 0.06 : 0.03, ease: [0.3, 0, 0.6, 1] }}
            />
          </div>
          {/* Dot 6 - Top Left */}
          <div className="absolute top-[27%] left-[7%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ opacity: currentIndex >= 5 ? 1 : 0.2 }}
              className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]"
              initial={{ opacity: 0.2 }}
              transition={{ duration: currentIndex >= 5 ? 0.06 : 0.03, ease: [0.3, 0, 0.6, 1] }}
            />
          </div>

          {/* Arrows */}
          <button
            aria-label="Previous slide"
            className="group absolute top-1/2 left-[100px] flex h-[102px] w-[102px] -translate-y-1/2 items-center justify-center transition hover:opacity-80 active:opacity-40 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)] disabled:cursor-not-allowed disabled:opacity-30"
            disabled={isTransitioning}
            onClick={goPrev}
            type="button"
          >
            <ChevronLeft className="h-[102px] w-[102px]" color="#6DCFF6" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Next slide"
            className="group absolute top-1/2 right-[70px] flex h-[102px] w-[102px] -translate-y-1/2 items-center justify-center transition hover:opacity-80 active:opacity-40 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)] disabled:cursor-not-allowed disabled:opacity-30"
            disabled={isTransitioning}
            onClick={goNext}
            type="button"
          >
            <ChevronRight className="h-[102px] w-[102px]" color="#6DCFF6" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircularCarousel;
