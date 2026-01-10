'use client';

import { useEffect, useRef, useState } from 'react';
import BlueDiamondMain from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondMain';
import GreenDiamondMain from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondMain';
import OrangeDiamondMain from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondMain';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { getVideoMimeType } from '@/lib/utils/get-video-mime-type';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

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
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!labelRef.current || !stickyHeaderRef.current) return;

      const labelRect = labelRef.current.getBoundingClientRect();
      const labelPastTop = labelRect.bottom < 0;

      // Find the last screen in the Solution section (thirdScreen or fourthScreen)
      const lastScreen = document.querySelector('[data-section-end="solution"]');
      if (!lastScreen) {
        // Fallback to showing when label is past top if last screen not found
        setShowStickyHeader(labelPastTop);
        return;
      }

      // Check if sticky header's bottom would go past the last screen's bottom
      const lastScreenRect = lastScreen.getBoundingClientRect();
      const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;
      const stickyHeaderBottom = stickyHeaderHeight; // Since it's fixed at top: 0
      const offset = 1500; // Disappear 1500px earlier
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

  return (
    <div 
      ref={sectionRef}
      data-section="solution"
      className="relative flex h-screen w-full flex-col overflow-visible bg-black"
    >
      {/* Background video */}
      <div 
        data-section-video="solution"
        className="absolute top-[-5px] left-0 h-[1545px] w-full"
      >
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
      <div className="absolute top-[1058px] left-0 z-[1] h-[14575px] w-full rounded-[100px] bg-gradient-to-b from-[#A2115E] to-[#8A0D71] group-data-[kiosk=kiosk-2]/kiosk:top-[1110px] group-data-[kiosk=kiosk-3]/kiosk:top-[1060px]" />

      {/* Subheadline - Initial Position */}
      <h2 className="absolute top-[240px] left-[120px] z-[1] w-[500px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[290px] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-2]/kiosk:w-[450px] group-data-[kiosk=kiosk-3]/kiosk:top-[300px] group-data-[kiosk=kiosk-3]/kiosk:left-[240px] group-data-[kiosk=kiosk-3]/kiosk:w-[330px]">
        {renderRegisteredMark(subheadline)}
      </h2>

      {/* Solution label - Initial Position */}
      <div 
        ref={labelRef}
        data-section-label="solution"
        className="absolute top-[790px] left-[140px] flex items-center gap-[41px] group-data-[kiosk=kiosk-2]/kiosk:top-[830px] group-data-[kiosk=kiosk-3]/kiosk:top-[860px] group-data-[kiosk=kiosk-3]/kiosk:left-[260px]"
      >
        <div className="relative top-[-25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
          <OutlinedDiamond aria-hidden="true" focusable="false" />
        </div>
        <h1 className="relative top-[-20px] left-[-100px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
          {labelText}
        </h1>
      </div>

      {/* Sticky Section Header - Fixed Position */}
      <div 
        ref={stickyHeaderRef}
        className={`fixed top-0 left-0 z-[100] w-full pointer-events-none transition-opacity duration-300 bg-gradient-to-b from-[rgba(162,17,94,0.95)] to-[rgba(138,13,113,0.85)] backdrop-blur-[8px] ${showStickyHeader ? 'opacity-100' : 'opacity-0'}`}
        data-solution-sticky-header
        data-visible={showStickyHeader}
      >
        {/* Subheadline */}
        <h2 className="px-[120px] pt-[20px] w-[700px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:w-[450px] group-data-[kiosk=kiosk-3]/kiosk:ml-[120px] group-data-[kiosk=kiosk-3]/kiosk:w-[330px]">
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
