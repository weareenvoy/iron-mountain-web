import type { SummitMetrics, SummitObstacles } from '@/app/(displays)/summit/_types';

type MetricsSectionProps = {
  readonly metrics: SummitMetrics;
  readonly obstacles: SummitObstacles;
};

const MetricsSection = ({ metrics, obstacles }: MetricsSectionProps) => {
  return (
    <section className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-2xl font-semibold text-[#58595B] sm:text-3xl">
          <span aria-hidden className="h-4 w-4 rotate-45 border-2 border-[#6DCFF6]" />
          <span>{metrics.title}</span>
        </div>
      </header>

      <div className="grid gap-8 sm:grid-cols-3">
        {metrics.items.map(item => (
          <div className="flex flex-col gap-2 text-center" key={item.label}>
            <p className="text-5xl font-semibold text-[#44A6E6] sm:text-6xl">{item.value}</p>
            <p className="text-sm text-[#58595B]">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-[#6DCFF6] bg-white px-6 py-8 shadow-sm sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {obstacles.items.map(item => (
            <article className="flex flex-col items-center gap-4 text-center" key={item.title}>
              <span className="rounded-full bg-[#0D3C69] px-4 py-1 text-sm font-semibold text-white">{item.title}</span>
              <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] border border-[#44A6E6] bg-white">
                <div className="flex h-20 w-20 rotate-45 items-center justify-center rounded-[1.5rem] border border-dashed border-[#44A6E6] bg-gradient-to-br from-white to-[#E6F4FC]">
                  <span className="-rotate-45 text-xs font-semibold tracking-wider text-[#0D3C69]">0101</span>
                </div>
              </div>
              <p className="text-sm text-[#58595B]">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;

