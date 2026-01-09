'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useRef } from 'react';
import BlueDot from '@/components/ui/icons/Kiosks/CustomInteractive/BlueDot';
import InnerRing from '@/components/ui/icons/Kiosks/CustomInteractive/InnerRing';
import OuterRing from '@/components/ui/icons/Kiosks/CustomInteractive/OuterRing';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

export interface CustomInteractiveKiosk3SecondScreenTemplateProps {
  readonly backgroundImageSrc?: string;
  readonly backLabel?: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly onBack?: () => void;
  readonly onTapToBegin?: () => void;
  readonly tapToBeginLabel?: string;
  readonly videoAsset?: string;
}

const CustomInteractiveKiosk3SecondScreenTemplate = ({
  backgroundImageSrc,
  backLabel,
  description,
  eyebrow,
  headline,
  onBack,
  onTapToBegin,
  tapToBeginLabel,
  videoAsset,
}: CustomInteractiveKiosk3SecondScreenTemplateProps) => {
  const eyebrowText = eyebrow;
  const headlineText = headline;
  const descriptionText = description;

  // Detect when the component is in view
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      data-scroll-section="customInteractive-second-screen"
      ref={ref}
    >
      <div className="absolute inset-0 bg-transparent" />

      {/* Diamond video */}
      <div className="pointer-events-none absolute bottom-[-1000px] left-[50px] h-[2500px] w-[2500px] rotate-[45deg] overflow-hidden rounded-[200px] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 h-full w-full -rotate-[45deg]">
          <video
            autoPlay
            className="relative left-[480px] h-full w-full origin-center scale-[1.45] object-cover"
            loop
            muted
            playsInline
            poster={backgroundImageSrc}
            src={videoAsset}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        </div>
      </div>

      <h2 className="absolute top-[240px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-white">
        {renderRegisteredMark(eyebrowText)}
      </h2>

      <div className="absolute top-[820px] left-[240px] max-w-[1200px] text-white">
        <h1 className="mb-[40px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line">
          {renderRegisteredMark(headlineText)}
        </h1>
        <p className="relative top-[190px] text-[52px] leading-[1.4] font-normal tracking-[-2.6px] whitespace-pre-line text-white/90">
          {renderRegisteredMark(descriptionText)}
        </p>
      </div>

      <div className="absolute top-[240px] right-[120px]">
        <button
          className="relative top-[1070px] flex h-[200px] items-center gap-[20px] rounded-[1000px] bg-[#ededed] px-[120px] text-[54px] leading-[1.4] font-normal tracking-[-2px] text-[#14477d] transition hover:scale-[1.01]"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft aria-hidden className="h-[32px] w-[32px]" color="#14477d" strokeWidth={2} />
          {renderRegisteredMark(backLabel)}
        </button>
      </div>

      <div className="absolute top-[2266px] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2">
        <button
          className="relative flex h-full w-full items-center justify-center rounded-full transition hover:scale-[1.05]"
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
              <div className="absolute top-[48%] left-[50%] [transform:translate(-50%,-50%)_rotate(0deg)_translateY(-430px)]">
                <BlueDot className="h-[60px] w-[60px]" />
              </div>
              
              {/* Dot 2 - animates from 0deg to 60deg with opacity fade */}
              <motion.div
                animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(60deg) translateY(-430px)' }}
                className="absolute top-[50%] left-[50%]"
                initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.3, 0, 0.4, 1] }}
              >
                <BlueDot className="h-[60px] w-[60px]" />
              </motion.div>
              
              {/* Dot 3 - animates from 0deg to 120deg with opacity fade */}
              <motion.div
                animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(120deg) translateY(-430px)' }}
                className="absolute top-[50%] left-[50%]"
                initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.3, 0, 0.4, 1] }}
              >
                <BlueDot className="h-[60px] w-[60px]" />
              </motion.div>
              
              {/* Dot 4 - animates from 0deg to 180deg with opacity fade */}
              <motion.div
                animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(180deg) translateY(-430px)' }}
                className="absolute top-[50%] left-[50%]"
                initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                transition={{ delay: 1.0, duration: 0.8, ease: [0.3, 0, 0.4, 1] }}
              >
                <BlueDot className="h-[60px] w-[60px]" />
              </motion.div>
              
              {/* Dot 5 - animates from 0deg to 240deg with opacity fade */}
              <motion.div
                animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(240deg) translateY(-430px)' }}
                className="absolute top-[50%] left-[50%]"
                initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                transition={{ delay: 1.1, duration: 0.8, ease: [0.3, 0, 0.4, 1] }}
              >
                <BlueDot className="h-[60px] w-[60px]" />
              </motion.div>
              
              {/* Dot 6 - animates from 0deg to 300deg with opacity fade, finishes when InnerRing pathLength completes (2.0s) */}
              <motion.div
                animate={{ opacity: 1, transform: 'translate(-50%, -50%) rotate(300deg) translateY(-430px)' }}
                className="absolute top-[50%] left-[50%]"
                initial={{ opacity: 0, transform: 'translate(-50%, -50%) rotate(0deg) translateY(-430px)' }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.3, 0, 0.4, 1] }}
              >
                <BlueDot className="h-[60px] w-[60px]" />
              </motion.div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomInteractiveKiosk3SecondScreenTemplate;
