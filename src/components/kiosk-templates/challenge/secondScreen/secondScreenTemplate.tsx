'use client';

import styles from './secondScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNarrowDown = 'http://localhost:3845/assets/a750fbdd00ef68fcb2ba9208e4bd977de111641b.svg';
const imgHero = '';
const imgVector = 'http://localhost:3845/assets/40afdcf461baafad39ec3925ac4fd501259151d6.png';
const imgVector1 = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface SecondScreenTemplateProps {
  bottomDescription?: string;
  bottomVideoSrc?: string;
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
  bottomVideoSrc = '/_videos/v1/a532f40a2a6848e2a80788002b6cb925a1f4c3c2',
  mainDescription = 'The Museum also needed assistance with physical storage for a collection of historical music artifacts.',
  onNavigateDown,
  onNavigateUp,
  statAmount = '',
  statDescription = 'The Museum needed a secure, off-site, cloud-accessible, and easily managed solution to protect its one-of-a-kind, irreplaceable footage. Storing the only master copy locally presented a high risk of losing all assets in the event of a data failure or system crash.',
  subheadline = 'Rich media &\n cultural heritage',
  topImageSrc = imgHero,
}: SecondScreenTemplateProps) {
  return (
    <div className={styles.container} data-node-id="5168:9907">
      {/* Hero Image */}
      <div className={styles.topVideoContainer} data-node-id="5168:9909">
        <img alt="" className={styles.topVideo} src={topImageSrc} />
      </div>

      {/* Bottom Video Section */}
      <div className={styles.bottomVideoContainer} data-node-id="5168:9908">
        <video
          autoPlay
          loop
          playsInline
          muted
          controlsList="nodownload"
          className={styles.bottomVideo}
        >
          <source src={bottomVideoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Subheadline */}
      <div className={styles.subheadlineContainer} data-node-id="5168:9918">
        <h2 className={styles.subheadline}>
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label */}
      <div className={styles.challengeLabel} data-node-id="5168:9925">
        <div className={styles.challengeIcon}>
          <div className={styles.iconInner}>
            <img alt="" src={imgVector1} />
          </div>
        </div>
        <h1 className={styles.challengeText}>Challenge</h1>
      </div>

      {/* Stat Section (Left) */}
      <div className={styles.statSection} data-node-id="5168:9913">
        <div className={styles.statAmount}>{renderRegisteredMark(statAmount)}</div>
        <p className={styles.statDescription}>{renderRegisteredMark(statDescription)}</p>
      </div>

      {/* Main Description (Right) */}
      <div className={styles.mainDescription} data-node-id="5168:9911">
        <p className={styles.descriptionText}>{renderRegisteredMark(mainDescription)}</p>
      </div>

      {/* Bottom Description */}
      <div className={styles.bottomDescriptionContainer} data-node-id="5168:9919">
        <p className={styles.bottomDescriptionText}>{renderRegisteredMark(bottomDescription)}</p>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        className={styles.arrowUp}
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
        <img alt="Up" src={imgArrowNarrowDown} />
      </div>
      <div
        aria-label="Next"
        className={styles.arrowDown}
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
        <img alt="Down" src={imgArrowNarrowDown} />
      </div>

      {/* Background Gradients */}
      <div className={styles.gradientBg} data-node-id="5168:9910" />
      <div className={styles.topGradientOverlay} data-node-id="5168:9916" />
      <div className={styles.fadeOutGradient} data-node-id="5168:9920" />

      {/* Large Background Icon */}
      <div className={styles.largeIcon} data-node-id="5168:9917">
        <img alt="" src={imgVector} />
      </div>
    </div>
  );
}
