'use client';

import { SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import HCBlueFilledDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueFilledDiamond';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCFilledOrangeDiamond2 from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond2';
import HCFilledTealDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledTealDiamond';
import HCHollowBlueDiamond2 from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond2';
import HCHollowGreenDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowGreenDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import CircularCarousel, { type CarouselSlide } from './components/CircularCarousel';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type CustomInteractiveKiosk3ThirdScreenTemplateProps = {
  readonly demoIframeSrc?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly onBack?: () => void;
  readonly overlayCardLabel?: string;
  readonly overlayEndTourLabel?: string;
  readonly overlayHeadline?: string;
  readonly slides?: CarouselSlide[];
};

const CustomInteractiveKiosk3ThirdScreenTemplate = ({
  demoIframeSrc,
  headline,
  heroImageAlt,
  heroImageSrc,
  overlayCardLabel,
  overlayEndTourLabel,
  overlayHeadline,
  slides,
}: CustomInteractiveKiosk3ThirdScreenTemplateProps) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLaunchPressed, setIsLaunchPressed] = useState(false);
  const safeSlides = slides ?? [];

  const handleShowOverlay = useCallback(() => {
    setShowOverlay(true);
  }, []);

  const handleHideOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  if (safeSlides.length === 0 || !headline) {
    return null;
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      data-scroll-section="customInteractive-third-screen"
    >
      <div className="pointer-events-none absolute inset-0 bg-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-black/15 backdrop-blur-[12px]" />

      <CircularCarousel slides={safeSlides}>
        {({ current }) => {
          const isSlide2 = current.id === 'slide-2';
          const isSlide5 = current.id === 'slide-5';
          const isSlide3 = current.id === 'slide-3';
          const isSlide6 = current.id === 'slide-6';
          const primaryDiamondClass =
            isSlide2 || isSlide5
              ? 'absolute left-[510px] bottom-[670px] h-[1200px] w-[1200px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
              : isSlide3 || isSlide6
                ? 'absolute left-[340px] bottom-[340px] h-[1130px] w-[1130px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
                : 'absolute left-[700px] bottom-[1120px] h-[830px] w-[830px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]';
          const secondaryDiamondClass =
            isSlide3 || isSlide6
              ? 'absolute left-[1390px] bottom-[1150px] h-[800px] w-[800px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]'
              : 'absolute left-[1380px] bottom-[400px] h-[880px] w-[880px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]';

          const headlineText = headline;
          const eyebrowText = current.eyebrow;
          const sectionTitle = current.sectionTitle;

          return (
            <>
              {/* Eyebrow */}
              <h2 className="absolute top-[240px] left-[120px] text-[57px] leading-[1.5] font-normal tracking-[-1.8px] whitespace-pre-line text-[#ededed]">
                {renderRegisteredMark(eyebrowText)}
              </h2>

              {/* Main headline */}
              <h1 className="absolute top-[830px] left-[240px] max-w-[1200px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line text-white">
                {renderRegisteredMark(headlineText)}
              </h1>

              {/* Data configuration + bullets */}
              <div className="absolute top-[1650px] left-[240px] max-w-[920px] space-y-[36px] text-white">
                <h2 className="text-[80px] leading-[1.3] tracking-[-4px]">{renderRegisteredMark(sectionTitle)}</h2>
                <ul className="mt-[110px] ml-[60px] space-y-[22px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white">
                  {current.bullets.map((item, i) => (
                    <li
                      className="flex w-[1100px] items-start gap-[16px] text-[64px]"
                      key={`${current.id}-bullet-${i}`}
                    >
                      <span className="mt-[20px] mr-[40px] ml-[-50px] inline-block h-[35px] w-[35px] rotate-[45deg] rounded-[4px] border border-white/80" />
                      <span>{renderRegisteredMark(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                className="absolute top-[2630px] left-[240px] flex h-[200px] items-center gap-[18px] rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[110px] text-[55px] leading-[1.1] font-semibold tracking-[2px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-150 ease-out data-[pressed=true]:scale-[0.98] data-[pressed=true]:opacity-70"
                data-pressed={isLaunchPressed}
                onClick={handleShowOverlay}
                onPointerDown={() => setIsLaunchPressed(true)}
                onPointerLeave={() => setIsLaunchPressed(false)}
                onPointerUp={() => setIsLaunchPressed(false)}
                type="button"
              >
                Launch demo
                <SquarePlay aria-hidden className="ml-[40px] h-[90px] w-[90px]" strokeWidth={2} />
              </button>

              {/* Primary Diamond */}
              <div className={primaryDiamondClass}>
                {current.primaryVideoSrc ? (
                  <video
                    autoPlay
                    className="h-full w-full origin-center scale-[1.35] -rotate-[45deg] object-cover"
                    loop
                    muted
                    playsInline
                    poster={current.primaryImageSrc}
                    src={current.primaryVideoSrc}
                  />
                ) : current.primaryImageSrc ? (
                  <Image
                    alt={current.primaryImageAlt}
                    className="origin-center scale-[1.35] -rotate-[45deg] object-cover"
                    fill
                    sizes="1200px"
                    src={current.primaryImageSrc}
                  />
                ) : null}
              </div>

              {/* Secondary Diamond */}
              {current.secondaryImageSrc ? (
                <div className={secondaryDiamondClass}>
                  <Image
                    alt={current.secondaryImageAlt}
                    className="origin-center scale-[1.35] -rotate-[45deg] object-cover"
                    fill
                    sizes="880px"
                    src={current.secondaryImageSrc}
                  />
                </div>
              ) : null}

              {/* Decorative SVG Diamonds - Slide 2 & 5 (Teal, Blue, Orange) */}
              {(isSlide2 || isSlide5) && (
                <>
                  <HCFilledTealDiamond className="pointer-events-none absolute bottom-[670px] left-[-20px] h-[510px] w-[560px]" />
                  <HCHollowBlueDiamond2 className="pointer-events-none absolute bottom-[-1560px] left-[-10px] h-[2400px] w-[2400px] overflow-visible" />
                  <HCFilledOrangeDiamond2 className="pointer-events-none absolute bottom-[-1555px] left-[1100px] h-[1200px] w-[1200px] rotate-[45deg] overflow-visible" />
                  <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[-980px] left-[1240px] h-[1800px] w-[1800px] overflow-visible" />
                </>
              )}

              {/* Decorative SVG Diamonds - Slide 3 & 6 (Orange, Blue, Green) */}
              {(isSlide3 || isSlide6) && (
                <>
                  <HCFilledOrangeDiamond className="pointer-events-none absolute bottom-[670px] left-[1880px] h-[450px] w-[450px]" />
                  <HCHollowBlueDiamond2 className="pointer-events-none absolute bottom-[-1650px] left-[1290px] h-[2400px] w-[2400px] overflow-visible" />
                  <HCHollowGreenDiamond className="pointer-events-none absolute bottom-[-1240px] left-[0px] h-[1800px] w-[1800px] overflow-visible" />
                </>
              )}

              {/* Decorative SVG Diamonds - Slide 1 & 4 (Blue, Orange) */}
              {!isSlide2 && !isSlide3 && !isSlide5 && !isSlide6 && (
                <>
                  <HCBlueFilledDiamond className="pointer-events-none absolute bottom-[590px] left-[490px] h-[510px] w-[560px]" />
                  <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[-1755px] left-[650px] h-[2400px] w-[2400px] overflow-visible" />
                </>
              )}
            </>
          );
        }}
      </CircularCarousel>

      {/* Overlay - Demo Screen */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          showOverlay ? 'pointer-events-auto z-[999] opacity-100' : 'pointer-events-none z-[-1] opacity-0'
        }`}
      >
        <CustomInteractiveDemoScreenTemplate
          cardLabel={overlayCardLabel}
          demoIframeSrc={demoIframeSrc}
          endTourLabel={overlayEndTourLabel}
          headline={overlayHeadline}
          heroImageAlt={heroImageAlt}
          heroImageSrc={heroImageSrc}
          isVisible={showOverlay}
          onEndTour={handleHideOverlay}
        />
      </div>
    </div>
  );
};

export default CustomInteractiveKiosk3ThirdScreenTemplate;
