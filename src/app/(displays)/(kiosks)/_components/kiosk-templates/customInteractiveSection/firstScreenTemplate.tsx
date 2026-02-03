import { motion } from 'framer-motion';
import { SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import { useGradientHeights } from '@/app/(displays)/(kiosks)/_components/providers/gradient-heights-provider';
import { useKioskOverlay } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-overlay-provider';
import { useKioskAudio } from '@/app/(displays)/(kiosks)/_components/providers/useKioskAudio';
import { useSfx } from '@/components/providers/audio-provider';
import ArrowIcon from '@/components/ui/icons/Kiosks/CustomInteractive/ArrowIcon';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { TITLE_ANIMATION_TRANSFORMS } from '../constants/animations';
import { SCROLL_ANIMATION_CONFIG, useScrollAnimation } from '../hooks/useScrollAnimation';
import { SECTION_NAMES, useStickyHeader } from '../hooks/useStickyHeader';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export interface CustomInteractiveKiosk1FirstScreenTemplateProps {
  readonly customInteractiveIndex?: number;
  readonly customInteractiveNumber?: 1 | 2 | 3;
  readonly demoIframeSrc?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly onEndTour?: () => void;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly onPrimaryCta?: () => void;
  readonly onSecondaryCta?: () => void;
  readonly overlayCardLabel?: string;
  readonly overlayEndTourLabel?: string;
  readonly overlayHeadline?: string;
  readonly primaryCtaLabel?: string;
  readonly secondaryCtaLabel?: string;
}

const CustomInteractiveKiosk1FirstScreenTemplate = ({
  customInteractiveIndex = 0,
  customInteractiveNumber = 1,
  demoIframeSrc,
  eyebrow,
  headline,
  heroImageAlt,
  heroImageSrc,
  onEndTour,
  onPrimaryCta,
  onSecondaryCta,
  overlayCardLabel,
  overlayEndTourLabel,
  overlayHeadline,
  primaryCtaLabel,
  secondaryCtaLabel,
}: CustomInteractiveKiosk1FirstScreenTemplateProps) => {
  const { shouldAnimate, triggerRef: animationTriggerRef } = useScrollAnimation<HTMLHeadingElement>();
  const { sfx } = useKioskAudio();
  const { playSfx } = useSfx();
  const { closeOverlay, openOverlay } = useKioskOverlay();

  const [showOverlay, setShowOverlay] = useState(false);

  const {
    labelRef: eyebrowRef,
    sectionRef,
    showStickyHeader,
    stickyHeaderRef,
  } = useStickyHeader<HTMLHeadingElement>({
    sectionName: SECTION_NAMES.CUSTOM_INTERACTIVE,
  });

  // Get dynamic gradient height for this custom interactive instance
  const { getCustomInteractiveHeight } = useGradientHeights();
  const gradientHeight = getCustomInteractiveHeight(customInteractiveIndex);

  const eyebrowText = eyebrow;
  const headlineText = headline;
  // Use custom interactive number instead of kiosk ID for styling
  const isCI3 = customInteractiveNumber === 3;
  const ctaWidthClass = isCI3 ? 'w-[1360px]' : 'w-[1020px]';
  const secondaryLabelPadding = isCI3 ? 'pl-[320px]' : 'pl-[80px]';
  const secondaryIconOffset = isCI3 ? 'left-[-330px]' : 'left-[-70px]';

  const handleSecondaryClick = () => {
    if (sfx.open) {
      playSfx(sfx.open);
    }
    openOverlay();
    setShowOverlay(true);
    onSecondaryCta?.();
  };

  const handlePrimaryClick = () => {
    if (sfx.next) {
      playSfx(sfx.next);
    }
    onPrimaryCta?.();
  };

  const handleCloseOverlay = () => {
    if (sfx.close) {
      playSfx(sfx.close);
    }
    closeOverlay();
    setShowOverlay(false);
    onEndTour?.();
  };

  return (
    <div
      className="group/ci relative flex h-screen w-full flex-col overflow-visible"
      data-ci={`ci-${customInteractiveNumber}`}
      data-scroll-section="customInteractive-first-screen"
      data-section={SECTION_NAMES.CUSTOM_INTERACTIVE}
      ref={sectionRef}
    >
      {/* Background gradient - height calculated dynamically based on rendered templates */}
      <div
        className="bg-gradient-kiosk-blue pointer-events-none absolute top-0 right-0 left-0"
        style={{ height: gradientHeight > 0 ? `${gradientHeight}px` : undefined }}
      />

      {/* Overlay - Demo Screen */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700',
          showOverlay ? 'pointer-events-auto z-9999 opacity-100' : 'pointer-events-none -z-10 opacity-0'
        )}
      >
        <CustomInteractiveDemoScreenTemplate
          cardLabel={overlayCardLabel}
          demoIframeSrc={demoIframeSrc}
          endTourLabel={overlayEndTourLabel}
          headline={overlayHeadline}
          heroImageAlt={heroImageAlt}
          heroImageSrc={heroImageSrc}
          onEndTour={handleCloseOverlay}
        />
      </div>

      {/* Eyebrow */}
      <motion.h2
        animate={shouldAnimate ? { y: 0 } : undefined}
        className="absolute top-[200px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed] will-change-transform group-data-[ci=ci-2]/ci:left-[120px] group-data-[ci=ci-3]/ci:top-[240px]"
        initial={{ y: TITLE_ANIMATION_TRANSFORMS.SECTION_HEADER }}
        ref={eyebrowRef}
        transition={{ delay: 0, duration: SCROLL_ANIMATION_CONFIG.DURATION, ease: SCROLL_ANIMATION_CONFIG.EASING }}
      >
        {renderRegisteredMark(eyebrowText)}
      </motion.h2>

      {/* Sticky Section Header - Fixed Position - gradient defined in globals.css for readability and ease of future updates */}
      <div
        className={cn(
          'bg-gradient-sticky-custom-interactive pointer-events-none fixed top-0 left-0 z-[100] h-[769px] w-full transition-opacity duration-300 motion-reduce:transition-none',
          showStickyHeader ? 'opacity-100' : 'opacity-0'
        )}
        data-custominteractive-sticky-header
        data-visible={showStickyHeader}
        ref={stickyHeaderRef}
      >
        {/* Eyebrow */}
        <h2 className="px-[120px] pt-[240px] pb-[375px] pl-[150px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(eyebrowText)}
        </h2>
      </div>

      {/* Animation trigger - positioned to trigger when section is fully in view */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[900px] h-[100px] w-full"
        ref={animationTriggerRef}
      />

      {/* Headline */}
      <h1
        className="absolute top-[1250px] left-[250px] w-full text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed] group-data-[ci=ci-3]/ci:top-[830px]"
        data-scroll-section="customInteractive-headline"
      >
        {renderRegisteredMark(headlineText)}
      </h1>

      {/* CTA buttons */}
      <div
        className={cn(
          'absolute top-[2220px] left-[245px] z-10 flex flex-col gap-[90px] group-data-[ci=ci-3]/ci:top-[2350px]',
          ctaWidthClass
        )}
      >
        {primaryCtaLabel && (
          <button
            className="group flex h-[200px] items-center justify-between rounded-[999px] bg-[#ededed] px-[100px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-[#14477d] shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[19px] transition-transform duration-150 hover:scale-[1.01] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
            onClick={handlePrimaryClick}
            type="button"
          >
            <span className="pt-[10px] pl-[10px]">{renderRegisteredMark(primaryCtaLabel)}</span>
            <div>
              <ArrowIcon />
            </div>
          </button>
        )}
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
