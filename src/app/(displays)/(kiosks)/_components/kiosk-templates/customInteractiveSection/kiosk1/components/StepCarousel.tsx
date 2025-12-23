'use client';

import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
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
    <div className="absolute top-[1980px] left-0 w-full">
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
                <div className="flex flex-col items-center gap-[28px]">
                  <button
                    className="relative z-[1] flex items-center justify-center"
                    onClick={() => {
                      if (!emblaApi) return;
                      emblaApi.scrollTo(idx);
                    }}
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
                            ? 'text-[61px] leading-[1.3] tracking-[-3px] text-[#14477d]'
                            : 'text-[43px] leading-[1.3] tracking-[-2.1px] text-[#ededed]'
                        }
                        style={{ width: isActive ? '340px' : '300px' }}
                      >
                        {renderRegisteredMark(step.label)}
                      </span>
                      {isActive ? (
                        <div
                          aria-label="Open details"
                          className="absolute inset-0 flex cursor-pointer items-center justify-center"
                          onClick={event => {
                            event.stopPropagation();
                            onStepClick(idx);
                          }}
                          onKeyDown={event => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              event.stopPropagation();
                              onStepClick(idx);
                            }
                          }}
                          role="button"
                          style={{ paddingRight: '5px', paddingTop: '490px' }}
                          tabIndex={0}
                        >
                          <CirclePlus className="h-[80px] w-[80px] text-[#14477d]" />
                        </div>
                      ) : null}
                    </div>
                  </button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-[220px] flex items-center justify-center gap-[48px]"
          style={{ bottom: '-290px' }}
        >
          <button
            aria-label="Previous"
            className="pointer-events-auto flex h-[64px] w-[64px] items-center justify-center text-white transition-transform duration-150 hover:scale-110"
            onClick={handlePrev}
            style={{ height: '102px', marginRight: '25px', width: '102px' }}
            type="button"
          >
            <ChevronLeft className="h-[36px] w-[36px]" style={{ height: '102px', width: '102px' }} />
          </button>
          <button
            aria-label="Next"
            className="pointer-events-auto flex h-[64px] w-[64px] items-center justify-center text-white transition-transform duration-150 hover:scale-110"
            onClick={handleNext}
            style={{ height: '102px', marginLeft: '25px', width: '102px' }}
            type="button"
          >
            <ChevronRight className="h-[36px] w-[36px]" style={{ height: '102px', width: '102px' }} />
          </button>
        </div>
      </Carousel>
    </div>
  );
};

export default StepCarousel;
