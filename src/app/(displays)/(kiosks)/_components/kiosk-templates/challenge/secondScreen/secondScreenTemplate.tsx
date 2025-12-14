'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';
import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// import styles from './secondScreenTemplate.module.css';

// Asset constants from Figma MCP
const imgHero = '/images/kiosks/kiosk1/02-solution/Solution-Image1-Full.png';
const imgVector = '/images/kiosks/kiosk1/01-challenge/Challenge-Image1-Diamond.png';

export type SecondScreenTemplateProps = Readonly<{
  bottomDescription?: string;
  kioskId?: KioskId;
  largeIconSrc?: string;
  mainDescription?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  statAmount?: string;
  statDescription?: string;
  subheadline?: string | string[];
  topImageSrc?: string;
}>;

export const SecondScreenTemplate = ({
  bottomDescription = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  kioskId = DEFAULT_KIOSK_ID,
  largeIconSrc = imgVector,
  mainDescription = 'The Museum also needed assistance with physical storage for a collection of historical music artifacts.',
  onNavigateDown,
  onNavigateUp,
  statAmount = '',
  statDescription = 'The Museum needed a secure, off-site, cloud-accessible, and easily managed solution to protect its one-of-a-kind, irreplaceable footage. Storing the only master copy locally presented a high risk of losing all assets in the event of a data failure or system crash.',
  subheadline = 'Rich media &\n cultural heritage',
  topImageSrc = imgHero,
}: SecondScreenTemplateProps) => {
  return (
    <div
      // className={styles.container}
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-hero-image={topImageSrc}
      data-kiosk={kioskId}
      data-node-id="5168:9907"
    >
      {/* Subheadline */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute top-[368px] left-[120px] z-[10] -translate-y-full"
        data-node-id="5168:9918"
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
        className="absolute top-[745px] left-[128px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9925"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-[5px] flex h-[120px] w-[120px] items-center justify-center"
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

      {/* Stat Section (Left) */}
      <div
        // className={styles.statSection}
        className="absolute top-[1058px] left-[124px] z-[5] flex w-[940px] flex-col gap-[60px] opacity-60"
        data-node-id="5168:9913"
      >
        <div
          // className={styles.statAmount}
          className="text-[300px] leading-[1.3] font-[300] tracking-[-15px] whitespace-nowrap text-[#6dcff6]"
        >
          {renderRegisteredMark(statAmount)}
        </div>
        <p
          // className={styles.statDescription}
          className="text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#a8d4f6]"
        >
          {renderRegisteredMark(statDescription)}
        </p>
      </div>

      {/* Main Description (Right) */}
      <div
        // className={styles.mainDescription}
        className="absolute top-[2340px] left-[1160px] z-[6] w-[760px]"
        data-node-id="5168:9911"
      >
        <p
          // className={styles.descriptionText}
          className="relative top-[-275px] left-[-390px] w-[980px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white"
        >
          {renderRegisteredMark(mainDescription)}
        </p>
      </div>

      {/* Bottom Description */}
      <div
        // className={styles.bottomDescriptionContainer}
        className="absolute top-[4065px] left-[120px] z-[5] w-[971px]"
        data-node-id="5168:9919"
      >
        <p
          // className={styles.bottomDescriptionText}
          className="text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white"
        >
          {renderRegisteredMark(bottomDescription)}
        </p>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute top-[1755px] right-[130px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        data-node-id="5168:9923"
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
        className="absolute top-[1975px] right-[130px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        data-node-id="5168:9921"
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
        className="absolute top-[-223px] left-0 z-[2] h-[5504px] w-full rounded-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9910"
        style={{ background: 'transparent' }}
      />
      <div
        // className={styles.topGradientOverlay}
        className="pointer-events-none absolute top-0 left-0 z-[3] h-[1291px] w-full bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)]"
        data-node-id="5168:9916"
        style={{ background: 'transparent' }}
      />
      <div
        // className={styles.fadeOutGradient}
        className="pointer-events-none absolute top-[3696px] left-0 z-[3] h-[1423px] w-full -scale-y-100 bg-[linear-gradient(to_bottom,#154c83_42.41%,rgba(21,75,130,0)_98.852%)]"
        data-node-id="5168:9920"
        style={{ background: 'transparent' }}
      />

      {/* Large Background Icon */}
      <div
        // className={styles.largeIcon}
        className="pointer-events-none absolute top-[42%] left-[-21%] z-[4] flex size-[1506px] -scale-y-100 rotate-[180deg] items-center justify-center"
        data-node-id="5168:9917"
      >
        <div className="relative h-full w-full">
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
};

SecondScreenTemplate.displayName = 'SecondScreenTemplate';

export default SecondScreenTemplate;
