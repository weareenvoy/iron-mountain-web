'use client';

import styles from './firstScreenTemplate.module.css';

// Asset constants from Figma MCP
const imgArrowNarrowDown = 'http://localhost:3845/assets/41b3eec6c414760c14b0a849351861e4f8091cf4.svg';
const imgVector = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface FirstScreenTemplateProps {
  videoSrc?: string;
  subheadline?: string;
  challengeLabel?: string;
  problemDescription?: string;
  savingsAmount?: string;
  savingsDescription?: string;
}

export default function FirstScreenTemplate({
  videoSrc = '/_videos/v1/3a042a38ece8bc71c733d7878d6e2f1d3104be52',
  subheadline = 'Information\n& data lifecycle',
  challengeLabel = 'Challenge',
  problemDescription = 'A large healthcare organization faced significant financial risk because it could not locate the appropriate documentation to confirm the eligibility of employee pension claims. The legal system ruled the organization liable to pay claims without evidence to disprove eligibility, resulting in millions of dollars paid in ineligible pension benefits.',
  savingsAmount = '$2M+',
  savingsDescription = 'saved annually through the identification of "duplicate" pension payments',
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
        <h2 className={styles.subheadline}>{subheadline}</h2>
      </div>

      {/* Challenge Label Section */}
      <div className={styles.challengeLabel} data-node-id="5168:9901">
        <div className={styles.challengeIcon}>
          <div className={styles.iconInner}>
            <img alt="" src={imgVector} />
          </div>
        </div>
        <h1 className={styles.challengeText}>{challengeLabel}</h1>
      </div>

      {/* Navigation Arrows */}
      <div className={styles.arrowUp} data-node-id="5168:9899">
        <img alt="Up" src={imgArrowNarrowDown} />
      </div>
      <div className={styles.arrowDown} data-node-id="5168:9897">
        <img alt="Down" src={imgArrowNarrowDown} />
      </div>

      {/* Problem Description Section */}
      <div className={styles.problemSection} data-node-id="5168:9893">
        <p className={styles.problemText}>{problemDescription}</p>
      </div>

      {/* Gradient Background */}
      <div className={styles.gradientBg} data-node-id="5168:9884" />

      {/* Savings Metrics Section */}
      <div className={styles.savingsSection} data-node-id="5168:9904">
        <div className={styles.savingsAmount}>{savingsAmount}</div>
        <p className={styles.savingsDescription}>{savingsDescription}</p>
      </div>

      {/* Fade Out Gradient */}
      <div className={styles.fadeOutGradient} data-node-id="5168:9895" />
    </div>
  );
}
