'use client';

import styles from './firstScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNarrowDown = 'http://localhost:3845/assets/41b3eec6c414760c14b0a849351861e4f8091cf4.svg';
const imgVector = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface FirstScreenTemplateProps {
  challengeLabel?: string;
  subheadline?: string | string[];
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  problemDescription?: string;
  savingsAmount?: string;
  savingsDescription?: string;
  videoSrc?: string;
}

export default function FirstScreenTemplate({
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
    <div className={styles.container} data-node-id="5168:9882">
      {/* Video Section */}
      <div className={styles.videoContainer} data-node-id="5168:9883">
        <video
          autoPlay
          loop
          playsInline
          muted
          controlsList="nodownload"
          className={styles.video}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Subheadline - positioned above challenge section */}
      <div className={styles.subheadlineContainer} data-node-id="5168:9896">
        <h2 className={styles.subheadline}>
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
      </div>

      {/* Challenge Label Section */}
      <div className={styles.challengeLabel} data-node-id="5168:9901">
        <div className={styles.challengeIcon}>
          <div className={styles.iconInner}>
            <img alt="" src={imgVector} />
          </div>
        </div>
        <h1 className={styles.challengeText}>{renderRegisteredMark(challengeLabel)}</h1>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        className={styles.arrowUp}
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
        <img alt="Up" src={imgArrowNarrowDown} />
      </div>
      <div
        aria-label="Next"
        className={styles.arrowDown}
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
        <img alt="Down" src={imgArrowNarrowDown} />
      </div>

      {/* Problem Description Section */}
      <div className={styles.problemSection} data-node-id="5168:9893">
        <p className={styles.problemText}>{renderRegisteredMark(problemDescription)}</p>
      </div>

      {/* Gradient Background */}
      <div className={styles.gradientBg} data-node-id="5168:9884" />

      {/* Savings Metrics Section */}
      <div className={styles.savingsSection} data-node-id="5168:9904">
        <div className={styles.savingsAmount}>{renderRegisteredMark(savingsAmount)}</div>
        <p className={styles.savingsDescription}>{renderRegisteredMark(savingsDescription)}</p>
      </div>

      {/* Fade Out Gradient */}
      <div className={styles.fadeOutGradient} data-node-id="5168:9895" />
    </div>
  );
}
