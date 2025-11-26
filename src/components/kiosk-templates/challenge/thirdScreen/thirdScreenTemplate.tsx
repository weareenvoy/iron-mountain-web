'use client';

import styles from './thirdScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrowNarrowDown = 'http://localhost:3845/assets/0317ffc66a61baf023ab7ce353692457254030a6.svg';
const imgHeroDiamond = 'http://localhost:3845/assets/980d1dee1ed7de2996214b8db1a42986b97dc47d.png';
const imgMetricDiamond = 'http://localhost:3845/assets/f52f006df3b7e80cef930718c449ddff29312f59.png';
const imgVector = imgHeroDiamond;
const imgVector1 = imgMetricDiamond;
const imgVector2 = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';

export interface ThirdScreenTemplateProps {
  description?: string;
  heroImageSrc?: string;
  metricAmount?: string;
  metricDescription?: string;
  metricImageSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  subheadline?: string | string[];
  videoSrc?: string;
}

export default function ThirdScreenTemplate({
  description = 'The former digital storage system was slow and inefficient, especially for remote access, which frustrated staff when they needed to retrieve content quickly.',
  heroImageSrc = imgHeroDiamond,
  metricAmount = '40 TB',
  metricDescription = 'of existing footage of data migration from physical drives into Smart Vault.',
  metricImageSrc = imgMetricDiamond,
  onNavigateDown,
  onNavigateUp,
  subheadline = 'Rich media &\n cultural heritage',
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

      {/* Top Hero Diamond */}
      <div className={styles.topDiamond}>
        <img alt="" src={heroImageSrc} />
      </div>

      {/* Subheadline */}
      <div className={styles.subheadlineContainer} data-node-id="5168:9935">
        <h2 className={styles.subheadline}>
          {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
        </h2>
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
        <p className={styles.description}>{renderRegisteredMark(description)}</p>
      </div>

      {/* Metrics Section */}
      <div className={styles.metricsSection} data-node-id="5168:9945">
        <div className={styles.metricAmount}>{renderRegisteredMark(metricAmount)}</div>
        <p className={styles.metricDescription}>{renderRegisteredMark(metricDescription)}</p>
      </div>

      {/* Bottom Media Diamond */}
      <div className={styles.metricDiamond}>
        <img alt="" src={metricImageSrc} />
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
