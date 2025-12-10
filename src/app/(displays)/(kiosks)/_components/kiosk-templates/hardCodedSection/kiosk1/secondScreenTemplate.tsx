'use client';

import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shadcn/carousel';
import NextImage from 'next/image';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCWhiteDiamond';
import { ArrowLeft, ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type ModalContent = {
  body: string | readonly string[];
  heading: string;
  imageAlt?: string;
  imageSrc?: string;
};

type Step = {
  label: string;
  modal?: Partial<ModalContent>;
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
  {
    label: 'Intake and assessment',
    modal: {
      body: [
        'Assets, whether film, audio, digital, or physical, are logged, evaluated for condition and risk, and prioritized based on preservation and activation potential.',
      ],
      imageAlt: 'Intake and assessment illustration',
      imageSrc: '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/intake-and-assessment.webp',
    },
  },
  {
    label: 'Digitization and remediation',
    modal: {
      body: [
        'Physical media is digitized to archival standards, with restoration applied as needed and metadata extracted to ensure assets are searchable, playable, and accessible.',
      ],
      imageAlt: 'Digitization and remediation illustration',
      imageSrc: '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/digitization-and-remediation.webp',
    },
  },
  {
    label: 'Digital preservation',
    modal: {
      body: [
        'Iron Mountain’s digital preservation platform provides a fully managed digital repository with triple-redundant geo-distributed storage, secure access, and intuitive navigation.',
      ],
      imageAlt: 'Digital preservation illustration',
      imageSrc: '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/digital-preservation.webp',
    },
  },
  {
    label: 'Search and discover',
    modal: {
      body: [
        'The entire archive becomes searchable through AI-powered metadata, custom filters, and integrated preview tools, enabling fast discovery from any location.',
      ],
      imageAlt: 'Search and discover illustration',
      imageSrc: '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/search-and-discover.webp',
    },
  },
  {
    label: 'Share, stream and monetize',
    modal: {
      body: [
        'Digitized content is ready for licensing, streaming, and storytelling, unlocking new value across platforms while maintaining archival integrity.',
      ],
      imageAlt: 'Share, stream and monetize illustration',
      imageSrc: '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/share-stream-and-monetize.webp',
    },
  },
];

const defaultModal: ModalContent = {
  body: [
    'Iron Mountain’s digital preservation platform provides a fully managed digital repository with triple-redundant geo-distributed storage, secure access, and intuitive navigation.',
  ],
  heading: 'Digital preservation',
  imageAlt: 'Digital preservation illustration',
  imageSrc: '/images/kiosks/kiosk1/04-custom-interactive/Illustrations/digital-preservation.webp',
};

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
  const headlineWithForcedBreak = headlineText?.replace(/archive\s+/i, "archive\n") ?? headlineText;
  const normalizedSteps = steps && steps.length > 0 ? steps : defaultSteps;

  const [emblaApi, setEmblaApi] = useState<EmblaApi>();
  const hasAppliedInitialAlignment = useRef(false);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const totalSlides = normalizedSteps.length;

  const activeStep = openModalIndex !== null ? normalizedSteps[openModalIndex] : null;
  const activeModalContent: ModalContent | null = activeStep
    ? {
        body: activeStep.modal?.body ?? defaultModal.body,
        heading: activeStep.modal?.heading ?? activeStep.label,
        imageAlt: activeStep.modal?.imageAlt ?? defaultModal.imageAlt,
        imageSrc: activeStep.modal?.imageSrc ?? defaultModal.imageSrc,
      }
    : null;
  const activeModalBody = Array.isArray(activeModalContent?.body)
    ? activeModalContent?.body
    : activeModalContent?.body
      ? [activeModalContent.body]
      : [];
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    emblaApi.scrollTo?.(desiredIndex, true);
    setSelectedIndex(desiredIndex);
    applyEdgeTransforms(desiredIndex);
  }, [applyEdgeTransforms, emblaApi, totalSlides]);

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
    <>
      <div ref={containerRef} className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="hardcoded-k1-second">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
          }}
        />

      <div className="absolute left-[120px] top-[240px] whitespace-pre-line text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div
        className="absolute w-full whitespace-pre-line text-[100px] font-normal leading-[1.2] tracking-[-5px] text-[#ededed]"
        style={{ left: "240px", top: "830px", width: "100%" }}
      >
        {renderRegisteredMark(headlineWithForcedBreak)}
      </div>

      <p
        className="absolute text-[52px] font-normal text-[#ededed]/90"
        style={{ left: "250px", letterSpacing: "-2.6px", lineHeight: "1.4", top: "1320px", width: "640px" }}
      >
        {renderRegisteredMark('Explore each section to learn how Iron Mountain can transform your enterprise')}
      </p>

      <button
        className="absolute right-[310px] top-[1320px] flex h-[190px] items-center gap-[12px] rounded-full bg-white px-[140px] text-[40px] font-normal leading-[1.2] tracking-[-2px] text-[#14477d] shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition-transform duration-150 hover:scale-[1.02]"
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
                    data-slide-index={idx}
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
                            <div
                              aria-label="Open details"
                              className="absolute inset-0 flex cursor-pointer items-center justify-center"
                              onClick={(event) => {
                                event.stopPropagation();
                                setOpenModalIndex(idx);
                              }}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setOpenModalIndex(idx);
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
          <div className="pointer-events-none absolute inset-x-0 -bottom-[220px] flex items-center justify-center gap-[48px]">
            <button
              aria-label="Previous"
              className="pointer-events-auto flex h-[64px] w-[64px] items-center justify-center text-white transition-transform duration-150 hover:scale-110"
              onClick={handlePrev}
              type="button"
            >
              <ChevronLeft className="h-[36px] w-[36px]" />
            </button>
            <button
              aria-label="Next"
              className="pointer-events-auto flex h-[64px] w-[64px] items-center justify-center text-white transition-transform duration-150 hover:scale-110"
              onClick={handleNext}
              type="button"
            >
              <ChevronRight className="h-[36px] w-[36px]" />
            </button>
          </div>
        </Carousel>
      </div>
    </div>

      {activeModalContent
        ? createPortal(
            <div className="absolute inset-0 z-[200] flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[30px]" onClick={() => setOpenModalIndex(null)} />
              <div className="relative z-[201] flex max-h-[90vh] w-[90vw] max-w-[1400px] flex-col overflow-hidden rounded-[48px] bg-[#97e9ff] p-[80px] text-[#14477d] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between">
                  <button
                    className="flex h-[100px] items-center gap-[24px] rounded-[1000px] bg-[#ededed] px-[60px] text-[36px] font-normal leading-[1.4] tracking-[-1.8px] text-[#14477d] transition hover:scale-[1.02]"
                    onClick={() => setOpenModalIndex(null)}
                    type="button"
                  >
                    <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#14477d]">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M15 6l-6 6 6 6" stroke="#14477d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      </svg>
                    </span>
                    Back
                  </button>
                </div>

                <div className="mt-[80px] grid gap-[80px] text-[#14477d]">
                  <div className="max-w-[1100px] space-y-[60px]">
                    <h2 className="text-[72px] font-normal leading-[1.25] tracking-[-3.6px]">{activeModalContent.heading}</h2>
                    <div className="space-y-[32px] text-[36px] font-normal leading-[1.4] tracking-[-1.8px]">
                      {activeModalBody?.map((line, idx) => (
                        <p key={idx} className="whitespace-pre-line">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {activeModalContent.imageSrc ? (
                    <div className="flex items-center justify-center">
                      <div className="relative h-[540px] w-[540px] rotate-[45deg] rounded-[100px] border-[8px] border-[#ededed]/80 bg-[#5ad2ff]">
                        <div className="absolute inset-[40px] -rotate-[45deg] flex items-center justify-center rounded-[80px] bg-white/10">
                          <NextImage
                            alt={activeModalContent.imageAlt ?? "Modal illustration"}
                            className="object-contain"
                            height={320}
                            src={activeModalContent.imageSrc}
                            width={320}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            containerRef.current ?? document.body,
          )
        : null}
    </>
  );
}