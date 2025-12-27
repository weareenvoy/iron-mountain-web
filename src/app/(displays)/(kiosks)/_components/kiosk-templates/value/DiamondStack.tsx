import { getDiamondIcon } from '@/app/(displays)/(kiosks)/_utils/get-diamond-icon';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import type { ValueDiamondCard } from '@/app/(displays)/(kiosks)/_types/value-types';

export type DiamondStackVariant = 'carousel' | 'overview';

type DiamondLayout = {
  readonly className?: string;
  readonly positions: readonly number[];
};

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

type DiamondStackProps = {
  readonly cards: readonly ValueDiamondCard[];
  readonly variant?: DiamondStackVariant;
};

const DiamondStack = ({ cards, variant = 'overview' }: DiamondStackProps) => {
  const layout = diamondLayouts[variant];

  return (
    <div className={`relative flex h-[565px] w-[920px] items-center ${layout.className ?? ''}`}>
      {cards.map((card, index) => {
        const Icon = getDiamondIcon(card);
        const leftOffset = layout.positions[index] ?? index * 160;

        return (
          <div
            className="absolute h-[550px] w-[550px] rotate-45 rounded-[80px]"
            key={`${card.label ?? index}`}
            style={{ '--left-offset': `${leftOffset}px`, 'left': 'var(--left-offset)' } as React.CSSProperties}
            // These styles are inline because this setup requires runtime calculation based on index and array lookup to create the visual stack effect when overlapping diamonds to create a staggered layout pattern with leftOffset (left positions based on index).
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
};

export default DiamondStack;
