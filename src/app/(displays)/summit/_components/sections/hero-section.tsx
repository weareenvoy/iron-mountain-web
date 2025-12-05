import Image from 'next/image';
import type { ReactNode } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { SummitHero } from '@/app/(displays)/summit/_types';

export type HeroMetadataLabels = {
  readonly company: string;
  readonly dateOfEngagement: string;
  readonly location: string;
};

type HeroSectionProps = {
  readonly actionSlot?: ReactNode;
  readonly hero: SummitHero;
  readonly labels?: HeroMetadataLabels;
  readonly title?: string;
  readonly variant?: 'print' | 'web';
};

const DEFAULT_LABELS: HeroMetadataLabels = {
  company: 'Company',
  dateOfEngagement: 'Date of engagement',
  location: 'Location',
};

const HeroSection = ({ actionSlot, hero, labels, title, variant = 'web' }: HeroSectionProps) => {
  const resolvedLabels = labels ?? DEFAULT_LABELS;
  const metadata: { readonly label: string; readonly value: string }[] = [
    { label: resolvedLabels.company, value: hero.clientName },
    { label: resolvedLabels.dateOfEngagement, value: hero.date },
    { label: resolvedLabels.location, value: hero.location },
  ];
  const heading = title ?? hero.title ?? 'Your personalized journey map';

  const containerGap = variant === 'print' ? 'gap-4 pb-4 pt-4' : 'gap-10 pb-10 pt-12';
  const headingSpacing = variant === 'print' ? 'mb-3 mt-6' : 'mb-8 mt-16';
  const containerClassName = cn('flex flex-col relative z-10', containerGap);
  const headingClassName = cn(
    'font-normal leading-tight lg:max-w-xl lg:text-7xl max-w-[24rem] sm:max-w-120 sm:text-5xl text-4xl text-[#58595B] text-balance',
    headingSpacing
  );

  return (
    <section className="isolate overflow-visible relative">
      <div aria-hidden className="-right-20 -top-6 -z-10 absolute hidden lg:block pointer-events-none">
        <Image alt="" height={420} priority src="/images/summit-root-diamonds-bg2.svg" width={420} />
      </div>

      <div className={containerClassName}>
        <div className="flex flex-wrap gap-6 items-start justify-between w-full">
          <Image
            alt={hero.logoAlt}
            className="h-auto w-60 sm:w-80"
            height={48}
            priority
            src={hero.logoSrc}
            width={260}
          />
        </div>

        <h1
          className={headingClassName}
          style={{ fontFamily: 'var(--font-interstate)', letterSpacing: '-0.04em' }}
        >
          {heading}
        </h1>

        {variant === 'web' && actionSlot ? (
          <div className="flex justify-start">{actionSlot}</div>
        ) : null}

        <dl className="gap-6 grid sm:grid-cols-3 text-sm">
          {metadata.map(item => (
            <div className="flex flex-col gap-1" key={item.label}>
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="text-base font-medium text-[#58595B]">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-[#D0D0D3] border-t" />
      </div>
    </section>
  );
};

export default HeroSection;
