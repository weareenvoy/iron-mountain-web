'use client';

import { forwardRef, type ForwardedRef, type ReactNode } from 'react';
import SummitPrintLayout from '@/app/(displays)/summit/_components/layouts/summit-print-layout';
import HeroSection, { type HeroMetadataLabels } from '@/app/(displays)/summit/_components/sections/hero-section';
import type { SummitHero } from '@/app/(displays)/summit/_types';

type PrintablePage = {
  readonly id: string;
  readonly sections: readonly ReactNode[];
};

type SummitPrintableDocumentProps = {
  readonly hero: SummitHero;
  readonly heroLabels: HeroMetadataLabels;
  readonly heroTitle: string;
  readonly pages: readonly PrintablePage[];
};

const SummitPrintableDocument = (
  { hero, heroLabels, heroTitle, pages }: SummitPrintableDocumentProps,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 left-[-9999px] flex flex-col gap-6 print:pointer-events-auto print:static print:top-auto print:left-auto print:flex"
      ref={ref}
    >
      {pages.map((page, index) => (
        <div
          className="flex flex-col"
          key={page.id}
          style={{ pageBreakAfter: index === pages.length - 1 ? 'auto' : 'always' }}
        >
          <SummitPrintLayout>
            <div className="flex flex-col gap-6 text-[0.92rem] leading-[1.35] tracking-[-0.01em]">
              <HeroSection hero={hero} labels={heroLabels} title={heroTitle} variant="print" />
              <div className="flex flex-col gap-5">
                {page.sections.map((section, sectionIndex) => (
                  <div key={`${page.id}-section-${sectionIndex}`}>{section}</div>
                ))}
              </div>
            </div>
          </SummitPrintLayout>
        </div>
      ))}
    </div>
  );
};

export default forwardRef<HTMLDivElement, SummitPrintableDocumentProps>(SummitPrintableDocument);
