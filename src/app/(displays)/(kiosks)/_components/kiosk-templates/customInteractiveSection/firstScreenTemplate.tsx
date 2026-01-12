import { SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import ArrowIcon from '@/components/ui/icons/Kiosks/CustomInteractive/ArrowIcon';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { SECTION_NAMES, useStickyHeader } from '../hooks/useStickyHeader';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export interface CustomInteractiveKiosk1FirstScreenTemplateProps {
  readonly demoIframeSrc?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly onPrimaryCta?: () => void;
  readonly onSecondaryCta?: () => void;
  readonly overlayCardLabel?: string;
  readonly overlayEndTourLabel?: string;
  readonly overlayHeadline?: string;
  readonly primaryCtaLabel?: string;
  readonly secondaryCtaLabel?: string;
}

const CustomInteractiveKiosk1FirstScreenTemplate = ({
  demoIframeSrc,
  eyebrow,
  headline,
  heroImageAlt,
  heroImageSrc,
  kioskId,
  onPrimaryCta,
  onSecondaryCta,
  overlayCardLabel,
  overlayEndTourLabel,
  overlayHeadline,
  primaryCtaLabel,
  secondaryCtaLabel,
}: CustomInteractiveKiosk1FirstScreenTemplateProps) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const {
    labelRef: eyebrowRef,
    sectionRef,
    showStickyHeader,
    stickyHeaderRef,
  } = useStickyHeader<HTMLHeadingElement>({
    sectionName: SECTION_NAMES.CUSTOM_INTERACTIVE,
  });

  const isKiosk1 = kioskId === 'kiosk-1';
  const eyebrowText = eyebrow;
  const headlineText = headline;
  const isKiosk3 = kioskId === 'kiosk-3';
  const ctaWidthClass = isKiosk3 ? 'w-[1360px]' : 'w-[1020px]';
  const secondaryLabelPadding = isKiosk3 ? 'pl-[320px]' : 'pl-[80px]';
  const secondaryIconOffset = isKiosk3 ? 'left-[-330px]' : 'left-[-70px]';

  const handleSecondaryClick = () => {
    setShowOverlay(true);
    onSecondaryCta?.();
  };

  const handlePrimaryClick = () => {
    onPrimaryCta?.();
  };

  return (
    <div
      className={cn(
        'group/kiosk relative flex h-screen w-full flex-col',
        isKiosk1 || isKiosk3 ? 'overflow-visible' : 'overflow-hidden'
      )}
      data-scroll-section="customInteractive-first-screen"
      data-section={SECTION_NAMES.CUSTOM_INTERACTIVE}
      ref={sectionRef}
    >
      {/* Background gradient - defined in globals.css for readability and ease of future updates */}
      <div className="bg-gradient-kiosk-blue pointer-events-none absolute inset-0 group-data-[kiosk=kiosk-1]/kiosk:h-[10530px] group-data-[kiosk=kiosk-2]/kiosk:h-[10390px] group-data-[kiosk=kiosk-3]/kiosk:h-[10430px]" />

      {/* Overlay - Demo Screen */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          showOverlay ? 'pointer-events-auto z-[9999] opacity-100' : 'pointer-events-none -z-10 opacity-0'
        )}
      >
        <CustomInteractiveDemoScreenTemplate
          cardLabel={overlayCardLabel}
          demoIframeSrc={demoIframeSrc}
          endTourLabel={overlayEndTourLabel}
          headline={overlayHeadline}
          heroImageAlt={heroImageAlt}
          heroImageSrc={heroImageSrc}
          onEndTour={() => setShowOverlay(false)}
        />
      </div>

      {/* Eyebrow */}
      <h2
        className="absolute top-[200px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[240px]"
        ref={eyebrowRef}
      >
        {renderRegisteredMark(eyebrowText)}
      </h2>

      {/* Sticky Section Header - Fixed Position */}
      <div
        className={`pointer-events-none fixed top-0 left-0 z-[100] h-[769px] w-full bg-[linear-gradient(180deg,#2481e3_65.52%,rgba(21,75,130,0)_99.31%)] transition-opacity duration-300 motion-reduce:transition-none ${showStickyHeader ? 'opacity-100' : 'opacity-0'}`}
        data-customInteractive-sticky-header
        data-visible={showStickyHeader}
        ref={stickyHeaderRef}
      >
        {/* Eyebrow */}
        <h2 className="px-[120px] pt-[240px] pb-[375px] pl-[150px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(eyebrowText)}
        </h2>
      </div>

      {/* Headline */}
      <h1
        className="absolute top-[1250px] left-[250px] w-full text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed] group-data-[kiosk=kiosk-3]/kiosk:top-[830px]"
        data-scroll-section="customInteractive-headline"
      >
        {renderRegisteredMark(headlineText)}
      </h1>

      {/* CTA buttons */}
      <div
        className={cn(
          'absolute top-[2220px] left-[245px] z-10 flex flex-col gap-[90px] group-data-[kiosk=kiosk-3]/kiosk:top-[2350px]',
          ctaWidthClass
        )}
      >
        <button
          className="group flex h-[200px] items-center justify-between rounded-[999px] bg-[#ededed] px-[100px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-[#14477d] shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[19px] transition-transform duration-150 group-data-[kiosk=kiosk-2]/kiosk:hidden hover:scale-[1.01] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
          onClick={handlePrimaryClick}
          type="button"
        >
          <span className="pt-[10px] pl-[10px]">{renderRegisteredMark(primaryCtaLabel)}</span>
          <div>
            <ArrowIcon />
          </div>
        </button>
        {/* CTA button gradient - defined in globals.css for readability and ease of future updates */}
        <button
          className="group bg-gradient-kiosk-magenta flex h-[200px] items-center justify-between rounded-[999px] px-[100px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[19px] transition-transform duration-150 hover:scale-[1.01] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
          onClick={handleSecondaryClick}
          type="button"
        >
          <span className={secondaryLabelPadding}>{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center">
            <SquarePlay
              aria-hidden
              className={cn('relative h-[90px] w-[90px]', secondaryIconOffset)}
              color="#ededed"
              strokeWidth={2}
            />
          </div>
        </button>
      </div>

      {/* Hero diamond image */}
      <div className="pointer-events-none absolute bottom-[160px] left-[1100px] h-[1380px] w-[1380px]">
        {heroImageSrc && (
          <Image
            alt={heroImageAlt || ''}
            className="clip-diamond-rounded object-cover"
            fill
            quality={85} // 85 Quality, secondary image to the buttons and headline.
            sizes="680px"
            src={heroImageSrc}
          />
        )}
      </div>

      {/* Decorative diamonds */}
      <HCHollowBlueDiamond className="pointer-events-none absolute bottom-[1400px] left-[510px] h-[520px] w-[520px] overflow-visible" />
      <HCFilledOrangeDiamond className="pointer-events-none absolute bottom-[640px] left-[280px] h-[420px] w-[800px]" />
      <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[410px] left-[500px] h-[340px] w-[340px] overflow-visible" />
    </div>
  );
};

export default CustomInteractiveKiosk1FirstScreenTemplate;
