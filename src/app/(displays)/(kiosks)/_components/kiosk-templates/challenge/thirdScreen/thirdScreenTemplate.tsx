'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '../../../../_types/kiosk-id';
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
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-hero-image={heroImageSrc}
      data-kiosk={kioskId}
      data-large-icon-center={largeIconCenterSrc}
      data-large-icon-top={largeIconTopSrc}
      data-node-id="5168:9928"
      data-video-src={videoSrc}
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute top-0 left-0 z-[1] h-[1291px] w-full overflow-hidden"
        data-node-id="5168:9929"
      >
        <div className="relative top-[-5.93%] left-[-7.5%] h-[117.19%] w-[124.52%]">
          <video
            autoPlay
            className="h-full w-full object-cover object-center"
            controlsList="nodownload"
            loop
            muted
            playsInline
            // className={styles.video}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Subheadline */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute top-[368px] left-[120px] z-[10] -translate-y-full"
        data-node-id="5168:9935"
      >
        <h2
          // className={styles.subheadline}
          className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]"
        >
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label */}
      <div
        // className={styles.challengeLabel}
        className="absolute top-[750px] left-[135px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9942"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-0 flex h-[110px] w-[110px] items-center justify-center"
        >
          <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1
          // className={styles.challengeText}
          className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]"
        >
          Challenge
        </h1>
      </div>

      {/* Description */}
      <div
        // className={styles.descriptionContainer}
        className="absolute top-[2115px] left-[120px] z-[5] w-[1010px]"
        data-node-id="5168:9932"
      >
        <p
          // className={styles.description}
          className="text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white"
        >
          {renderRegisteredMark(description)}
        </p>
      </div>

      {/* Metrics Section */}
      <div
        // className={styles.metricsSection}
        className="absolute top-[3315px] left-[-80px] z-[5] flex w-[1390px] flex-col gap-[100px] group-data-[kiosk=kiosk-2]/kiosk:top-[3395px] group-data-[kiosk=kiosk-2]/kiosk:left-[-180px]"
        data-node-id="5168:9945"
      >
        <div
          // className={styles.metricAmount}
          className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]"
        >
          {renderRegisteredMark(metricAmount)}
        </div>
        <p
          // className={styles.metricDescription}
          className="relative top-[-142px] left-[200px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#6dcff6] group-data-[kiosk=kiosk-2]/kiosk:left-[300px]"
        >
          {renderRegisteredMark(metricDescription)}
        </p>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute top-[1750px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        data-node-id="5168:9940"
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateUp?.();
          }
        }}
        onPointerDown={() => onNavigateUp?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowUp aria-hidden="true" className="h-full w-full text-[#ffffff66]" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        // className={styles.arrowDown}
        className="absolute top-[1980px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        data-node-id="5168:9938"
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateDown?.();
          }
        }}
        onPointerDown={() => onNavigateDown?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowDown aria-hidden="true" className="h-full w-full text-[#ffffff66]" focusable="false" strokeWidth={1.5} />
      </div>

      {/* Background Gradients */}
      <div
        // className={styles.gradientBg}
        className="absolute top-[-224px] left-[0px] z-[2] h-[5549px] w-[2158px] rounded-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9930"
      />
      <div
        // className={styles.topGradientOverlay}
        className="pointer-events-none absolute top-0 left-0 z-[3] h-[1732px] w-full bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)]"
        data-node-id="5168:9934"
      />

      <div
        // className={styles.largeIconCenter}
        className="pointer-events-none absolute top-[2415px] left-[920px] z-[4] flex h-[945px] w-[945px] scale-y-[-1] rotate-[225deg] items-center justify-center"
        data-node-id="5168:9936"
      >
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
    </div>
  );
};

ThirdScreenTemplate.displayName = 'ThirdScreenTemplate';

export default ThirdScreenTemplate;
