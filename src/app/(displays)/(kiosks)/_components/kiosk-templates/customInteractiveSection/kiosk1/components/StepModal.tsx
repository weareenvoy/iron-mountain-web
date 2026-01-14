import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import NextImage from 'next/image';
import { memo, useCallback, useEffect, useRef } from 'react';

/**
 * ModalContent - Content configuration for step detail modal
 */
export type ModalContent = {
  readonly body: string;
  readonly heading: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
};

/**
 * Animation configuration for modal entrance/exit
 * Slides up from far below viewport on open, returns on close
 */
const MODAL_ANIMATION = {
  DURATION: 0.6,
  EASE: [0.3, 0, 0.4, 1] as const, // 30 out 60 in easing
  START_Y: 4000, // Slides up from far below
} as const;

/**
 * StepModalProps - Props for the step detail modal
 */
type StepModalProps = {
  readonly backLabel?: string;
  readonly content: ModalContent | null;
  readonly onClose: () => void;
};

/**
 * StepModal - Full-screen modal displaying step details
 * Features slide-up animation and escape key support
 */
const StepModal = ({ backLabel, content, onClose }: StepModalProps) => {
  // Store latest onClose in ref to avoid recreating event listener
  const onCloseRef = useRef(onClose);

  // Update ref when onClose changes
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Stable backdrop click handler to prevent memory leaks
  const handleBackdropClick = useCallback(() => {
    onCloseRef.current();
  }, []);

  // Add escape key support - uses ref to avoid memory leak
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []); // Empty deps - listener never recreated

  if (!content) return null;

  return (
    <div className="absolute inset-0 z-200 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-[50px]" onClick={handleBackdropClick} />
      <motion.div
        animate={{ y: 0 }}
        className="relative z-201 flex h-[2800px] max-h-[90vh] w-[1920px] flex-col overflow-hidden rounded-[48px] bg-[#97e9ff] p-[80px] text-[#14477d] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        exit={{ y: MODAL_ANIMATION.START_Y }}
        initial={{ y: MODAL_ANIMATION.START_Y }}
        onClick={e => e.stopPropagation()}
        transition={{
          duration: MODAL_ANIMATION.DURATION,
          ease: MODAL_ANIMATION.EASE,
        }}
      >
        <div className="flex items-center justify-between">
          <button
            className="group pointer-events-auto relative top-[45px] left-[60px] flex h-[200px] items-center gap-[24px] rounded-[1000px] bg-[#ededed] px-[90px] py-[60] pr-[100px] text-[55px] leading-[1.4] font-normal tracking-[-2.7px] text-[#14477d] transition hover:scale-[1.02] active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
            onClick={handleBackdropClick}
            type="button"
          >
            <span className="flex items-center justify-center">
              <ArrowLeft aria-hidden className="mr-[30px] h-[52px] w-[52px]" color="#14477d" strokeWidth={2} />
            </span>
            {backLabel}
          </button>
        </div>

        <div className="mt-[80px] grid gap-[80px] text-[#14477d]">
          <div className="relative top-[150px] left-[45px] space-y-[60px]">
            <h2 className="mb-[105px] text-[100px] leading-[1.3] font-normal tracking-[-5px]">{content.heading}</h2>
            <div className="w-[1170px] space-y-[32px] text-[60px] leading-[1.4] font-normal tracking-[-3px]">
              <p className="whitespace-pre-line">{content.body}</p>
            </div>
          </div>

          {content.imageSrc ? (
            <div className="flex items-center justify-center">
              <div className="relative top-[130px] h-[1680px] w-[1680px]">
                <NextImage
                  alt={content.imageAlt ?? 'Modal illustration'}
                  className="clip-diamond-rounded object-cover"
                  fill
                  quality={85}
                  sizes="1680px"
                  src={content.imageSrc}
                />
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

const MemoizedStepModal = memo(StepModal);
export { MemoizedStepModal as StepModal };
