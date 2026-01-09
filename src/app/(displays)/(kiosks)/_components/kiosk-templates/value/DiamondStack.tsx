import { memo } from 'react';
import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { ValueDiamondCard } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Layout variant for diamond stack positioning.
 * - 'carousel': Diamonds positioned for carousel view (offset left with specific spacing)
 * - 'overview': Diamonds evenly spaced across the full width
 */
export type DiamondStackVariant = 'carousel' | 'overview';

/**
 * Layout configuration for diamond positioning.
 */
type DiamondLayout = {
  /** Optional Tailwind class for container positioning */
  readonly className?: string;
  /** Array of left positions (in px) for each diamond */
  readonly positions: readonly number[];
};

/**
 * Predefined layouts for different diamond stack variants.
 * All positioning values are derived from Figma design specifications to ensure
 * pixel-perfect alignment with the design system.
 *
 * Carousel variant:
 * - Left offset: -330px to align diamond stack within carousel container (from Figma frame positioning)
 * - Diamond positions: [335, 490, 650]px creating 155px spacing between centers (from Figma spacing grid)
 *
 * Overview variant:
 * - No offset (positioned at container origin)
 * - Diamond positions: [0, 565, 1130]px evenly distributed across 920px container (from Figma artboard layout)
 */
const diamondLayouts: Record<DiamondStackVariant, DiamondLayout> = {
  carousel: {
    className: 'relative left-[-330px]',
    positions: [335, 490, 650],
  },
  overview: {
    className: undefined,
    positions: [0, 565, 1130],
  },
} as const;

/**
 * Props for the DiamondStack component.
 */
type DiamondStackProps = {
  /** Array of diamond card data to render */
  readonly cards: readonly ValueDiamondCard[];
  /** Layout variant to use (defaults to 'overview') */
  readonly variant?: DiamondStackVariant;
};

/**
 * Renders a stack of diamond icons with optional labels.
 * Used for both carousel and overview variants with different positioning.
 *
 * @param cards - Array of diamond card data including icons and labels
 * @param variant - Layout variant: 'carousel' (offset left) or 'overview' (evenly spaced)
 */
const DiamondStack = memo(({ cards, variant = 'overview' }: DiamondStackProps) => {
  const layout = diamondLayouts[variant];

  return (
    <div className={`relative flex h-[565px] w-[920px] items-center ${layout.className ?? ''}`}>
      {cards.map((card, index) => {
        const Icon = getDiamondIcon(card);
        const leftOffset = layout.positions[index];

        // Validate index is within expected range
        if (leftOffset === undefined) {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              `Invalid diamond index ${index} for variant '${variant}'. Expected 0-${layout.positions.length - 1}.`
            );
          }
          return null;
        }

        return (
          <div
            className="absolute h-[550px] w-[550px] rotate-45 rounded-[80px]"
            key={card.label || `diamond-${variant}-${index}`}
            style={{ left: `${leftOffset}px` }}
            // Inline left position is required for runtime calculation based on variant and index
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full -rotate-45">
                {Icon ? <Icon aria-hidden className="h-full w-full" focusable="false" /> : null}
              </div>
            </div>
            {card.label ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-[320px] w-[320px] -rotate-45 items-center justify-center px-10 text-center text-[48px] leading-[1.4] font-normal tracking-[-2.4px] text-[#ededed]">
                  {renderRegisteredMark(card.label)}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

export default DiamondStack;
