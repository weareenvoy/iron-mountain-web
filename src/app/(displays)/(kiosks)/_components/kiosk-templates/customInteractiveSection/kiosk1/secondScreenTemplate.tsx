'use client';

import { AnimatePresence } from 'framer-motion';
import { SquarePlay } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import { KIOSK_SFX } from '@/app/(displays)/(kiosks)/_utils/audio-constants';
import { useSfx } from '@/components/providers/audio-provider';
import { cn } from '@/lib/tailwind/utils/cn';
import { normalizeText } from '@/lib/utils/normalize-text';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { AnimatedText } from './components/AnimatedText';
import { StepCarousel, type Step } from './components/StepCarousel';
import { StepModal, type ModalContent } from './components/StepModal';
import { SECTION_NAMES } from '../../hooks/useStickyHeader';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Props for Custom Interactive Kiosk 1 Second Screen Template
 */
export type CustomInteractiveKiosk1SecondScreenTemplateProps = {
  /** Label for the back button in step modal */
  readonly backLabel?: string;
  /** Body text below headline (extracted from hardcoded string) */
  readonly bodyText?: string;
  /** URL for demo iframe content */
  readonly demoIframeSrc?: string;
  /** Small heading above main headline */
  readonly eyebrow?: string;
  /** Main headline text */
  readonly headline?: string;
  /** Hero image alt text for demo overlay */
  readonly heroImageAlt?: string;
  /** Hero image source for demo overlay */
  readonly heroImageSrc?: string;
  /** Kiosk identifier for layout adjustments */
  readonly kioskId?: KioskId;
  /** Callback when back button is pressed */
  readonly onBack?: () => void;
  /** Callback when secondary CTA is clicked */
  readonly onSecondaryCta?: () => void;
  /** Label for overlay card */
  readonly overlayCardLabel?: string;
  /** Label for end tour button */
  readonly overlayEndTourLabel?: string;
  /** Headline for overlay screen */
  readonly overlayHeadline?: string;
  /** Label for secondary CTA button */
  readonly secondaryCtaLabel?: string;
  /** Array of carousel steps */
  readonly steps?: readonly Step[];
};

/**
 * CustomInteractiveKiosk1SecondScreenTemplate - Second screen for custom interactive kiosk
 * Features animated headline/body/button and diamond carousel with modal details
 */
