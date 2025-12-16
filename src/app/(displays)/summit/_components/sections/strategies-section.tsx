import type {
  SummitFuturescaping,
  SummitKioskAmbient,
  SummitMapLocations,
  SummitPossibility,
} from '@/lib/internal/types';

// Different item types based on variant
type PossibilityItem = SummitPossibility;
type SolutionItem = { readonly locations: SummitMapLocations; readonly title: string };
type FuturescopingItem = SummitFuturescaping;
type StoryItem = SummitKioskAmbient;

type StrategiesSectionProps =
  | {
      readonly accentColor?: string;
      readonly items: readonly FuturescopingItem[];
      readonly title: string;
      readonly variant: 'futurescaping';
    }
  | {
      readonly accentColor?: string;
      readonly items: readonly PossibilityItem[];
      readonly title: string;
      readonly variant?: 'possibilities';
    }
  | {
      readonly accentColor?: string;
      readonly items: readonly SolutionItem[];
      readonly title: string;
      readonly variant: 'solutions';
    }
  | {
      readonly accentColor?: string;
      readonly items: readonly StoryItem[];
      readonly title: string;
      readonly variant: 'stories';
    };

const StrategiesSection = (props: StrategiesSectionProps) => {
  const { accentColor = '#8A0D71', items, title, variant = 'possibilities' } = props;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center gap-3 text-2xl font-semibold text-[#58595B] sm:text-3xl">
        <span aria-hidden className="h-4 w-4 rotate-45 rounded-xs border-2" style={{ borderColor: accentColor }} />
        <span>{title}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((item, index) => (
          <article className="rounded-xl border p-6 shadow-sm" key={index} style={{ borderColor: accentColor }}>
            <p className="text-sm font-semibold" style={{ color: accentColor }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-4 text-lg font-semibold text-[#4B4B4D]">
              {variant === 'possibilities' && (item as PossibilityItem).title}
              {variant === 'solutions' && (item as SolutionItem).title}
              {variant === 'futurescaping' && (item as FuturescopingItem).title}
              {variant === 'stories' && (item as StoryItem).solutionTitle}
            </h3>
            <div className="mt-4 text-sm whitespace-pre-line text-[#4B4B4D]">
              {variant === 'possibilities' && renderPossibility(item as PossibilityItem)}
              {variant === 'solutions' && renderSolution(item as SolutionItem)}
              {variant === 'futurescaping' && renderFuturescaping(item as FuturescopingItem)}
              {variant === 'stories' && renderStory(item as StoryItem)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const renderPossibility = (item: PossibilityItem) => (
  <>
    <p>{item.body1}</p>
    <p className="mt-2">{item.body2}</p>
    <p className="mt-2">{item.body3}</p>
  </>
);

const renderSolution = (item: SolutionItem) => {
  const locations = item.locations;
  return (
    <>
      <p className="font-bold">{locations.mapLocation1.title}</p>
      <p> {locations.mapLocation1.body}</p>
      <p className="mt-2 font-bold">{locations.mapLocation2.title}</p>
      <p className="mt-2"> {locations.mapLocation2.body}</p>
      <p className="mt-2 font-bold"> {locations.mapLocation3.title}</p>
      <p className="mt-2"> {locations.mapLocation3.body}</p>
    </>
  );
};

const renderFuturescaping = (item: FuturescopingItem) => <p>{item.body}</p>;

const renderStory = (item: StoryItem) => (
  <>
    {item.headline && <p className="font-semibold">{item.headline}</p>}
    {item.body && <p className="mt-2">{item.body}</p>}
    {item.attribution && <p className="mt-2 italic">{item.attribution}</p>}
  </>
);

export default StrategiesSection;
