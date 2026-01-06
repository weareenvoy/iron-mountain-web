import { motion } from 'framer-motion';
import { memo } from 'react';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import { BULLET_ANIMATION } from './constants';

type BulletListProps = {
  /** Array of bullet point strings to display */
  readonly bulletItems: readonly string[];
  /** Whether bullets should be visible (controls animation state) */
  readonly shouldShow: boolean;
  /** Unique key for AnimatePresence */
  readonly slideId?: string;
};

/**
 * BulletList - Animated list of bullet points for value proposition slides.
 *
 * Renders a styled unordered list with fade-in/fade-out animations.
 * Each bullet has a circular marker and supports registered trademark rendering.
 *
 * @component
 */
const BulletList = memo(({ bulletItems, shouldShow, slideId }: BulletListProps) => {
  return (
    <motion.ul
      animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: BULLET_ANIMATION.Y_OFFSET }}
      className="text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#8a0d71]"
      exit={{ opacity: 0, y: BULLET_ANIMATION.Y_OFFSET }}
      initial={{ opacity: 0, y: BULLET_ANIMATION.Y_OFFSET }}
      key={slideId}
      transition={{
        duration: BULLET_ANIMATION.DURATION,
        ease: BULLET_ANIMATION.EASE,
      }}
    >
      {bulletItems.map((bullet, idx) => (
        <li className="relative mb-[80px] w-[840px] pl-[40px] last:mb-0" key={`${slideId}-bullet-${idx}`}>
          <span className="absolute top-[30px] left-0 size-[16px] -translate-y-1/2 rounded-full bg-[#8a0d71]" />
          <span>{renderRegisteredMark(bullet)}</span>
        </li>
      ))}
    </motion.ul>
  );
});

export default BulletList;
