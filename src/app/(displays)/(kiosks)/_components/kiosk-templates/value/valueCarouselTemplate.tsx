'use client';

import { memo } from 'react';
import { normalizeDiamondCards } from '@/app/(displays)/(kiosks)/_utils/normalize-diamond-cards';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { cn } from '@/lib/tailwind/utils/cn';
import { getVideoMimeType } from '@/lib/utils/get-video-mime-type';
import { normalizeMultiline } from '@/lib/utils/normalize-multiline';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import AnimatedValueCarousel from './components/AnimatedValueCarousel';
import ValueCarousel from './components/ValueCarousel';
import type { ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

export type ValueCarouselTemplateProps = {
  readonly body?: string;
  readonly carouselId?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly heroVideoPosterSrc?: string;
  readonly labelText?: string;
  readonly mainVideo?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly onRegisterCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly slides?: readonly ValueCarouselSlide[];
};

const ValueCarouselTemplate = memo((props: ValueCarouselTemplateProps) => {
  const {
    body,
    carouselId,
    eyebrow,
    headline,
    heroVideoPosterSrc,
    labelText,
    mainVideo,
    onRegisterCarouselHandlers,
    slides,
  } = props;
  // Show video background when mainVideo is provided (used in animated carousel variant)
  const heroVideo = mainVideo;

  const slidesToRender = slides?.length ? slides : [];
  const slidesWithDefaults = slidesToRender.map(slide => ({
    ...slide,
    diamondCards: normalizeDiamondCards(slide.diamondCards),
  }));

  const getBulletItems = (slide: ValueCarouselSlide) =>
    slide.bullets?.filter(entry => entry && entry.trim().length > 0) ?? [];

  const hasCarouselSlides = slidesWithDefaults.some(slide => getBulletItems(slide).length > 0);
  const useAnimatedCarousel = hasCarouselSlides && heroVideo;

  return (
    <div
      {...(useAnimatedCarousel ? { 'data-scroll-section': 'value-carousel' } : {})}
      className="relative flex h-screen w-full flex-col overflow-visible bg-transparent"
      data-carousel-id={carouselId}
    >
      <div className="absolute top-0 left-0 z-0 h-[1284px] w-full overflow-hidden">
        {heroVideo ? (
          <video
            autoPlay
            className="absolute h-full w-full bg-black object-cover object-center"
            controlsList="nodownload"
            loop
            muted
            playsInline
            poster={heroVideoPosterSrc}
          >
            <source src={heroVideo} type={getVideoMimeType(heroVideo)} />
          </video>
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-0 left-0 z-2 flex h-[1284px] w-full flex-col justify-between px-[120px] py-[240px]">
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(normalizeMultiline(eyebrow))}
        </p>
        <div className="relative top-[-100px] left-[10px] flex items-center gap-[41px]">
          <div className="relative top-[25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
            <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
          </div>
          <h1 className="relative top-[30px] left-[-90px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]">
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      <div
        className={cn(
          'absolute top-[1060px] left-0 z-3 w-full rounded-t-[100px] px-[240px] pt-[200px] pb-[1166px]',
          useAnimatedCarousel ? 'h-[4150px] bg-[#ededed]' : 'h-[9360px] bg-[#ededed]'
        )}
      >
        <div className="relative top-[-10px] flex flex-col gap-[360px] text-[#8a0d71]">
          <div>
            <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px]">{renderRegisteredMark(headline)}</p>
            <p
              {...(useAnimatedCarousel ? { 'data-scroll-section': 'value-description' } : {})}
              className="mt-[80px] w-[1480px] text-[60px] leading-[1.4] font-normal tracking-[-3px]"
            >
              {renderRegisteredMark(normalizeMultiline(body))}
            </p>
          </div>
          {useAnimatedCarousel ? (
            <AnimatedValueCarousel
              hasCarouselSlides={hasCarouselSlides}
              onRegisterCarouselHandlers={onRegisterCarouselHandlers}
              slides={slidesWithDefaults}
            />
          ) : (
          <ValueCarousel
            hasCarouselSlides={hasCarouselSlides}
            onRegisterCarouselHandlers={onRegisterCarouselHandlers}
            slides={slidesWithDefaults}
          />
          )}
        </div>
      </div>
    </div>
  );
});

export default ValueCarouselTemplate;
