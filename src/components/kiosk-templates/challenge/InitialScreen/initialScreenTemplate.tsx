'use client';

import React from 'react';
import styles from './initialScreenTemplate.module.css';

// Asset constants from Figma MCP
const imgBackground = 'http://localhost:3845/assets/dd98d7914a26e49c34d00ab9c8c7203040efa819.png';
const imgGuides = 'http://localhost:3845/assets/bbb0c30a6c52c72ecfe10371a7001daf550a68d1.svg';
const imgLogoLeft = 'http://localhost:3845/assets/38289b05b71863e8503d53ef14e909f42b7886ac.svg';
const imgLogoRight = 'http://localhost:3845/assets/05ccdbe86e680d4f2668ce2111496defad30fecd.svg';
const imgArrow = 'http://localhost:3845/assets/7326293bfdde3ab859cd77f94bcf35b016e0258d.svg';

export interface InitialScreenTemplateProps {
  headline?: string;
  subheadline?: string;
  quote?: string;
  attribution?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  backgroundImage?: string;
}

export default function InitialScreenTemplate({
  headline = 'The GRAMMY Museum® preserves the soundtrack of history.',
  subheadline = 'Rich media & cultural heritage',
  quote = '"It\'s been a pleasure working with Iron Mountain. We feel very confident that the GRAMMY Museum\'s physical artifacts and digital content is safely protected. Smart Vault also provides significant reassurance that our iconic artist performances and interviews will remain preserved and accessible which is a huge benefit to the GRAMMY Museum."',
  attribution = '- Michael Rohrabacher, Technical Director at the GRAMMY Museum',
  buttonText = 'Touch to explore',
  onButtonClick,
  backgroundImage = imgBackground,
}: InitialScreenTemplateProps) {
  return (
    <div className={styles.container} data-node-id="5168:9345">
      {/* Background with parallax layer */}
      <div className={styles.backgroundLayer}>
        <img alt="" className={styles.backgroundImage} src={backgroundImage} />
      </div>

      {/* Solution Pathways Guide Lines */}
      <div className={styles.guidesContainer} data-name="Solution Pathways - Master Guides">
        <div className={styles.guides}>
          <img alt="" className={styles.guidesImage} src={imgGuides} />
        </div>
      </div>

      {/* Subheadline - positioned above content */}
      <div className={styles.subheadlineContainer}>
        <h2 className={styles.subheadline}>{subheadline}</h2>
      </div>

      {/* Main Content Box */}
      <div className={styles.contentBox} data-name="Challenge Initial Screen Content Box">
        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <div className={styles.logoLeft}>
            <img alt="Logo" src={imgLogoLeft} />
          </div>
          <div className={styles.logoRight}>
            <img alt="Logo" src={imgLogoRight} />
          </div>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>{headline}</h1>

        {/* Quote and Attribution */}
        <div className={styles.quoteSection}>
          <p className={styles.quote}>{quote}</p>
          <p className={styles.attribution}>{attribution}</p>
        </div>

        {/* CTA Button */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={onButtonClick}
            aria-label={buttonText}
            data-name="button_default"
          >
            <span className={styles.buttonText}>{buttonText}</span>
            <div className={styles.arrowIcon}>
              <img alt="" src={imgArrow} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
