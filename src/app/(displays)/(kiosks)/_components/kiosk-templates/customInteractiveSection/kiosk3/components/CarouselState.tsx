import { AnimatePresence, motion } from 'framer-motion';
import { SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { memo } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import CircularCarousel, { type CarouselSlide } from './CircularCarousel';
import {
  ANIMATION_VALUES,
  DIAMOND_ANIMATIONS,
  getDecorativeSVGVariant,
  getPrimaryDiamondClass,
  getSecondaryDiamondClass,
  SLIDE_ID,
  TRANSITIONS,
  Z_INDEX,
} from '../constants';
import DecorativeSVGGroup from './DecorativeSVGGroup';

type CarouselStateProps = {
  /** Main headline displayed across all carousel slides */
  readonly headline?: string;
  /** Callback when carousel index changes */
  readonly onIndexChange: (index: number) => void;
  /** Callback when slide exit animation state changes */
  readonly onIsExitingChange: (isExiting: boolean) => void;
  /** Callback to show demo overlay */
  readonly onShowOverlay: () => void;
  /** Whether carousel is visible (controls fade-in animation) */
  readonly showCarousel: boolean;
  /** Array of slides to display in carousel */
  readonly slides: readonly CarouselSlide[];
};

/**
 * Carousel state component for Kiosk 3 Custom Interactive.
 *
 * Displays after "Tap to begin" is clicked. Contains:
 * - Circular carousel navigation with slide counter
 * - Primary diamond (video/image) for each slide
 * - Secondary diamond (decorative image) for select slides
 * - Decorative SVG backgrounds (varies by slide)
 * - Bullet points with content
 * - "Launch demo" CTA button
 *
 * ## Animation Behavior
 * - Fades in when `showCarousel` becomes true
 * - Class computations happen in pure functions to avoid hooks violations
 * - Coordinates with parent via `onIndexChange` and `onIsExitingChange`
 *
 * ## Performance
 * - Helper functions are pure and don't require memoization
 * - Component is wrapped in React.memo
 * - Uses AnimatePresence for smooth transitions
 *
 * @param props - Component props
 */
const CarouselState = memo(
  ({ headline, onIndexChange, onIsExitingChange, onShowOverlay, showCarousel, slides }: CarouselStateProps) => {
    return (
      <motion.div
        animate={{ opacity: showCarousel ? 1 : 0 }}
        className={cn('absolute inset-0', showCarousel ? 'pointer-events-auto' : 'pointer-events-none')}
        initial={{ opacity: 0 }}
        style={{ zIndex: Z_INDEX.CAROUSEL }}
        transition={TRANSITIONS.CAROUSEL}
      >
        <CircularCarousel onIndexChange={onIndexChange} onIsExitingChange={onIsExitingChange} slides={slides}>
          {({ current, index, isExiting }) => {
            // Pure function calls - no hooks needed since these are simple string returns
            const primaryDiamondClass = getPrimaryDiamondClass(current.id);
            const secondaryDiamondClass = getSecondaryDiamondClass(current.id);
            const svgVariant = getDecorativeSVGVariant(current.id);

            return (
              <>
                {/* Eyebrow */}
                <h2 className="absolute top-[240px] left-[120px] text-[57px] leading-normal font-normal tracking-[-1.8px] whitespace-pre-line text-[#ededed]">
                  {renderRegisteredMark(current.eyebrow)}
                </h2>

                {/* Main headline */}
                <h1 className="absolute top-[830px] left-[240px] max-w-[1200px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line text-white">
                  {renderRegisteredMark(headline)}
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
                      transition={TRANSITIONS.SLIDE_CONTENT}
                    >
                      <div className="text-[80px] leading-normal font-normal tracking-[-4px]">
                        {renderRegisteredMark(current.sectionTitle)}
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
                              delay: ANIMATION_VALUES.BULLET_STAGGER_START + bulletIndex * ANIMATION_VALUES.BULLET_STAGGER_DELAY,
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
                {current.id !== SLIDE_ID.SLIDE_1 && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={
                        isExiting
                          ? {
                              opacity: DIAMOND_ANIMATIONS.ENTRY.exit.opacity,
                              scale: DIAMOND_ANIMATIONS.ENTRY.exit.scale,
                              x: DIAMOND_ANIMATIONS.ENTRY.exit.x,
                              y: DIAMOND_ANIMATIONS.ENTRY.exit.y,
                            }
                          : DIAMOND_ANIMATIONS.ENTRY.animate
                      }
                      className={primaryDiamondClass}
                      exit={DIAMOND_ANIMATIONS.ENTRY.exit}
                      initial={DIAMOND_ANIMATIONS.ENTRY.initial}
                      key={`primary-${index}`}
                      transition={TRANSITIONS.CAROUSEL}
                    >
                      {current.primaryVideoSrc && (
                        <video
                          autoPlay
                          className="h-full w-full origin-center -rotate-45 object-cover"
                          loop
                          muted
                          playsInline
                          src={current.primaryVideoSrc}
                          style={{ scale: ANIMATION_VALUES.DIAMOND_VIDEO_SCALE }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Secondary diamond (decorative SVG or image) */}
                {current.secondaryImageSrc && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      animate={
                        isExiting
                          ? {
                              opacity: DIAMOND_ANIMATIONS.ENTRY.exit.opacity,
                              scale: DIAMOND_ANIMATIONS.ENTRY.exit.scale,
                              x: DIAMOND_ANIMATIONS.ENTRY.exit.x,
                              y: DIAMOND_ANIMATIONS.ENTRY.exit.y,
                            }
                          : DIAMOND_ANIMATIONS.ENTRY.animate
                      }
                      className={secondaryDiamondClass}
                      exit={DIAMOND_ANIMATIONS.ENTRY.exit}
                      initial={DIAMOND_ANIMATIONS.ENTRY.initial}
                      key={`secondary-${index}`}
                      transition={{ delay: 0.1, ...TRANSITIONS.CAROUSEL }}
                    >
                      <Image
                        alt={current.secondaryImageAlt}
                        className="origin-center -rotate-45 object-cover"
                        fill
                        sizes="880px"
                        src={current.secondaryImageSrc}
                        style={{ scale: ANIMATION_VALUES.DIAMOND_VIDEO_SCALE }}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Decorative SVG Diamonds - Different groups for different slides */}
                <DecorativeSVGGroup index={index} isExiting={isExiting} variant={svgVariant} />
              </>
            );
          }}
        </CircularCarousel>

        {/* CTA - Only visible when carousel is shown */}
        <button
          className="group absolute top-[2630px] left-[240px] flex h-[200px] items-center gap-[18px] rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[110px] text-[55px] leading-[1.1] font-semibold tracking-[2px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
          onClick={onShowOverlay}
          style={{ zIndex: Z_INDEX.CAROUSEL_CTA }}
          type="button"
        >
          Launch demo
          <SquarePlay aria-hidden className="ml-[40px] h-[90px] w-[90px]" strokeWidth={2} />
        </button>
      </motion.div>
    );
  }
);

export default CarouselState;
