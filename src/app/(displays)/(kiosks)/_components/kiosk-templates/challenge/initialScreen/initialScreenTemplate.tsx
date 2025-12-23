'use client';

import Image from 'next/image';
import ButtonArrow from '@/components/ui/icons/ButtonArrow';
import WhiteLogoSimple from '@/components/ui/icons/WhiteLogoSimple';
import renderRegisteredMark from '../utils/renderRegisteredMark';

export type InitialScreenTemplateProps = {
  readonly arrowIconSrc?: string;
  readonly attribution?: string;
  readonly backgroundImage?: string;
  readonly buttonText?: string;
  readonly contentBoxBgColor?: string;
  readonly headline?: string;
  readonly kioskId?: KioskVariant;
  readonly logoCombinedSrc?: string;
  readonly onButtonClick?: () => void;
  readonly quote?: string;
  readonly subheadline?: string;
};

type KioskVariant = 'kiosk-1' | 'kiosk-2' | 'kiosk-3';

export const InitialScreenTemplate = ({
  arrowIconSrc,
  attribution,
  backgroundImage,
  buttonText,
  contentBoxBgColor,
  headline,
  kioskId = 'kiosk-1',
  logoCombinedSrc,
  onButtonClick,
  quote,
  subheadline,
}: InitialScreenTemplateProps) => {
  const heroAlt = headline ? `${headline} background image` : 'Kiosk hero background image';

  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      data-kiosk={kioskId}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="relative h-full w-full">
          {backgroundImage && (
            <Image
              alt={heroAlt}
              className="object-cover object-center"
              fill
              priority
              sizes="100vw"
              src={backgroundImage}
            />
          )}
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
        </div>
      </div>
      <div className="absolute top-[970px] left-[244px] z-[3] w-[980px] -translate-y-full">
        <h2 className="text-[120px] leading-[1.3] font-normal tracking-[-6px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(subheadline)}
        </h2>
      </div>

      <div
        className="absolute bg-[#F7931E] top-[1130px] left-[120px] z-[2] flex w-[1920px] flex-col gap-[200px] rounded-[60px] px-[120px] py-[240px] pb-[330px] backdrop-blur-[30px] group-data-[kiosk=kiosk-2]/kiosk:py-[220px] group-data-[kiosk=kiosk-2]/kiosk:pb-[240px] group-data-[kiosk=kiosk-3]/kiosk:w-[1920px] group-data-[kiosk=kiosk-3]/kiosk:pb-0"
        data-name="Challenge Initial Screen Content Box"
        style={contentBoxBgColor ? { backgroundColor: contentBoxBgColor } : undefined}
      >
        <div className="absolute top-[2910px] left-[120px] z-[3] flex h-[182px] w-[703px] items-center group-data-[kiosk=kiosk-2]/kiosk:top-[2890px] group-data-[kiosk=kiosk-3]/kiosk:hidden">
          <div className="relative h-full w-full">
            {logoCombinedSrc ? (
              <Image
                alt="Partner logos"
                className="object-contain"
                fill
                sizes="710px"
                src={logoCombinedSrc}
              />
            ) : (
              <WhiteLogoSimple aria-hidden="true" className="h-full w-full" preserveAspectRatio="xMidYMid meet" />
            )}
          </div>
        </div>

        <h1 className="max-w-[1660px] text-[80px] leading-[1.3] font-normal tracking-[-4px] text-black">
          {renderRegisteredMark(headline)}
        </h1>

        <div className="relative top-[10px] flex w-[1670px] flex-col gap-[20px]">
          <p className="text-[80px] leading-[1.3] font-normal tracking-[-4px] text-white group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:top-[-230px] group-data-[kiosk=kiosk-3]/kiosk:text-[120px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-6px]">
            {renderRegisteredMark(quote)}
          </p>
          <p className="relative top-[180px] text-[52px] leading-[1.4] font-semibold tracking-[-2.6px] whitespace-pre-wrap text-black">
            {renderRegisteredMark(attribution)}
          </p>
        </div>

        <div className="relative top-[190px] flex w-full flex-col items-start justify-center gap-[10px] group-data-[kiosk=kiosk-2]/kiosk:top-0 group-data-[kiosk=kiosk-3]/kiosk:top-[-220px]">
          <button
            aria-label={buttonText}
            className="flex h-[200px] items-center justify-center gap-[60px] rounded-[999px] bg-[#ededed] px-[100px] py-[70px] text-left backdrop-blur-[19px] transition-all duration-300 ease-out group-data-[kiosk=kiosk-2]/kiosk:px-[110px] hover:scale-[1.05] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-[0.98]"
            data-name="button_default"
            onClick={onButtonClick}
          >
            <span className="text-[60.792px] leading-none font-normal tracking-[-1.8238px] whitespace-nowrap text-[#14477d]">
              {renderRegisteredMark(buttonText)}
            </span>
            <div className="relative flex h-[60px] w-[120px] items-center justify-center">
              {arrowIconSrc ? (
                <Image
                  alt=""
                  aria-hidden="true"
                  className="object-contain"
                  fill
                  role="presentation"
                  sizes="120px"
                  src={arrowIconSrc}
                />
              ) : (
                <ButtonArrow
                  aria-hidden="true"
                  className="h-full w-full"
                  focusable="false"
                  preserveAspectRatio="xMidYMid meet"
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};


export default InitialScreenTemplate;
