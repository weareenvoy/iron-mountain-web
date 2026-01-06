import { memo } from 'react';
import { DIAMOND_KEY_PREFIX } from '../constants/layout';
import Diamond from './Diamond';
import { getDiamondPositionForSlide, getDiamondZIndex, shouldShowDiamondText } from '../utils/helpers';

/**
 * Props for the DiamondContainer component.
 * Manages the rendering and animation of all diamond elements.
 */
type DiamondContainerProps = {
  /** Current active slide index (0-2) */
  readonly currentSlideIndex: number;
  /** Number of diamond cards to render */
  readonly diamondCount: number;
  /** SVG icons for each diamond, memoized from parent */
  readonly diamondIcons: ReadonlyArray<null | React.ComponentType<React.SVGProps<SVGSVGElement>>>;
  /** Text labels for each diamond, memoized from parent */
  readonly diamondLabels: readonly string[];
  /** Whether all diamonds have completed their initial animation */
  readonly diamondsSettled: boolean;
  /** Whether the carousel has become visible and should begin animating */
  readonly shouldAnimate: boolean;
};

/**
 * Container component for managing diamond elements in the value carousel.
 * Handles positioning, animation state, and validation for all diamonds.
 *
 * @component
 */
const DiamondContainer = memo(
  ({
    currentSlideIndex,
    diamondCount,
    diamondIcons,
    diamondLabels,
    diamondsSettled,
    shouldAnimate,
  }: DiamondContainerProps) => {
    return (
      <div className="relative flex h-[565px] w-[920px] items-center">
        {Array.from({ length: diamondCount }).map((_, index) => {
          const diamondIcon = diamondIcons[index] ?? null;
          const diamondLabel = diamondLabels[index] ?? '';

          const targetPosition = getDiamondPositionForSlide(currentSlideIndex, index);
          const zIndexClass = getDiamondZIndex(currentSlideIndex, index);
          const showText = shouldShowDiamondText(currentSlideIndex, index);

          // Helper functions return null if indices are invalid
          if (targetPosition === null || zIndexClass === null || showText === null) {
            if (process.env.NODE_ENV === 'development') {
              console.error(`Invalid carousel indices: slide=${currentSlideIndex}, diamond=${index}`);
            }
            return null;
          }

          return (
            <Diamond
              currentSlideIndex={currentSlideIndex}
              diamondIcon={diamondIcon}
              diamondLabel={diamondLabel}
              diamondsSettled={diamondsSettled}
              index={index}
              key={`${DIAMOND_KEY_PREFIX}-${index}`}
              shouldAnimate={shouldAnimate}
              showText={showText}
              targetPosition={targetPosition}
              zIndexClass={zIndexClass}
            />
          );
        })}
      </div>
    );
  }
);

export default DiamondContainer;
