'use client';

import { Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '../../../../_types/kiosk-id';
import renderRegisteredMark from '../utils/renderRegisteredMark';

const imgHeroDiamond = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const imgMetricDiamond = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const imgVector = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Full.png';
const imgVector1 = imgMetricDiamond;

export type ThirdScreenTemplateProps = Readonly<{
  description?: string;
  heroImageSrc?: string;
  kioskId?: KioskId;
  largeIconCenterSrc?: string;
  largeIconTopSrc?: string;
  metricAmount?: string;
  metricDescription?: string;
  metricImageSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  subheadline?: string | string[];
  videoSrc?: string;
}>;

export const ThirdScreenTemplate = ({
  description = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  heroImageSrc = imgHeroDiamond,
  kioskId = DEFAULT_KIOSK_ID,
  largeIconCenterSrc = imgVector1,
  largeIconTopSrc = imgVector,
  metricAmount = '40 TB',
  metricDescription = 'of existing footage of data migration from physical drives into Iron Mountain’s digital preservation platform.',
  metricImageSrc = imgMetricDiamond,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateDown: _onNavigateDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateUp: _onNavigateUp,
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/03-value/Value-header.mp4',
}: ThirdScreenTemplateProps) => {
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-transparent"
      data-hero-image={heroImageSrc}
      data-kiosk={kioskId}
      data-large-icon-center={largeIconCenterSrc}
      data-large-icon-top={largeIconTopSrc}
      data-node-id="5168:9928"
      data-video-src={videoSrc}
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-transparent" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[2490px] left-[920px] z-[1] flex h-[940px] w-[940px] scale-y-[-1] rotate-[225deg] items-center justify-center group-data-[kiosk=kiosk-2]/kiosk:left-[1070px] group-data-[kiosk=kiosk-2]/kiosk:top-[2430px] group-data-[kiosk=kiosk-2]/kiosk:size-[800px] group-data-[kiosk=kiosk-3]/kiosk:top-[1740px] group-data-[kiosk=kiosk-3]/kiosk:left-[1080px] group-data-[kiosk=kiosk-3]/kiosk:size-[800px]">
        <div className="relative h-full w-full">
          <Image
            alt={metricDescription ? `Graphic representing ${metricDescription}` : 'Metric highlight graphic'}
            className="object-contain"
            fill
            sizes="795px"
            src={metricImageSrc}
            style={{ transform: 'rotate(45deg)' }}
            unoptimized
          />
        </div>
      </div>

      {/* Header Section */}
      <div className="relative z-[2] px-[120px] pt-[300px] pb-[150px]">
        <h2 className="mb-[200px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>

        <div className="relative top-[180px] left-[20px] flex items-center gap-[41px]">
          <div className="relative mr-0 flex h-[110px] w-[110px] items-center justify-center">
            <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
          </div>
          <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            Challenge
          </h1>
        </div>
      </div>

      {/* Description Section - SCROLLABLE */}
      <div className="relative top-[970px] z-[2] px-[120px] py-[250px] group-data-[kiosk=kiosk-3]/kiosk:top-[290px]">
        <p
          className="group-data-[kiosk=kiosk-3[/kiosk:leading-[1.3] max-w-[980px] group-data-[kiosk=kiosk-2]/kiosk:w-[1070px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk-3]/kiosk:max-w-[1070px]"
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
          className="relative top-[100px] left-[135px] mt-[-142px] max-w-[1280px] text-left text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#6dcff6]  group-data-[kiosk=kiosk-2]/kiosk:left-[10px] group-data-[kiosk=kiosk-2]/kiosk:top-[140px] group-data-[kiosk=kiosk-3]/kiosk:top-[140px] group-data-[kiosk=kiosk-3]/kiosk:left-[130px] group-data-[kiosk=kiosk-3]/kiosk:max-w-[900px] group-data-[kiosk=kiosk-3]/kiosk:leading-[1.3]"
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
