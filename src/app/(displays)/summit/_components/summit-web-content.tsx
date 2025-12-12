'use client';

import { useRef, useState, type ReactElement } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import RecapPrintSection from '@/app/(displays)/summit/_components/sections/recap-print-section';
import RecapSection, { type RecapTone } from '@/app/(displays)/summit/_components/sections/recap-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import SummitPrintableDocument from '@/app/(displays)/summit/_components/summit-printable-document';
import PrintIcon from '@/components/ui/icons/PrintIcon';

const PAGE_CONTAINER_CLASS = 'flex flex-col gap-14 py-10';
const PRINT_PAGE_STYLE =
  '@page { size: 8.5in 11in; margin: 0.25in; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
const RECAP_TONES: readonly (RecapTone | undefined)[] = [
  undefined,
  {
    accentBg: '#8A0D71',
    accentColor: '#EDEDED',
    bodyColor: '#EDEDED',
    iconColor: '#EDEDED',
    rightTextColor: '#12406A',
  },
  {
    accentBg: '#00A88E',
    accentColor: '#FFFFFF',
    bodyColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    rightTextColor: '#12406A',
  },
  {
    accentBg: '#F7931E',
    accentColor: '#FFFFFF',
    bodyColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    rightTextColor: '#12406A',
  },
  {
    accentBg: '#1B75BC',
    accentColor: '#FFFFFF',
    bodyColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    rightTextColor: '#12406A',
  },
];
const SECTION_WRAPPER_CLASS = 'lg:px-12 max-w-[1200px] mx-auto px-4 sm:px-8 w-full';
const STRATEGY_COLORS = ['#8A0D71', '#00A88E', '#F7931E', '#1B75BC'] as const;

