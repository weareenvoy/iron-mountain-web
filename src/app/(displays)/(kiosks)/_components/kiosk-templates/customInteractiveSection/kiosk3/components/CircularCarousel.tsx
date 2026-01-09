'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export type CarouselSlide = {
  readonly bullets: string[];
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly id: string;
  readonly primaryImageAlt: string;
  readonly primaryImageSrc: string;
  readonly primaryVideoSrc?: string;
  readonly secondaryImageAlt: string;
  readonly secondaryImageSrc?: string;
  readonly sectionTitle: string;
};

type CircularCarouselProps = {
  readonly children: (props: { current: CarouselSlide; index: number; total: number }) => React.ReactNode;
  readonly slides: readonly CarouselSlide[];
};

const CircularCarousel = ({ children, slides }: CircularCarouselProps) => {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const currentIndex = total > 0 ? index % total : 0;
  const current = slides[currentIndex];

  const goNext = () => setIndex(i => (i + 1) % total);
  const goPrev = () => setIndex(i => (i - 1 + total) % total);

  if (!current) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      {children({ current, index, total })}

      {/* Circle carousel control */}
      <div className="absolute top-[1670px] right-[120px] z-[1] h-[520px] w-[520px]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#6dcff6]/70" />
          <div className="absolute inset-[18px] rounded-full border-[12px] border-transparent" />
          <div className="absolute inset-[44px] rounded-full border-[6px] border-transparent" />

          <div className="absolute inset-0 flex items-center justify-center text-[60px] leading-[1.4] font-semibold tracking-[-3px] text-white">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
          </div>
          <div className="absolute top-[28%] left-[95%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
          </div>
          <div className="absolute top-[73%] left-[94%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
          </div>
          <div className="absolute top-full left-[52%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
          </div>
          <div className="absolute top-[73%] left-[7%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
          </div>
          <div className="absolute top-[27%] left-[7%] -translate-x-1/2 -translate-y-1/2">
            <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
          </div>

          {/* Arrows */}
          <button
            aria-label="Previous slide"
            className="group absolute top-1/2 left-[100px] flex h-[102px] w-[102px] -translate-y-1/2 items-center justify-center transition hover:opacity-80 active:opacity-40 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]"
            onClick={goPrev}
            type="button"
          >
            <ChevronLeft className="h-[102px] w-[102px]" color="#6DCFF6" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Next slide"
            className="group absolute top-1/2 right-[70px] flex h-[102px] w-[102px] -translate-y-1/2 items-center justify-center transition hover:opacity-80 active:opacity-40 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]"
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
