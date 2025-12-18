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
      readonly items: readonly SolutionItem[];
      readonly title: string;
      readonly variant: 'solutions';
    }
  | {
      readonly accentColor?: string;
      readonly items: readonly SummitFuturescaping[];
      readonly title: string;
      readonly variant: 'futurescaping';
    }
  | {
      readonly accentColor?: string;
      readonly items: readonly SummitKioskAmbient[];
      readonly title: string;
      readonly variant: 'stories';
    }
  | {
      readonly accentColor?: string;
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
        itemKey: typedItem.solutionTitle,
        itemTitle: typedItem.solutionTitle,
      };
    }
  }
};

const StrategiesSection = ({
  accentColor = '#8A0D71',
  items,
  title,
  variant = 'possibilities',
}: StrategiesSectionProps) => {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center gap-3 text-2xl font-semibold text-[#58595B] sm:text-3xl">
        <span aria-hidden className="h-4 w-4 rotate-45 rounded-xs border-2" style={{ borderColor: accentColor }} />
        <span>{title}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((item, index) => {
          const { content, itemKey, itemTitle } = processItem(item, variant);

          return (
            <article className="rounded-xl border p-6 shadow-sm" key={itemKey} style={{ borderColor: accentColor }}>
              <p className="text-sm font-semibold" style={{ color: accentColor }}>
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-[#4B4B4D]">{itemTitle}</h3>
              <div className="mt-4 text-sm whitespace-pre-line text-[#4B4B4D]">{content}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default StrategiesSection;
