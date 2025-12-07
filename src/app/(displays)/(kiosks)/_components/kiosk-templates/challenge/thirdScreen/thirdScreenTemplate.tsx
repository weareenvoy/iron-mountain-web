'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';
import Image from 'next/image';

// import styles from './thirdScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';
import { DEFAULT_KIOSK_ID, type KioskId } from '../../../../_types/kiosk-id';

// Asset constants from Figma MCP
const imgHeroDiamond = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const imgMetricDiamond = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const imgVector = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Full.png';
const imgVector1 = imgMetricDiamond;

export interface ThirdScreenTemplateProps {
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
}

export default function ThirdScreenTemplate({
  description = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  heroImageSrc: _heroImageSrc = imgHeroDiamond,
  kioskId = DEFAULT_KIOSK_ID,
  largeIconCenterSrc: _largeIconCenterSrc = imgVector1,
  largeIconTopSrc: _largeIconTopSrc = imgVector,
  metricAmount = '40 TB',
  metricDescription = 'of existing footage of data migration from physical drives into Iron Mountain’s digital preservation platform.',
  metricImageSrc = imgMetricDiamond,
  onNavigateDown,
  onNavigateUp,
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/03-value/Value-header.mp4',
}: ThirdScreenTemplateProps) {
  return (
    <div
      // className={styles.container}
      className="bg-black flex flex-col group/kiosk h-screen overflow-hidden relative w-full"
      data-kiosk={kioskId}
      data-node-id="5168:9928"
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute h-[1291px] left-0 overflow-hidden top-0 w-full z-[1]"
        data-node-id="5168:9929"
      >
        <div className="h-[117.19%] left-[-7.5%] relative top-[-5.93%] w-[124.52%]">
          <video
            autoPlay
            loop
            playsInline
            muted
            controlsList="nodownload"
            // className={styles.video}
            className="h-full object-center object-cover w-full"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute bg-black/20 inset-0 pointer-events-none" />
        </div>
      </div>


      {/* Subheadline */}
      <div
        // className={styles.subheadlineContainer}
        className="-translate-y-full absolute left-[120px] top-[368px] z-[10]"
        data-node-id="5168:9935"
      >
        <h2
          // className={styles.subheadline}
          className="font-normal leading-[1.4] text-[#ededed] text-[60px] tracking-[-3px] whitespace-pre-line"
        >
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label */}
      <div
        // className={styles.challengeLabel}
        className="absolute flex gap-[41px] items-center left-[135px] top-[750px] z-[10]"
        data-node-id="5168:9942"
      >
        <div
          // className={styles.challengeIcon}
          className="flex h-[110px] items-center justify-center mr-0 relative w-[110px]"
        >
          <Diamond aria-hidden="true" className="h-full text-[#ededed] w-full" focusable="false" strokeWidth={1.25} />
        </div>
        <h1
          // className={styles.challengeText}
          className="font-normal leading-[1.3] text-[#ededed] text-[126.031px] tracking-[-6.3015px] whitespace-nowrap"
        >
          Challenge
        </h1>
      </div>

      {/* Description */}
      <div
        // className={styles.descriptionContainer}
        className="absolute left-[120px] top-[2115px] w-[1010px] z-[5]"
        data-node-id="5168:9932"
      >
        <p
          // className={styles.description}
          className="font-normal leading-[1.4] text-[60px] text-white tracking-[-3px]"
        >
          {renderRegisteredMark(description)}
        </p>
      </div>

      {/* Metrics Section */}
      <div
        // className={styles.metricsSection}
        className="absolute flex flex-col gap-[100px] group-data-[kiosk=kiosk-2]/kiosk:left-[-180px] group-data-[kiosk=kiosk-2]/kiosk:top-[3395px] left-[-80px] top-[3315px] w-[1390px] z-[5]"
        data-node-id="5168:9945"
      >
        <div
          // className={styles.metricAmount}
          className="font-[300] leading-[1.3] text-[#6dcff6] text-[400px] text-center tracking-[-20px] whitespace-nowrap"
        >
          {renderRegisteredMark(metricAmount)}
        </div>
        <p
          // className={styles.metricDescription}
          className="font-normal group-data-[kiosk=kiosk-2]/kiosk:left-[300px] leading-[1.4] left-[200px] relative text-[#6dcff6] text-[60px] top-[-142px] tracking-[-3px]"
        >
          {renderRegisteredMark(metricDescription)}
        </p>
      </div>


      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1750px] w-[118px] z-[10]"
        data-node-id="5168:9940"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateUp?.();
          }
        }}
        onPointerDown={() => onNavigateUp?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowUp aria-hidden="true" className="h-full text-[#ffffff66] w-full" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        // className={styles.arrowDown}
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1980px] w-[118px] z-[10]"
        data-node-id="5168:9938"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateDown?.();
          }
        }}
        onPointerDown={() => onNavigateDown?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowDown aria-hidden="true" className="h-full text-[#ffffff66] w-full" focusable="false" strokeWidth={1.5} />
      </div>

      {/* Background Gradients */}
      <div
        // className={styles.gradientBg}
        className="absolute bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)] h-[5549px] left-[0px] rounded-[100px] top-[-224px] w-[2158px] z-[2]"
        data-node-id="5168:9930"
      />
      <div
        // className={styles.topGradientOverlay}
        className="absolute bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)] h-[1732px] left-0 pointer-events-none top-0 w-full z-[3]"
        data-node-id="5168:9934"
      />

      <div
        // className={styles.largeIconCenter}
        className="absolute flex h-[945px] items-center justify-center left-[920px] pointer-events-none rotate-[225deg] scale-y-[-1] top-[2415px] w-[945px] z-[4]"
        data-node-id="5168:9936"
      >
        <div className="h-full relative w-full">
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
}

ThirdScreenTemplate.displayName = 'ThirdScreenTemplate';
