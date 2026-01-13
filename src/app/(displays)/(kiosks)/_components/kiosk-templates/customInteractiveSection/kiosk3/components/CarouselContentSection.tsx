import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { ANIMATION_VALUES, EASING, TRANSITIONS } from '../constants';
import type { CarouselSlide } from './CircularCarousel';

type CarouselContentSectionProps = {
  /** Current slide data */
  readonly current: CarouselSlide;
};

/**
 * Content section displaying slide title and animated bullet points.
 *
 * Features:
 * - Section title with registered mark support
 * - Staggered bullet point animations
 * - Smooth transitions between slides via AnimatePresence
 *
 * @param props - Component props
 */
const CarouselContentSection = memo(({ current }: CarouselContentSectionProps) => {
  return (
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
                  ease: EASING.EASE_IN_OUT,
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
  );
});

CarouselContentSection.displayName = 'CarouselContentSection';

export default CarouselContentSection;
