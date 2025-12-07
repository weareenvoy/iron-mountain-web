'use client';

import Image from 'next/image';

import renderRegisteredMark from '../utils/renderRegisteredMark';
import ButtonArrow from '@/components/ui/icons/ButtonArrow';
import WhiteLogoSimple from '@/components/ui/icons/WhiteLogos';

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
  kioskId?: KioskVariant;
  guidesImageSrc?: string;
  headline?: string;
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
  kioskId = 'kiosk-1',
  guidesImageSrc = imgGuides,
  headline = 'The GRAMMY Museum® preserves the soundtrack of history.',
  logoCombinedSrc,
  onButtonClick,
  quote = '"It\'s been a pleasure working with Iron Mountain. We feel very confident that the GRAMMY Museum\'s physical artifacts and digital content is safely protected. Smart Vault also provides significant reassurance that our iconic artist performances and interviews will remain preserved and accessible which is a huge benefit to the GRAMMY Museum."',
  subheadline = 'Rich media & cultural heritage',
}: InitialScreenTemplateProps) {
  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      data-kiosk={kioskId}
      data-node-id="5168:9345"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            alt=""
            className="object-cover object-center"
            fill
            priority
            sizes="100vw"
            src={backgroundImage}
            unoptimized
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-[1] h-[5120px] w-[2160px] overflow-hidden" data-name="Solution Pathways - Master Guides">
        <div className="absolute inset-0 h-full w-full">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="100vw"
            src={guidesImageSrc}
            unoptimized
          />
        </div>
      </div>

      <div className="absolute left-[244px] top-[907px] z-[3] w-[980px] -translate-y-full">
        <h2 className="whitespace-pre-line text-[120px] font-normal leading-[1.3] tracking-[-6px] text-[#ededed]">
          {renderRegisteredMark(subheadline)}
        </h2>
      </div>

      <div
        className="absolute left-[120px] top-[1066px] z-[2] flex w-[1940px] flex-col gap-[200px] rounded-[60px] px-[120px] py-[240px] pb-[430px] backdrop-blur-[30px] group-data-[kiosk=kiosk-2]/kiosk:py-[220px] group-data-[kiosk=kiosk-2]/kiosk:pb-[240px] group-data-[kiosk=kiosk-3]/kiosk:w-[1920px] group-data-[kiosk=kiosk-3]/kiosk:pb-0"
        data-name="Challenge Initial Screen Content Box"
        style={{ backgroundColor: contentBoxBgColor }}
      >
        <div className="absolute left-[120px] top-[2910px] z-[3] flex h-[180px] w-[710px] items-center group-data-[kiosk=kiosk-2]/kiosk:top-[2870px] group-data-[kiosk=kiosk-3]/kiosk:hidden">
          <div className="relative h-full w-full">
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

        <h1 className="max-w-[1660px] text-[80px] font-normal leading-[1.3] tracking-[-4px] text-black">
          {renderRegisteredMark(headline)}
        </h1>

        <div className="relative top-[10px] flex w-[1670px] flex-col gap-[20px]">
          <p className="text-[80px] font-normal leading-[1.3] tracking-[-4px] text-white group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:top-[-230px] group-data-[kiosk=kiosk-3]/kiosk:text-[120px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-6px]">
            {renderRegisteredMark(quote)}
          </p>
          <p className="relative top-[180px] whitespace-pre-wrap text-[52px] font-semibold leading-[1.6] tracking-[-2.4px] text-black">
            {renderRegisteredMark(attribution)}
          </p>
        </div>

        <div className="relative top-[190px] flex w-full flex-col items-start justify-center gap-[10px] group-data-[kiosk=kiosk-2]/kiosk:top-0 group-data-[kiosk=kiosk-3]/kiosk:top-[-220px]">
          <button
            aria-label={buttonText}
            className="flex h-[200px] items-center justify-center gap-[60px] rounded-[999px] bg-[#ededed] px-[100px] py-[70px] text-left transition-all duration-300 ease-out hover:scale-[1.05] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-[0.98] backdrop-blur-[19px] group-data-[kiosk=kiosk-2]/kiosk:px-[110px]"
            data-name="button_default"
            onClick={onButtonClick}
          >
            <span className="whitespace-nowrap text-[60.792px] font-normal leading-none tracking-[-1.8238px] text-[#14477d]">
              {renderRegisteredMark(buttonText)}
            </span>
            <div className="relative flex h-[60px] w-[120px] items-center justify-center">
              {arrowIconSrc ? (
                <Image alt="" fill sizes="120px" src={arrowIconSrc} unoptimized className="object-contain" />
              ) : (
                <ButtonArrow aria-hidden="true" className="h-full w-full" preserveAspectRatio="xMidYMid meet" />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
