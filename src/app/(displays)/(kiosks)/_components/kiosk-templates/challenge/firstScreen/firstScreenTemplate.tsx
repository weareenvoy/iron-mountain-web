'use client';

import { Diamond } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { getVideoMimeType } from '@/lib/utils/get-video-mime-type';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
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
    const [showStickyHeader, setShowStickyHeader] = useState(false);
    const labelRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const stickyHeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleScroll = () => {
        if (!labelRef.current || !stickyHeaderRef.current) return;

        const labelRect = labelRef.current.getBoundingClientRect();
        const labelPastTop = labelRect.bottom < 0;

        // Find the last screen in the Challenge section (thirdScreen)
        const lastScreen = document.querySelector('[data-section-end="challenge"]');
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

  return (
    <div 
      ref={sectionRef}
      data-section="challenge"
      className="relative flex h-screen w-full flex-col overflow-visible bg-black"
    >
      {/* Background gradient - stays behind all content */}
      <div className="pointer-events-none absolute inset-0 top-[1290px] z-[1] h-[14400px] rounded-[100px] bg-[linear-gradient(180deg,#1B75BC_0.01%,#14477D_98%)] group-data-[kiosk=kiosk-2]/kiosk:top-[1240px] group-data-[kiosk=kiosk-2]/kiosk:h-[14450px]" />

      {/* Video Header Section */}
      <div 
        data-section-video="challenge"
        className="relative flex h-[1284px] w-full flex-col items-center justify-center px-[120px] py-[200px]"
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
        <div className="relative top-[120px] left-[-760px] z-[2] px-[120px] pb-[400px] group-data-[kiosk=kiosk-3]/kiosk:top-[50px] group-data-[kiosk=kiosk-3]/kiosk:left-[-800px]">
          <h2 className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
            {renderRegisteredMark(subheadline)}
          </h2>
        </div>
      </div>

      {/* Challenge Label Section - Initial Position */}
      <div 
        ref={labelRef}
        data-section-label="challenge"
        className="relative top-[-260px] z-[2] flex items-center gap-[41px] px-[128px] pb-[200px] group-data-[kiosk=kiosk-2]/kiosk:top-[-260px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[-320px] group-data-[kiosk=kiosk-3]/kiosk:left-[10px]"
      >
        <div className="relative mr-[5px] flex h-[110px] w-[110px] items-center justify-center">
          <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
          {renderRegisteredMark(labelText)}
        </h1>
      </div>

      {/* Sticky Section Header - Fixed Position */}
      <div 
        ref={stickyHeaderRef}
        className={`fixed top-0 left-0 z-[100] w-full h-[1369px] pointer-events-none transition-opacity duration-300 bg-[linear-gradient(180deg,#155A95_65.52%,rgba(21,75,130,0)_99.31%)] ${showStickyHeader ? 'opacity-100' : 'opacity-0'}`}
        data-challenge-sticky-header
        data-visible={showStickyHeader}
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
            <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
          </div>
          <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

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