const SummitWebContent = () => {
  const { data, error, loading } = useSummit();
  const printableRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<null | string>(null);

  const heroTitle = 'Your personalized journey map'; // This will come from Simple CMS.
  const recapPlaceholder = 'Type your notes here';

  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: heroTitle,
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    onPrintError: () => {
      setPrintError(printErrorMessage);
      setIsPrinting(false);
    },
    pageStyle: PRINT_PAGE_STYLE,
  });

  const loadErrorMessage = 'Unable to load summit content.';
  const loadingMessage = 'Loading summit experience…';
  const printErrorMessage = 'Unable to generate PDF. Please try again.';

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-base text-muted-foreground">
        {loadingMessage}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-base text-destructive">
        {error ?? loadErrorMessage}
      </div>
    );
  }

  const { basecamp, meta, overlook } = data;
  const kiosk1 = data['kiosk-1'];
  const kiosk2 = data['kiosk-2'];
  const kiosk3 = data['kiosk-3'];

  const handlePrintClick = async () => {
    setPrintError(null);
    setIsPrinting(true);
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    try {
      await handlePrint();
    } catch (e) {
      console.error('Failed to start print job', e);
      setPrintError('Unable to generate PDF. Please try again.');
    }
  };

  // Render sections
  const renderMetrics = () => (
    <MetricsSection
      challenges={basecamp['problem-3']}
      stats={basecamp['problem-2']}
      title={basecamp['problem-1'].title}
    />
  );

  const renderPossibilities = () => (
    <StrategiesSection
      accentColor={STRATEGY_COLORS[0]}
      items={[basecamp['possibilities-a'], basecamp['possibilities-b'], basecamp['possibilities-c']]}
      title={basecamp.possibilities.title}
    />
  );

  const renderSolutions = () => (
    <StrategiesSection
      accentColor={STRATEGY_COLORS[1]}
      items={[
        { locations: overlook.protect, title: 'Protect' }, // TODO The 3 titles will come from Simple CMS.
        { locations: overlook.connect, title: 'Connect' },
        { locations: overlook.activate, title: 'Activate' },
      ]}
      title="Relevant solutions"
      variant="solutions"
    />
  );

  const renderFuturescaping = () => (
    <StrategiesSection
      accentColor={STRATEGY_COLORS[2]}
      items={[overlook['futurescaping-1'], overlook['futurescaping-2'], overlook['futurescaping-3']]}
      title="Unlock your future" // TODO All the titles will come from Simple CMS.
      variant="futurescaping"
    />
  );

  const renderStories = () => (
    <StrategiesSection
      accentColor={STRATEGY_COLORS[3]}
      items={[kiosk1.ambient, kiosk2.ambient, kiosk3.ambient]}
      title="Stories of impact"
      variant="stories"
    />
  );

  const renderRecap = (index: number) => (
    <RecapSection
      placeholder={recapPlaceholder}
      storageKey={`recap-${index}`}
      title="Recap"
      tone={RECAP_TONES[index]}
    />
  );

  const renderRecapPrint = (index: number) => (
    <RecapPrintSection
      placeholder={recapPlaceholder}
      storageKey={`recap-${index}`}
      title="Recap"
      tone={RECAP_TONES[index]}
    />
  );

  const printablePages = [
    { id: 'overview', sections: [renderMetrics(), renderRecapPrint(0)] },
    { id: 'possibilities', sections: [renderPossibilities(), renderRecapPrint(1)] },
    { id: 'solutions', sections: [renderSolutions(), renderRecapPrint(2)] },
    { id: 'futurescaping', sections: [renderFuturescaping(), renderRecapPrint(3)] },
    { id: 'stories', sections: [renderStories(), renderRecapPrint(4)] },
  ].filter(p => p.sections.length > 0) as { id: string; sections: ReactElement[] }[];

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <div className={SECTION_WRAPPER_CLASS}>
        <HeroSection
          actionSlot={
            <div className="flex flex-col items-end gap-1">
              <button
                aria-busy={isPrinting}
                aria-label="Generate PDF"
                className="inline-flex items-center gap-2 rounded-full border border-[#14477D] bg-white px-5 py-2 text-sm font-semibold text-[#14477D] shadow-[0_2px_6px_rgba(20,71,125,0.15)] transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#14477D]/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isPrinting}
                onClick={handlePrintClick}
                type="button"
              >
                <span>{isPrinting ? 'Generating…' : 'Generate PDF'}</span>
                <PrintIcon aria-hidden className="h-4 w-4" />
              </button>
              {printError ? (
                <p className="text-right text-sm text-destructive" role="alert">
                  {printError}
                </p>
              ) : null}
            </div>
          }
          company={meta.company}
          date={meta['start-date']}
          location={meta.location}
          title={heroTitle}
        />
      </div>

      {/* Metrics + Recap */}
      <div className={SECTION_WRAPPER_CLASS}>{renderMetrics()}</div>
      <div className={SECTION_WRAPPER_CLASS}>{renderRecap(0)}</div>
      <div className={SECTION_WRAPPER_CLASS}>
        <hr className="border-t border-[#D0D0D3]" />
      </div>

      {/* Possibilities + Recap */}
      <div className={SECTION_WRAPPER_CLASS}>{renderPossibilities()}</div>
      <div className={SECTION_WRAPPER_CLASS}>{renderRecap(1)}</div>
      <div className={SECTION_WRAPPER_CLASS}>
        <hr className="border-t border-[#D0D0D3]" />
      </div>

      {/* Solutions + Recap */}
      <div className={SECTION_WRAPPER_CLASS}>{renderSolutions()}</div>
      <div className={SECTION_WRAPPER_CLASS}>{renderRecap(2)}</div>
      <div className={SECTION_WRAPPER_CLASS}>
        <hr className="border-t border-[#D0D0D3]" />
      </div>

      {/* Futurescaping + Recap */}
      <div className={SECTION_WRAPPER_CLASS}>{renderFuturescaping()}</div>
      <div className={SECTION_WRAPPER_CLASS}>{renderRecap(3)}</div>
      <div className={SECTION_WRAPPER_CLASS}>
        <hr className="border-t border-[#D0D0D3]" />
      </div>

      {/* Stories + Recap */}
      <div className={SECTION_WRAPPER_CLASS}>{renderStories()}</div>
      <div className={SECTION_WRAPPER_CLASS}>{renderRecap(4)}</div>

      <SummitPrintableDocument
        company={meta.company}
        date={meta['start-date']}
        heroTitle={heroTitle}
        location={meta.location}
        pages={printablePages}
        ref={printableRef}
      />
    </div>
  );
};

export default SummitWebContent;
