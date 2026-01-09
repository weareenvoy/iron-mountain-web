import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { memo } from 'react';
import BlueDot from '@/components/ui/icons/Kiosks/CustomInteractive/BlueDot';
import InnerRing from '@/components/ui/icons/Kiosks/CustomInteractive/InnerRing';
import OuterRing from '@/components/ui/icons/Kiosks/CustomInteractive/OuterRing';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { TRANSITIONS } from '../constants';

type InitialStateProps = {
  readonly backLabel?: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly isButtonTransitioning: boolean;
  readonly isInView: boolean;
  readonly onBack?: () => void;
  readonly onTapToBegin: () => void;
  readonly showCarousel: boolean;
  readonly tapToBeginLabel?: string;
};

/**
 * The initial state shown before the carousel is activated.
 * Contains the headline, description, back button, animated rings, dots,
 * and the "Tap to begin" button that morphs into the first carousel slide.
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
    );
  }
);

InitialState.displayName = 'InitialState';

export default InitialState;
