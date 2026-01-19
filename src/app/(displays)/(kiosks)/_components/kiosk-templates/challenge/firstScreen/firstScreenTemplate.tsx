'use client';

import { motion } from 'framer-motion';
import { Diamond } from 'lucide-react';
import { memo } from 'react';
import { getVideoMimeType } from '@/lib/utils/get-video-mime-type';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { TITLE_ANIMATION_TRANSFORMS } from '../../constants/animations';
import { SCROLL_ANIMATION_CONFIG, useScrollAnimation } from '../../hooks/useScrollAnimation';
import { SECTION_NAMES, useStickyHeader } from '../../hooks/useStickyHeader';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type FirstScreenTemplateProps = {
  readonly body?: string;
  readonly featuredStat1?: string;
  readonly featuredStat1Body?: string;
  readonly kioskId?: KioskId;
  readonly labelText?: string;
  readonly mainVideo?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
};

const FirstScreenTemplate = memo(
  ({ body, featuredStat1, featuredStat1Body, labelText, mainVideo, subheadline }: FirstScreenTemplateProps) => {
    const { shouldAnimate, triggerRef: animationTriggerRef } = useScrollAnimation<HTMLDivElement>();

    const {
      bottomGradientPosition,
      bottomGradientRef,
      labelRef,
      sectionRef,
      showBottomGradient,
      showStickyHeader,
      stickyHeaderRef,
    } = useStickyHeader<HTMLDivElement>({
      hasBottomGradient: true,
      sectionName: SECTION_NAMES.CHALLENGE,
    });

    return (
      <div
        className="relative flex h-screen w-full flex-col overflow-visible bg-black"
        data-section={SECTION_NAMES.CHALLENGE}
        ref={sectionRef}
      >
        {/* Background gradient - defined in globals.css for readability and ease of future updates */}
        <div className="bg-gradient-challenge-section pointer-events-none absolute inset-0 top-[1290px] z-[1] h-[14340px] rounded-[100px] group-data-[kiosk=kiosk-2]/kiosk:top-[1240px] group-data-[kiosk=kiosk-2]/kiosk:h-[14390px]" />

        {/* Video Header Section */}
        <div
          className="relative flex h-[1284px] w-full flex-col items-center justify-center px-[120px] py-[200px]"
          data-section-video="challenge"
        >
          <video
            autoPlay
            className="absolute inset-0 top-[230px] h-full w-full object-cover object-center"
            controlsList="nodownload"
            data-scroll-section="challenge-first-video"
            loop
            muted
            playsInline
          >
            <source src={mainVideo} type={getVideoMimeType(mainVideo)} />
          </video>
          <div className="pointer-events-none absolute inset-0 top-[230px] bg-black/20" />

          {/* Subheadline - Initial Position */}
          <motion.div
            animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            className="relative top-[120px] left-[-760px] z-[2] px-[120px] pb-[400px] will-change-[transform,opacity] group-data-[kiosk=kiosk-3]/kiosk:top-[50px] group-data-[kiosk=kiosk-3]/kiosk:left-[-800px]"
            initial={{ opacity: 0, y: TITLE_ANIMATION_TRANSFORMS.CHALLENGE_SUBHEADLINE }}
            transition={{ delay: 0, duration: SCROLL_ANIMATION_CONFIG.DURATION, ease: SCROLL_ANIMATION_CONFIG.EASING }}
          >
            <h2 className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
              {renderRegisteredMark(subheadline)}
            </h2>
          </motion.div>
        </div>

        {/* Challenge Label Section - Initial Position */}
        <div ref={animationTriggerRef}>
          <motion.div
            animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
            className="relative top-[-260px] z-[0] flex items-center gap-[41px] px-[128px] pb-[200px] will-change-[transform,opacity] group-data-[kiosk=kiosk-2]/kiosk:top-[-260px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[-320px] group-data-[kiosk=kiosk-3]/kiosk:left-[10px]"
            data-section-label="challenge"
            initial={{ opacity: 0, y: TITLE_ANIMATION_TRANSFORMS.CHALLENGE_LABEL }}
            ref={labelRef}
            transition={{
              delay: SCROLL_ANIMATION_CONFIG.SECONDARY_DELAY,
              duration: SCROLL_ANIMATION_CONFIG.DURATION,
              ease: SCROLL_ANIMATION_CONFIG.EASING,
            }}
          >
            <div className="relative mr-[5px] flex h-[110px] w-[110px] items-center justify-center">
              <Diamond
                aria-hidden="true"
                className="h-full w-full text-[#ededed]"
                focusable="false"
                strokeWidth={1.25}
              />
            </div>
            <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
              {renderRegisteredMark(labelText)}
            </h1>
          </motion.div>
        </div>

        {/* Sticky Section Header - Fixed Position - gradient defined in globals.css for readability and ease of future updates */}
        <div
          className={`bg-gradient-sticky-challenge pointer-events-none fixed top-0 left-0 z-[100] h-[1369px] w-full transition-opacity duration-300 motion-reduce:transition-none ${showStickyHeader ? 'opacity-100' : 'opacity-0'}`}
          data-challenge-sticky-header
          data-visible={showStickyHeader}
          ref={stickyHeaderRef}
        >
          {/* Subheadline */}
          <div className="px-[120px] pt-[240px] pb-[375px] pl-[150px]">
            <h2 className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
              {renderRegisteredMark(subheadline)}
            </h2>
          </div>

          {/* Challenge Label */}
          <div className="flex items-center gap-[41px] px-[128px] pb-[20px] pl-[180px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:left-[10px]">
            <div className="relative mr-[5px] flex h-[86px] w-[86px] items-center justify-center">
              <Diamond
                aria-hidden="true"
                className="h-full w-full text-[#ededed]"
                focusable="false"
                strokeWidth={1.25}
              />
            </div>
            <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
              {renderRegisteredMark(labelText)}
            </h1>
          </div>
        </div>

        {/* Sticky Section Footer - Fixed Position (Bottom) */}
        {/* Bottom Fixed Gradient - Rotated 180 degrees for fade effect at bottom - gradient defined in globals.css for readability and ease of future updates */}
        <div
          className={`bg-gradient-sticky-challenge pointer-events-none fixed left-0 z-[100] h-[1369px] w-full rotate-180 transition-opacity duration-300 motion-reduce:transition-none ${bottomGradientPosition ? 'bottom-[-900px]' : 'bottom-0'} ${showBottomGradient ? 'opacity-100' : 'opacity-0'}`}
          data-challenge-sticky-footer
          data-visible={showBottomGradient}
          ref={bottomGradientRef}
        />

        {/* Problem Description Section */}
        <div className="relative top-[-140px] left-[-10px] z-[2] px-[120px] group-data-[kiosk=kiosk-2]/kiosk:top-[-150px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[-210px] group-data-[kiosk=kiosk-3]/kiosk:left-[0]">
          <p className="max-w-[1380px] text-[80px] leading-[1.4] font-normal tracking-[-4px] text-white">
            {renderRegisteredMark(body)}
          </p>
        </div>

        {/* Savings Metrics Section */}
        <div className="relative top-[30px] left-[-430px] z-[2] flex w-full flex-col items-center py-[490px] group-data-[kiosk=kiosk-2]/kiosk:top-[-220px] group-data-[kiosk=kiosk-2]/kiosk:left-[-490px] group-data-[kiosk=kiosk-3]/kiosk:top-[70px] group-data-[kiosk=kiosk-3]/kiosk:left-[-400px]">
          <span className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
            {renderRegisteredMark(featuredStat1)}
          </span>
          <p className="relative top-[40px] left-[-20px] mt-[-40px] w-[1030px] text-[60px] leading-[1.3] font-normal tracking-[-3px] whitespace-pre-line text-[#6dcff6] group-data-[kiosk=kiosk-2]/kiosk:top-[30px] group-data-[kiosk=kiosk-2]/kiosk:left-[60px] group-data-[kiosk=kiosk-3]/kiosk:top-[50px] group-data-[kiosk=kiosk-3]/kiosk:left-[-20px] group-data-[kiosk=kiosk-3]/kiosk:w-[1070px]">
            {renderRegisteredMark(featuredStat1Body)}
          </p>
        </div>
      </div>
    );
  }
);

export default FirstScreenTemplate;
