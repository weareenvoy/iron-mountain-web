import renderRegisteredMark from '../challenge/utils/renderRegisteredMark';
import { getDiamondIcon, type ValueDiamondCard } from './valueCarouselTemplate';

export type DiamondStackVariant = 'carousel' | 'overview';

const diamondLayouts: Record<
  DiamondStackVariant,
  Readonly<{ className?: string; positions: readonly number[] }>
> = {
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
        const fallbackColor = card.color ?? '#8a0d71';
        const leftOffset = layout.positions[index] ?? index * 160;

        return (
          <div
            className="absolute h-[550px] w-[550px] rotate-[45deg] rounded-[80px]"
            key={`${card.label ?? fallbackColor}-${index}`}
            style={{ left: leftOffset }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full -rotate-[45deg]">
                {Icon ? (
                  <Icon aria-hidden className="h-full w-full" focusable="false" />
                ) : (
                  <div className="h-full w-full rounded-[80px]" style={{ backgroundColor: fallbackColor }} />
                )}
              </div>
            </div>
            {card.label ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-[320px] w-[320px] -rotate-[45deg] items-center justify-center px-10 text-center text-[48px] leading-[1.4] font-normal tracking-[-2.4px] text-[#ededed]">
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
