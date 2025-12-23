'use client';

// React import removed - not needed with new JSX transform
import { Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '../../../../_types/kiosk-id';
import renderRegisteredMark from '../utils/renderRegisteredMark';

export type ThirdScreenTemplateProps = {
  readonly labelText?: string;
  readonly description?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly largeIconCenterSrc?: string;
  readonly largeIconTopSrc?: string;
  readonly metricAmount?: string;
  readonly metricDescription?: string;
  readonly metricImageSrc?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
  readonly videoSrc?: string;
};

export const ThirdScreenTemplate = ({
  labelText,
  description,
  heroImageSrc,
  kioskId = DEFAULT_KIOSK_ID,
  largeIconCenterSrc,
  largeIconTopSrc,
  metricAmount,
  metricDescription,
  metricImageSrc,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateDown: _onNavigateDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateUp: _onNavigateUp,
  subheadline,
  videoSrc,
}: ThirdScreenTemplateProps) => {
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-transparent"
      data-hero-image={heroImageSrc}
      data-kiosk={kioskId}
      data-large-icon-center={largeIconCenterSrc}
      data-large-icon-top={largeIconTopSrc}
      data-video-src={videoSrc}
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[2490px] left-[920px] z-[1] flex h-[940px] w-[940px] scale-y-[-1] rotate-[225deg] items-center justify-center group-data-[kiosk=kiosk-2]/kiosk:top-[2430px] group-data-[kiosk=kiosk-2]/kiosk:left-[1070px] group-data-[kiosk=kiosk-2]/kiosk:size-[800px] group-data-[kiosk=kiosk-3]/kiosk:top-[1740px] group-data-[kiosk=kiosk-3]/kiosk:left-[1080px] group-data-[kiosk=kiosk-3]/kiosk:size-[800px]">
        <div className="relative h-full w-full">
          {metricImageSrc && (
            <Image
              alt={metricDescription ? `Graphic representing ${metricDescription}` : 'Metric graphic'}
              className="rotate-45 object-contain"
              fill
              sizes="795px"
              src={metricImageSrc}
              unoptimized
            />
          )}
        </div>
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
          {renderRegisteredMark(description)}
        </p>
      </div>

      {/* Metrics Section - SCROLLABLE */}
      <div className="relative top-[1180px] left-[-460px] z-[2] flex w-full flex-col items-center px-[120px] py-[300px]  group-data-[kiosk=kiosk-2]/kiosk:top-[1450px] group-data-[kiosk=kiosk-2]/kiosk:left-[-560px] group-data-[kiosk=kiosk-3]/kiosk:top-[790px] group-data-[kiosk=kiosk-3]/kiosk:left-[-640px]">
        <span className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
          {renderRegisteredMark(metricAmount)}
        </span>
        <p
          className="relative top-[100px] left-[135px] mt-[-142px] max-w-[1280px] text-left text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#6dcff6]  group-data-[kiosk=kiosk-2]/kiosk:top-[140px] group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-3]/kiosk:top-[140px] group-data-[kiosk=kiosk-3]/kiosk:left-[130px] group-data-[kiosk=kiosk-3]/kiosk:max-w-[900px] group-data-[kiosk=kiosk-3]/kiosk:leading-[1.3]"
          data-scroll-section="metrics-description"
        >
          {renderRegisteredMark(metricDescription)}
        </p>
      </div>
    </div>
  );
};

ThirdScreenTemplate.displayName = 'ThirdScreenTemplate';

export default ThirdScreenTemplate;
