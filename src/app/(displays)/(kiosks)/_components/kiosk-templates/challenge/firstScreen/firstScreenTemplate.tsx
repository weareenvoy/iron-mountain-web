'use client';

import Image from 'next/image';

// import styles from './firstScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNavDown = '/images/kiosks/svgs/NavDownArrow.svg';
const imgArrowNavUp = '/images/kiosks/svgs/NavUpArrow.svg';
const imgVector = '/images/kiosks/svgs/ChallengesDiamond.svg';

export interface FirstScreenTemplateProps {
  arrowDownIconSrc?: string;
  arrowIconSrc?: string;
  arrowUpIconSrc?: string;
  challengeIconSrc?: string;
  challengeLabel?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  problemDescription?: string;
  savingsAmount?: string;
  savingsDescription?: string;
  subheadline?: string | string[];
  videoSrc?: string;
}

export default function FirstScreenTemplate({
  arrowDownIconSrc = imgArrowNavDown,
  arrowIconSrc = imgArrowNavDown,
  arrowUpIconSrc = imgArrowNavUp,
  challengeIconSrc = imgVector,
  challengeLabel = 'Challenge',
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
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-node-id="5168:9882"
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute left-0 top-0 z-[1] h-[1291px] w-full overflow-hidden bg-transparent"
        data-node-id="5168:9883"
      >
        <div className="relative h-full w-full">
          <video
            autoPlay
            loop
            playsInline
            muted
            controlsList="nodownload"
            // className={styles.video}
            className="block h-full w-full object-cover object-center"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Subheadline - positioned above challenge section */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute left-[120px] top-[368px] z-[10] -translate-y-full"
        data-node-id="5168:9896"
      >
        <h2
          // className={styles.subheadline}
          className="whitespace-pre-line text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]"
        >
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label Section */}
      <div
        // className={styles.challengeLabel}
        className="absolute left-[128px] top-[745px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9901"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-[5px] flex h-[110px] w-[110px] items-center justify-center"
        >
          <Image
            alt=""
            className="object-contain"
            fill
            sizes="100px"
            src={challengeIconSrc}
            unoptimized
          />
        </div>
        <h1
          // className={styles.challengeText}
          className="whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed]"
        >
          {renderRegisteredMark(challengeLabel)}
        </h1>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute right-[100px] top-[1740px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        className="absolute right-[100px] top-[1970px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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

      {/* Problem Description Section */}
      <div
        // className={styles.problemSection}
        className="absolute left-[115px] top-[1230px] z-[5] w-[1390px]"
        data-node-id="5168:9893"
      >
        <p
          // className={styles.problemText}
          className="text-[80px] font-normal leading-[1.4] tracking-[-3px] text-white"
        >
          {renderRegisteredMark(problemDescription)}
        </p>
      </div>

      {/* Gradient Background */}
      <div
        // className={styles.gradientBg}
        className="absolute left-0 top-[1030px] z-[2] h-[4085px] w-full rounded-t-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9884"
      />

      {/* Savings Metrics Section */}
      <div
        // className={styles.savingsSection}
        className="absolute left-[-115px] top-[2675px] z-[5] flex w-[1390px] flex-col"
        data-node-id="5168:9904"
      >
        <div
          // className={styles.savingsAmount}
          className="whitespace-nowrap text-center font-[300] text-[400px] leading-[1.3] tracking-[-20px] text-[#6dcff6]"
        >
          {renderRegisteredMark(savingsAmount)}
        </div>
        <p
          // className={styles.savingsDescription}
          className="relative left-[240px] top-0 whitespace-pre-line text-left text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#6dcff6]"
        >
          {renderRegisteredMark(savingsDescription)}
        </p>
      </div>

      {/* Fade Out Gradient */}
      <div
        // className={styles.fadeOutGradient}
        className="pointer-events-none absolute left-0 top-[3750px] z-[3] h-[1369px] w-full -scale-y-100 bg-[linear-gradient(to_bottom,#154c83_42.41%,rgba(21,75,130,0)_98.852%)]"
        data-node-id="5168:9895"
      />
    </div>
  );
}
