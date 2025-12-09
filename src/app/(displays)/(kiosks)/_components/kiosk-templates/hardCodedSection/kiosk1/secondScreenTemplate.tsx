'use client';

import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shadcn/carousel';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCWhiteDiamond';
import { ArrowLeft, ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

type Step = {
  label: string;
};

type EmblaApi = {
  off: (...args: unknown[]) => void;
  on: (...args: unknown[]) => void;
  rootNode?: () => HTMLElement;
  selectedScrollSnap: () => number;
  scrollNext?: () => void;
  scrollPrev?: () => void;
  canScrollNext?: () => boolean;
  canScrollPrev?: () => boolean;
  scrollTo?: (index: number, jump?: boolean) => void;
};

export type HardCodedKiosk1SecondScreenTemplateProps = Readonly<{
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  eyebrow?: string | string[];
  headline?: string | string[];
  onBack?: () => void;
  steps?: readonly Step[];
}>;

const defaultSteps: readonly Step[] = [
  { label: 'Intake and assessment' },
  { label: 'Digitization and remediation' },
  { label: 'Digital preservation' },
  { label: 'Search and discover' },
  { label: 'Share, stream and monetize' },
];

const gradientDefaults = {
  backgroundEndColor: '#0a2f5c',
  backgroundStartColor: '#1b75bc',
};

const textDefaults = {
  eyebrow: ['Rich media &', 'cultural heritage'],
  headline: ['From archive', 'to access'],
};

const normalizeText = (value?: string | string[]) => (Array.isArray(value) ? value.join('\n') : value);

export default function HardCodedKiosk1SecondScreenTemplate({
  backgroundEndColor = gradientDefaults.backgroundEndColor,
  backgroundStartColor = gradientDefaults.backgroundStartColor,
  eyebrow = textDefaults.eyebrow,
  headline = textDefaults.headline,
  onBack,
  steps = defaultSteps,
}: HardCodedKiosk1SecondScreenTemplateProps) {
  const eyebrowText = normalizeText(eyebrow);
  const headlineText = normalizeText(headline);
  const normalizedSteps = steps && steps.length > 0 ? steps : defaultSteps;

  const [emblaApi, setEmblaApi] = useState<EmblaApi>();
  const [selectedIndex, setSelectedIndex] = useState(2);
  const totalSlides = normalizedSteps.length;

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

      slides.forEach((slide) => {
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

      slides.forEach((slide) => {
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
          delta === -2
            ? 'translate3d(240px, 0px, 0px)'
            : delta === 2
              ? 'translate3d(-240px, 0px, 0px)'
              : '';
        slide.style.transform = transform;
      });
    },
    [emblaApi, totalSlides],
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
    handleSelect();
    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleSelect);
      emblaApi.off('scroll', handleSelect);
    };
  }, [applyEdgeTransforms, emblaApi]);

  useEffect(() => {
    applyEdgeTransforms(selectedIndex);
  }, [applyEdgeTransforms, selectedIndex]);

  const handlePrev = () => {
    if (!emblaApi || totalSlides === 0) return;
    const target = (selectedIndex - 1 + totalSlides) % totalSlides;
    emblaApi.scrollTo?.(target);
  };

  const handleNext = () => {
    if (!emblaApi || totalSlides === 0) return;
    const target = (selectedIndex + 1) % totalSlides;
    emblaApi.scrollTo?.(target);
  };


  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="hardcoded-k1-second">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
        }}
      />

      <div className="absolute left-[120px] top-[120px] text-[42px] font-normal leading-[1.4] tracking-[-2.1px] text-[#ededed]">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute left-[120px] top-[280px] w-[720px] text-[78px] font-normal leading-[1.2] tracking-[-3.9px] text-[#ededed]">
        {renderRegisteredMark(headlineText)}
      </div>

      <p className="absolute left-[120px] top-[520px] w-[620px] text-[40px] font-normal leading-[1.3] tracking-[-2px] text-[#ededed]/90">
        {renderRegisteredMark('Explore each section to learn how Iron Mountain can transform your enterprise')}
      </p>

      <button
        className="absolute right-[200px] top-[440px] flex h-[120px] items-center gap-[12px] rounded-full bg-white px-[40px] text-[40px] font-normal leading-[1.2] tracking-[-2px] text-[#14477d] shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-[1.02]"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="h-[36px] w-[36px]" />
        Back
      </button>

      <div className="absolute left-1/2 w-full max-w-[2200px] -translate-x-1/2"
        style={{ top: '1990px' }}>
        <Carousel
          className="w-full"
          opts={{ align: 'center', containScroll: false, dragFree: false, loop: true, slidesToScroll: 1, startIndex: 2 }}
          setApi={setEmblaApi as any}
        >
          <CarouselContent className="flex items-center gap-[60px] px-0">
            {normalizedSteps.map((step, idx) => {
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
                  className="basis-[560px] shrink-0 grow-0 pl-0"
                  key={`${step.label}-${idx}`}
                  style={itemTransform ? { transform: itemTransform } : undefined}
                >
                  <div className="flex flex-col items-center gap-[28px]">
                    <button
                      className="relative flex items-center justify-center"
                      onClick={() => (emblaApi as any)?.scrollTo?.(idx)}
                      type="button"
                    >
                      {isActive ? (
                        <HCWhiteDiamond className="h-[880px] w-[880px]" aria-hidden="true" focusable="false" />
                      ) : (
                        <HCBlueDiamond
                          className={inactiveSize === 440 ? 'h-[440px] w-[440px]' : 'h-[640px] w-[640px]'}
                          aria-hidden="true"
                          focusable="false"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                        <span
                          className={
                            isActive
                              ? 'text-[44px] font-semibold leading-[1.2] tracking-[-2.2px] text-[#14477d]'
                              : 'text-[30px] font-semibold leading-[1.2] tracking-[-1.5px] text-[#ededed]'
                          }
                          style={{ width: isActive ? '240px' : '200px' }}
                        >
                          {renderRegisteredMark(step.label)}
                        </span>
                        {isActive ? (
                          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <CirclePlus className="h-[56px] w-[56px] text-[#14477d]" />
                          </span>
                        ) : null}
                      </div>
                    </button>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="pointer-events-none absolute inset-x-0 -bottom-[220px] flex items-center justify-center gap-[48px]">
            <button
              aria-label="Previous"
              className="pointer-events-auto flex h-[64px] w-[64px] items-center justify-center rounded-full border-2 border-white/70 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-105"
              onClick={handlePrev}
              type="button"
            >
              <ChevronLeft className="h-[28px] w-[28px]" />
            </button>
            <button
              aria-label="Next"
              className="pointer-events-auto flex h-[64px] w-[64px] items-center justify-center rounded-full border-2 border-white/70 text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-105"
              onClick={handleNext}
              type="button"
            >
              <ChevronRight className="h-[28px] w-[28px]" />
            </button>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
