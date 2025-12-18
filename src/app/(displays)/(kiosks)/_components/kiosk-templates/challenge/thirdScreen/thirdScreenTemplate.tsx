'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '../../../../_types/kiosk-id';
import { useAutoScrollNavigation } from '../../hooks/useAutoScrollNavigation';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// import styles from './thirdScreenTemplate.module.css';

// Asset constants from Figma MCP
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
  onNavigateDown,
  onNavigateUp,
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/03-value/Value-header.mp4',
}: ThirdScreenTemplateProps) => {
  const { containerRef, handleNavigateDown, handleNavigateUp } = useAutoScrollNavigation({
    duration: 800,
    onNavigateDown,
    onNavigateUp,
  });

  return (
    <div
      ref={containerRef}
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-x-hidden overflow-y-auto scroll-smooth bg-[#1b75bc]"
      data-hero-image={heroImageSrc}
      data-kiosk={kioskId}
      data-large-icon-center={largeIconCenterSrc}
      data-large-icon-top={largeIconTopSrc}
      data-node-id="5168:9928"
      data-video-src={videoSrc}
    >
      {/* Background gradient layer */}
      <div className="pointer-events-none absolute inset-0 z-[0] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_100%)]" />

      {/* Decorative background diamond */}
      <div className="pointer-events-none absolute top-[45%] left-[50%] z-[1] flex h-[945px] w-[945px] scale-y-[-1] rotate-[225deg] items-center justify-center opacity-30">
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

        <div className="flex items-center gap-[41px]">
          <div className="relative mr-0 flex h-[110px] w-[110px] items-center justify-center">
            <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
          </div>
          <h1 className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]">
            Challenge
          </h1>
        </div>
      </div>

      {/* Description Section - SCROLLABLE */}
      <div className="relative z-[2] px-[120px] py-[250px]" data-scroll-section="description">
        <p className="max-w-[1010px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white">
          {renderRegisteredMark(description)}
        </p>
      </div>

      {/* Metrics Section - SCROLLABLE */}
      <div
        className="relative z-[2] flex w-full flex-col items-center px-[120px] py-[300px]"
        data-scroll-section="metrics-section"
      >
        <div className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]">
          {renderRegisteredMark(metricAmount)}
        </div>
        <p className="mt-[-142px] max-w-[1200px] text-center text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#6dcff6]">
          {renderRegisteredMark(metricDescription)}
        </p>
      </div>

      {/* Fixed Navigation Arrows */}
      <div className="fixed top-1/2 right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]">
        <div
          aria-label="Previous"
          className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleNavigateUp();
            }
          }}
          onPointerDown={handleNavigateUp}
          role="button"
          tabIndex={0}
        >
          <ArrowUp aria-hidden="true" className="h-full w-full text-[#6DCFF6]" focusable="false" strokeWidth={1.5} />
        </div>
        <div
          aria-label="Next"
          className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleNavigateDown();
            }
          }}
          onPointerDown={handleNavigateDown}
          role="button"
          tabIndex={0}
        >
          <ArrowDown aria-hidden="true" className="h-full w-full text-[#6DCFF6]" focusable="false" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

ThirdScreenTemplate.displayName = 'ThirdScreenTemplate';

export default ThirdScreenTemplate;
