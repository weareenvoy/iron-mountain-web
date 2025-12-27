'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

type StepConfig = {
  readonly description: string;
  readonly label: string;
};

type AnimatedNumberedListProps = {
  readonly currentScrollTarget: null | string;
  readonly dividerHeights: number[];
  readonly steps: StepConfig[];
};

/**
 * Animated numbered list component that responds to arrow key navigation.
 * When navigating down: current item fades up and out, next item moves up to full opacity.
 * When navigating up: current item fades down and out, previous item moves down to full opacity.
 */
const AnimatedNumberedList = ({ currentScrollTarget, dividerHeights, steps }: AnimatedNumberedListProps) => {
  // Derive active index from currentScrollTarget prop
  const activeIndex = useMemo(() => {
    if (!currentScrollTarget || !currentScrollTarget.startsWith('solution-step-')) {
      return 0;
    }

    const match = currentScrollTarget.match(/solution-step-(\d+)/);
    if (match?.[1]) {
      return Number.parseInt(match[1], 10);
    }

    return 0;
  }, [currentScrollTarget]);

  // Calculate opacity based on distance from active index
  const getOpacity = (index: number) => {
    if (index === activeIndex) return 1; // Active item: full opacity
    if (index === activeIndex - 1) return 0; // Previous item: faded out (scrolled up)
    if (index === activeIndex + 1) return 0.5; // Next item: partially visible
    if (index === activeIndex + 2) return 0.2; // Two away: fading
    return 0; // Others: invisible
  };

  // Calculate Y offset - all items shift up uniformly as activeIndex increases
  // This creates the effect where current item scrolls up and out, next item scrolls up into its place
  const getYOffset = () => {
    // Calculate cumulative height of all items that have "passed" (been scrolled out)
    let cumulativeShift = 0;
    for (let i = 0; i < activeIndex; i++) {
      cumulativeShift += 250; // Approximate item height
      cumulativeShift += 60; // gap-[60px]
      if (i < steps.length - 1) {
        cumulativeShift += 30; // mt-[30px] for divider
        cumulativeShift += dividerHeights[i] ?? 280; // divider height
      }
    }

    // All items move up by the same amount (the cumulative shift)
    // This makes them scroll up together, with the active item landing at y=0
    return -cumulativeShift;
  };

  return (
    <div className="absolute top-[1890px] left-[240px] z-[2] flex w-[1010px] flex-col gap-[60px] text-[60px] leading-[1.3] tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[1860px] group-data-[kiosk=kiosk-2]/kiosk:left-[250px]">
      {steps.map((step, index) => (
        <motion.div
          animate={{
            opacity: getOpacity(index),
            y: getYOffset(),
          }}
          key={`${step.label}-${index}`}
          transition={{
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <div className="flex gap-[70px]" data-scroll-section={`solution-step-${index}`} data-step-index={index}>
            <p className="w-[120px]">{renderRegisteredMark(step.label)}</p>
            <p className="w-[1620px]">{renderRegisteredMark(step.description)}</p>
          </div>
          {index < steps.length - 1 ? (
            <div className="mt-[30px] ml-[140px]">
              <div
                className="border-l border-dashed border-[#ededed]/60"
                style={
                  {
                    '--divider-height': `${dividerHeights[index] ?? 280}px`,
                    'height': 'var(--divider-height)',
                  } as React.CSSProperties
                }
              />
            </div>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedNumberedList;
