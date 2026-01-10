'use client';

import { memo, useEffect, useRef, useState } from 'react';
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
  
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!labelRef.current || !stickyHeaderRef.current) return;

      const labelRect = labelRef.current.getBoundingClientRect();
      const labelPastTop = labelRect.bottom < 0;

      // Find the last screen in the Value section
      const lastScreen = document.querySelector('[data-section-end="value"]');
      if (!lastScreen) {
        // Fallback to showing when label is past top if last screen not found
        setShowStickyHeader(labelPastTop);
        return;
      }

      // Check if sticky header's bottom would go past the last screen's bottom
      const lastScreenRect = lastScreen.getBoundingClientRect();
      const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;
      const stickyHeaderBottom = stickyHeaderHeight; // Since it's fixed at top: 0
      const offset = 1000; // Disappear 1000px earlier
      const sectionEndReached = lastScreenRect.bottom <= (stickyHeaderBottom + offset);

      // Show sticky header when label scrolls past top AND last screen bottom hasn't been reached
      const shouldShow = labelPastTop && !sectionEndReached;
      setShowStickyHeader(shouldShow);
    };

    // Find the scrolling container (BaseKioskView)
    const scrollContainer = document.querySelector('[data-kiosk]');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial state

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
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
      ref={sectionRef}
      data-section="value"
      className="relative flex h-screen w-full flex-col overflow-visible bg-transparent"
      data-carousel-id={carouselId}
    >
      <div 
        data-section-video="value"
        className="absolute top-0 left-0 z-0 h-[1284px] w-full overflow-hidden"
      >
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
      <div className="absolute top-0 left-0 z-2 flex h-[1284px] w-full flex-col justify-between px-[120px] py-[240px]">
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(normalizeMultiline(eyebrow))}
        </p>
        <div 
          ref={labelRef}
          data-section-label="value"
          className="relative top-[-100px] left-[10px] flex items-center gap-[41px]"
        >
          <div className="relative top-[25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
            <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
          </div>
          <h1 className="relative top-[30px] left-[-90px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]">
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      {/* Sticky Section Header - Fixed Position */}
      <div 
        ref={stickyHeaderRef}
        className="fixed top-0 left-0 z-[100] w-full pointer-events-none transition-opacity duration-300"
        data-value-sticky-header
        data-visible={showStickyHeader}
        style={{
          background: '#ededed',
          opacity: showStickyHeader ? 1 : 0,
        }}
      >
        <div className="flex flex-col px-[120px] py-[20px]">
          <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#8a0d71]">
            {renderRegisteredMark(normalizeMultiline(eyebrow))}
          </p>
          <div className="flex items-center gap-[41px] mt-[20px]">
            <div className="relative top-[25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
              <OutlinedDiamond aria-hidden="true" className="text-[#8a0d71]" focusable="false" />
            </div>
            <h1 className="relative top-[30px] left-[-90px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#8a0d71]">
              {renderRegisteredMark(labelText)}
            </h1>
          </div>
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
