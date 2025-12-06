'use client';

import Image from 'next/image';

// import styles from './secondScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNavDown = '/images/kiosks/svgs/NavDownArrow.svg';
const imgArrowNavUp = '/images/kiosks/svgs/NavUpArrow.svg';
const imgHero = '/images/kiosks/kiosk1/02-solution/Solution-Image1-Full.png';
const imgVector = '/images/kiosks/kiosk1/01-challenge/Challenge-Image1-Diamond.png';
const imgVector1 = '/images/kiosks/svgs/ChallengesDiamond.svg';

export interface SecondScreenTemplateProps {
  arrowDownIconSrc?: string;
  arrowIconSrc?: string;
  arrowUpIconSrc?: string;
  bottomDescription?: string;
  bottomVideoSrc?: string;
  challengeIconSrc?: string;
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
  arrowDownIconSrc = imgArrowNavDown,
  arrowIconSrc = imgArrowNavDown,
  arrowUpIconSrc = imgArrowNavUp,
  bottomDescription = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  bottomVideoSrc = '',
  challengeIconSrc = imgVector1,
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
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-hero-image={topImageSrc}
      data-node-id="5168:9907"
    >


      {/* Bottom Video Section */}
      {showBottomVideo ? (
        <div
          // className={styles.bottomVideoContainer}
          className="absolute left-0 top-[4233px] z-[1] h-[1291px] w-full overflow-hidden"
          data-node-id="5168:9908"
        >
          <div className="relative left-[-30.42%] top-[-30.96%] h-[172.5%] w-[181.73%]">
            <video
              autoPlay
              loop
              playsInline
              muted
              controlsList="nodownload"
              // className={styles.bottomVideo}
              className="h-full w-full object-cover object-center"
            >
              <source src={bottomVideoSrc} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>
        </div>
      ) : null}

      {/* Subheadline */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute left-[120px] top-[368px] z-[10] -translate-y-full"
        data-node-id="5168:9918"
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
        className="absolute left-[128.17px] top-[745.23px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9925"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-[5px] flex h-[120px] w-[120px] items-center justify-center"
        >
          <Image
            alt=""
            className="object-contain"
            fill
            sizes="120px"
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

      {/* Stat Section (Left) */}
      <div
        // className={styles.statSection}
        className="absolute left-[124px] top-[1058px] z-[5] flex w-[940px] flex-col gap-[60px] opacity-60"
        data-node-id="5168:9913"
      >
        <div
          // className={styles.statAmount}
          className="whitespace-nowrap text-[300px] font-[300] leading-[1.3] tracking-[-15px] text-[#6dcff6]"
        >
          {renderRegisteredMark(statAmount)}
        </div>
        <p
          // className={styles.statDescription}
          className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#a8d4f6]"
        >
          {renderRegisteredMark(statDescription)}
        </p>
      </div>

      {/* Main Description (Right) */}
      <div
        // className={styles.mainDescription}
        className="absolute left-[1160px] top-[2340px] z-[6] w-[760px]"
        data-node-id="5168:9911"
      >
        <p
          // className={styles.descriptionText}
          className="font-normal left-[-380px] leading-[1.4] relative text-[60px] text-white tracking-[-3px] top-[-255px] w-[980px]"
        >
          {renderRegisteredMark(mainDescription)}
        </p>
      </div>

      {/* Bottom Description */}
      <div
        // className={styles.bottomDescriptionContainer}
        className="absolute left-[120px] top-[4065px] z-[5] w-[971px]"
        data-node-id="5168:9919"
      >
        <p
          // className={styles.bottomDescriptionText}
          className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white"
        >
          {renderRegisteredMark(bottomDescription)}
        </p>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute right-[110px] top-[1765px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        className="absolute right-[110px] top-[1995px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        className="absolute left-0 top-[-223px] z-[2] h-[5504px] w-full rounded-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9910"
      />
      <div
        // className={styles.topGradientOverlay}
        className="pointer-events-none absolute left-0 top-0 z-[3] h-[1291px] w-full bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)]"
        data-node-id="5168:9916"
      />
      <div
        // className={styles.fadeOutGradient}
        className="pointer-events-none absolute left-0 top-[3696px] z-[3] h-[1423px] w-full -scale-y-100 bg-[linear-gradient(to_bottom,#154c83_42.41%,rgba(21,75,130,0)_98.852%)]"
        data-node-id="5168:9920"
      />

      {/* Large Background Icon */}
      <div
        // className={styles.largeIcon}
        className="pointer-events-none absolute left-[-21.5%] top-[42.5%] z-[4] flex size-[1506px] -scale-y-100 items-center justify-center rotate-[180deg]"
        data-node-id="5168:9917"
      >
        <div className="relative h-full w-full">
          <Image
            alt=""
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
