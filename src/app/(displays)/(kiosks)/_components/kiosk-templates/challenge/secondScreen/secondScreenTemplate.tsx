'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';
import Image from 'next/image';

// import styles from './secondScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgHero = '/images/kiosks/kiosk1/02-solution/Solution-Image1-Full.png';
const imgVector = '/images/kiosks/kiosk1/01-challenge/Challenge-Image1-Diamond.png';

export interface SecondScreenTemplateProps {
  bottomDescription?: string;
  bottomVideoSrc?: string;
  largeIconSrc?: string;
  mainDescription?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  statAmount?: string;
  statDescription?: string;
  subheadline?: string | string[];
  topImageSrc?: string;
}

export default function SecondScreenTemplate({
  bottomDescription = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  bottomVideoSrc = '',
  largeIconSrc = imgVector,
  mainDescription = 'The Museum also needed assistance with physical storage for a collection of historical music artifacts.',
  onNavigateDown,
  onNavigateUp,
  statAmount = '',
  statDescription = 'The Museum needed a secure, off-site, cloud-accessible, and easily managed solution to protect its one-of-a-kind, irreplaceable footage. Storing the only master copy locally presented a high risk of losing all assets in the event of a data failure or system crash.',
  subheadline = 'Rich media &\n cultural heritage',
  topImageSrc = imgHero,
}: SecondScreenTemplateProps) {
  const showBottomVideo = Boolean(bottomVideoSrc);

  return (
    <div
      // className={styles.container}
      className="bg-black flex flex-col h-screen overflow-hidden relative w-full"
      data-hero-image={topImageSrc}
      data-node-id="5168:9907"
    >


      {/* Bottom Video Section */}
      {showBottomVideo ? (
        <div
          // className={styles.bottomVideoContainer}
          className="absolute h-[1291px] left-0 overflow-hidden top-[4233px] w-full z-[1]"
          data-node-id="5168:9908"
        >
          <div className="h-[172.5%] left-[-30.42%] relative top-[-30.96%] w-[181.73%]">
            <video
              autoPlay
              loop
              playsInline
              muted
              controlsList="nodownload"
              // className={styles.bottomVideo}
              className="h-full object-center object-cover w-full"
            >
              <source src={bottomVideoSrc} type="video/mp4" />
            </video>
            <div className="absolute bg-black/20 inset-0 pointer-events-none" />
          </div>
        </div>
      ) : null}

      {/* Subheadline */}
      <div
        // className={styles.subheadlineContainer}
        className="-translate-y-full absolute left-[120px] top-[368px] z-[10]"
        data-node-id="5168:9918"
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
        className="absolute flex gap-[41px] items-center left-[128px] top-[745px] z-[10]"
        data-node-id="5168:9925"
      >
        <div
          // className={styles.challengeIcon}
          className="flex h-[120px] items-center justify-center mr-[5px] relative w-[120px]"
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

      {/* Stat Section (Left) */}
      <div
        // className={styles.statSection}
        className="absolute flex flex-col gap-[60px] left-[124px] opacity-60 top-[1058px] w-[940px] z-[5]"
        data-node-id="5168:9913"
      >
        <div
          // className={styles.statAmount}
          className="font-[300] leading-[1.3] text-[#6dcff6] text-[300px] tracking-[-15px] whitespace-nowrap"
        >
          {renderRegisteredMark(statAmount)}
        </div>
        <p
          // className={styles.statDescription}
          className="font-normal leading-[1.4] text-[#a8d4f6] text-[60px] tracking-[-3px]"
        >
          {renderRegisteredMark(statDescription)}
        </p>
      </div>

      {/* Main Description (Right) */}
      <div
        // className={styles.mainDescription}
        className="absolute left-[1160px] top-[2340px] w-[760px] z-[6]"
        data-node-id="5168:9911"
      >
        <p
          // className={styles.descriptionText}
          className="font-normal leading-[1.4] left-[-390px] relative text-[60px] text-white top-[-275px] tracking-[-3px] w-[980px]"
        >
          {renderRegisteredMark(mainDescription)}
        </p>
      </div>

      {/* Bottom Description */}
      <div
        // className={styles.bottomDescriptionContainer}
        className="absolute left-[120px] top-[4065px] w-[971px] z-[5]"
        data-node-id="5168:9919"
      >
        <p
          // className={styles.bottomDescriptionText}
          className="font-normal leading-[1.4] text-[60px] text-white tracking-[-3px]"
        >
          {renderRegisteredMark(bottomDescription)}
        </p>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute flex h-[118px] items-center justify-center right-[130px] top-[1755px] w-[118px] z-[10]"
        data-node-id="5168:9923"
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
        className="absolute flex h-[118px] items-center justify-center right-[130px] top-[1975px] w-[118px] z-[10]"
        data-node-id="5168:9921"
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
        className="absolute bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)] h-[5504px] left-0 rounded-[100px] top-[-223px] w-full z-[2]"
        data-node-id="5168:9910"
      />
      <div
        // className={styles.topGradientOverlay}
        className="absolute bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)] h-[1291px] left-0 pointer-events-none top-0 w-full z-[3]"
        data-node-id="5168:9916"
      />
      <div
        // className={styles.fadeOutGradient}
        className="-scale-y-100 absolute bg-[linear-gradient(to_bottom,#154c83_42.41%,rgba(21,75,130,0)_98.852%)] h-[1423px] left-0 pointer-events-none top-[3696px] w-full z-[3]"
        data-node-id="5168:9920"
      />

      {/* Large Background Icon */}
      <div
        // className={styles.largeIcon}
        className="-scale-y-100 absolute flex items-center justify-center left-[-21%] pointer-events-none rotate-[180deg] size-[1506px] top-[42%] z-[4]"
        data-node-id="5168:9917"
      >
        <div className="h-full relative w-full">
          <Image
            alt="Large decorative background diamond"
            className="object-contain"
            fill
            sizes="1506px"
            src={largeIconSrc}
            style={{ transform: 'scaleX(-1)' }}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}

SecondScreenTemplate.displayName = 'SecondScreenTemplate';
