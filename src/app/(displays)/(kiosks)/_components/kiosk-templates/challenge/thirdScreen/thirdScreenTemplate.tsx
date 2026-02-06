'use client';

import Image from 'next/image';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { SECTION_NAMES } from '../../hooks/useStickyHeader';
import type { KioskId } from '../../../../_types/kiosk-id';

export type ThirdScreenTemplateProps = {
  readonly featuredStat2?: string;
  readonly featuredStat2Body?: string;
  readonly item2Body?: string;
  readonly item2Image?: string;
  readonly kioskId?: KioskId;
  readonly labelText?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
};

const ThirdScreenTemplate = ({ featuredStat2, featuredStat2Body, item2Body, item2Image }: ThirdScreenTemplateProps) => {
  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden bg-transparent"
      data-hero-image={item2Image}
      data-section-end={SECTION_NAMES.CHALLENGE}
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[2200px] left-[1050px] z-[1] h-[840px] w-[840px] -scale-x-100 group-data-[kiosk=kiosk\_2]/kiosk:top-[1860px] group-data-[kiosk=kiosk\_2]/kiosk:left-[1070px] group-data-[kiosk=kiosk\_2]/kiosk:size-[800px] group-data-[kiosk=kiosk\_3]/kiosk:top-[1740px] group-data-[kiosk=kiosk\_3]/kiosk:left-[1080px] group-data-[kiosk=kiosk\_3]/kiosk:size-[800px]">
        {item2Image && (
          <Image
            alt={featuredStat2Body ? `Graphic representing ${featuredStat2Body}` : 'Metric graphic'}
            className="clip-diamond-rounded object-cover"
            fill
            quality={75} // All decorative images are 75 quality, the text is the main focus not the image. 75 is a good balance between quality and performance.
            sizes="795px"
            src={item2Image}
          />
        )}
      </div>

      {/* Description Section - SCROLLABLE */}
      <div
        className="relative top-[1740px] left-[-20px] z-[2] px-[120px] py-[250px] group-data-[kiosk=kiosk\_2]/kiosk:top-[1410px] group-data-[kiosk=kiosk\_2]/kiosk:left-0 group-data-[kiosk=kiosk\_3]/kiosk:top-[290px]"
        data-scroll-section="challenge-third-description"
      >
        <p className="max-w-[1090px] text-[60px] leading-[1.3] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk\_2]/kiosk:w-[1070px] group-data-[kiosk=kiosk\_3]/kiosk:max-w-[1070px]">
          {renderRegisteredMark(item2Body)}
        </p>
      </div>

      {/* Metrics Section - SCROLLABLE */}
      <div className="relative top-[2250px] left-[-460px] z-[2] flex w-full flex-col items-center px-[120px] py-[300px]  group-data-[kiosk=kiosk\_2]/kiosk:top-[1900px] group-data-[kiosk=kiosk\_2]/kiosk:left-[-560px] group-data-[kiosk=kiosk\_3]/kiosk:top-[790px] group-data-[kiosk=kiosk\_3]/kiosk:left-[-640px]">
        <span className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
          {renderRegisteredMark(featuredStat2)}
        </span>
        <p className="relative top-[140px] left-[120px] mt-[-142px] max-w-[1280px] text-left text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#6dcff6]  group-data-[kiosk=kiosk\_2]/kiosk:top-[140px] group-data-[kiosk=kiosk\_2]/kiosk:left-[10px] group-data-[kiosk=kiosk\_3]/kiosk:top-[140px] group-data-[kiosk=kiosk\_3]/kiosk:left-[130px] group-data-[kiosk=kiosk\_3]/kiosk:max-w-[900px] group-data-[kiosk=kiosk\_3]/kiosk:leading-[1.3]">
          {renderRegisteredMark(featuredStat2Body)}
        </p>
      </div>
    </div>
  );
};

export default ThirdScreenTemplate;
