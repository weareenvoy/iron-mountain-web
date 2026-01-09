'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

type StepConfig = {
  readonly description: string;
  readonly label: string;
};

type AnimatedNumberedListProps = {
  readonly dividerHeights: number[];
  readonly onRegisterHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly steps: StepConfig[];
};

/**
 * Animated numbered list component with Framer Motion animations.
 * Registers stable handlers with parent to control when navigation can advance.
 * Dynamically measures item heights for accurate positioning using useLayoutEffect to prevent first-frame jumps.
 */
const AnimatedNumberedList = ({ dividerHeights, onRegisterHandlers, steps }: AnimatedNumberedListProps) => {
  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepIndexRef = useRef(0);

  // Keep ref in sync with state for stable handler reads
  useEffect(() => {
    stepIndexRef.current = internalStepIndex;
  }, [internalStepIndex]);

  // Measure actual item heights synchronously before paint to prevent first-frame jump
  useLayoutEffect(() => {
    const measuredHeights = itemRefs.current.map(ref => {
      if (!ref) return 0;
      return ref.getBoundingClientRect().height;
    });
    setItemHeights(measuredHeights);
  }, [steps]);

  // Register stable navigation handlers (no dependency on internalStepIndex)
  const scrollNext = useCallback(() => {
    setInternalStepIndex(prev => (prev < steps.length - 1 ? prev + 1 : prev));
  }, [steps.length]);

  const scrollPrev = useCallback(() => {
    setInternalStepIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const canScrollNext = useCallback(() => {
    return stepIndexRef.current < steps.length - 1;
  }, [steps.length]);

  const canScrollPrev = useCallback(() => {
    return stepIndexRef.current > 0;
  }, []);

  useEffect(() => {
    if (onRegisterHandlers) {
      onRegisterHandlers({
        canScrollNext,
        canScrollPrev,
        scrollNext,
        scrollPrev,
      });
    }
  }, [canScrollNext, canScrollPrev, onRegisterHandlers, scrollNext, scrollPrev]);

  // Calculate opacity based on distance from active index
  const getOpacity = (index: number) => {
    if (index === internalStepIndex) return 1;
    if (index === internalStepIndex - 1) return 0;
    if (index === internalStepIndex + 1) return 0.5;
    if (index === internalStepIndex + 2) return 0.2;
    return 0;
  };

  // Calculate Y offset using measured heights
  const getYOffset = () => {
    if (itemHeights.length === 0) return 0; // Wait for measurements

    let cumulativeShift = 0;
    for (let i = 0; i < internalStepIndex; i++) {
      // Add the actual measured height of this item's content
      cumulativeShift += itemHeights[i] ?? 0;
      // Add gap between items
      cumulativeShift += 60;
    }
    return -cumulativeShift;
  };

  return (
    <motion.div
      animate={{ y: getYOffset() }}
      className="absolute top-[1890px] left-[240px] z-2 flex w-[1010px] flex-col gap-[60px] text-[60px] leading-[1.3] tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[1860px] group-data-[kiosk=kiosk-2]/kiosk:left-[250px]"
      transition={{
        duration: 0.6,
        ease: [0.3, 0, 0.6, 1],
      }}
    >
      {steps.map((step, index) => (
        <motion.div
          animate={{
            opacity: getOpacity(index),
          }}
          key={`${step.label}-${index}`}
          ref={el => {
            itemRefs.current[index] = el;
          }}
          transition={{
            duration: 0.6,
            ease: [0.3, 0, 0.6, 1],
          }}
        >
          <div className="flex gap-[70px]">
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
                } // Heights are dynamic per item and they're calculated after render in the useLayoutEffect at the top of the component which makes them runtime. This is inline because tailwind works with build time values not runtime values.
              />
            </div>
          ) : null}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedNumberedList;
