import Image from 'next/image';
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
          <span aria-hidden className="h-4 w-4 rotate-45 rounded-xs border-2 border-[#6DCFF6]" />
          <span>{metrics.title}</span>
        </div>
      </header>

      <div className="grid gap-8 sm:grid-cols-3 print:grid-cols-3 print:gap-6">
        {metrics.items.map(item => (
          <div className="flex flex-col gap-1 text-left" key={item.label}>
            <p className="text-5xl font-semibold text-[#44A6E6] sm:text-6xl">{item.value}</p>
            <p className="text-sm text-[#58595B]">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#6DCFF6] bg-white px-6 py-8 shadow-sm sm:px-8 lg:px-10 lg:py-10 print:px-6 print:py-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-4">
          {obstacles.items.map(item => (
            <article className="flex flex-col items-center gap-4 text-center" key={item.title}>
              <span className="rounded-full bg-[#0D3C69] px-4 py-1 text-sm font-semibold text-white">{item.title}</span>
              <div className="flex h-28 w-28 items-center justify-center print:h-24 print:w-24">
                <div className="flex h-24 w-24 -rotate-45 items-center justify-center rounded-xl border border-[#44A6E6] bg-white print:h-20 print:w-20">
                  <div className="relative flex h-20 w-20 rotate-45 items-center justify-center rounded-full print:h-16 print:w-16">
                    <Image alt="" height={100} loading="eager" priority src="/images/binary-code-circle.png" width={100} />
                  </div>
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
