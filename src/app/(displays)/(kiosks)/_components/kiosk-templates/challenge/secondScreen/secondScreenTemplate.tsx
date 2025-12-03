'use client';

// import styles from './secondScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNavDown = '/images/kiosks/svgs/NavDownArrow.svg';
const imgArrowNavUp = '/images/kiosks/svgs/NavUpArrow.svg';
const imgHero = 'http://localhost:3845/assets/40afdcf461baafad39ec3925ac4fd501259151d6.png';
const imgVector = 'http://localhost:3845/assets/40afdcf461baafad39ec3925ac4fd501259151d6.png';
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
  bottomVideoSrc = '/_videos/v1/a532f40a2a6848e2a80788002b6cb925a1f4c3c2',
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
  return (
    <div
      // className={styles.container}
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-node-id="5168:9907"
    >
      {/* Hero Image */}
      <div
        // className={styles.topVideoContainer}
        className="absolute left-0 top-0 z-[1] h-[1291px] w-full overflow-hidden"
        data-node-id="5168:9909"
      >
        <img
          alt=""
          // className={styles.topVideo}
          className="absolute left-[-7.5%] top-[-5.93%] h-[117.19%] w-[124.52%] object-cover object-center"
          src={topImageSrc}
        />
      </div>

      {/* Bottom Video Section */}
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
            className="h-full w-full bg-red-500 object-cover object-center"
          >
            <source src={bottomVideoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>

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
          className="relative mr-[15px] flex h-[100px] w-[100px] items-center justify-center"
        >
          <img alt="" className="block h-full w-full object-contain" src={challengeIconSrc} />
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
        className="absolute left-[124px] top-[1058px] z-[5] flex w-[1390px] flex-col gap-[60px] opacity-50"
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
          className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#6dcff6]"
        >
          {renderRegisteredMark(statDescription)}
        </p>
      </div>

      {/* Main Description (Right) */}
      <div
        // className={styles.mainDescription}
        className="absolute right-[422px] top-[2065px] z-[5] w-[971px]"
        data-node-id="5168:9911"
      >
        <p
          // className={styles.descriptionText}
          className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-white"
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
        className="absolute right-[120px] top-[1755px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <img alt="Up" className="h-full w-full object-contain" src={arrowUpIconSrc ?? imgArrowNavUp} />
      </div>
      <div
        aria-label="Next"
        // className={styles.arrowDown}
        className="absolute right-[120px] top-[1980px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
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
        <img
          alt="Down"
          className="h-full w-full object-contain"
          src={arrowDownIconSrc ?? arrowIconSrc ?? imgArrowNavDown}
        />
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
        className="pointer-events-none absolute left-[-12%] top-[46%] z-[4] flex h-[1106px] w-[1106px] -scale-y-100 items-center justify-center rotate-[225deg]"
        data-node-id="5168:9917"
      >
        <img alt="" className="block h-full w-full object-contain" src={largeIconSrc} />
      </div>
    </div>
  );
}
