'use client';

import { motion, useInView } from 'framer-motion';
import { memo, useRef } from 'react';
import { normalizeDiamondCards } from '@/app/(displays)/(kiosks)/_utils/normalize-diamond-cards';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { cn } from '@/lib/tailwind/utils/cn';
import { getVideoMimeType } from '@/lib/utils/get-video-mime-type';
import { normalizeMultiline } from '@/lib/utils/normalize-multiline';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import AnimatedValueCarousel from './components/AnimatedValueCarousel';
import ValueCarousel from './components/ValueCarousel';
import type { ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Props for the ValueCarouselTemplate component.
 * Displays a value proposition carousel with animated diamonds and bullet points.
 */
export type ValueCarouselTemplateProps = {
  /** Body text describing the value proposition */
  readonly body?: string;
  /** Unique identifier for the carousel instance */
  readonly carouselId?: string;
  /** Eyebrow text displayed above the main headline */
  readonly eyebrow?: string;
  /** Main headline text */
  readonly headline?: string;
  /** Alt text for hero image (when not using video) */
  readonly heroImageAlt?: string;
  /** Source URL for hero image (when not using video) */
  readonly heroImageSrc?: string;
  /** Poster image for video player */
  readonly heroVideoPosterSrc?: string;
  /** Whether this is the last screen in the Value section */
  readonly isLastScreen?: boolean;
  /** Label text displayed with diamond icon */
  readonly labelText?: string;
  /** Main video URL (enables animated carousel variant) */
  readonly mainVideo?: string;
  /** Callback for downward navigation */
  readonly onNavigateDown?: () => void;
  /** Callback for upward navigation */
  readonly onNavigateUp?: () => void;
  /** Callback to register carousel navigation handlers for parent control */
  readonly registerCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  /** Array of carousel slides with diamond cards and bullet points */
  readonly slides?: readonly ValueCarouselSlide[];
};

const ValueCarouselTemplate = memo((props: ValueCarouselTemplateProps) => {
  const {
    body,
    carouselId,
    eyebrow,
    headline,
    heroVideoPosterSrc,
    isLastScreen,
    labelText,
    mainVideo,
    registerCarouselHandlers,
    slides,
  } = props;

  const animationTriggerRef = useRef(null);
  const isInView = useInView(animationTriggerRef, { amount: 1, once: true }); // amount 1 is in use to make sure 100% of the template is in use before this animation kicks off. This keeps it from animating early when part of the template is in view.

  const labelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Enable delegation for any carousel variant that has slides
  const shouldEnableCarouselDelegation = hasCarouselSlides;

  return (
    <div
      {...(shouldEnableCarouselDelegation ? { 'data-scroll-section': 'value-carousel' } : {})}
      {...(isLastScreen ? { 'data-section-end': 'value' } : {})}
      className="relative flex h-screen w-full flex-col overflow-visible bg-transparent"
      data-carousel-id={carouselId}
      data-section="value"
      ref={sectionRef}
    >
      <div className="absolute top-0 left-0 z-0 h-[1284px] w-full overflow-hidden" data-section-video="value">
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

      {/* Header Section - Initial Position */}
      <div className="absolute top-0 left-0 flex h-[1284px] w-full flex-col justify-between px-[120px] py-[240px]">
        <motion.p
          animate={isInView ? { y: 0 } : undefined}
          className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed] will-change-transform"
          initial={{ y: -1100 }}
          transition={{ delay: 0, duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
        >
          {renderRegisteredMark(normalizeMultiline(eyebrow))}
        </motion.p>
        <div ref={animationTriggerRef}>
          <motion.div
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            className="relative top-[-100px] left-[10px] flex items-center gap-[41px] will-change-[transform,opacity]"
            data-section-label="value"
            initial={{ opacity: 0, y: -1100 }}
            ref={labelRef}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
          >
            <div className="relative top-[25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
              <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
            </div>
            <h1 className="relative top-[30px] left-[-90px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]">
              {renderRegisteredMark(labelText)}
            </h1>
          </motion.div>
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
            <p className="mt-[80px] w-[1480px] text-[60px] leading-[1.4] font-normal tracking-[-3px]">
              {renderRegisteredMark(normalizeMultiline(body))}
            </p>
          </div>
          {useAnimatedCarousel ? (
            <AnimatedValueCarousel
              hasCarouselSlides={hasCarouselSlides}
              registerCarouselHandlers={registerCarouselHandlers}
              slides={slidesWithDefaults}
            />
          ) : (
            <ValueCarousel
              hasCarouselSlides={hasCarouselSlides}
              registerCarouselHandlers={registerCarouselHandlers}
              slides={slidesWithDefaults}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default ValueCarouselTemplate;
