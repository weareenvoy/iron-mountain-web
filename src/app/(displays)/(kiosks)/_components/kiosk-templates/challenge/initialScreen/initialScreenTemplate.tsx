'use client';

import styles from './initialScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrow = '/images/kiosks/svgs/ButtonArrow.svg';
const imgBackground = 'http://localhost:3845/assets/dd98d7914a26e49c34d00ab9c8c7203040efa819.png';
const imgGuides = 'http://localhost:3845/assets/bbb0c30a6c52c72ecfe10371a7001daf550a68d1.svg';
const imgLogoLeft = 'http://localhost:3845/assets/38289b05b71863e8503d53ef14e909f42b7886ac.svg';
const imgLogoRight = 'http://localhost:3845/assets/05ccdbe86e680d4f2668ce2111496defad30fecd.svg';

export interface InitialScreenTemplateProps {
  arrowIconSrc?: string;
  attribution?: string;
  backgroundImage?: string;
  buttonText?: string;
  guidesImageSrc?: string;
  headline?: string;
  logoLeftSrc?: string;
  logoRightSrc?: string;
  onButtonClick?: () => void;
  quote?: string;
  subheadline?: string | string[];
}

export default function InitialScreenTemplate({
  arrowIconSrc = imgArrow,
  attribution = '- Michael Rohrabacher, Technical Director at the GRAMMY Museum',
  backgroundImage = imgBackground,
  buttonText = 'Touch to explore',
  guidesImageSrc = imgGuides,
  headline = 'The GRAMMY Museum® preserves the soundtrack of history.',
  logoLeftSrc = imgLogoLeft,
  logoRightSrc = imgLogoRight,
  onButtonClick,
  quote = '"It\'s been a pleasure working with Iron Mountain. We feel very confident that the GRAMMY Museum\'s physical artifacts and digital content is safely protected. Smart Vault also provides significant reassurance that our iconic artist performances and interviews will remain preserved and accessible which is a huge benefit to the GRAMMY Museum."',
  subheadline = 'Rich media & cultural heritage',
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
          <img alt="" className={styles.guidesImage} src={guidesImageSrc} />
        </div>
      </div>

      {/* Subheadline - positioned above content */}
      <div className={styles.subheadlineContainer}>
        <h2 className={styles.subheadline}>{renderRegisteredMark(subheadline)}</h2>
      </div>

      {/* Main Content Box */}
      <div className={styles.contentBox} data-name="Challenge Initial Screen Content Box">
        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <div className={styles.logoLeft}>
            <img alt="Logo" src={logoLeftSrc} />
          </div>
          <div className={styles.logoRight}>
            <img alt="Logo" src={logoRightSrc} />
          </div>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>{renderRegisteredMark(headline)}</h1>

        {/* Quote and Attribution */}
        <div className={styles.quoteSection}>
          <p className={styles.quote}>{renderRegisteredMark(quote)}</p>
          <p className={styles.attribution}>{renderRegisteredMark(attribution)}</p>
        </div>

        {/* CTA Button */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            onClick={onButtonClick}
            aria-label={buttonText}
            data-name="button_default"
          >
            <span className={styles.buttonText}>{renderRegisteredMark(buttonText)}</span>
            <div className={styles.arrowIcon}>
              <img alt="" src={arrowIconSrc} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
