import Image from 'next/image';
import type { SummitHero } from '@/app/(displays)/summit/_types';

type HeroSectionProps = {
  readonly hero: SummitHero;
};

const HeroSection = ({ hero }: HeroSectionProps) => {
  const metadata: { readonly label: string; readonly value: string }[] = [
    { label: 'Company', value: hero.clientName },
    { label: 'Date of engagement', value: hero.date },
    { label: 'Location', value: hero.location },
  ];

  return (
    <section className="relative isolate overflow-visible">
      <div aria-hidden className="pointer-events-none absolute -top-6 -right-20 hidden lg:block">
        <Image alt="" height={420} priority src="/images/summit-root-diamonds-bg2.svg" width={420} />
      </div>

      <div className="relative flex flex-col gap-10 pt-12 pb-10">
        <Image alt={hero.logoAlt} className="h-auto w-60 sm:w-80" height={48} priority src={hero.logoSrc} width={260} />

        <h1
          className="mt-16 mb-8 max-w-[24rem] text-4xl leading-tight font-normal text-balance text-[#58595B] sm:max-w-120 sm:text-5xl lg:max-w-xl lg:text-7xl"
          style={{ fontFamily: 'var(--font-interstate)', letterSpacing: '-0.04em' }}
        >
          {hero.title}
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
