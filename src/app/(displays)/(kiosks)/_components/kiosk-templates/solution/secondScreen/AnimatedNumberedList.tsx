'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
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
 * Registers handlers with parent to control when navigation can advance.
 * Dynamically measures item heights for accurate positioning.
 */
const AnimatedNumberedList = ({ dividerHeights, onRegisterHandlers, steps }: AnimatedNumberedListProps) => {
  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Measure actual item heights on mount and when steps change
  useEffect(() => {
    const measuredHeights = itemRefs.current.map(ref => {
      if (!ref) return 0;
      return ref.getBoundingClientRect().height;
    });
    setItemHeights(measuredHeights);
  }, [steps]);

  // Register navigation handlers
  const scrollNext = useCallback(() => {
    if (internalStepIndex < steps.length - 1) {
      setInternalStepIndex(prev => prev + 1);
    }
  }, [internalStepIndex, steps.length]);

  const scrollPrev = useCallback(() => {
    if (internalStepIndex > 0) {
      setInternalStepIndex(prev => prev - 1);
    }
  }, [internalStepIndex]);

  const canScrollNext = useCallback(() => {
    return internalStepIndex < steps.length - 1;
  }, [internalStepIndex, steps.length]);

  const canScrollPrev = useCallback(() => {
    return internalStepIndex > 0;
  }, [internalStepIndex]);

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
    <div className="absolute top-[1890px] left-[240px] z-[2] flex w-[1010px] flex-col gap-[60px] text-[60px] leading-[1.3] tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[1860px] group-data-[kiosk=kiosk-2]/kiosk:left-[250px]">
      {steps.map((step, index) => (
        <motion.div
          animate={{
            opacity: getOpacity(index),
            y: getYOffset(),
          }}
          key={`${step.label}-${index}`}
          ref={el => {
            itemRefs.current[index] = el;
          }}
          transition={{
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96],
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
                } // Heights are dynamic per item and they're calculated after render in the useEffect at the top of the component which makes them runtime. This is inline because tailwind works with build time values not runtime values.
              />
            </div>
          ) : null}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedNumberedList;
