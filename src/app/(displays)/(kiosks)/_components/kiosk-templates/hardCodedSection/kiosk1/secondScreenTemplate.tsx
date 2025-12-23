'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CirclePlus, SquarePlay } from 'lucide-react';
import NextImage from 'next/image';
import { createPortal } from 'react-dom';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import HardCodedDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/demoScreenTemplate';
import { Carousel, CarouselContent, CarouselItem } from '@/components/shadcn/carousel';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCWhiteDiamond';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

export type HardCodedKiosk1SecondScreenTemplateProps = {
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: 'kiosk-1' | 'kiosk-2' | 'kiosk-3';
  readonly onBack?: () => void;
  readonly onSecondaryCta?: () => void;
  readonly overlayCardLabel?: string;
  readonly overlayHeadline?: string;
  readonly secondaryCtaLabel?: string;
  readonly steps?: readonly Step[];
};

type ModalContent = {
  readonly body: string;
  readonly heading: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

type Step = {
  readonly label: string;
  readonly modal?: Partial<ModalContent>;
};

type EmblaApi = UseEmblaCarouselType[1];

const normalizeText = (value?: string): string => {
  if (typeof value === 'string') return value;
  return '';
};

const HardCodedKiosk1SecondScreenTemplate = ({
  eyebrow,
  headline,
  heroImageAlt,
  heroImageSrc,
  kioskId,
  onSecondaryCta,
  overlayCardLabel,
  overlayHeadline,
  secondaryCtaLabel,
  steps,
}: HardCodedKiosk1SecondScreenTemplateProps) => {
  const eyebrowText: string = normalizeText(eyebrow);
  const headlineText: string = normalizeText(headline);
  const normalizedSteps = steps ?? [];
  const isKiosk3 = kioskId === 'kiosk-3';
  const secondaryIconOffset = isKiosk3 ? 'left-[-330px]' : 'left-[-70px]';

  const [emblaApi, setEmblaApi] = useState<EmblaApi | undefined>(undefined);
  const hasAppliedInitialAlignment = useRef(false);
  const [openModalIndex, setOpenModalIndex] = useState<null | number>(null);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [showOverlay, setShowOverlay] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const totalSlides = normalizedSteps.length;

  const activeStep = openModalIndex !== null ? normalizedSteps[openModalIndex] : null;
  const activeModalContent: ModalContent | null = activeStep
    ? {
        body: activeStep.modal?.body ?? '',
        heading: activeStep.modal?.heading ?? activeStep.label,
        imageAlt: activeStep.modal?.imageAlt,
        imageSrc: activeStep.modal?.imageSrc,
      }
    : null;
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

  const handleSecondaryClick = () => {
    setShowOverlay(true);
    onSecondaryCta?.();
  };

  useEffect(() => {
    setPortalTarget(containerRef.current);
  }, []);

  return (
    <>
      <div
        className="relative flex h-screen w-full flex-col overflow-visible bg-transparent"
        data-scroll-section="hardcoded-second-screen"
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-transparent" />

        <h2 className="absolute top-[240px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(eyebrowText)}
        </h2>

        <h1
          className="absolute left-[240px] top-[830px] w-full text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed]"
        >
          {renderRegisteredMark(headlineText)}
        </h1>

        <p
          className="absolute left-[250px] top-[1320px] w-[640px] text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#ededed]"
        >
          {renderRegisteredMark('Explore each section to learn how Iron Mountain can transform your enterprise')}
        </p>

        <button
          className="absolute top-[1330px] left-[1245px] flex h-[200px] items-center justify-between rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[70px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[19px] transition-transform duration-150 hover:scale-[1.01]"
          onClick={handleSecondaryClick}
          type="button"
        >
          <span className="mr-[50px]">{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center pl-[80px]">
            <SquarePlay
              aria-hidden
              className={`relative h-[90px] w-[90px] ${secondaryIconOffset}`}
              color="#ededed"
              strokeWidth={2}
            />
          </div>
        </button>

        {/* Overlay - Demo Screen */}
        <div
          className={`absolute inset-0 z-[999] transition-opacity duration-700 ${
            showOverlay ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <HardCodedDemoScreenTemplate
            cardLabel={overlayCardLabel}
            headline={overlayHeadline}
            heroImageAlt={heroImageAlt}
            heroImageSrc={heroImageSrc}
            onEndTour={() => setShowOverlay(false)}
          />
        </div>

        <div
          className="absolute top-[1750px] left-[1080px] w-full max-w-[2200px] -translate-x-1/2"
        >
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
                                ? 'w-[340px] text-[61px] leading-[1.3] tracking-[-3px] text-[#14477d]'
                                : 'w-[300px] text-[43px] leading-[1.3] tracking-[-2.1px] text-[#ededed]'
                            }
                          >
                            {renderRegisteredMark(step.label)}
                          </span>
                          {isActive ? (
                            <div
                              aria-label="Open details"
                              className="absolute inset-0 flex cursor-pointer items-center justify-center pr-[5px] pt-[490px]"
                              onClick={event => {
                                event.stopPropagation();
                                setOpenModalIndex(idx);
                              }}
                              onKeyDown={event => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  event.stopPropagation();
                                  setOpenModalIndex(idx);
                                }
                              }}
                              role="button"
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
              className="pointer-events-none absolute inset-x-0 -bottom-[290px] flex items-center justify-center gap-[48px]"
            >
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
      </div>

      {activeModalContent
        ? createPortal(
            <div
              className="absolute inset-0 z-[200] flex items-center justify-center pointer-events-auto"
            >
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[50px]"
                onClick={() => setOpenModalIndex(null)}
              />
              <div
                className="relative z-[201] flex h-[2800px] w-[1920px] max-h-[90vh] flex-col overflow-hidden rounded-[48px] bg-[#97e9ff] p-[80px] text-[#14477d] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
              >
                <div className="flex items-center justify-between">
                  <button
                    className="relative left-[60px] top-[45px] flex h-[200px] items-center gap-[24px] rounded-[1000px] bg-[#ededed] px-[90px] py-[60] pr-[100px] text-[55px] leading-[1.4] font-normal tracking-[-2.7px] text-[#14477d] transition hover:scale-[1.02]"
                    onClick={() => setOpenModalIndex(null)}
                    type="button"
                  >
                    <span className="flex items-center justify-center">
                      <ArrowLeft aria-hidden className="mr-[30px] h-[52px] w-[52px]" color="#14477d" strokeWidth={2} />
                    </span>
                    Back
                  </button>
                </div>

                <div className="mt-[80px] grid gap-[80px] text-[#14477d]">
                  <div className="relative left-[45px] top-[150px] space-y-[60px]">
                    <h2 className="mb-[105px] text-[100px] leading-[1.3] font-normal tracking-[-5px]">
                      {activeModalContent.heading}
                    </h2>
                    <div className="w-[1170px] space-y-[32px] text-[60px] leading-[1.4] font-normal tracking-[-3px]">
                      <p className="whitespace-pre-line">{activeModalContent.body}</p>
                    </div>
                  </div>

                  {activeModalContent.imageSrc ? (
                    <div className="flex items-center justify-center">
                      <div
                        className="relative top-[130px] h-[1680px] w-[1680px] rotate-[45deg] rounded-[80px] border-0 bg-transparent"
                      >
                        <div
                          className="absolute inset-0 -rotate-[45deg] flex items-center justify-center rounded-[80px] bg-transparent"
                        >
                          <NextImage
                            alt={activeModalContent.imageAlt ?? 'Modal illustration'}
                            className="h-full w-full object-contain"
                            height={1394}
                            src={activeModalContent.imageSrc}
                            width={1680}
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>,
            portalTarget ?? document.body
          )
        : null}
    </>
  );
};

export default HardCodedKiosk1SecondScreenTemplate;
