'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowLeft, SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import CustomInteractiveDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import BlueDot from '@/components/ui/icons/Kiosks/CustomInteractive/BlueDot';
import HCBlueFilledDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueFilledDiamond';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCFilledOrangeDiamond2 from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond2';
import HCFilledTealDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledTealDiamond';
import HCHollowBlueDiamond2 from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond2';
import HCHollowGreenDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowGreenDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import InnerRing from '@/components/ui/icons/Kiosks/CustomInteractive/InnerRing';
import OuterRing from '@/components/ui/icons/Kiosks/CustomInteractive/OuterRing';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import CircularCarousel, { type CarouselSlide } from './components/CircularCarousel';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type CustomInteractiveKiosk3SecondScreenTemplateProps = {
  readonly backLabel?: string;
  readonly demoIframeSrc?: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly onBack?: () => void;
  readonly overlayCardLabel?: string;
  readonly overlayEndTourLabel?: string;
  readonly overlayHeadline?: string;
  readonly overlayHeroImageAlt?: string;
  readonly overlayHeroImageSrc?: string;
  readonly slides?: CarouselSlide[];
  readonly tapToBeginLabel?: string;
  readonly videoAsset?: string;
};

const CustomInteractiveKiosk3SecondScreenTemplate = ({
  backLabel,
  demoIframeSrc,
  description,
  eyebrow,
  headline,
  onBack,
  overlayCardLabel,
  overlayEndTourLabel,
  overlayHeadline,
  overlayHeroImageAlt,
  overlayHeroImageSrc,
  slides,
  tapToBeginLabel,
  videoAsset,
}: CustomInteractiveKiosk3SecondScreenTemplateProps) => {
  const [showCarousel, setShowCarousel] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isCarouselExiting, setIsCarouselExiting] = useState(false);
  const [isButtonTransitioning, setIsButtonTransitioning] = useState(false);
  const safeSlides = slides ?? [];

  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  const handleTapToBegin = useCallback(() => {
    setIsButtonTransitioning(true);
    setShowCarousel(true);
  }, []);

  const handleShowOverlay = useCallback(() => {
    setShowOverlay(true);
  }, []);

  const handleHideOverlay = useCallback(() => {
    setShowOverlay(false);
  }, []);

  const handleIndexChange = useCallback((index: number) => {
    setCarouselIndex(index);
  }, []);

  const handleIsExitingChange = useCallback((isExiting: boolean) => {
    setIsCarouselExiting(isExiting);
  }, []);

  if (safeSlides.length === 0 || !headline) {
    return null;
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      data-scroll-section="customInteractive-second-screen"
      ref={ref}
    >
      <div className="absolute inset-0 bg-transparent" />

      {/* Diamond video background - Morphs into first carousel slide */}
      <AnimatePresence mode="wait">
        {(!showCarousel || carouselIndex === 0) && (
          <motion.div
            animate={
              carouselIndex === 0 && isCarouselExiting
                ? { opacity: 0, scale: 0.332, x: -1116, y: -896 }
                : showCarousel
                  ? { opacity: 1, scale: 0.332, x: -1095, y: -875 }
                  : { opacity: 1, scale: 1, x: 0, y: 0 }
            }
            className="pointer-events-none absolute bottom-[-1000px] left-[50px] z-0 h-[2500px] w-[2500px] rotate-45 overflow-hidden rounded-[200px] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
            exit={{ opacity: 0, scale: 0.332, x: -1116, y: -896 }}
            initial={showCarousel ? { opacity: 0, scale: 0, x: -1095, y: -875 } : { opacity: 1, scale: 1, x: 0, y: 0 }}
            key="morphing-diamond"
            transition={{ duration: 0.6, ease: [0.3, 0, 0.4, 1] }}
          >
            <motion.div
              animate={{ left: showCarousel ? 0 : 480 }}
              className="absolute inset-0 h-full w-full -rotate-45"
              initial={{ left: showCarousel ? 0 : 480 }}
              transition={{ duration: 0.6, ease: [0.3, 0, 0.4, 1] }}
            >
              <motion.video
                animate={{ scale: showCarousel ? 1.4 : 1.7 }}
                autoPlay
                className="h-full w-full origin-center object-cover"
                initial={{ scale: showCarousel ? 1.4 : 1.7 }}
                loop
                muted
                playsInline
                src={videoAsset}
                transition={{ duration: 0.6, ease: [0.3, 0, 0.4, 1] }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel state - Always present but initially at opacity 0 */}
      <motion.div
        animate={{ opacity: showCarousel ? 1 : 0 }}
        className={cn('absolute inset-0 z-10', showCarousel ? 'pointer-events-auto' : 'pointer-events-none')}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
      >
        <CircularCarousel
          onIndexChange={handleIndexChange}
          onIsExitingChange={handleIsExitingChange}
          slides={safeSlides}
        >
          {({ current, index, isExiting }) => {
            const isSlide1 = current.id === 'slide-1';
            const isSlide2 = current.id === 'slide-2';
            const isSlide5 = current.id === 'slide-5';
            const isSlide3 = current.id === 'slide-3';
            const isSlide6 = current.id === 'slide-6';
            const primaryDiamondClass =
              isSlide2 || isSlide5
                ? 'absolute left-[510px] bottom-[670px] h-[1200px] w-[1200px] rotate-45 overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
                : isSlide3 || isSlide6
                  ? 'absolute left-[340px] bottom-[340px] h-[1130px] w-[1130px] rotate-45 overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
                  : 'absolute left-[700px] bottom-[1120px] h-[830px] w-[830px] rotate-45 overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]';
            const secondaryDiamondClass =
              isSlide3 || isSlide6
                ? 'absolute left-[1390px] bottom-[1150px] h-[800px] w-[800px] rotate-45 overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]'
                : 'absolute left-[1380px] bottom-[400px] h-[880px] w-[880px] rotate-45 overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]';

            const headlineText = headline;
            const eyebrowText = current.eyebrow;
            const sectionTitle = current.sectionTitle;

            return (
              <>
                {/* Eyebrow */}
                <h2 className="absolute top-[240px] left-[120px] text-[57px] leading-normal font-normal tracking-[-1.8px] whitespace-pre-line text-[#ededed]">
                  {renderRegisteredMark(eyebrowText)}
                </h2>

                {/* Main headline */}
                <h1 className="absolute top-[830px] left-[240px] max-w-[1200px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line text-white">
                  {renderRegisteredMark(headlineText)}
                </h1>

                {/* Data configuration + bullets */}
                <div className="absolute top-[1600px] left-[240px] w-[1000px] text-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      key={current.id}
                      transition={{ delay: 0.2, duration: 0.4, ease: [0.3, 0, 0.6, 1] }}
                    >
                      <div className="text-[80px] leading-normal font-normal tracking-[-4px]">
                        {renderRegisteredMark(sectionTitle)}
                      </div>
                      <ul className="mt-[110px] ml-[60px] space-y-[22px]">
                        {current.bullets.map((bullet, bulletIndex) => (
                          <motion.li
                            animate={{ opacity: 1 }}
                            className="flex w-[1100px] items-start gap-[16px] text-[64px]"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            key={`${current.id}-bullet-${bulletIndex}`}
                            transition={{
                              delay: 0.2 + bulletIndex * 0.1,
                              duration: 0.4,
                              ease: [0.3, 0, 0.6, 1],
                            }}
                          >
                            <span className="mt-[30px] mr-[40px] ml-[-50px] inline-block h-[32px] w-[32px] rotate-45 rounded-[4px] border-4 border-white/80" />
                            <span>{renderRegisteredMark(bullet)}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Primary diamond (video or image) - Hidden for slide 1 since background morphs into it */}
                {!isSlide1 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={
                        isExiting ? { opacity: 0, scale: 1, x: -21, y: -21 } : { opacity: 1, scale: 1, x: 0, y: 0 }
                      }
                      className={primaryDiamondClass}
                      exit={{ opacity: 0, scale: 1, x: -21, y: -21 }}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      key={`primary-${index}`}
                      transition={{ duration: 0.6, ease: [0.3, 0, 0.4, 1] }}
                    >
                      {current.primaryVideoSrc ? (
                        <video
                          autoPlay
                          className="h-full w-full origin-center scale-[1.35] -rotate-45 object-cover"
                          loop
                          muted
                          playsInline
                          src={current.primaryVideoSrc}
                        />
                      ) : null}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Secondary diamond (decorative SVG or image) */}
                {current.secondaryImageSrc ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={
                        isExiting ? { opacity: 0, scale: 1, x: -21, y: -21 } : { opacity: 1, scale: 1, x: 0, y: 0 }
                      }
                      className={secondaryDiamondClass}
                      exit={{ opacity: 0, scale: 1, x: -21, y: -21 }}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      key={`secondary-${index}`}
                      transition={{ delay: 0.1, duration: 0.6, ease: [0.3, 0, 0.4, 1] }}
                    >
                      <Image
                        alt={current.secondaryImageAlt}
                        className="origin-center scale-[1.35] -rotate-45 object-cover"
                        fill
                        sizes="880px"
                        src={current.secondaryImageSrc}
                      />
                    </motion.div>
                  </AnimatePresence>
                ) : null}

                {/* Decorative SVG Diamonds - Slide 2 & 5 (Teal, Blue, Orange) */}
                {(isSlide2 || isSlide5) && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={isExiting ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
                      className="absolute inset-0"
                      exit={{ opacity: 0, y: -30 }}
                      initial={{ opacity: 0, y: 0 }}
                      key={`svg-group-2-5-${index}`}
                      transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                    >
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[670px] left-[-20px] h-[510px] w-[560px]"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCFilledTealDiamond className="h-full w-full" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[-1560px] left-[-10px] h-[2400px] w-[2400px] overflow-visible"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCHollowBlueDiamond2 className="h-full w-full" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[-1555px] left-[1100px] h-[1200px] w-[1200px] rotate-45 overflow-visible"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCFilledOrangeDiamond2 className="h-full w-full" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[-980px] left-[1240px] h-[1800px] w-[1800px] overflow-visible"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCHollowOrangeDiamond className="h-full w-full" />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Decorative SVG Diamonds - Slide 3 & 6 (Orange, Blue, Green) */}
                {(isSlide3 || isSlide6) && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={isExiting ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
                      className="absolute inset-0"
                      exit={{ opacity: 0, y: -30 }}
                      initial={{ opacity: 0, y: 0 }}
                      key={`svg-group-3-6-${index}`}
                      transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                    >
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[670px] left-[1880px] h-[450px] w-[450px]"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCFilledOrangeDiamond className="h-full w-full" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[-1650px] left-[1290px] h-[2400px] w-[2400px] overflow-visible"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCHollowBlueDiamond2 className="h-full w-full" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[-1240px] left-0 h-[1800px] w-[1800px] overflow-visible"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCHollowGreenDiamond className="h-full w-full" />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Decorative SVG Diamonds - Slide 1 & 4 (Blue, Orange) */}
                {!isSlide2 && !isSlide3 && !isSlide5 && !isSlide6 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={isExiting ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
                      className="absolute inset-0"
                      exit={{ opacity: 0, y: -30 }}
                      initial={{ opacity: 0, y: 0 }}
                      key={`svg-group-1-4-${index}`}
                      transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                    >
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[590px] left-[490px] h-[510px] w-[560px]"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCBlueFilledDiamond className="h-full w-full" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: 1 }}
                        className="pointer-events-none absolute bottom-[-1755px] left-[650px] h-[2400px] w-[2400px] overflow-visible"
                        initial={{ scale: 0 }}
                        transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
                      >
                        <HCHollowOrangeDiamond className="h-full w-full" />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </>
            );
          }}
        </CircularCarousel>

        {/* CTA - Only visible when carousel is shown */}
        <button
          className="group absolute top-[2630px] left-[240px] z-10 flex h-[200px] items-center gap-[18px] rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[110px] text-[55px] leading-[1.1] font-semibold tracking-[2px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
          onClick={handleShowOverlay}
          type="button"
        >
          Launch demo
          <SquarePlay aria-hidden className="ml-[40px] h-[90px] w-[90px]" strokeWidth={2} />
        </button>
      </motion.div>

      {/* Initial state - Rings, dots, "Tap to begin" - Fades to opacity 0 */}
      <motion.div
        animate={{ opacity: showCarousel ? 0 : 1 }}
        className={cn('absolute inset-0 z-10', showCarousel ? 'pointer-events-none' : 'pointer-events-auto')}
        initial={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.3, 0, 0.6, 1] }}
      >
        <h2 className="absolute top-[240px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-white">
          {renderRegisteredMark(eyebrow)}
        </h2>

        <div className="absolute top-[820px] left-[240px] max-w-[1200px] text-white">
          <h1 className="mb-[40px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line">
            {renderRegisteredMark(headline)}
          </h1>
          <p className="relative top-[190px] text-[52px] leading-[1.4] font-normal tracking-[-2.6px] whitespace-pre-line text-white/90">
            {renderRegisteredMark(description)}
          </p>
        </div>

        <div className="absolute top-[240px] right-[120px]">
          <button
            className="group relative top-[1070px] flex h-[200px] items-center gap-[20px] rounded-[1000px] bg-[#ededed] px-[120px] text-[54px] leading-[1.4] font-normal tracking-[-2px] text-[#14477d] transition hover:scale-[1.01] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft aria-hidden className="h-[32px] w-[32px]" color="#14477d" strokeWidth={2} />
            {renderRegisteredMark(backLabel)}
          </button>
        </div>

        <motion.div
          animate={
            isButtonTransitioning ? { opacity: 0, scale: 0.52, x: 700, y: -336 } : { opacity: 1, scale: 1, x: 0, y: 0 }
          }
          className="absolute top-[2266px] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0.6, 1] }}
        >
          <button
            className="relative flex h-full w-full items-center justify-center rounded-full transition hover:scale-[1.05] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
            onClick={handleTapToBegin}
            type="button"
          >
            {isInView && (
              <>
                <OuterRing className="absolute top-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
                <InnerRing className="absolute top-1/2 left-1/2 h-[730px] w-[730px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute inset-0 rounded-full bg-transparent" />
                <div className="absolute inset-[20px] rounded-full bg-transparent" />
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  className="relative top-[5px] z-10 text-[80px] leading-[1.3] font-normal tracking-[-4px] text-white"
                  transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                >
                  {renderRegisteredMark(tapToBeginLabel)}
                </motion.span>

                {/* Dot 1 - stays at 0deg (reference position, does not animate) */}
                <div className="absolute top-[48%] left-[50%] transform-[translate(-50%,-50%)_rotate(0deg)_translateY(-430px)]">
                  <BlueDot className="h-[60px] w-[60px]" />
                </div>

                {/* Dot 2 - animates from 0deg to 60deg with opacity fade */}
                <motion.div
                  animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(60deg) translateY(-430px)' }}
                  className="absolute top-[50%] left-[50%]"
                  initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                  transition={{ delay: 0.8, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
                >
                  <BlueDot className="h-[60px] w-[60px]" />
                </motion.div>

                {/* Dot 3 - animates from 0deg to 120deg with opacity fade */}
                <motion.div
                  animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(120deg) translateY(-430px)' }}
                  className="absolute top-[50%] left-[50%]"
                  initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                  transition={{ delay: 0.9, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
                >
                  <BlueDot className="h-[60px] w-[60px]" />
                </motion.div>

                {/* Dot 4 - animates from 0deg to 180deg with opacity fade */}
                <motion.div
                  animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(180deg) translateY(-430px)' }}
                  className="absolute top-[50%] left-[50%]"
                  initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                  transition={{ delay: 1.0, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
                >
                  <BlueDot className="h-[60px] w-[60px]" />
                </motion.div>

                {/* Dot 5 - animates from 0deg to 240deg with opacity fade */}
                <motion.div
                  animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(240deg) translateY(-430px)' }}
                  className="absolute top-[50%] left-[50%]"
                  initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                  transition={{ delay: 1.1, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
                >
                  <BlueDot className="h-[60px] w-[60px]" />
                </motion.div>

                {/* Dot 6 - animates from 0deg to 300deg with opacity fade, finishes when InnerRing pathLength completes (2.0s) */}
                <motion.div
                  animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(300deg) translateY(-430px)' }}
                  className="absolute top-[50%] left-[50%]"
                  initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                  transition={{ delay: 1.2, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
                >
                  <BlueDot className="h-[60px] w-[60px]" />
                </motion.div>
              </>
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Demo overlay */}
      {showOverlay && (
        <div className="absolute inset-0 z-9999 animate-in duration-700 fade-in">
          <CustomInteractiveDemoScreenTemplate
            cardLabel={overlayCardLabel}
            demoIframeSrc={demoIframeSrc}
            endTourLabel={overlayEndTourLabel}
            headline={overlayHeadline}
            heroImageAlt={overlayHeroImageAlt}
            heroImageSrc={overlayHeroImageSrc}
            onEndTour={handleHideOverlay}
          />
        </div>
      )}
    </div>
  );
};

export default CustomInteractiveKiosk3SecondScreenTemplate;
