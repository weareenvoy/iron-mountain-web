'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';

import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import { DEFAULT_KIOSK_ID } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// import styles from './firstScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

export interface FirstScreenTemplateProps {
  challengeLabel?: string;
  kioskId?: KioskId;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  problemDescription?: string;
  savingsAmount?: string;
  savingsDescription?: string;
  subheadline?: string | string[];
  videoSrc?: string;
}

export default function FirstScreenTemplate({
  challengeLabel = 'Challenge',
  kioskId = DEFAULT_KIOSK_ID,
  onNavigateDown,
  onNavigateUp,
  problemDescription = 'The Museum needed a secure, off-site, cloud-accessible, and easily managed solution to protect its one-of-a-kind, irreplaceable footage. Storing the only master copy locally presented a high risk of losing all assets in the event of a data failure or system crash.',
  savingsAmount = '120 TB',
  savingsDescription = 'of data is safely stored and accessible for the Museum.',
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/01-challenge/Challenge-Header.mp4',
}: FirstScreenTemplateProps) {
  return (
    <div
      // className={styles.container}
      className="bg-black flex flex-col group/kiosk h-screen overflow-hidden relative w-full"
      data-kiosk={kioskId}
      data-node-id="5168:9882"
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute bg-transparent h-[1291px] left-0 overflow-hidden top-0 w-full z-[1]"
        data-node-id="5168:9883"
      >
        <div className="h-full relative w-full">
          <video
            autoPlay
            loop
            playsInline
            muted
            controlsList="nodownload"
            // className={styles.video}
            className="block h-full object-center object-cover w-full"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute bg-black/20 inset-0 pointer-events-none" />
        </div>
      </div>

      {/* Subheadline - positioned above challenge section */}
      <div
        // className={styles.subheadlineContainer}
        className="-translate-y-full absolute left-[120px] top-[368px] z-[10]"
        data-node-id="5168:9896"
      >
        <h2
          // className={styles.subheadline}
          className="font-normal leading-[1.4] text-[#ededed] text-[60px] tracking-[-3px] whitespace-pre-line"
        >
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label Section */}
      <div
        // className={styles.challengeLabel}
        className="absolute flex gap-[41px] items-center left-[128px] top-[745px] z-[10]"
        data-node-id="5168:9901"
      >
        <div
          // className={styles.challengeIcon}
          className="flex h-[110px] items-center justify-center mr-[5px] relative w-[110px]"
        >
          <Diamond aria-hidden="true" className="h-full text-[#ededed] w-full" focusable="false" strokeWidth={1.25} />
        </div>
        <h1
          // className={styles.challengeText}
          className="font-normal leading-[1.3] text-[#ededed] text-[126.031px] tracking-[-6.3015px] whitespace-nowrap"
        >
          {renderRegisteredMark(challengeLabel)}
        </h1>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute flex group-data-[kiosk=kiosk-2]/kiosk:h-[140px] group-data-[kiosk=kiosk-2]/kiosk:right-[120px] group-data-[kiosk=kiosk-2]/kiosk:top-[1740px] group-data-[kiosk=kiosk-2]/kiosk:w-[120px] group-data-[kiosk=kiosk-3]/kiosk:right-[130px] group-data-[kiosk=kiosk-3]/kiosk:top-[1760px] h-[118px] items-center justify-center right-[110px] top-[1770px] w-[118px] z-[10]"
        data-node-id="5168:9899"
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
        className="absolute flex group-data-[kiosk=kiosk-2]/kiosk:h-[140px] group-data-[kiosk=kiosk-2]/kiosk:right-[120px] group-data-[kiosk=kiosk-2]/kiosk:top-[1970px] group-data-[kiosk=kiosk-2]/kiosk:w-[120px] group-data-[kiosk=kiosk-3]/kiosk:right-[130px] group-data-[kiosk=kiosk-3]/kiosk:top-[1980px] h-[118px] items-center justify-center right-[110px] top-[1990px] w-[118px] z-[10]"
        data-node-id="5168:9897"
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

      {/* Problem Description Section */}
      <div
        // className={styles.problemSection}
        className="absolute group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-2]/kiosk:top-[1240px] group-data-[kiosk=kiosk-2]/kiosk:w-[1370px] left-[115px] top-[1230px] w-[1390px] z-[5]"
        data-node-id="5168:9893"
      >
        <p
          // className={styles.problemText}
          className="font-normal group-data-[kiosk=kiosk-2]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-2]/kiosk:left-0 group-data-[kiosk=kiosk-2]/kiosk:top-[200px] group-data-[kiosk=kiosk-3]/kiosk:left-[-25px] group-data-[kiosk=kiosk-3]/kiosk:text-[80px] group-data-[kiosk=kiosk-3]/kiosk:top-[200px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-4px] leading-[1.4] left-[5px] relative text-[60px] text-white top-[210px] tracking-[-3px]"
        >
          {renderRegisteredMark(problemDescription)}
        </p>
      </div>

      {/* Gradient Background */}
      <div
        // className={styles.gradientBg}
        className="absolute bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)] h-[4085px] left-0 rounded-t-[100px] top-[1060px] w-full z-[2]"
        data-node-id="5168:9884"
      />

      {/* Savings Metrics Section */}
      <div
        // className={styles.savingsSection}
        className="absolute flex flex-col group-data-[kiosk=kiosk-2]/kiosk:left-[-105px] group-data-[kiosk=kiosk-3]/kiosk:left-[-15px] group-data-[kiosk=kiosk-3]/kiosk:top-[2445px] left-[-45px] top-[2465px] w-[1390px] z-[5]"
        data-node-id="5168:9904"
      >
        <div
          // className={styles.savingsAmount}
          className="font-[300] leading-[1.3] text-[#6dcff6] text-[400px] text-center tracking-[-20px] whitespace-nowrap"
        >
          {renderRegisteredMark(savingsAmount)}
        </div>
        <p
          // className={styles.savingsDescription}
          className="font-normal group-data-[kiosk=kiosk-2]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-2]/kiosk:left-[220px] group-data-[kiosk=kiosk-2]/kiosk:top-[-30px] group-data-[kiosk=kiosk-3]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-3]/kiosk:left-[130px] group-data-[kiosk=kiosk-3]/kiosk:top-[-50px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-3px] leading-[1.4] left-[160px] relative text-[#6dcff6] text-[60px] text-left top-[-40px] tracking-[-3px] whitespace-pre-line"
        >
          {renderRegisteredMark(savingsDescription)}
        </p>
      </div>

      {/* Fade Out Gradient */}
      <div
        // className={styles.fadeOutGradient}
        className="-scale-y-100 absolute bg-[linear-gradient(to_bottom,#154c83_42.41%,rgba(21,75,130,0)_98.852%)] h-[1369px] left-0 pointer-events-none top-[3750px] w-full z-[3]"
        data-node-id="5168:9895"
      />
    </div>
  );
}

FirstScreenTemplate.displayName = 'FirstScreenTemplate';
