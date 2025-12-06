'use client';

import Image from 'next/image';

// import styles from './thirdScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';
import { DEFAULT_KIOSK_ID, type KioskId } from '../../../../_types/kiosk-id';

// Asset constants from Figma MCP
const imgArrowNavDown = '/images/kiosks/svgs/NavDownArrow.svg';
const imgArrowNavUp = '/images/kiosks/svgs/NavUpArrow.svg';
const imgHeroDiamond = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const imgMetricDiamond = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const imgVector = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Full.png';
const imgVector1 = imgMetricDiamond;
const imgVector2 = '/images/kiosks/svgs/ChallengesDiamond.svg';

export interface ThirdScreenTemplateProps {
  arrowDownIconSrc?: string;
  arrowIconSrc?: string;
  arrowUpIconSrc?: string;
  challengeIconSrc?: string;
  description?: string;
  heroImageSrc?: string;
  largeIconCenterSrc?: string;
  largeIconTopSrc?: string;
  metricAmount?: string;
  metricDescription?: string;
  metricImageSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  kioskId?: KioskId;
  subheadline?: string | string[];
  videoSrc?: string;
}

export default function ThirdScreenTemplate({
  arrowDownIconSrc = imgArrowNavDown,
  arrowIconSrc = imgArrowNavDown,
  arrowUpIconSrc = imgArrowNavUp,
  challengeIconSrc = imgVector2,
  description = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  heroImageSrc: _heroImageSrc = imgHeroDiamond,
  largeIconCenterSrc: _largeIconCenterSrc = imgVector1,
  largeIconTopSrc: _largeIconTopSrc = imgVector,
  metricAmount = '40 TB',
  metricDescription = 'of existing footage of data migration from physical drives into Iron Mountain’s digital preservation platform.',
  metricImageSrc = imgMetricDiamond,
  onNavigateDown,
  onNavigateUp,
  kioskId = DEFAULT_KIOSK_ID,
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/03-value/Value-header.mp4',
}: ThirdScreenTemplateProps) {
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-kiosk={kioskId}
      data-node-id="5168:9928"
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute left-0 top-0 z-[1] h-[1291px] w-full overflow-hidden"
        data-node-id="5168:9929"
      >
        <div className="relative left-[-7.5%] top-[-5.93%] h-[117.19%] w-[124.52%]">
          <video
            autoPlay
            loop
            playsInline
            muted
            controlsList="nodownload"
            // className={styles.video}
            className="h-full w-full object-cover object-center"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>


      {/* Subheadline */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute left-[120px] top-[368px] z-[10] -translate-y-full"
        data-node-id="5168:9935"
      >
        <h2
          // className={styles.subheadline}
          className="whitespace-pre-line text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]"
        >
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label */}
      <div
        // className={styles.challengeLabel}
        className="absolute left-[135px] top-[750px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9942"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-0 flex h-[110px] w-[110px] items-center justify-center"
        >
          <Image
            alt=""
            className="object-contain"
            fill
            sizes="110px"
            src={challengeIconSrc}
            unoptimized
          />
        </div>
        <h1
          // className={styles.challengeText}
          className="whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed]"
        >
          Challenge
        </h1>
      </div>

      {/* Description */}
      <div
        // className={styles.descriptionContainer}
        className="absolute left-[120px] top-[2115px] z-[5] w-[1010px]"
        data-node-id="5168:9932"
      >
        <p
          // className={styles.description}
          className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white"
        >
          {renderRegisteredMark(description)}
        </p>
      </div>

      {/* Metrics Section */}
      <div
        // className={styles.metricsSection}
        className="absolute left-[-80px] top-[3315px] z-[5] flex w-[1390px] flex-col gap-[100px] group-data-[kiosk=kiosk-2]/kiosk:left-[-180px] group-data-[kiosk=kiosk-2]/kiosk:top-[3395px]"
        data-node-id="5168:9945"
      >
        <div
          // className={styles.metricAmount}
          className="whitespace-nowrap text-center font-[300] text-[400px] leading-[1.3] tracking-[-20px] text-[#6dcff6]"
        >
          {renderRegisteredMark(metricAmount)}
        </div>
        <p
          // className={styles.metricDescription}
          className="relative left-[200px] top-[-142px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#6dcff6] group-data-[kiosk=kiosk-2]/kiosk:left-[300px]"
        >
          {renderRegisteredMark(metricDescription)}
        </p>
      </div>


      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute right-[120px] top-[1750px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <div className="relative h-full w-full">
          <Image
            alt="Up"
            className="object-contain"
            fill
            sizes="118px"
            src={arrowUpIconSrc ?? imgArrowNavUp}
            unoptimized
          />
        </div>
      </div>
      <div
        aria-label="Next"
        // className={styles.arrowDown}
        className="absolute right-[120px] top-[1980px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <div className="relative h-full w-full">
          <Image
            alt="Down"
            className="object-contain"
            fill
            sizes="118px"
            src={arrowDownIconSrc ?? arrowIconSrc ?? imgArrowNavDown}
            unoptimized
          />
        </div>
      </div>

      {/* Background Gradients */}
      <div
        // className={styles.gradientBg}
        className="absolute left-[0px] top-[-224px] z-[2] h-[5549px] w-[2158px] rounded-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9930"
      />
      <div
        // className={styles.topGradientOverlay}
        className="pointer-events-none absolute left-0 top-0 z-[3] h-[1732px] w-full bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)]"
        data-node-id="5168:9934"
      />

      <div
        // className={styles.largeIconCenter}
        className="pointer-events-none absolute left-[920px] top-[2415px] z-[4] flex h-[945px] w-[945px] items-center justify-center rotate-[225deg] scale-y-[-1]"
        data-node-id="5168:9936"
      >
        <div className="relative h-full w-full">
          <Image
            alt=""
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
