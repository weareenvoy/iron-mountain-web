import IronMountainLogoBlue from '@/components/ui/icons/IronMountainLogoBlue';
import SummitRootDiamondsBg from '@/components/ui/icons/SummitRootDiamondsBg';
import { cn } from '@/lib/tailwind/utils/cn';
import type { SummitHero } from '@/app/(displays)/summit/_types';
import type { ReactNode } from 'react';

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

  const containerGap = variant === 'print' ? 'gap-3 pb-3 pt-3' : 'gap-10 pb-10 pt-12';
  const headingSpacing = variant === 'print' ? 'mb-2 mt-4' : 'mb-8 mt-16';
  const containerClassName = cn('relative z-10 flex flex-col', containerGap);
  const headingClassName = cn(
    'font-normal text-[#58595B] text-balance',
    variant === 'print'
      ? 'text-[2.15rem] leading-[1.1] tracking-[-0.05em] sm:text-[2.6rem] lg:text-[3rem]'
      : 'text-4xl leading-tight sm:text-5xl lg:max-w-xl lg:text-7xl max-w-[24rem] sm:max-w-120 tracking-[-0.04em]',
    headingSpacing
  );
  const headingStyle =
    variant === 'print'
      ? { fontFamily: 'var(--font-interstate)', letterSpacing: '-0.05em' }
      : { fontFamily: 'var(--font-interstate)', letterSpacing: '-0.04em' };
  const metadataWrapperClassName = cn('grid gap-6 text-sm sm:grid-cols-3', variant === 'print' && 'gap-4 text-xs');
  const metadataValueClassName = cn(
    'font-medium text-[#58595B]',
    variant === 'print' ? 'text-sm leading-snug' : 'text-base'
  );

  return (
    <section className="relative isolate overflow-visible">
      <div aria-hidden className="pointer-events-none absolute -top-6 -right-20 -z-10 hidden lg:block">
        <SummitRootDiamondsBg className="h-[420px] w-[420px]" />
      </div>
      <div aria-hidden className="pointer-events-none fixed hidden print:top-0 print:right-0 print:block">
        <SummitRootDiamondsBg className="h-36 w-36" />
      </div>

      <div className={containerClassName}>
        <div className="flex w-full flex-wrap items-start justify-between gap-6">
          <IronMountainLogoBlue
            aria-label={hero.logoAlt}
            className="h-auto w-[300px] max-w-full sm:w-[360px]"
            role="img"
          />
        </div>

        <div
          className={cn(
            'flex w-full flex-col gap-3',
            variant === 'web' && 'md:flex-row md:items-center md:justify-between'
          )}
        >
          <h1 className={headingClassName} style={headingStyle}>
            {heading}
          </h1>
          {variant === 'web' && actionSlot ? <div className="print:hidden">{actionSlot}</div> : null}
        </div>

        <dl className={metadataWrapperClassName}>
          {metadata.map(item => (
            <div className="flex flex-col gap-1" key={item.label}>
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className={metadataValueClassName}>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-[#D0D0D3]" />
      </div>
    </section>
  );
};

export default HeroSection;
