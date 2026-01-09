import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';
import HCBlueFilledDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCBlueFilledDiamond';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCFilledOrangeDiamond2 from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond2';
import HCFilledTealDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledTealDiamond';
import HCHollowBlueDiamond2 from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond2';
import HCHollowGreenDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowGreenDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import { SVG_ANIMATIONS, TRANSITIONS } from '../constants';

type DecorativeSVGGroupProps = {
  readonly index: number;
  readonly isExiting: boolean;
  readonly variant: 'default' | 'slide-2-5' | 'slide-3-6';
};

/**
 * Renders decorative SVG diamonds that appear behind carousel content.
 * Different variants show for different slide groups to create visual variety.
 *
 * @param variant - Which SVG group to show: 'slide-2-5', 'slide-3-6', or 'default'
 * @param index - Current carousel index for keying animations
 * @param isExiting - Whether the current slide is exiting
 */
const DecorativeSVGGroup = memo(({ index, isExiting, variant }: DecorativeSVGGroupProps) => {
  if (variant === 'slide-2-5') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          animate={isExiting ? SVG_ANIMATIONS.CONTAINER.exit : SVG_ANIMATIONS.CONTAINER.animate}
          className="absolute inset-0"
          exit={SVG_ANIMATIONS.CONTAINER.exit}
          initial={SVG_ANIMATIONS.CONTAINER.initial}
          key={`svg-group-2-5-${index}`}
          transition={TRANSITIONS.CAROUSEL}
        >
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[670px] left-[-20px] h-[510px] w-[560px]"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCFilledTealDiamond className="h-full w-full" />
          </motion.div>
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[-1560px] left-[-10px] h-[2400px] w-[2400px] overflow-visible"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCHollowBlueDiamond2 className="h-full w-full" />
          </motion.div>
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[-1555px] left-[1100px] h-[1200px] w-[1200px] rotate-45 overflow-visible"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCFilledOrangeDiamond2 className="h-full w-full" />
          </motion.div>
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[-980px] left-[1240px] h-[1800px] w-[1800px] overflow-visible"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCHollowOrangeDiamond className="h-full w-full" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'slide-3-6') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          animate={isExiting ? SVG_ANIMATIONS.CONTAINER.exit : SVG_ANIMATIONS.CONTAINER.animate}
          className="absolute inset-0"
          exit={SVG_ANIMATIONS.CONTAINER.exit}
          initial={SVG_ANIMATIONS.CONTAINER.initial}
          key={`svg-group-3-6-${index}`}
          transition={TRANSITIONS.CAROUSEL}
        >
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[670px] left-[1880px] h-[450px] w-[450px]"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCFilledOrangeDiamond className="h-full w-full" />
          </motion.div>
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[-1650px] left-[1290px] h-[2400px] w-[2400px] overflow-visible"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCHollowBlueDiamond2 className="h-full w-full" />
          </motion.div>
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className="pointer-events-none absolute bottom-[-1240px] left-0 h-[1800px] w-[1800px] overflow-visible"
            initial={SVG_ANIMATIONS.SCALE.initial}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <HCHollowGreenDiamond className="h-full w-full" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Default variant for slides 1 & 4
  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={isExiting ? SVG_ANIMATIONS.CONTAINER.exit : SVG_ANIMATIONS.CONTAINER.animate}
        className="absolute inset-0"
        exit={SVG_ANIMATIONS.CONTAINER.exit}
        initial={SVG_ANIMATIONS.CONTAINER.initial}
        key={`svg-group-1-4-${index}`}
        transition={TRANSITIONS.CAROUSEL}
      >
        <motion.div
          animate={SVG_ANIMATIONS.SCALE.animate}
          className="pointer-events-none absolute bottom-[590px] left-[490px] h-[510px] w-[560px]"
          initial={SVG_ANIMATIONS.SCALE.initial}
          transition={TRANSITIONS.SVG_SCALE}
        >
          <HCBlueFilledDiamond className="h-full w-full" />
        </motion.div>
        <motion.div
          animate={SVG_ANIMATIONS.SCALE.animate}
          className="pointer-events-none absolute bottom-[-1755px] left-[650px] h-[2400px] w-[2400px] overflow-visible"
          initial={SVG_ANIMATIONS.SCALE.initial}
          transition={TRANSITIONS.SVG_SCALE}
        >
          <HCHollowOrangeDiamond className="h-full w-full" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});

DecorativeSVGGroup.displayName = 'DecorativeSVGGroup';

export default DecorativeSVGGroup;
