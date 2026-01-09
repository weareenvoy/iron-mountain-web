import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import BlueDot from '@/components/ui/icons/Kiosks/CustomInteractive/BlueDot';
import InnerRing from '@/components/ui/icons/Kiosks/CustomInteractive/InnerRing';
import OuterRing from '@/components/ui/icons/Kiosks/CustomInteractive/OuterRing';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { TRANSITIONS } from '../constants';

// Configuration for animated dots around the "Tap to begin" button
// Dots animate in sequence, rotating from 0deg to their target position
const DOT_CONFIG = [
  { delay: 0.8, rotation: 60 }, // Dot 2
  { delay: 0.9, rotation: 120 }, // Dot 3
  { delay: 1.0, rotation: 180 }, // Dot 4
  { delay: 1.1, rotation: 240 }, // Dot 5
  { delay: 1.2, rotation: 300 }, // Dot 6
] as const;

type InitialStateProps = {
  /** Label for back button */
  readonly backLabel?: string;
  /** Description text */
  readonly description?: string;
  /** Eyebrow text */
  readonly eyebrow?: string;
  /** Main headline */
  readonly headline?: string;
  /** Whether "Tap to begin" button is transitioning/morphing */
  readonly isButtonTransitioning: boolean;
  /** Whether content is in viewport (triggers animations) */
  readonly isInView: boolean;
  /** Callback when back button is clicked */
  readonly onBack?: () => void;
  /** Callback when "Tap to begin" is clicked */
  readonly onTapToBegin: () => void;
  /** Whether carousel is visible (triggers fade-out) */
  readonly showCarousel: boolean;
  /** Label for "Tap to begin" button */
  readonly tapToBeginLabel?: string;
};

/**
 * Initial state component for Kiosk 3 Custom Interactive.
 *
 * Displays before carousel is activated. Contains:
 * - Headline and description text
 * - Back navigation button
 * - Animated "Tap to begin" button with rings and dots
 * - Sequential dot animations around the circle
 *
 * ## Animation Behavior
 * - Fades out when `showCarousel` becomes true
 * - "Tap to begin" button morphs/scales into first carousel slide position
 * - Dots animate in sequence (0.8s - 1.2s delays)
 * - Rings draw in with path animation
 *
 * ## Interaction
 * - When `isInView` is true, animations trigger
 * - Clicking "Tap to begin" calls `onTapToBegin` and starts morph animation
 * - Pointer events disabled when carousel is shown
 *
 * @param props - Component props
 */
const InitialState = memo(
  ({
    backLabel,
    description,
    eyebrow,
    headline,
    isButtonTransitioning,
    isInView,
    onBack,
    onTapToBegin,
    showCarousel,
    tapToBeginLabel,
  }: InitialStateProps) => {
    return (
      <motion.div
        animate={{ opacity: showCarousel ? 0 : 1 }}
        className={cn('absolute inset-0 z-10', showCarousel ? 'pointer-events-none' : 'pointer-events-auto')}
        initial={{ opacity: 1 }}
        transition={TRANSITIONS.FADE}
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
            className="group relative top-[1070px] flex h-[200px] items-center gap-[20px] rounded-[999px] bg-[#ededed] px-[120px] text-[54px] leading-[1.4] font-normal tracking-[-2px] text-[#14477d] transition hover:scale-[1.01] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
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
          transition={TRANSITIONS.CAROUSEL}
        >
          <button
            className="relative flex h-full w-full items-center justify-center rounded-full transition hover:scale-[1.05] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
            onClick={onTapToBegin}
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

                {/* Dots 2-6 - animate in sequence around the circle */}
                {DOT_CONFIG.map(({ delay, rotation }, index) => (
                  <motion.div
                    animate={{
                      opacity: 1,
                      transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-430px)`,
                    }}
                    className="absolute top-[50%] left-[50%]"
                    initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                    key={`dot-${index + 2}`}
                    transition={{ delay, duration: 0.8, ease: [0.3, 0, 0.6, 1] }}
                  >
                    <BlueDot className="h-[60px] w-[60px]" />
                  </motion.div>
                ))}
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    );
  }
);

export default InitialState;
