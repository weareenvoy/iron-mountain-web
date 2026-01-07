'use client';

import { motion } from 'framer-motion';
import { SquarePlay } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import { cn } from '@/lib/tailwind/utils/cn';
import { normalizeText } from '@/lib/utils/normalize-text';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import StepCarousel, { type Step } from './components/StepCarousel';
import StepModal, { type ModalContent } from './components/StepModal';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// Animation configuration for text/button entrance from below
const TEXT_ANIMATION = {
  DELAY: 0.4, // Starts after center diamond begins moving
  DURATION: 0.8,
  EASE: [0.4, 0, 0.2, 1] as const,
  START_Y: 550, // Animates UP from far below (bleeds significantly into diamonds area)
} as const;

export type CustomInteractiveKiosk1SecondScreenTemplateProps = {
  readonly demoIframeSrc?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly onBack?: () => void;
  readonly onSecondaryCta?: () => void;
  readonly overlayCardLabel?: string;
  readonly overlayEndTourLabel?: string;
  readonly overlayHeadline?: string;
  readonly secondaryCtaLabel?: string;
  readonly steps?: readonly Step[];
};

const CustomInteractiveKiosk1SecondScreenTemplate = ({
  demoIframeSrc,
  eyebrow,
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
  const eyebrowText: string = normalizeText(eyebrow);
  const headlineText: string = normalizeText(headline);
  const normalizedSteps = steps ?? [];
  const isKiosk3 = kioskId === 'kiosk-3';
  const secondaryIconOffset = isKiosk3 ? 'left-[-330px]' : 'left-[-70px]';

  const [openModalIndex, setOpenModalIndex] = useState<null | number>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [shouldAnimateText, setShouldAnimateText] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const activeStep = openModalIndex !== null ? normalizedSteps[openModalIndex] : null;
  const activeModalContent: ModalContent | null = activeStep
    ? {
        body: activeStep.modal?.body ?? '',
        heading: activeStep.modal?.heading ?? activeStep.label,
        imageAlt: activeStep.modal?.imageAlt,
        imageSrc: activeStep.modal?.imageSrc,
      }
    : null;

  const handleSecondaryClick = () => {
    setShowOverlay(true);
    onSecondaryCta?.();
  };

  useEffect(() => {
    setPortalTarget(containerRef.current);
  }, []);

  // Detect when text/button become visible to trigger animations
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
        threshold: 0.1, // Trigger when 10% visible (earlier to account for transform offset)
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
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-transparent" />

        {/* Overlay - Demo Screen */}
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            showOverlay ? 'pointer-events-auto z-50 opacity-100' : 'pointer-events-none opacity-0'
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

        <h2 className="absolute top-[240px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(eyebrowText)}
        </h2>

        <motion.h1
          animate={shouldAnimateText ? { y: 0 } : { y: TEXT_ANIMATION.START_Y }}
          className="absolute top-[830px] left-[240px] z-0 w-full text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed] will-change-transform"
          initial={{ y: TEXT_ANIMATION.START_Y }}
          ref={headlineRef}
          transition={{
            delay: TEXT_ANIMATION.DELAY,
            duration: TEXT_ANIMATION.DURATION,
            ease: TEXT_ANIMATION.EASE,
          }}
        >
          {renderRegisteredMark(headlineText)}
        </motion.h1>

        <motion.p
          animate={shouldAnimateText ? { y: 0 } : { y: TEXT_ANIMATION.START_Y }}
          className="absolute top-[1320px] left-[250px] z-0 w-[640px] text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#ededed] will-change-transform"
          initial={{ y: TEXT_ANIMATION.START_Y }}
          transition={{
            delay: TEXT_ANIMATION.DELAY,
            duration: TEXT_ANIMATION.DURATION,
            ease: TEXT_ANIMATION.EASE,
          }}
        >
          {renderRegisteredMark('Explore each section to learn how Iron Mountain can transform your enterprise')}
        </motion.p>

        <motion.button
          animate={shouldAnimateText ? { y: 0 } : { y: TEXT_ANIMATION.START_Y }}
          className="absolute top-[1330px] left-[1245px] z-0 flex h-[200px] items-center justify-between rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[70px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[19px] transition-transform duration-150 will-change-transform hover:scale-[1.01]"
          initial={{ y: TEXT_ANIMATION.START_Y }}
          onClick={handleSecondaryClick}
          transition={{
            delay: TEXT_ANIMATION.DELAY,
            duration: TEXT_ANIMATION.DURATION,
            ease: TEXT_ANIMATION.EASE,
          }}
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
        </motion.button>

        {/* Step Carousel */}
        <StepCarousel onStepClick={setOpenModalIndex} steps={normalizedSteps} />
      </div>

      {/* Step Modal */}
      {activeModalContent && portalTarget
        ? createPortal(<StepModal content={activeModalContent} onClose={() => setOpenModalIndex(null)} />, portalTarget)
        : null}
    </>
  );
};

export default CustomInteractiveKiosk1SecondScreenTemplate;
