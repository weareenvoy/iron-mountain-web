import {
  renderFuturescaping,
  renderPossibility,
  renderSolution,
  renderStory,
  type SolutionItem,
} from '@/app/(displays)/summit/_utils';
import type { SummitFuturescaping, SummitKioskAmbient, SummitPossibility } from '@/app/(displays)/summit/_types';

type StrategiesSectionProps =
  | {
      readonly accentColor?: string;
      readonly density?: 'compact' | 'default';
      readonly items: readonly SolutionItem[];
      readonly title: string;
      readonly variant: 'solutions';
    }
  | {
      readonly accentColor?: string;
      readonly density?: 'compact' | 'default';
      readonly items: readonly SummitFuturescaping[];
      readonly title: string;
      readonly variant: 'futurescaping';
    }
  | {
      readonly accentColor?: string;
      readonly density?: 'compact' | 'default';
      readonly items: readonly SummitKioskAmbient[];
      readonly title: string;
      readonly variant: 'stories';
    }
  | {
      readonly accentColor?: string;
      readonly density?: 'compact' | 'default';
      readonly items: readonly SummitPossibility[];
      readonly title: string;
      readonly variant?: 'possibilities';
    };

type ProcessedItem = {
  readonly content: React.ReactNode;
  readonly itemKey: string;
  readonly itemTitle: string;
};

const processItem = (
  item: SolutionItem | SummitFuturescaping | SummitKioskAmbient | SummitPossibility,
  variant: 'futurescaping' | 'possibilities' | 'solutions' | 'stories'
): ProcessedItem => {
  switch (variant) {
    case 'futurescaping': {
      const typedItem = item as SummitFuturescaping;
      return {
        content: renderFuturescaping(typedItem),
        itemKey: typedItem.title,
        itemTitle: typedItem.title,
      };
    }
    case 'possibilities': {
      const typedItem = item as SummitPossibility;
      return {
        content: renderPossibility(typedItem),
        itemKey: typedItem.title,
        itemTitle: typedItem.title,
      };
    }
    case 'solutions': {
      const typedItem = item as SolutionItem;
      return {
        content: renderSolution(typedItem),
        itemKey: typedItem.title,
        itemTitle: typedItem.title,
      };
    }
    case 'stories': {
      const typedItem = item as SummitKioskAmbient;
      return {
        content: renderStory(typedItem),
        itemKey: typedItem.solution_title,
        itemTitle: typedItem.solution_title,
      };
    }
  }
};

const StrategiesSection = ({
  accentColor = '#8A0D71',
  density = 'default',
  items,
  title,
  variant = 'possibilities',
}: StrategiesSectionProps) => {
  const isCompact = density === 'compact';

  return (
    <section className={`flex flex-col ${isCompact ? 'gap-6 print:gap-5' : 'gap-8 print:gap-6'}`}>
      <div
        className={`flex items-center text-[#58595B] ${
          isCompact
            ? 'gap-2 text-xl font-semibold sm:text-2xl print:gap-2 print:text-xl'
            : 'gap-3 text-2xl font-semibold sm:text-3xl print:text-2xl'
        }`}
      >
        <span
          aria-hidden
          className={`${isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} rotate-45 rounded-xs border-2`}
          style={{ borderColor: accentColor }}
        />
        <span>{title}</span>
      </div>

      <div className={`grid ${isCompact ? 'gap-4 print:gap-4' : 'gap-6 print:gap-5'} sm:grid-cols-3`}>
        {items.map((item, index) => {
          const { content, itemKey, itemTitle } = processItem(item, variant);

          return (
            <article
              className={`${isCompact ? 'p-4 print:p-4' : 'p-6 print:p-4'} rounded-xl border shadow-sm`}
              key={itemKey}
              style={{ borderColor: accentColor }}
            >
              <p
                className={`${isCompact ? 'text-xs' : 'text-sm'} font-semibold print:text-xs`}
                style={{ color: accentColor }}
              >
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3
                className={`mt-3 font-semibold text-[#4B4B4D] ${
                  isCompact ? 'text-base leading-tight' : 'text-lg'
                } print:text-base print:leading-tight`}
              >
                {itemTitle}
              </h3>
              <div
                className={`mt-3 whitespace-pre-line text-[#4B4B4D] ${
                  isCompact ? 'text-xs leading-snug' : 'text-sm'
                } print:text-xs print:leading-snug`}
              >
                {content}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default StrategiesSection;
