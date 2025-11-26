'use client';

import type { CSSProperties } from 'react';

// import styles from './initialScreenTemplate.module.css';
import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgArrow = 'http://localhost:3845/assets/7326293bfdde3ab859cd77f94bcf35b016e0258d.svg';
const imgBackground = 'http://localhost:3845/assets/dd98d7914a26e49c34d00ab9c8c7203040efa819.png';
const imgGuides = 'http://localhost:3845/assets/bbb0c30a6c52c72ecfe10371a7001daf550a68d1.svg';
const imgLogoLeft = 'http://localhost:3845/assets/38289b05b71863e8503d53ef14e909f42b7886ac.svg';
const imgLogoRight = 'http://localhost:3845/assets/05ccdbe86e680d4f2668ce2111496defad30fecd.svg';

type BackgroundImageStyle = Pick<CSSProperties, 'height' | 'left' | 'objectPosition' | 'top' | 'width'>;

const defaultBackgroundImageStyle: BackgroundImageStyle = {
  height: '129%',
  left: '157%',
  objectPosition: 'center',
  top: '-13%',
  width: '100%',
};

export interface InitialScreenTemplateProps {
  arrowIconSrc?: string;
  attribution?: string;
  backgroundImage?: string;
  backgroundImageStyle?: Partial<BackgroundImageStyle>;
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
  backgroundImageStyle,
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
    <div
      // className={styles.container}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      data-node-id="5168:9345"
    >
      {/* Background with parallax layer */}
      <div
        // className={styles.backgroundLayer}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          alt=""
          className="absolute left-[157%] top-[-13%] h-[129%] w-full overflow-visible object-cover object-center"
          src={backgroundImage}
          style={{ ...defaultBackgroundImageStyle, ...backgroundImageStyle }}
        />
      </div>

      {/* Solution Pathways Guide Lines */}
      <div
        // className={styles.guidesContainer}
        className="pointer-events-none absolute left-0 top-0 z-[1] h-[5120px] w-[2160px] overflow-clip"
        data-name="Solution Pathways - Master Guides"
      >
        <div
          // className={styles.guides}
          className="absolute inset-0"
        >
          <img alt="" className="block h-full w-full object-cover" src={guidesImageSrc} />
        </div>
      </div>

      {/* Subheadline - positioned above content */}
      <div
        // className={styles.subheadlineContainer}
        className="absolute left-[244px] top-[907px] z-[3] w-[980px] -translate-y-full"
      >
        <h2
          // className={styles.subheadline}
          className="whitespace-pre-line text-[120px] font-normal leading-[1.3] tracking-[-6px] text-[#ededed]"
        >
          {renderRegisteredMark(subheadline)}
        </h2>
      </div>

      {/* Main Content Box */}
      <div
        // className={styles.contentBox}
        className="absolute left-[126px] top-[1066px] z-[2] flex w-[1920px] flex-col gap-[200px] rounded-[60px] bg-[#f7931e] px-[120px] py-[240px] backdrop-blur-[30px]"
        data-name="Challenge Initial Screen Content Box"
      >
        {/* Logo Section */}
        <div
          // className={styles.logoContainer}
          className="absolute left-[114px] top-[2890px] z-[3] flex h-[180px] w-[710px] items-center gap-[4%]"
        >
          <div
            // className={styles.logoLeft}
            className="flex h-full items-center"
            style={{ flex: '0 0 32.28%' }}
          >
            <img alt="Logo" className="h-full w-full object-contain" src={logoLeftSrc} />
          </div>
          <div
            // className={styles.logoRight}
            className="flex h-full flex-1 items-center"
          >
            <img alt="Logo" className="h-full w-full object-contain" src={logoRightSrc} />
          </div>
        </div>

        {/* Headline */}
        <h1
          // className={styles.headline}
          className="w-full max-w-[1460px] text-[80px] font-normal leading-[1.3] tracking-[-4px] text-black"
        >
          {renderRegisteredMark(headline)}
        </h1>

        {/* Quote and Attribution */}
        <div
          // className={styles.quoteSection}
          className="flex flex-col gap-[200px]"
        >
          <p
            // className={styles.quote}
            className="w-full text-[80px] font-normal leading-[1.3] tracking-[-4px] text-white"
          >
            {renderRegisteredMark(quote)}
          </p>
          <p
            // className={styles.attribution}
            className="w-full whitespace-pre-wrap text-[52px] font-semibold leading-[1.6] tracking-[-2.4px] text-black"
          >
            {renderRegisteredMark(attribution)}
          </p>
        </div>

        {/* CTA Button */}
        <div
          // className={styles.buttonContainer}
          className="flex w-full flex-col items-start justify-center gap-[10px]"
        >
          <button
            // className={styles.button}
            className="flex h-[200px] items-center justify-center gap-[60px] rounded-[506593px] border-0 bg-[#ededed] px-[100px] py-[70px] text-left transition duration-300 ease-out hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95"
            onClick={onButtonClick}
            aria-label={buttonText}
            data-name="button_default"
          >
            <span
              // className={styles.buttonText}
              className="whitespace-nowrap text-[60.792px] font-normal tracking-[-1.8238px] text-[#14477d]"
            >
              {renderRegisteredMark(buttonText)}
            </span>
            <div
              // className={styles.arrowIcon}
              className="flex h-[61px] w-[126px] flex-shrink-0 items-center justify-center"
            >
              <img alt="" className="h-full w-full object-contain" src={arrowIconSrc} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
