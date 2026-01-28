import { AnimatePresence, motion } from 'framer-motion';
import { memo, type ComponentType } from 'react';
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

type SVGConfig = {
  className: string;
  Component: ComponentType<{ className?: string }>;
};

/**
 * Configuration object mapping variant names to their SVG diamond layouts.
 * Each variant contains an array of SVG configurations with positioning and sizing.
 *
 * Adding a new SVG: Add an entry to the appropriate variant array with:
 * - Component: The SVG component to render
 * - className: Tailwind classes for positioning (absolute bottom-[x] left-[x] h-[x] w-[x])
 */
const SVG_GROUP_CONFIG: Record<DecorativeSVGGroupProps['variant'], SVGConfig[]> = {
  'default': [
    {
      className: 'pointer-events-none absolute bottom-[580px] left-[510px] h-[510px] w-[560px]',
      Component: HCBlueFilledDiamond,
    },
    {
      className: 'pointer-events-none absolute bottom-[-1670px] left-[670px] h-[2400px] w-[2400px] overflow-visible',
      Component: HCHollowOrangeDiamond,
    },
  ],
  'slide-2-5': [
    {
      className: 'pointer-events-none absolute bottom-[670px] left-[-20px] h-[510px] w-[560px]',
      Component: HCFilledTealDiamond,
    },
    {
      className: 'pointer-events-none absolute bottom-[-1560px] left-[-10px] h-[2400px] w-[2400px] overflow-visible',
      Component: HCHollowBlueDiamond2,
    },
    {
      className:
        'pointer-events-none absolute bottom-[-1555px] left-[1100px] h-[1200px] w-[1200px] rotate-45 overflow-visible',
      Component: HCFilledOrangeDiamond2,
    },
    {
      className: 'pointer-events-none absolute bottom-[-980px] left-[1240px] h-[1800px] w-[1800px] overflow-visible',
      Component: HCHollowOrangeDiamond,
    },
  ],
  'slide-3-6': [
    {
      className: 'pointer-events-none absolute bottom-[670px] left-[1880px] h-[450px] w-[450px]',
      Component: HCFilledOrangeDiamond,
    },
    {
      className: 'pointer-events-none absolute bottom-[-1650px] left-[-120px] h-[2400px] w-[2400px] scale-x-[-1] overflow-visible',
      Component: HCHollowBlueDiamond2,
    },
    {
      className: 'pointer-events-none absolute bottom-[-1240px] left-0 h-[1800px] w-[1800px] overflow-visible',
      Component: HCHollowGreenDiamond,
    },
  ],
} as const;

/**
 * Renders decorative SVG diamonds that appear behind carousel content.
 * Different variants show for different slide groups to create visual variety.
 *
 * Uses a configuration-driven approach to eliminate code duplication.
 * All SVG layouts are defined in SVG_GROUP_CONFIG for easy modification.
 *
 * @param variant - Which SVG group to show: 'slide-2-5', 'slide-3-6', or 'default'
 * @param index - Current carousel index for keying animations
 * @param isExiting - Whether the current slide is exiting
 */
const DecorativeSVGGroup = memo(({ index, isExiting, variant }: DecorativeSVGGroupProps) => {
  const svgConfigs = SVG_GROUP_CONFIG[variant];

  return (
    <AnimatePresence mode="sync">
      <motion.div
        animate={isExiting ? SVG_ANIMATIONS.CONTAINER.exit : SVG_ANIMATIONS.CONTAINER.animate}
        className="absolute inset-0"
        exit={SVG_ANIMATIONS.CONTAINER.exit}
        initial={SVG_ANIMATIONS.CONTAINER.initial}
        key={`svg-group-${variant}-${index}`}
        transition={TRANSITIONS.CAROUSEL}
      >
        {svgConfigs.map(({ className, Component }, svgIndex) => (
          <motion.div
            animate={SVG_ANIMATIONS.SCALE.animate}
            className={className}
            initial={SVG_ANIMATIONS.SCALE.initial}
            key={`${variant}-svg-${svgIndex}`}
            transition={TRANSITIONS.SVG_SCALE}
          >
            <Component className="h-full w-full" />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

export default DecorativeSVGGroup;
