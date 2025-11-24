'use client';

import styles from './secondScreenTemplate.module.css';

// Asset constants from Figma MCP
const imgVector = 'http://localhost:3845/assets/caf81e3bbca82f86954a2677e5046573cb1ee4a2.png';
const imgArrowNarrowDown = 'http://localhost:3845/assets/a750fbdd00ef68fcb2ba9208e4bd977de111641b.svg';
const imgVector1 = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface SecondScreenTemplateProps {
  bottomDescription?: string;
  bottomVideoSrc?: string;
  mainDescription?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  statAmount?: string;
  statDescription?: string;
  subheadline?: string;
  topVideoSrc?: string;
}

export default function SecondScreenTemplate({
  bottomDescription = 'After multiple acquisitions with antiquated and disordered records, finding the required regulatory documentation was difficult to impossible.',
  bottomVideoSrc = '/_videos/v1/a532f40a2a6848e2a80788002b6cb925a1f4c3c2',
  mainDescription = 'Disparate, unstructured records across various locations and legacy systems—including paper, microfilm, CD, and digital formats—created costly, risk-laden pension administration.',
  onNavigateDown,
  onNavigateUp,
  statAmount = '100M+',
  statDescription = 'A large healthcare organization faced significant financial risk because it could not locate the appropriate documentation to confirm the eligibility of employee pension claims. The legal system ruled the organization liable to pay claims without evidence to disprove eligibility, resulting in millions of dollars paid in ineligible pension benefits.',
  subheadline = 'Information\n& data lifecycle',
  topVideoSrc = '/_videos/v1/3742b7e5490c6c79474014f5d41e4d50fe21d59a',
}: SecondScreenTemplateProps) {
  return (
    <div className={styles.container} data-node-id="5168:9907">
      {/* Top Video Section */}
      <div className={styles.topVideoContainer} data-node-id="5168:9909">
        <video
          autoPlay
          loop
          playsInline
          muted
          controlsList="nodownload"
          className={styles.topVideo}
        >
          <source src={topVideoSrc} type="video/mp4" />
        </video>
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
        <h2 className={styles.subheadline}>{subheadline}</h2>
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
        <div className={styles.statAmount}>{statAmount}</div>
        <p className={styles.statDescription}>{statDescription}</p>
      </div>

      {/* Main Description (Right) */}
      <div className={styles.mainDescription} data-node-id="5168:9911">
        <p className={styles.descriptionText}>{mainDescription}</p>
      </div>

      {/* Bottom Description */}
      <div className={styles.bottomDescriptionContainer} data-node-id="5168:9919">
        <p className={styles.bottomDescriptionText}>{bottomDescription}</p>
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
