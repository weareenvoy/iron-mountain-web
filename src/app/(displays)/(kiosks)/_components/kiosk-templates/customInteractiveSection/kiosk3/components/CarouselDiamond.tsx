import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { memo } from 'react';
import { DIAMOND_ANIMATIONS, TRANSITIONS } from '../constants';

type CarouselDiamondProps = {
  /** CSS classes for positioning and styling the diamond */
  readonly className: string;
  /** Alt text for secondary image variant */
  readonly imageAlt?: string;
  /** Image source for secondary variant */
  readonly imageSrc?: string;
  /** Unique key for AnimatePresence tracking */
  readonly index: number;
  /** Whether the carousel is in exiting animation state */
  readonly isExiting: boolean;
  /** Transition delay (useful for staggering multiple diamonds) */
  readonly transitionDelay?: number;
  /** Diamond variant type */
  readonly variant: 'primary' | 'secondary';
  /** Video source for primary variant */
  readonly videoSrc?: string;
};

/**
 * Animated diamond-shaped container for carousel media.
 *
 * Supports two variants:
 * - **primary**: Video player (requires `videoSrc`)
 * - **secondary**: Static image (requires `imageSrc` and `imageAlt`)
 *
 * Features:
 * - Coordinated entry/exit animations
 * - Respects parent `isExiting` state for synchronized transitions
 * - Rotated content with scale adjustments to fill diamond shape
 *
 * @param props - Component props
 */
const CarouselDiamond = memo(
  ({
    className,
    imageAlt,
    imageSrc,
    index,
    isExiting,
    transitionDelay = 0,
    variant,
    videoSrc,
  }: CarouselDiamondProps) => {
    return (
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
          className={className}
          exit={DIAMOND_ANIMATIONS.ENTRY.exit}
          initial={DIAMOND_ANIMATIONS.ENTRY.initial}
          key={`${variant}-${index}`}
          transition={{ delay: transitionDelay, ...TRANSITIONS.CAROUSEL }}
        >
          {variant === 'primary' && videoSrc && (
            <video
              autoPlay
              className="h-full w-full origin-center scale-[1.35] -rotate-45 object-cover"
              loop
              muted
              playsInline
              src={videoSrc}
            />
          )}
          {variant === 'secondary' && imageSrc && (
            <Image
              alt={imageAlt ?? ''}
              className="origin-center scale-[1.35] -rotate-45 object-cover"
              fill
              sizes="880px"
              src={imageSrc}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  }
);

export default CarouselDiamond;
