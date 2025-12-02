import type { SummitStrategy } from '@/app/(displays)/summit/_types';

type StrategiesSectionProps = {
  readonly accentColor?: string;
  readonly strategy: SummitStrategy;
  readonly title?: string;
};

const StrategiesSection = ({ accentColor = '#8A0D71', strategy, title }: StrategiesSectionProps) => {
  const heading = title ?? strategy.title ?? strategy.eyebrow;

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center gap-3 text-2xl font-semibold text-[#58595B] sm:text-3xl">
        <span aria-hidden className="h-4 w-4 rotate-45 rounded-xs border-2" style={{ borderColor: accentColor }} />
        <span>{heading}</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {strategy.items.map((item, index) => (
          <article className="rounded-xl border p-6 shadow-sm" key={item.title} style={{ borderColor: accentColor }}>
            <p className="text-sm font-semibold" style={{ color: accentColor }}>
              {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-4 text-lg font-semibold text-[#4B4B4D]">{item.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#4B4B4D]">
              {item.body.map(point => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StrategiesSection;
