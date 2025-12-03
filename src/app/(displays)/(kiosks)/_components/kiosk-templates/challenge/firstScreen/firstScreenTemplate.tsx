'use client';

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
  videoSrc = '/_videos/v1/3a042a38ece8bc71c733d7878d6e2f1d3104be52',
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
            className="block h-full w-full bg-red-500 object-cover object-center"
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
        className="absolute left-[128.17px] top-[745.23px] z-[10] flex items-center gap-[41px]"
        data-node-id="5168:9901"
      >
        <div
          // className={styles.challengeIcon}
          className="relative mr-[15px] flex h-[100px] w-[100px] items-center justify-center"
        >
          <img alt="" className="block h-full w-full object-contain" src={challengeIconSrc} />
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
        className="absolute right-[120px] top-[1760px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <img alt="Up" className="h-full w-full object-contain" src={arrowUpIconSrc ?? imgArrowNavUp} />
      </div>
      <div
        aria-label="Next"
        // className={styles.arrowDown}
        className="absolute right-[120px] top-[1980px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <img
          alt="Down"
          className="h-full w-full object-contain"
          src={arrowDownIconSrc ?? arrowIconSrc ?? imgArrowNavDown}
        />
      </div>

      {/* Problem Description Section */}
      <div
        // className={styles.problemSection}
        className="absolute left-[114px] top-[1432px] z-[5] w-[1390px]"
        data-node-id="5168:9893"
      >
        <p
          // className={styles.problemText}
          className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white"
        >
          {renderRegisteredMark(problemDescription)}
        </p>
      </div>

      {/* Gradient Background */}
      <div
        // className={styles.gradientBg}
        className="absolute left-0 top-[1058px] z-[2] h-[4085px] w-full rounded-t-[100px] bg-[linear-gradient(to_bottom,#1b75bc_0%,#14477d_98%)]"
        data-node-id="5168:9884"
      />

      {/* Savings Metrics Section */}
      <div
        // className={styles.savingsSection}
        className="absolute left-[-45px] top-[2455px] z-[5] flex w-[1390px] flex-col"
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
          className="relative left-[140px] top-[-40px] text-center text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#6dcff6]"
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
