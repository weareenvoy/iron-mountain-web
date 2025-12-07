'use client';

import ButtonArrow from '@/components/ui/icons/ButtonArrow';
import WhiteLogoSimple from '@/components/ui/icons/WhiteLogos';
import Image from 'next/image';

import renderRegisteredMark from '../utils/renderRegisteredMark';

// Asset constants from Figma MCP
const imgBackground = '/images/kiosks/kiosk1/Cover.png';
const imgGuides = 'http://localhost:3845/assets/bbb0c30a6c52c72ecfe10371a7001daf550a68d1.svg';

type KioskVariant = 'kiosk-1' | 'kiosk-2' | 'kiosk-3';

export interface InitialScreenTemplateProps {
  arrowIconSrc?: string;
  attribution?: string;
  backgroundImage?: string;
  buttonText?: string;
  contentBoxBgColor?: string;
  guidesImageSrc?: string;
  headline?: string;
  kioskId?: KioskVariant;
  logoCombinedSrc?: string;
  onButtonClick?: () => void;
  quote?: string;
  subheadline?: string | string[];
}

export default function InitialScreenTemplate({
  arrowIconSrc,
  attribution = '- Michael Rohrabacher, Technical Director at the GRAMMY Museum',
  backgroundImage = imgBackground,
  buttonText = 'Touch to explore',
  contentBoxBgColor = '#f7931e',
  guidesImageSrc = imgGuides,
  headline = 'The GRAMMY Museum® preserves the soundtrack of history.',
  kioskId = 'kiosk-1',
  logoCombinedSrc,
  onButtonClick,
  quote = '"It\'s been a pleasure working with Iron Mountain. We feel very confident that the GRAMMY Museum\'s physical artifacts and digital content is safely protected. Smart Vault also provides significant reassurance that our iconic artist performances and interviews will remain preserved and accessible which is a huge benefit to the GRAMMY Museum."',
  subheadline = 'Rich media & cultural heritage',
}: InitialScreenTemplateProps) {
  const heroAlt = headline ? `${headline} background image` : 'Kiosk hero background image';
  const guidesAlt = 'Decorative guide line background';

  return (
    <div
      className="flex flex-col group/kiosk h-screen items-center justify-center overflow-hidden relative w-full"
      data-kiosk={kioskId}
      data-node-id="5168:9345"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="h-full relative w-full">
          <Image
            alt={heroAlt}
            className="object-center object-cover"
            fill
            priority
            sizes="100vw"
            src={backgroundImage}
            unoptimized
          />
          <div className="absolute bg-[rgba(0,0,0,0.2)] inset-0" />
        </div>
      </div>

      <div className="absolute h-[5120px] left-0 overflow-hidden pointer-events-none top-0 w-[2160px] z-[1]" data-name="Solution Pathways - Master Guides">
        <div className="absolute h-full inset-0 w-full">
          <Image
            alt={guidesAlt}
            className="object-cover"
            fill
            sizes="100vw"
            src={guidesImageSrc}
            unoptimized
          />
        </div>
      </div>

      <div className="-translate-y-full absolute left-[244px] top-[907px] w-[980px] z-[3]">
        <h2 className="font-normal leading-[1.3] text-[#ededed] text-[120px] tracking-[-6px] whitespace-pre-line">
          {renderRegisteredMark(subheadline)}
        </h2>
      </div>

      <div
        className="absolute backdrop-blur-[30px] flex flex-col gap-[200px] group-data-[kiosk=kiosk-2]/kiosk:pb-[240px] group-data-[kiosk=kiosk-2]/kiosk:py-[220px] group-data-[kiosk=kiosk-3]/kiosk:pb-0 group-data-[kiosk=kiosk-3]/kiosk:w-[1920px] left-[120px] pb-[430px] px-[120px] py-[240px] rounded-[60px] top-[1066px] w-[1940px] z-[2]"
        data-name="Challenge Initial Screen Content Box"
        style={{ backgroundColor: contentBoxBgColor }}
      >
        <div className="absolute flex group-data-[kiosk=kiosk-2]/kiosk:top-[2870px] group-data-[kiosk=kiosk-3]/kiosk:hidden h-[180px] items-center left-[120px] top-[2910px] w-[710px] z-[3]">
          <div className="h-full relative w-full">
            {logoCombinedSrc ? (
            <Image
              alt="Partner logos"
              className="object-contain"
              fill
              sizes="710px"
                src={logoCombinedSrc}
              unoptimized
            />
            ) : (
              <WhiteLogoSimple aria-hidden="true" className="h-full w-full" preserveAspectRatio="xMidYMid meet" />
            )}
          </div>
        </div>

        <h1 className="font-normal leading-[1.3] max-w-[1660px] text-[80px] text-black tracking-[-4px]">
          {renderRegisteredMark(headline)}
        </h1>

        <div className="flex flex-col gap-[20px] relative top-[10px] w-[1670px]">
          <p className="font-normal group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:text-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[-230px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-6px] leading-[1.3] text-[80px] text-white tracking-[-4px]">
            {renderRegisteredMark(quote)}
          </p>
          <p className="font-semibold leading-[1.6] relative text-[52px] text-black top-[180px] tracking-[-2.4px] whitespace-pre-wrap">
            {renderRegisteredMark(attribution)}
          </p>
        </div>

        <div className="flex flex-col gap-[10px] group-data-[kiosk=kiosk-2]/kiosk:top-0 group-data-[kiosk=kiosk-3]/kiosk:top-[-220px] items-start justify-center relative top-[190px] w-full">
          <button
            aria-label={buttonText}
            className="active:scale-[0.98] backdrop-blur-[19px] bg-[#ededed] duration-300 ease-out flex gap-[60px] group-data-[kiosk=kiosk-2]/kiosk:px-[110px] h-[200px] hover:scale-[1.05] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] items-center justify-center px-[100px] py-[70px] rounded-[999px] text-left transition-all"
            data-name="button_default"
            onClick={onButtonClick}
          >
            <span className="font-normal leading-none text-[#14477d] text-[60.792px] tracking-[-1.8238px] whitespace-nowrap">
              {renderRegisteredMark(buttonText)}
            </span>
            <div className="flex h-[60px] items-center justify-center relative w-[120px]">
              {arrowIconSrc ? (
                <Image
                  alt=""
                  aria-hidden="true"
                  fill
                  role="presentation"
                  sizes="120px"
                  src={arrowIconSrc}
                  unoptimized
                  className="object-contain"
                />
              ) : (
                <ButtonArrow aria-hidden="true" className="h-full w-full" focusable="false" preserveAspectRatio="xMidYMid meet" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

InitialScreenTemplate.displayName = 'InitialScreenTemplate';
