import { motion } from 'framer-motion';
import { memo } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { DIAMOND_ANIMATION, INITIAL_SPREAD_POSITIONS, INITIALLY_VISIBLE_DIAMOND_INDEX } from './constants';

/**
 * Props for the Diamond component.
 * Controls a single animated diamond's position, visibility, and content.
 */
type DiamondProps = {
  /** Current active slide index (0-2) */
  readonly currentSlideIndex: number;
  /** SVG icon component to render inside the diamond */
  readonly diamondIcon: null | React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Text label to display inside the diamond (when visible) */
  readonly diamondLabel: string;
  /** Whether all diamonds have completed their initial animation */
  readonly diamondsSettled: boolean;
  /** This diamond's index (0-2) in the diamonds array */
  readonly index: number;
  /** Whether the carousel has become visible and should begin animating */
  readonly shouldAnimate: boolean;
  /** Whether this diamond's text should be visible on the current slide */
  readonly showText: boolean;
  /** Target left position (in px) for this diamond on the current slide */
  readonly targetPosition: number;
  /** Tailwind z-index class for stacking order (e.g., 'z-2') */
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

    // Safely access spread positions with fallback to first position
    const initialSpreadPosition = INITIAL_SPREAD_POSITIONS[index] ?? INITIAL_SPREAD_POSITIONS[0];
    const isInitiallyVisible = index === INITIALLY_VISIBLE_DIAMOND_INDEX;

    // For first slide: start at spread position, animate to target when shouldAnimate is true
    // For other slides: always at target position
    const animateLeft = isFirstSlide && !shouldAnimate ? initialSpreadPosition : targetPosition;

    return (
      <motion.div
        animate={{ left: animateLeft }}
        className={cn('absolute h-[550px] w-[550px] rotate-45 rounded-[80px]', zIndexClass)}
        initial={{ left: initialSpreadPosition }}
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
          initial={{ opacity: isInitiallyVisible ? 1 : 0 }}
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

export default Diamond;
