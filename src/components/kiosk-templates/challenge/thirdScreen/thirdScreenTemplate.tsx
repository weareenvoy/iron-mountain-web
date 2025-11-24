'use client';

import styles from './thirdScreenTemplate.module.css';

// Asset constants from Figma MCP
const imgVector = 'http://localhost:3845/assets/05930578dd643bcb26c67c6dc5d299ebc1702ef3.png';
const imgVector1 = 'http://localhost:3845/assets/5c5e81bd06cff3986cbe35647aee4663132b7b27.png';
const imgArrowNarrowDown = 'http://localhost:3845/assets/97b897487da68eef15f83e02bbe8418edb1b4cd5.svg';
const imgVector2 = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface ThirdScreenTemplateProps {
  description?: string;
  metricAmount?: string;
  metricDescription?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  subheadline?: string;
  videoSrc?: string;
}

export default function ThirdScreenTemplate({
  description = 'After multiple acquisitions with antiquated and disordered records, finding the required regulatory documentation was difficult to impossible.',
  metricAmount = '2.5M',
  metricDescription = 'paper images are being digitized.',
  onNavigateDown,
  onNavigateUp,
  subheadline = 'Information\n& data lifecycle',
  videoSrc = '/_videos/v1/3742b7e5490c6c79474014f5d41e4d50fe21d59a',
}: ThirdScreenTemplateProps) {
  return (
    <div className={styles.container} data-node-id="5168:9928">
      {/* Video Section */}
      <div className={styles.videoContainer} data-node-id="5168:9929">
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

      {/* Subheadline */}
      <div className={styles.subheadlineContainer} data-node-id="5168:9935">
        <h2 className={styles.subheadline}>{subheadline}</h2>
      </div>

      {/* Challenge Label */}
      <div className={styles.challengeLabel} data-node-id="5168:9942">
        <div className={styles.challengeIcon}>
          <div className={styles.iconInner}>
            <img alt="" src={imgVector2} />
          </div>
        </div>
        <h1 className={styles.challengeText}>Challenge</h1>
      </div>

      {/* Description */}
      <div className={styles.descriptionContainer} data-node-id="5168:9932">
        <p className={styles.description}>{description}</p>
      </div>

      {/* Metrics Section */}
      <div className={styles.metricsSection} data-node-id="5168:9945">
        <div className={styles.metricAmount}>{metricAmount}</div>
        <p className={styles.metricDescription}>{metricDescription}</p>
      </div>

      {/* Navigation Arrows */}
      <div
        aria-label="Previous"
        className={styles.arrowUp}
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
        <img alt="Up" src={imgArrowNarrowDown} />
      </div>
      <div
        aria-label="Next"
        className={styles.arrowDown}
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
        <img alt="Down" src={imgArrowNarrowDown} />
      </div>

      {/* Background Gradients */}
      <div className={styles.gradientBg} data-node-id="5168:9930" />
      <div className={styles.topGradientOverlay} data-node-id="5168:9934" />

      {/* Large Background Icons */}
      <div className={styles.largeIconTop} data-node-id="5168:9933">
        <img alt="" src={imgVector} />
      </div>
      <div className={styles.largeIconCenter} data-node-id="5168:9936">
        <img alt="" src={imgVector1} />
      </div>
    </div>
  );
}
