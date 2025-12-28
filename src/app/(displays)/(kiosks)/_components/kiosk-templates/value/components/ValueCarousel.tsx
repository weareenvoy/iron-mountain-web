'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useEffect } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import DiamondStack, { type DiamondStackVariant } from '../DiamondStack';
import type { ValueCarouselSlide, ValueDiamondCard } from '@/app/(displays)/(kiosks)/_types/value-types';

type ValueCarouselProps = {
  readonly hasCarouselSlides?: boolean;
  readonly onRegisterCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly slides: readonly ValueCarouselSlide[];
};

const ValueCarousel = ({ hasCarouselSlides, onRegisterCarouselHandlers, slides }: ValueCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });

  const getBulletItems = (slide: ValueCarouselSlide) =>
    slide.bullets?.filter(entry => entry && entry.trim().length > 0) ?? [];

  useEffect(() => {
    if (emblaApi && onRegisterCarouselHandlers) {
      onRegisterCarouselHandlers({
        canScrollNext: () => emblaApi.canScrollNext(),
        canScrollPrev: () => emblaApi.canScrollPrev(),
        scrollNext: () => emblaApi.scrollNext(),
        scrollPrev: () => emblaApi.scrollPrev(),
      });
    }
  }, [emblaApi, onRegisterCarouselHandlers]);

  return (
    <div
      className={cn('flex flex-col items-end gap-[80px]', hasCarouselSlides && 'relative left-[-330px] self-baseline')}
    >
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex w-full">
          {slides.map(slide => {
            const cards: readonly ValueDiamondCard[] = slide.diamondCards ?? [];
            const bulletItems = getBulletItems(slide);
            const hasBullets = bulletItems.length > 0;
            const stackVariant: DiamondStackVariant = hasBullets ? 'carousel' : 'overview';
            return (
              <div className="flex min-h-[1600px] w-full min-w-full flex-row gap-[53px] pr-[80px]" key={slide.id}>
                <div className="flex w-[920px] flex-col items-center gap-[71px]">
                  <DiamondStack cards={cards} variant={stackVariant} />
                </div>
                {hasBullets ? (
                  <ul className="flex-1 text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#8a0d71]">
                    {bulletItems.map((bullet, idx) => (
                      <li
                        className="relative mb-[80px] w-[840px] pl-[40px] last:mb-0"
                        key={`${slide.id}-bullet-${idx}`}
                      >
                        <span className="absolute top-[30px] left-0 size-[16px] -translate-y-1/2 rounded-full bg-[#8a0d71]" />
                        <span>{renderRegisteredMark(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ValueCarousel;
