import { motion } from 'framer-motion';
import { memo } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { DIAMOND_ANIMATION, INITIAL_SPREAD_POSITIONS, INITIALLY_VISIBLE_DIAMOND_INDEX } from './constants';

type DiamondProps = {
  readonly currentSlideIndex: number;
  readonly diamondIcon: null | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  readonly diamondLabel: string;
  readonly diamondsSettled: boolean;
  readonly index: number;
  readonly shouldAnimate: boolean;
  readonly showText: boolean;
  readonly targetPosition: number;
  readonly zIndexClass: string;
};

/**
 * Individual animated diamond component for the Value Carousel.
 * Handles positioning, z-index, icon rendering, and text visibility.
 */
const Diamond = memo(
  ({
    currentSlideIndex,
    diamondIcon: Icon,
    diamondLabel,
    diamondsSettled,
    index,
    shouldAnimate,
    showText,
    targetPosition,
    zIndexClass,
  }: DiamondProps) => {
    const isFirstSlide = currentSlideIndex === 0;

    // For first slide: start at spread position, animate to target when shouldAnimate is true
    // For other slides: always at target position
    const animateLeft = isFirstSlide && !shouldAnimate ? INITIAL_SPREAD_POSITIONS[index] : targetPosition;

    return (
      <motion.div
        animate={{ left: animateLeft }}
        className={cn('absolute h-[550px] w-[550px] rotate-45 rounded-[80px]', zIndexClass)}
        initial={{ left: INITIAL_SPREAD_POSITIONS[index] }}
        transition={{
          delay: isFirstSlide && shouldAnimate && !diamondsSettled ? index * DIAMOND_ANIMATION.DELAY_INCREMENT : 0,
          duration:
            isFirstSlide && shouldAnimate && !diamondsSettled
              ? DIAMOND_ANIMATION.DURATION_FIRST_SLIDE
              : DIAMOND_ANIMATION.DURATION_OTHER_SLIDES,
          ease: DIAMOND_ANIMATION.EASE,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full -rotate-45">
            {Icon ? <Icon aria-hidden className="h-full w-full" focusable="false" /> : null}
          </div>
        </div>
        <motion.div
          animate={{ opacity: showText ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: index === INITIALLY_VISIBLE_DIAMOND_INDEX ? 1 : 0 }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
        >
          {diamondLabel ? (
            <div className="flex h-[320px] w-[320px] -rotate-45 items-center justify-center px-10 text-center text-[48px] leading-[1.4] font-normal tracking-[-2.4px] text-[#ededed]">
              {renderRegisteredMark(diamondLabel)}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    );
  }
);

Diamond.displayName = 'Diamond';

export default Diamond;
