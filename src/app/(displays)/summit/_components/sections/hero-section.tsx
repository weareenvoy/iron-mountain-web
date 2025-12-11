import IronMountainLogoBlue from '@/components/ui/icons/IronMountainLogoBlue';
import SummitRootDiamondsBg from '@/components/ui/icons/SummitRootDiamondsBg';
import type { SummitHero } from '@/app/(displays)/summit/_types';

type HeroMetadataLabels = {
  readonly company: string;
  readonly dateOfEngagement: string;
  readonly location: string;
};

type HeroSectionProps = {
  readonly hero: SummitHero;
  readonly labels?: HeroMetadataLabels;
  readonly title?: string;
};

const DEFAULT_LABELS: HeroMetadataLabels = {
  company: 'Company',
  dateOfEngagement: 'Date of engagement',
  location: 'Location',
};

const HeroSection = ({ hero, labels, title }: HeroSectionProps) => {
  const resolvedLabels = labels ?? DEFAULT_LABELS;
  const metadata: { readonly label: string; readonly value: string }[] = [
    { label: resolvedLabels.company, value: hero.clientName },
    { label: resolvedLabels.dateOfEngagement, value: hero.date },
    { label: resolvedLabels.location, value: hero.location },
  ];
  const heading = title ?? hero.title ?? 'Your personalized journey map';

  return (
    <section className="relative isolate overflow-visible">
      <div aria-hidden className="pointer-events-none absolute -top-6 -right-20 hidden lg:block">
        <SummitRootDiamondsBg className="h-[420px] w-[420px]" />
      </div>

      <div className="relative flex flex-col gap-10 pt-12 pb-10">
        <IronMountainLogoBlue
          aria-label={hero.logoAlt}
          className="h-auto w-[300px] max-w-full sm:w-[360px]"
          role="img"
        />

        <h1
          className="mt-16 mb-8 max-w-[24rem] text-4xl leading-tight font-normal text-balance text-[#58595B] sm:max-w-120 sm:text-5xl lg:max-w-xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-interstate)', letterSpacing: '-0.04em' }}
        >
          {heading}
        </h1>

        <dl className="grid gap-6 text-sm sm:grid-cols-3">
          {metadata.map(item => (
            <div className="flex flex-col gap-1" key={item.label}>
              <dt className="text-muted-foreground">{item.label}</dt>
              <dd className="text-base font-medium text-[#58595B]">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-[#D0D0D3]" />
      </div>
    </section>
  );
};

export default HeroSection;
