'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
// import styles from './firstScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

export type FirstScreenTemplateProps = Readonly<{
  challengeLabel?: string;
  kioskId?: KioskId;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  problemDescription?: string;
  savingsAmount?: string;
  savingsDescription?: string;
  subheadline?: string | string[];
  videoSrc?: string;
}>;

export const FirstScreenTemplate = ({
  challengeLabel = 'Challenge',
  kioskId = DEFAULT_KIOSK_ID,
  onNavigateDown,
  onNavigateUp,
  problemDescription = 'The Museum needed a secure, off-site, cloud-accessible, and easily managed solution to protect its one-of-a-kind, irreplaceable footage. Storing the only master copy locally presented a high risk of losing all assets in the event of a data failure or system crash.',
  savingsAmount = '120 TB',
  savingsDescription = 'of data is safely stored and accessible for the Museum.',
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/images/kiosks/kiosk1/01-challenge/Challenge-Header.mp4',
}: FirstScreenTemplateProps) => {
  return (
    <div
      // className={styles.container}
      className="group/kiosk relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-kiosk={kioskId}
      data-node-id="5168:9882"
      style={{ overflow: 'visible' }}
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute top-0 left-0 z-[1] h-[1291px] w-full overflow-hidden bg-transparent"
        data-node-id="5168:9883"
      >
        <div className="relative h-full w-full">
          <video
            autoPlay
            className="block h-full w-full object-cover object-center"
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

      {/* Subheadline - positioned above challenge section */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute top-[368px] left-[120px] z-[10] -translate-y-full"
        data-node-id="5168:9896"
      >
        <h2
          // className={styles.subheadline}
          className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]"
        >
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label Section */}
      <div
        // className={styles.challengeLabel}
        className="absolute top-[745px] left-[128px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9901"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-[5px] flex h-[110px] w-[110px] items-center justify-center"
        >
          <Diamond aria-hidden="true" className="h-full w-full text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1
          // className={styles.challengeText}
          className="text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]"
        >
          {renderRegisteredMark(challengeLabel)}
        </h1>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute top-[1770px] right-[110px] z-[10] flex h-[118px] w-[118px] items-center justify-center group-data-[kiosk=kiosk-2]/kiosk:top-[1740px] group-data-[kiosk=kiosk-2]/kiosk:right-[120px] group-data-[kiosk=kiosk-2]/kiosk:h-[140px] group-data-[kiosk=kiosk-2]/kiosk:w-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[1760px] group-data-[kiosk=kiosk-3]/kiosk:right-[130px]"
        data-node-id="5168:9899"
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
      <ArrowUp aria-hidden="true" className="h-full w-full text-[#6DCFF6]" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        // className={styles.arrowDown}
        className="absolute top-[1990px] right-[110px] z-[10] flex h-[118px] w-[118px] items-center justify-center group-data-[kiosk=kiosk-2]/kiosk:top-[1970px] group-data-[kiosk=kiosk-2]/kiosk:right-[120px] group-data-[kiosk=kiosk-2]/kiosk:h-[140px] group-data-[kiosk=kiosk-2]/kiosk:w-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[1980px] group-data-[kiosk=kiosk-3]/kiosk:right-[130px]"
        data-node-id="5168:9897"
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
      <ArrowDown aria-hidden="true" className="h-full w-full text-[#6DCFF6]" focusable="false" strokeWidth={1.5} />
      </div>

      {/* Problem Description Section */}
      <div
        // className={styles.problemSection}
        className="absolute top-[1230px] left-[115px] z-[5] w-[1390px] group-data-[kiosk=kiosk-2]/kiosk:top-[1240px] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-2]/kiosk:w-[1370px]"
        data-node-id="5168:9893"
      >
        <p
          // className={styles.problemText}
          className="relative top-[210px] left-[5px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white group-data-[kiosk=kiosk-2]/kiosk:top-[200px] group-data-[kiosk=kiosk-2]/kiosk:left-0 group-data-[kiosk=kiosk-2]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-3]/kiosk:top-[200px] group-data-[kiosk=kiosk-3]/kiosk:left-[-25px] group-data-[kiosk=kiosk-3]/kiosk:text-[80px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-4px]"
        >
          {renderRegisteredMark(problemDescription)}
        </p>
      </div>

      {/* Gradient Background */}
      <div
        // className={styles.gradientBg}
        className="absolute top-[1060px] left-0 z-[2] h-[4085px] w-full rounded-t-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9884"
        style={{ height: '14570px' }}
      />

      {/* Savings Metrics Section */}
      <div
        // className={styles.savingsSection}
        className="absolute top-[2465px] left-[-45px] z-[5] flex w-[1390px] flex-col group-data-[kiosk=kiosk-2]/kiosk:left-[-105px] group-data-[kiosk=kiosk-3]/kiosk:top-[2445px] group-data-[kiosk=kiosk-3]/kiosk:left-[-15px]"
        data-node-id="5168:9904"
      >
        <div
          // className={styles.savingsAmount}
          className="text-center text-[400px] leading-[1.3] font-[300] tracking-[-20px] whitespace-nowrap text-[#6dcff6]"
        >
          {renderRegisteredMark(savingsAmount)}
        </div>
        <p
          // className={styles.savingsDescription}
          className="relative top-[-40px] left-[160px] text-left text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#6dcff6] group-data-[kiosk=kiosk-2]/kiosk:top-[-30px] group-data-[kiosk=kiosk-2]/kiosk:left-[220px] group-data-[kiosk=kiosk-2]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-3]/kiosk:top-[-50px] group-data-[kiosk=kiosk-3]/kiosk:left-[130px] group-data-[kiosk=kiosk-3]/kiosk:leading-[1.3] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-3px]"
        >
          {renderRegisteredMark(savingsDescription)}
        </p>
      </div>

      {/* Fade Out Gradient */}
      <div
        // className={styles.fadeOutGradient}
        className="pointer-events-none absolute top-[3750px] left-0 z-[3] h-[1369px] w-full -scale-y-100 bg-[linear-gradient(to_bottom,#154c83_42.41%,rgba(21,75,130,0)_98.852%)]"
        data-node-id="5168:9895"
        style={{ height: '11880px' }}
      />
    </div>
  );
};

FirstScreenTemplate.displayName = 'FirstScreenTemplate';

export default FirstScreenTemplate;
