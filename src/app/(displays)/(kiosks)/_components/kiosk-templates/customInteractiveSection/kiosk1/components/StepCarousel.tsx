'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCWhiteDiamond';
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

const StepCarousel = ({ onStepClick, steps }: StepCarouselProps) => {
  const [emblaApi, setEmblaApi] = useState<EmblaApi | undefined>(undefined);
  const hasAppliedInitialAlignment = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const totalSlides = steps.length;

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
          delta = slideCenter < rootCenter ? -2 : 2;
        }

        if (delta > half) {
          delta -= totalSlides;
        }
        if (delta < -half) {
          delta += totalSlides;
        }

        const transform =
          delta === -2 ? 'translate3d(240px, 0px, 0px)' : delta === 2 ? 'translate3d(-240px, 0px, 0px)' : '';
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
    const desiredIndex = Math.min(totalSlides - 1, 2);
    hasAppliedInitialAlignment.current = true;
    emblaApi.scrollTo(desiredIndex, true);
  }, [applyEdgeTransforms, emblaApi, totalSlides]);

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

  return (
    <div className="absolute top-[1750px] left-[1080px] w-full max-w-[2200px] -translate-x-1/2">
      <Carousel
        className="w-full"
        opts={{
          align: 'center',
          containScroll: false,
          dragFree: false,
          loop: true,
          slidesToScroll: 1,
          startIndex: 2,
        }}
        setApi={setEmblaApi}
      >
        <CarouselContent className="flex items-center gap-[60px] px-0">
          {steps.map((step, idx) => {
            const isActive = idx === selectedIndex;
            const leftIndex = (selectedIndex - 2 + totalSlides) % totalSlides;
            const rightIndex = (selectedIndex + 2) % totalSlides;
            const isLeftEdge = idx === leftIndex;
            const isRightEdge = idx === rightIndex;
            const inactiveSize = isLeftEdge || isRightEdge ? 440 : 640;
            const itemTransform = isLeftEdge
              ? 'translate3d(240px, 0px, 0px)'
              : isRightEdge
                ? 'translate3d(-240px, 0px, 0px)'
                : undefined;
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
              >
                <div className="relative flex h-[620px] w-[560px] items-center justify-center">
                  <div
                    className="relative cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    onClick={() => onStepClick(idx)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') onStepClick(idx);
                    }}
                    role="button"
                    style={{
                      height: isActive ? '620px' : `${inactiveSize}px`,
                      width: isActive ? '560px' : `${inactiveSize}px`,
                    }}
                    tabIndex={0}
                  >
                    {isActive ? (
                      <HCBlueDiamond aria-hidden className="h-full w-full" focusable="false" />
                    ) : (
                      <HCWhiteDiamond aria-hidden className="h-full w-full" focusable="false" />
                    )}
                    <div
                      className="absolute top-1/2 left-1/2 flex h-[160px] w-[160px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                    >
                      <CirclePlus aria-hidden className="h-[80px] w-[80px] text-[#14477d]" strokeWidth={2.4} />
                    </div>
                    <span
                      className="absolute bottom-[60px] left-1/2 w-[80%] -translate-x-1/2 text-center text-[48px] leading-[1.3] font-normal tracking-[-2.4px] text-[#14477d]"
                      style={{ fontSize: isActive ? '48px' : '38px' }}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <div className="absolute top-1/2 left-[-240px] -translate-y-1/2">
        <button
          aria-label="Previous step"
          className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition hover:bg-white/20"
          onClick={handlePrev}
          type="button"
        >
          <ChevronLeft aria-hidden className="h-[80px] w-[80px] text-white" strokeWidth={2.5} />
        </button>
      </div>

      <div className="absolute top-1/2 right-[-550px] -translate-y-1/2">
        <button
          aria-label="Next step"
          className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition hover:bg-white/20"
          onClick={handleNext}
          type="button"
        >
          <ChevronRight aria-hidden className="h-[80px] w-[80px] text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default StepCarousel;

