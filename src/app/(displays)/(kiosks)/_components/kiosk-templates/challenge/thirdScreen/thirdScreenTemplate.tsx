'use client';

import { Diamond } from 'lucide-react';
import Image from 'next/image';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
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

const ThirdScreenTemplate = ({
  featuredStat2,
  featuredStat2Body,
  item2Body,
  item2Image,
  labelText,
  subheadline,
}: ThirdScreenTemplateProps) => {
  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-transparent"
      data-hero-image={item2Image}
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[2490px] left-[920px] z-[1] h-[940px] w-[940px] group-data-[kiosk=kiosk-2]/kiosk:top-[2430px] group-data-[kiosk=kiosk-2]/kiosk:left-[1070px] group-data-[kiosk=kiosk-2]/kiosk:size-[800px] group-data-[kiosk=kiosk-3]/kiosk:top-[1740px] group-data-[kiosk=kiosk-3]/kiosk:left-[1080px] group-data-[kiosk=kiosk-3]/kiosk:size-[800px]">
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

      {/* Header Section */}
      <div className="relative z-[2] px-[120px] pt-[300px] pb-[150px]">
        <h2 className="mb-[200px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(subheadline)}
        </h2>

        <div className="relative top-[180px] left-[20px] flex items-center gap-[41px]">
          <div className="relative mr-0 flex h-[110px] w-[110px] items-center justify-center">
            <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
          </div>
          <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      {/* Description Section - SCROLLABLE */}
      <div className="relative top-[970px] z-[2] px-[120px] py-[250px] group-data-[kiosk=kiosk-3]/kiosk:top-[290px]">
        <p
          className="group-data-[kiosk=kiosk-3[/kiosk:leading-[1.3] max-w-[980px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk-2]/kiosk:w-[1070px] group-data-[kiosk=kiosk-3]/kiosk:max-w-[1070px]"
          data-scroll-section="description"
        >
          {renderRegisteredMark(item2Body)}
        </p>
      </div>

      {/* Metrics Section - SCROLLABLE */}
      <div className="relative top-[1180px] left-[-460px] z-[2] flex w-full flex-col items-center px-[120px] py-[300px]  group-data-[kiosk=kiosk-2]/kiosk:top-[1450px] group-data-[kiosk=kiosk-2]/kiosk:left-[-560px] group-data-[kiosk=kiosk-3]/kiosk:top-[790px] group-data-[kiosk=kiosk-3]/kiosk:left-[-640px]">
        <span className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
          {renderRegisteredMark(featuredStat2)}
        </span>
        <p
          className="relative top-[100px] left-[135px] mt-[-142px] max-w-[1280px] text-left text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#6dcff6]  group-data-[kiosk=kiosk-2]/kiosk:top-[140px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[140px] group-data-[kiosk=kiosk-3]/kiosk:left-[130px] group-data-[kiosk=kiosk-3]/kiosk:max-w-[900px] group-data-[kiosk=kiosk-3]/kiosk:leading-[1.3]"
          data-scroll-section="metrics-description"
        >
          {renderRegisteredMark(featuredStat2Body)}
        </p>
      </div>
    </div>
  );
};

export default ThirdScreenTemplate;
