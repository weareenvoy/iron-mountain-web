import { motion } from 'framer-motion';
import { CirclePlus } from 'lucide-react';
import { memo } from 'react';
import { CarouselItem } from '@/components/shadcn/carousel';
import HCBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueDiamond';
import HCWhiteDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCWhiteDiamond';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { Step } from './StepCarousel';

/**
 * Layout constants for diamond sizing
 */
const LAYOUT = {
  DIAMOND_SIZE_ACTIVE: 880,
  DIAMOND_SIZE_EDGE: 440,
  DIAMOND_SIZE_MIDDLE: 640,
} as const;

/**
 * Animation configuration for staggered diamond entrance
 */
const DIAMOND_ANIMATION = {
  CENTER: { delay: 0.3, startY: -120 },
  DURATION: 0.8,
  EASE: [0.3, 0, 0.4, 1] as const,
  MIDDLE: { delay: 0.15, startY: -350 },
  OUTER: { delay: 0, startY: -550 },
} as const;

/**
 * Animation configuration for diamond transitions
 */
const DIAMOND_TRANSITION = {
  DURATION: 0.5,
  EASE: [0.3, 0, 0.4, 1] as const,
} as const;

/**
 * Diamond color palette
 */
const DIAMOND_COLORS = {
  ACTIVE_PRESSED: '#78d5f7',
  INACTIVE: '#EDEDED',
  TEXT_ACTIVE: '#14477d',
  TEXT_INACTIVE: '#ededed',
} as const;

/**
 * Font scale for labels
 */
const LABEL_SCALE = {
  ACTIVE: 1,
  INACTIVE: 0.7049,
} as const;

type DiamondCarouselItemProps = {
  readonly idx: number;
  readonly inactiveSize: number;
  readonly isActive: boolean;
  readonly isLeftEdge: boolean;
  readonly isMiddle: boolean;
  readonly isOuter: boolean;
  readonly isRightEdge: boolean;
  readonly onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly onPointerCancel: () => void;
  readonly onPointerDown: () => void;
  readonly onPointerLeave: () => void;
  readonly onPointerUp: () => void;
  readonly pressedIndex: null | number;
  readonly shouldAnimate: boolean;
  readonly step: Step;
};

/**
 * Individual diamond carousel item with animations and interactions
 */
const DiamondCarouselItem = ({
  idx,
  inactiveSize,
  isActive,
  isMiddle,
  isOuter,
  onClick,
  onPointerCancel,
  onPointerDown,
  onPointerLeave,
  onPointerUp,
  pressedIndex,
  shouldAnimate,
  step,
}: DiamondCarouselItemProps) => {
  const animConfig = isOuter ? DIAMOND_ANIMATION.OUTER : isMiddle ? DIAMOND_ANIMATION.MIDDLE : DIAMOND_ANIMATION.CENTER;

  return (
    <CarouselItem
      className={cn('shrink-0 grow-0 basis-[560px] pl-0', isActive && 'z-10')}
      data-slide-index={idx}
      key={`${idx}-${step.label}`}
    >
      <motion.div
        animate={shouldAnimate ? { y: 0 } : { y: animConfig.startY }}
        className="flex flex-col items-center gap-[28px] will-change-transform"
        initial={{ y: animConfig.startY }}
        transition={{
          delay: animConfig.delay,
          duration: DIAMOND_ANIMATION.DURATION,
          ease: DIAMOND_ANIMATION.EASE,
        }}
      >
        <div className="relative flex h-[880px] w-[880px] items-center justify-center">
          <button
            aria-label={isActive ? 'Open details' : `Select ${step.label}`}
            className="relative z-[1] flex cursor-pointer items-center justify-center"
            data-idx={idx}
            onClick={onClick}
            onPointerCancel={onPointerCancel}
            onPointerDown={onPointerDown}
            onPointerLeave={onPointerLeave}
            onPointerUp={onPointerUp}
            type="button"
          >
            {/* Fixed outer container prevents layout shift, inner container animates size */}
            <div className="flex h-[880px] w-[880px] items-center justify-center">
              <motion.div
                animate={{
                  height: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                  width: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                }}
                className="relative flex items-center justify-center"
                initial={{
                  height: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                  width: isActive ? LAYOUT.DIAMOND_SIZE_ACTIVE : inactiveSize,
                }}
                transition={{
                  duration: DIAMOND_TRANSITION.DURATION,
                  ease: DIAMOND_TRANSITION.EASE,
                }}
              >
                {/* White Diamond (Active) - cross-fades in when active, color changes when pressed */}
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: isActive ? 1 : 0 }}
                  transition={{
                    duration: DIAMOND_TRANSITION.DURATION,
                    ease: DIAMOND_TRANSITION.EASE,
                  }}
                >
                  <HCWhiteDiamond
                    aria-hidden="true"
                    className="h-full w-full"
                    fill={pressedIndex === idx ? DIAMOND_COLORS.ACTIVE_PRESSED : DIAMOND_COLORS.INACTIVE}
                    focusable="false"
                  />
                </motion.div>
                {/* Blue Diamond (Inactive) - cross-fades in when inactive */}
                <motion.div
                  animate={{ opacity: isActive ? 0 : 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: isActive ? 0 : 1 }}
                  transition={{
                    duration: DIAMOND_TRANSITION.DURATION,
                    ease: DIAMOND_TRANSITION.EASE,
                  }}
                >
                  <HCBlueDiamond aria-hidden="true" className="h-full w-full" focusable="false" />
                </motion.div>
              </motion.div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              {/* Use scale transform instead of fontSize animation. origin-center controls the scale animation anchor point for diamond labels */}
              <motion.span
                animate={{
                  color: isActive ? DIAMOND_COLORS.TEXT_ACTIVE : DIAMOND_COLORS.TEXT_INACTIVE,
                  scale: isActive ? LABEL_SCALE.ACTIVE : LABEL_SCALE.INACTIVE,
                }}
                className={
                  isActive
                    ? 'w-[420px] origin-center text-[61px] leading-[1.3] tracking-[-3px]'
                    : 'w-[420px] origin-center text-[61px] leading-[1.3] tracking-[-2.1px]'
                }
                transition={{
                  duration: DIAMOND_TRANSITION.DURATION,
                  ease: DIAMOND_TRANSITION.EASE,
                }}
              >
                {renderRegisteredMark(step.label)}
              </motion.span>
            </div>
          </button>
          {/* CirclePlus icon for active diamond - indicates clickability */}
          {isActive && (
            <div className="pointer-events-none absolute bottom-[160px] right-[390px] z-[100] flex items-center justify-center">
              <CirclePlus
                aria-hidden="true"
                className="h-[100px] w-[100px]"
                color="#14477d"
                strokeWidth={2}
              />
            </div>
          )}
        </div>
      </motion.div>
    </CarouselItem>
  );
};

export default memo(DiamondCarouselItem);
