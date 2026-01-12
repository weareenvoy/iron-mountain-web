'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { memo, useEffect, useRef, useState } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import ButtonArrow from '@/components/ui/icons/ButtonArrow';
import WhiteLogoSimple from '@/components/ui/icons/WhiteLogoSimple';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type InitialScreenTemplateProps = {
  readonly arrowIconSrc?: string;
  readonly attribution?: string;
  readonly backgroundImage?: string;
  readonly buttonText?: string;
  readonly headline?: string;
  readonly idleVideoSrc?: string;
  readonly kioskId?: KioskId;
  readonly onButtonClick?: () => void;
  readonly quote?: string;
  readonly subheadline?: string;
};

const IDLE_FADE_OUT_DURATION_MS = 800;

const InitialScreenTemplate = memo(
  ({
    arrowIconSrc,
    attribution,
    backgroundImage,
    buttonText,
    headline,
    idleVideoSrc,
    kioskId,
    onButtonClick,
    quote,
    subheadline,
  }: InitialScreenTemplateProps) => {
    const { client } = useMqtt();
    const ref = useRef(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const idleVideoSrcRef = useRef<string | undefined>(idleVideoSrc);
    const [dismissedIdleVideoSrc, setDismissedIdleVideoSrc] = useState<null | string>(null);
    const [idleCompleteVideoSrc, setIdleCompleteVideoSrc] = useState<null | string>(null);

    /**
     * Animation trigger configuration:
     * - amount: 0.3 = Animations trigger when 30% of element is visible
     * - once: true = Animations fire once and won't re-trigger on scroll back
     *
     * Note: Animations are gated by both isInView AND idleComplete.
     * This means if user scrolls away and back before dismissing idle,
     * animations won't trigger (intentional design to wait for idle dismissal).
     */
    const isInView = useInView(ref, { amount: 0.3, once: true });

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      idleVideoSrcRef.current = idleVideoSrc;
    }, [idleVideoSrc]);

    const handleIdleTap = () => {
      if (!idleVideoSrc) return;
      setDismissedIdleVideoSrc(idleVideoSrc);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Trigger loadTour when idle screen is dismissed
      if (client && kioskId) {
        console.info(`${kioskId}: Idle screen dismissed, triggering loadTour`);
        client.loadTour(kioskId, {
          onError: (err: Error) => console.error(`${kioskId}: Failed to trigger loadTour:`, err),
          onSuccess: () => console.info(`${kioskId}: Successfully triggered loadTour`),
        });
      }

      // Wait for fade out animation to complete before triggering initial screen animations
      const videoSrcAtTap = idleVideoSrc;
      timeoutRef.current = setTimeout(() => {
        if (idleVideoSrcRef.current !== videoSrcAtTap) return;
        setIdleCompleteVideoSrc(videoSrcAtTap);
        timeoutRef.current = null;
      }, IDLE_FADE_OUT_DURATION_MS);
    };

    const idleComplete = !idleVideoSrc || idleCompleteVideoSrc === idleVideoSrc;
    const showIdle = Boolean(idleVideoSrc) && dismissedIdleVideoSrc !== idleVideoSrc;

    const shouldAnimate = isInView && idleComplete;
    return (
      <div
        className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
        data-scroll-section="cover-ambient-initial"
        ref={ref}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="relative h-full w-full">
            {backgroundImage && (
              <Image
                alt={headline ? `${headline} background image` : 'Kiosk hero background image'}
                className="object-cover object-center"
                fill
                priority
                quality={90} // 90 Quality here since it's a hero image and it's the / a main focus of the page.
                sizes="100vw"
                src={backgroundImage}
              />
            )}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.2)]" />
          </div>
        </div>
        <div className="absolute top-[970px] left-[244px] z-3 w-[980px] -translate-y-full">
          <h2 className="text-[120px] leading-[1.3] font-normal tracking-[-6px] whitespace-pre-line text-[#ededed]">
            {renderRegisteredMark(subheadline)}
          </h2>
        </div>

        {/* Logo - Not animated, positioned outside the animated container */}
        <div className="absolute top-[4030px] left-[250px] z-3 flex h-[182px] w-[703px] items-center group-data-[kiosk=kiosk-3]/kiosk:hidden">
          <WhiteLogoSimple aria-hidden="true" className="h-full w-full" preserveAspectRatio="xMidYMid meet" />
        </div>

        <motion.div
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 200 }}
          className="absolute top-[1130px] left-[120px] z-2 flex w-[1920px] flex-col gap-[200px] rounded-[60px] bg-[#F7931E] px-[120px] py-[240px] pb-[430px] backdrop-blur-[30px] will-change-[transform,opacity] group-data-[kiosk=kiosk-2]/kiosk:bg-[#8DC13F] group-data-[kiosk=kiosk-2]/kiosk:py-[220px] group-data-[kiosk=kiosk-2]/kiosk:pb-[240px] group-data-[kiosk=kiosk-3]/kiosk:w-[1920px] group-data-[kiosk=kiosk-3]/kiosk:bg-[#00A88E] group-data-[kiosk=kiosk-3]/kiosk:pb-0"
          data-name="Challenge Initial Screen Content Box"
          initial={{ opacity: 0, y: 200 }}
          transition={{ delay: 0, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
        >
          <motion.h1
            animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }}
            className="max-w-[1660px] text-[80px] leading-[1.3] font-normal tracking-[-4px] text-black will-change-[transform,opacity]"
            initial={{ opacity: 0, y: 150 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
          >
            {renderRegisteredMark(headline)}
          </motion.h1>

          <motion.div
            animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }}
            className="relative top-[10px] flex w-[1670px] flex-col gap-[20px] will-change-[transform,opacity]"
            initial={{ opacity: 0, y: 150 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
          >
            <p className="text-[80px] leading-[1.3] font-normal tracking-[-4px] text-white group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:top-[-230px] group-data-[kiosk=kiosk-3]/kiosk:text-[120px] group-data-[kiosk=kiosk-3]/kiosk:tracking-[-6px]">
              {renderRegisteredMark(quote)}
            </p>
            <p className="relative top-[180px] text-[52px] leading-[1.4] font-semibold tracking-[-2.6px] whitespace-pre-wrap text-black">
              {renderRegisteredMark(attribution)}
            </p>
          </motion.div>

          <motion.div
            animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }}
            className="relative top-[190px] flex w-full flex-col items-start justify-center gap-[10px] will-change-[transform,opacity] group-data-[kiosk=kiosk-2]/kiosk:top-0 group-data-[kiosk=kiosk-3]/kiosk:top-[-220px]"
            initial={{ opacity: 0, y: 150 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
          >
            <button
              aria-label={buttonText}
              className="group flex h-[200px] items-center justify-center gap-[60px] rounded-[999px] bg-[#ededed] px-[100px] py-[70px] text-left backdrop-blur-[19px] transition-all duration-300 ease-out group-data-[kiosk=kiosk-2]/kiosk:px-[110px] hover:scale-[1.05] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-[0.98] active:opacity-70 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]"
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
          </motion.div>
        </motion.div>

        {/* Idle Screen Overlay */}
        <AnimatePresence>
          {showIdle && idleVideoSrc && (
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 flex cursor-pointer items-center justify-center bg-black"
              exit={{ opacity: 0 }}
              initial={{ opacity: 1 }}
              onClick={handleIdleTap}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleIdleTap();
                }
              }}
              role="button"
              tabIndex={0}
              transition={{ duration: IDLE_FADE_OUT_DURATION_MS / 1000, ease: [0.3, 0, 0.6, 1] }}
            >
              <video
                autoPlay
                className="absolute inset-0 h-full w-full object-cover"
                loop
                muted
                playsInline
                src={idleVideoSrc}
              >
                <track kind="captions" />
              </video>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default InitialScreenTemplate;
