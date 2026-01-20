'use client';

import { motion } from 'framer-motion';
import BlueDiamondMain from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondMain';
import GreenDiamondMain from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondMain';
import OrangeDiamondMain from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondMain';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { getVideoMimeType } from '@/lib/utils/get-video-mime-type';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { TITLE_ANIMATION_TRANSFORMS } from '../../constants/animations';
import { SCROLL_ANIMATION_CONFIG, useScrollAnimation } from '../../hooks/useScrollAnimation';
import { SECTION_NAMES, useStickyHeader } from '../../hooks/useStickyHeader';

export type SolutionFirstScreenTemplateProps = {
  readonly body?: string;
  readonly headline?: string;
  readonly kioskId?: string;
  readonly labelText?: string;
  readonly mainVideo?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
};

const SolutionFirstScreenTemplate = ({
  body,
  headline,
  labelText,
  mainVideo,
  subheadline,
}: SolutionFirstScreenTemplateProps) => {
  const { shouldAnimate, triggerRef: animationTriggerRef } = useScrollAnimation<HTMLDivElement>();

  const { labelRef, sectionRef, showStickyHeader, stickyHeaderRef } = useStickyHeader<HTMLDivElement>({
    sectionName: SECTION_NAMES.SOLUTION,
  });

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-visible bg-black"
      data-section={SECTION_NAMES.SOLUTION}
      ref={sectionRef}
    >
      {/* Background video */}
      <div className="absolute top-[-5px] left-0 h-[1545px] w-full" data-section-video="solution">
        <div className="relative h-full w-full">
          <video
            autoPlay
            className="absolute h-full w-full bg-black object-cover"
            controlsList="nodownload"
            data-scroll-section="solution-first-video"
            loop
            muted
            playsInline
          >
            <source src={mainVideo} type={getVideoMimeType(mainVideo)} />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Gradient body */}
      <div className="bg-gradient-kiosk-solution absolute top-[1058px] left-0 z-[1] h-[14575px] w-full rounded-[100px] group-data-[kiosk=kiosk-2]/kiosk:top-[1110px] group-data-[kiosk=kiosk-2]/kiosk:h-[14515px] group-data-[kiosk=kiosk-3]/kiosk:top-[1060px]" />

      {/* Subheadline - Initial Position */}
      <motion.h2
        animate={shouldAnimate ? { y: 0 } : undefined}
        className="absolute top-[240px] left-[120px] w-[500px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed] will-change-transform group-data-[kiosk=kiosk-2]/kiosk:top-[290px] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-2]/kiosk:w-[450px] group-data-[kiosk=kiosk-3]/kiosk:top-[300px] group-data-[kiosk=kiosk-3]/kiosk:left-[240px] group-data-[kiosk=kiosk-3]/kiosk:w-[330px]"
        initial={{ y: TITLE_ANIMATION_TRANSFORMS.SECTION_HEADER }}
        transition={{ delay: 0, duration: SCROLL_ANIMATION_CONFIG.DURATION, ease: SCROLL_ANIMATION_CONFIG.EASING }}
      >
        {renderRegisteredMark(subheadline)}
      </motion.h2>

      {/* Solution label - Initial Position */}
      <div ref={animationTriggerRef}>
        <motion.div
          animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
          className="absolute top-[790px] left-[140px] flex items-center gap-[41px] will-change-[transform,opacity] group-data-[kiosk=kiosk-2]/kiosk:top-[830px] group-data-[kiosk=kiosk-3]/kiosk:top-[860px] group-data-[kiosk=kiosk-3]/kiosk:left-[260px]"
          data-section-label="solution"
          initial={{ opacity: 0, y: TITLE_ANIMATION_TRANSFORMS.SECTION_HEADER }}
          ref={labelRef}
          transition={{
            delay: SCROLL_ANIMATION_CONFIG.SECONDARY_DELAY,
            duration: SCROLL_ANIMATION_CONFIG.DURATION,
            ease: SCROLL_ANIMATION_CONFIG.EASING,
          }}
        >
          <div className="relative top-[-25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
            <OutlinedDiamond aria-hidden="true" focusable="false" />
          </div>
          <h1 className="relative top-[-20px] left-[-100px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            {labelText}
          </h1>
        </motion.div>
      </div>

      {/* Sticky Section Header - Fixed Position - gradient defined in globals.css for readability and ease of future updates */}
      <div
        className={`bg-gradient-sticky-solution pointer-events-none fixed top-0 left-0 z-[100] h-[1369px] w-full transition-opacity duration-300 motion-reduce:transition-none ${showStickyHeader ? 'opacity-100' : 'opacity-0'}`}
        data-solution-sticky-header
        data-visible={showStickyHeader}
        ref={stickyHeaderRef}
      >
        {/* Subheadline */}
        <h2 className="w-[700px] px-[120px] pt-[240px] pb-[375px] pl-[150px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:w-[650px] group-data-[kiosk=kiosk-3]/kiosk:ml-[120px] group-data-[kiosk=kiosk-3]/kiosk:w-[630px]">
          {renderRegisteredMark(subheadline)}
        </h2>

        {/* Solution label */}
        <div className="flex items-center gap-[41px] px-[140px] pb-[20px] group-data-[kiosk=kiosk-3]/kiosk:ml-[120px]">
          <div className="relative top-[-25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
            <OutlinedDiamond aria-hidden="true" focusable="false" />
          </div>
          <h1 className="relative top-[-20px] left-[-100px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            {labelText}
          </h1>
        </div>
      </div>

      {/* Body copy */}
      <div className="absolute top-[1270px] left-[120px] z-[1] flex w-auto max-w-[1271px] flex-col gap-[80px] text-white group-data-[kiosk=kiosk-2]/kiosk:top-[1300px] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[1260px] group-data-[kiosk=kiosk-3]/kiosk:left-[120px]">
        <p className="w-[900px] text-[100px] leading-[1.3] font-normal tracking-[-5px]">
          {renderRegisteredMark(headline)}
        </p>
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px]">{renderRegisteredMark(body)}</p>
      </div>

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute top-[2420px] left-[-170px] z-[3] h-[1770px] w-[1770px] opacity-60 group-data-[kiosk=kiosk-2]/kiosk:top-[2420px] group-data-[kiosk=kiosk-2]/kiosk:top-[2450px] group-data-[kiosk=kiosk-3]/kiosk:top-[2420px] group-data-[kiosk=kiosk-3]/kiosk:left-[-180px] group-data-[kiosk=kiosk-3]/kiosk:size-[1780px]">
        <BlueDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="pointer-events-none absolute top-[2400px] left-[1250px] z-[3] h-[800px] w-[800px] opacity-70 group-data-[kiosk=kiosk-2]/kiosk:top-[2420px] group-data-[kiosk=kiosk-2]/kiosk:left-[1240px] group-data-[kiosk=kiosk-2]/kiosk:size-[805px] group-data-[kiosk=kiosk-3]/kiosk:top-[2390px] group-data-[kiosk=kiosk-3]/kiosk:left-[1250px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        <GreenDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="pointer-events-none absolute top-[3440px] left-[1250px] z-[3] h-[795px] w-[795px] opacity-70 group-data-[kiosk=kiosk-3]/kiosk:top-[3420px] group-data-[kiosk=kiosk-3]/kiosk:left-[1250px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        <OrangeDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
    </div>
  );
};

export default SolutionFirstScreenTemplate;
