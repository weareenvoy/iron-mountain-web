import Image from 'next/image';
import { cn } from '@/lib/tailwind/utils/cn';
import type { SummitProblem2Item, SummitProblem3 } from '@/app/(displays)/summit/_types';

type MetricsSectionProps = {
  readonly challenges?: null | SummitProblem3 | SummitProblem3['challenges'] | undefined;
  readonly stats: readonly SummitProblem2Item[];
  readonly title: string;
  readonly variant?: 'default' | 'slide';
};

const MetricsSection = ({ challenges, stats, title, variant = 'default' }: MetricsSectionProps) => {
  const isSlide = variant === 'slide';
  const challengeItems = Array.isArray((challenges as SummitProblem3 | undefined)?.challenges)
    ? (challenges as SummitProblem3).challenges
    : Array.isArray(challenges)
      ? challenges
      : [];

  return (
    <section className={cn('flex flex-col', isSlide ? 'gap-5' : 'gap-12')}>
      <header className={cn('flex flex-col', isSlide ? 'gap-1' : 'gap-3')}>
        <div
          className={cn(
            'flex items-center font-semibold text-[#58595B]',
            isSlide ? 'gap-2 text-2xl' : 'gap-3 text-2xl sm:text-3xl'
          )}
        >
          <span aria-hidden className="h-4 w-4 rotate-45 rounded-xs border-2 border-[#6DCFF6]" />
          <span>{title}</span>
        </div>
      </header>

      <div className={cn('grid sm:grid-cols-3 print:grid-cols-3 print:gap-6', isSlide ? 'gap-6' : 'gap-8')}>
        {stats.map(item => (
          <div className="flex flex-col gap-1 text-left" key={item.title}>
            <p
              className={cn(
                'font-semibold text-[#6DCFF6] print:text-[2.5rem] print:leading-[1.1]',
                isSlide ? 'text-4xl sm:text-5xl' : 'text-5xl sm:text-6xl'
              )}
            >
              {item.title}
            </p>
            <p className={cn('text-[#58595B] print:text-xs print:leading-snug', 'text-sm')}>{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div
        className={cn(
          'rounded-xl border border-[#6DCFF6] bg-white shadow-sm print:mt-4 print:px-5 print:py-5',
          isSlide ? 'px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7' : 'px-6 py-8 sm:px-8 lg:px-10 lg:py-10'
        )}
      >
        <div
          className={cn(
            'grid print:grid-cols-4 print:gap-4',
            isSlide ? 'gap-5 sm:grid-cols-2 lg:grid-cols-4' : 'gap-8 sm:grid-cols-2 lg:grid-cols-4'
          )}
        >
          {challengeItems.map(item => (
            <article className="flex flex-col items-center gap-4 text-center" key={item.title}>
              <span
                className={cn(
                  'rounded-full bg-[#0D3C69] font-semibold text-white',
                  isSlide ? 'px-3 py-1 text-[13px]' : 'px-4 py-1 text-sm'
                )}
              >
                {item.title}
              </span>
              <div
                className={cn(
                  'flex items-center justify-center print:h-24 print:w-24',
                  isSlide ? 'h-24 w-24' : 'h-28 w-28'
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-center rounded-xl border border-[#44A6E6] bg-white print:h-20 print:w-20',
                    isSlide ? 'h-20 w-20 -rotate-45' : 'h-24 w-24 -rotate-45'
                  )}
                >
                  <div
                    className={cn(
                      'relative flex rotate-45 items-center justify-center rounded-full print:h-16 print:w-16',
                      isSlide ? 'h-16 w-16' : 'h-20 w-20'
                    )}
                  >
                    <Image
                      alt=""
                      height={isSlide ? 80 : 100}
                      loading="eager"
                      priority
                      src="/images/binary-code-circle.png"
                      width={isSlide ? 80 : 100}
                    />
                  </div>
                </div>
              </div>
              <p className={cn('text-[#58595B]', 'text-sm')}>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