const CustomInteractiveKiosk1SecondScreenTemplate = ({
  backLabel,
  bodyText,
  demoIframeSrc,
  headline,
  heroImageAlt,
  heroImageSrc,
  kioskId,
  onSecondaryCta,
  overlayCardLabel,
  overlayEndTourLabel,
  overlayHeadline,
  secondaryCtaLabel,
  steps,
}: CustomInteractiveKiosk1SecondScreenTemplateProps) => {
  const headlineText: string = normalizeText(headline);
  const normalizedBodyText = bodyText ?? '';
  const normalizedSteps = steps ?? [];
  const isKiosk3 = kioskId === 'kiosk-3';
  const secondaryIconOffset = isKiosk3 ? 'left-[-330px]' : 'left-[-70px]';
  const { playSfx } = useSfx();

  const [openModalIndex, setOpenModalIndex] = useState<null | number>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [shouldAnimateText, setShouldAnimateText] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const activeStep = (openModalIndex !== null && normalizedSteps[openModalIndex]) ?? null;
  const activeModalContent: ModalContent | null = activeStep
    ? {
        body: activeStep.modal?.body ?? '',
        heading: activeStep.modal?.heading ?? activeStep.label,
        imageAlt: activeStep.modal?.imageAlt,
        imageSrc: activeStep.modal?.imageSrc,
      }
    : null;

  const handleSecondaryClick = useCallback(() => {
    playSfx(KIOSK_SFX.open);
    setShowOverlay(true);
    onSecondaryCta?.();
  }, [onSecondaryCta, playSfx]);

  const handleEndTour = useCallback(() => {
    playSfx(KIOSK_SFX.close);
    setShowOverlay(false);
  }, [playSfx]);

  const handleModalClose = useCallback(() => {
    playSfx(KIOSK_SFX.close);
    setOpenModalIndex(null);
  }, [playSfx]);

  const handleModalOpen = useCallback(
    (index: number) => {
      playSfx(KIOSK_SFX.open);
      setOpenModalIndex(index);
    },
    [playSfx]
  );

  useEffect(() => {
    setPortalTarget(containerRef.current);
  }, []);

  /**
   * Detect when text/button become visible to trigger animations
   * Lower threshold (0.1) triggers earlier than carousel (0.3) because text
   * starts 550px below initial position and needs time to animate into view
   */
  useEffect(() => {
    const currentHeadline = headlineRef.current;
    if (!currentHeadline) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldAnimateText(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(currentHeadline);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="relative flex h-screen w-full flex-col overflow-visible bg-transparent"
        data-scroll-section="customInteractive-second-screen"
        data-section-end={SECTION_NAMES.CUSTOM_INTERACTIVE}
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-transparent" />

        {/* Overlay - Demo Screen */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            showOverlay ? 'pointer-events-auto z-9999 opacity-100' : 'pointer-events-none opacity-0'
          )}
        >
          <CustomInteractiveDemoScreenTemplate
            cardLabel={overlayCardLabel}
            demoIframeSrc={demoIframeSrc}
            endTourLabel={overlayEndTourLabel}
            headline={overlayHeadline}
            heroImageAlt={heroImageAlt}
            heroImageSrc={heroImageSrc}
            onEndTour={handleEndTour}
          />
        </div>

        {/* Use AnimatedText component for consistent animation */}
        <AnimatedText
          as="h1"
          className="absolute top-[830px] left-[240px] z-0 w-full text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed] will-change-transform"
          ref={headlineRef}
          shouldAnimate={shouldAnimateText}
        >
          {renderRegisteredMark(headlineText)}
        </AnimatedText>

        <AnimatedText
          as="p"
          className="absolute top-[1320px] left-[250px] z-0 w-[640px] text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#ededed] will-change-transform"
          shouldAnimate={shouldAnimateText}
        >
          {renderRegisteredMark(normalizedBodyText)}
        </AnimatedText>

        {/* CTA button gradient - defined in globals.css for readability and ease of future updates */}
        <AnimatedText
          as="button"
          className="group bg-gradient-kiosk-magenta absolute top-[1330px] left-[1245px] z-0 flex h-[200px] items-center justify-between rounded-[999px] px-[70px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[19px] transition-transform duration-150 will-change-transform hover:scale-[1.01] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
          onClick={handleSecondaryClick}
          shouldAnimate={shouldAnimateText}
          type="button"
        >
          <span className="mr-[50px]">{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center pl-[80px]">
            <SquarePlay
              aria-hidden
              className={cn('relative h-[90px] w-[90px]', secondaryIconOffset)}
              color="#ededed"
              strokeWidth={2}
            />
          </div>
        </AnimatedText>

        {/* Step Carousel */}
        <StepCarousel onStepClick={handleModalOpen} steps={normalizedSteps} />
      </div>

      {/* Step Modal */}
      {portalTarget
        ? createPortal(
            <AnimatePresence>
              {activeModalContent ? (
                <StepModal
                  backLabel={backLabel}
                  content={activeModalContent}
                  key="step-modal"
                  onClose={handleModalClose}
                />
              ) : null}
            </AnimatePresence>,
            portalTarget
          )
        : null}
    </>
  );
};

const MemoizedCustomInteractiveKiosk1SecondScreenTemplate = memo(CustomInteractiveKiosk1SecondScreenTemplate);
export { MemoizedCustomInteractiveKiosk1SecondScreenTemplate as CustomInteractiveKiosk1SecondScreenTemplate };
