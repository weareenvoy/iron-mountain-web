'use client';

// import styles from './thirdScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNarrowDown = 'http://localhost:3845/assets/0317ffc66a61baf023ab7ce353692457254030a6.svg';
const imgHeroDiamond = 'http://localhost:3845/assets/980d1dee1ed7de2996214b8db1a42986b97dc47d.png';
const imgMetricDiamond = 'http://localhost:3845/assets/f52f006df3b7e80cef930718c449ddff29312f59.png';
const imgVector = imgHeroDiamond;
const imgVector1 = imgMetricDiamond;
const imgVector2 = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface ThirdScreenTemplateProps {
  arrowIconSrc?: string;
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
  subheadline?: string | string[];
  videoSrc?: string;
}

export default function ThirdScreenTemplate({
  arrowIconSrc = imgArrowNarrowDown,
  challengeIconSrc = imgVector2,
  description = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  heroImageSrc = imgHeroDiamond,
  largeIconCenterSrc = imgVector1,
  largeIconTopSrc = imgVector,
  metricAmount = '40 TB',
  metricDescription = 'of existing footage of data migration from physical drives into Smart Vault.',
  metricImageSrc = imgMetricDiamond,
  onNavigateDown,
  onNavigateUp,
  subheadline = 'Rich media &\n cultural heritage',
  videoSrc = '/_videos/v1/3742b7e5490c6c79474014f5d41e4d50fe21d59a',
}: ThirdScreenTemplateProps) {
  return (
    <div
      // className={styles.container}
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-node-id="5168:9928"
    >
      {/* Video Section */}
      <div
        // className={styles.videoContainer}
        className="absolute left-0 top-0 z-[1] h-[1291px] w-full overflow-hidden"
        data-node-id="5168:9929"
      >
        <video
          autoPlay
          loop
          playsInline
          muted
          controlsList="nodownload"
          // className={styles.video}
          className="absolute left-[-7.5%] top-[-5.93%] h-[117.19%] w-[124.52%] bg-red-500 object-cover object-center"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Top Hero Diamond */}
      <div className="absolute left-[240px] top-[640px] z-[4] flex size-[520px] -translate-x-1/2 rotate-[45deg]">
        <img alt="" className="h-full w-full object-contain" src={heroImageSrc} />
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
          className="relative mr-[15px] flex h-[100px] w-[100px] items-center justify-center"
        >
          <div className="relative size-full rotate-[225deg] scale-y-[-1]">
            <img alt="" className="block h-full w-full object-contain" src={challengeIconSrc} />
          </div>
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
        className="absolute left-[118px] top-[2122px] z-[5] w-[971px]"
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
        className="absolute left-[-80px] top-[3324px] z-[5] flex w-[1390px] flex-col gap-[100px]"
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
          className="relative left-[200px] top-[-142px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#6dcff6]"
        >
          {renderRegisteredMark(metricDescription)}
        </p>
      </div>

      {/* Bottom Media Diamond */}
      <div className="absolute left-[332px] top-[3100px] z-[4] flex size-[520px] rotate-[45deg]">
        <img alt="" className="h-full w-full object-contain" src={metricImageSrc} />
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        // className={styles.arrowUp}
        className="absolute right-[120px] top-[1755px] z-[10] flex h-[118px] w-[118px] -scale-y-100 items-center justify-center"
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
        <img alt="Up" className="h-full w-full object-contain" src={arrowIconSrc} />
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
        <img alt="Down" className="h-full w-full object-contain" src={arrowIconSrc} />
      </div>

      {/* Background Gradients */}
      <div
        // className={styles.gradientBg}
        className="absolute left-[0.49px] top-[-224.49px] z-[2] h-[5549.29px] w-[2158.28px] rounded-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9930"
      />
      <div
        // className={styles.topGradientOverlay}
        className="pointer-events-none absolute left-0 top-0 z-[3] h-[1732px] w-full bg-[linear-gradient(to_bottom,#1968ab_66.076%,rgba(26,108,175,0)_99.322%)]"
        data-node-id="5168:9934"
      />

      {/* Large Background Icons */}
      <div
        // className={styles.largeIconTop}
        className="pointer-events-none absolute left-[-152px] top-[666px] z-[4] flex h-[1056px] w-[860px] items-center justify-center rotate-[225deg] scale-y-[-1]"
        data-node-id="5168:9933"
      >
        <img alt="" className="block h-full w-full object-contain" src={largeIconTopSrc} />
      </div>
      <div
        // className={styles.largeIconCenter}
        className="pointer-events-none absolute left-[1052px] top-[2536px] z-[4] flex h-[695px] w-[695px] items-center justify-center rotate-[225deg] scale-y-[-1]"
        data-node-id="5168:9936"
      >
        <img alt="" className="block h-full w-full object-contain" src={largeIconCenterSrc} />
      </div>
    </div>
  );
}
