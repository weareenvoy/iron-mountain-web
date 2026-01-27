'use client';

import { ChevronDown } from 'lucide-react';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import RecapPrintSection from '@/app/(displays)/summit/_components/sections/recap-print-section';
import RecapSection, { type RecapTone } from '@/app/(displays)/summit/_components/sections/recap-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import SummitPrintableDocument from '@/app/(displays)/summit/_components/summit-printable-document';
import { transformToSummitTours, type SolutionItem } from '@/app/(displays)/summit/_utils';
import PrintIcon from '@/components/ui/icons/PrintIcon';
import { getSummitData } from '@/lib/internal/data/get-summit';
import { getToursData } from '@/lib/internal/data/get-tours';
import { getUTCTourMonth, getUTCTourYear } from '@/lib/utils/iso-date';
import type { SummitFuturescaping, SummitKioskAmbient, SummitPossibility } from '@/app/(displays)/summit/_types';
import type { SummitTourSummary } from '@/lib/internal/types';

const PAGE_CONTAINER_CLASS = 'flex flex-col gap-14 py-10';
const PRINT_PAGE_STYLE =
  '@page { size: 8.5in 11in; margin: 0.25in; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;
const RECAP_TONES_BY_INDEX: readonly (RecapTone | undefined)[] = [
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
] as const;
const SECTION_WRAPPER_CLASS = 'lg:px-12 max-w-[1200px] mx-auto px-4 sm:px-8 w-full';
const STRATEGY_ACCENT_COLORS = ['#8A0D71', '#00A88E', '#F7931E', '#1B75BC'] as const;

const SummitWebContent = () => {
  const { data, error, loading } = useSummit();
  const printableRef = useRef<HTMLDivElement>(null);
  const expectedTourIdRef = useRef<string>('');
  const [activeData, setActiveData] = useState<null | typeof data>(null);
  const [activeTourId, setActiveTourId] = useState<string>('');
  const [hasLoadedExperience, setHasLoadedExperience] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState<null | string>(null);
  const [tours, setTours] = useState<readonly SummitTourSummary[]>([]);
  const [toursError, setToursError] = useState<null | string>(null);
  const [toursLoading, setToursLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<'' | number>('');
  const [selectedMonth, setSelectedMonth] = useState<'' | number>('');
  const [selectedExperience, setSelectedExperience] = useState<'' | string>('');
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceError, setExperienceError] = useState<null | string>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTours = async () => {
      setToursLoading(true);
      setToursError(null);
      try {
        const toursData = await getToursData();
        const tourList = transformToSummitTours(toursData);
        if (!isMounted) return;
        setTours(tourList);
        if (tourList.length > 0) {
          const years = Array.from(
            new Set(tourList.map(tour => getUTCTourYear(tour.date)).filter((year): year is number => year !== null))
          ).sort((a, b) => a - b);
          const latestYear = years.at(-1) ?? '';
          setSelectedYear(latestYear);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load summit tours', err);
        setToursError('Unable to load experiences.');
      } finally {
        if (isMounted) {
          setToursLoading(false);
        }
      }
    };

    loadTours();

    return () => {
      isMounted = false;
    };
  }, []);

  // Include all years from 2025 to current, even if no tours exist yet, so users can see the full range for planning.
  const availableYears = useMemo(() => {
    const yearsFromTours = Array.from(
      new Set(tours.map(tour => getUTCTourYear(tour.date)).filter((year): year is number => year !== null))
    );
    const currentYear = new Date().getFullYear();
    const startYear = 2025;
    const allYears = [];
    for (let year = startYear; year <= currentYear; year += 1) {
      allYears.push(year);
    }
    const merged = Array.from(new Set([...allYears, ...yearsFromTours])).sort((a, b) => a - b);
    return merged;
  }, [tours]);

  const toursByYear = useMemo(() => {
    if (!selectedYear) return [];
    return tours.filter(tour => getUTCTourYear(tour.date) === selectedYear);
  }, [selectedYear, tours]);

  const monthAvailability = useMemo(() => {
    const availability = new Map<number, number>();
    toursByYear.forEach(tour => {
      const monthIndex = getUTCTourMonth(tour.date);
      if (monthIndex === null) {
        console.warn('Invalid date in tour:', tour);
        return;
      }
      availability.set(monthIndex, (availability.get(monthIndex) ?? 0) + 1);
    });
    return availability;
  }, [toursByYear]);

  const toursByYearAndMonth = useMemo(() => {
    if (!selectedYear) return [];
    return toursByYear.filter(tour => {
      const monthIndex = getUTCTourMonth(tour.date);
      if (monthIndex === null) return false;
      if (selectedMonth === '') return true;
      return monthIndex === selectedMonth;
    });
  }, [selectedMonth, selectedYear, toursByYear]);

  const isMonthDisabled = !selectedYear || toursByYear.length === 0;
  const isExperienceDisabled =
    !selectedYear || isMonthDisabled || selectedMonth === '' || toursByYearAndMonth.length === 0;
  const isLoadDisabled = !selectedExperience || experienceLoading;

  const handleYearChange = (value: string) => {
    const nextYear = value ? Number.parseInt(value, 10) : '';
    setSelectedYear(Number.isNaN(nextYear) ? '' : nextYear);
    setSelectedMonth('');
    setSelectedExperience('');
  };

  const handleMonthChange = (value: string) => {
    const nextMonth = value ? Number.parseInt(value, 10) : '';
    setSelectedMonth(Number.isNaN(nextMonth) ? '' : nextMonth);
    setSelectedExperience('');
  };

  const handleExperienceChange = (value: string) => {
    setActiveData(null);
    setActiveTourId('');
    setHasLoadedExperience(false);
    setExperienceError(null);
    setSelectedExperience(value);
  };

  const handleLoadExperience = async () => {
    if (!selectedExperience) return;
    const isValidTour = toursByYearAndMonth.some(tour => tour.id === selectedExperience);
    if (!isValidTour) {
      console.error('Invalid tour ID selected:', selectedExperience);
      setExperienceError('Invalid experience selected. Please try again.');
      return;
    }
    expectedTourIdRef.current = selectedExperience;
    setActiveTourId(selectedExperience);
    setHasLoadedExperience(false);
    setExperienceLoading(true);
    setExperienceError(null);
    try {
      const fetched = await getSummitData(selectedExperience);
      if (expectedTourIdRef.current === selectedExperience) {
        setActiveData(fetched.data);
        setHasLoadedExperience(true);
      }
    } catch (err) {
      if (expectedTourIdRef.current === selectedExperience) {
        console.error('Failed to load summit experience', err);
        setExperienceError('Unable to load experience. Please try again.');
      }
    } finally {
      if (expectedTourIdRef.current === selectedExperience) {
        setExperienceLoading(false);
      }
    }
  };

  const recapPlaceholder = 'Type your notes here';

  const contentData = hasLoadedExperience ? activeData : null;
  const hasExperienceSelected = selectedExperience !== '';
  const hasTriedExperience = experienceLoading || hasLoadedExperience || Boolean(experienceError);
  const loadErrorMessage = 'Unable to load summit content.';
  const loadingMessage = 'Loading summit experience…';
  const printErrorMessage = 'Unable to generate PDF. Please try again.';

  const requireSlideTitle = (handle: string) => {
    if (!contentData) {
      throw new Error('Missing summit data');
    }
    const slide = contentData.summitSlides.find(item => item.handle === handle);
    if (!slide) {
      throw new Error(`Missing summit slide: ${handle}`);
    }
    return slide.title;
  };

  const heroTitle = contentData ? requireSlideTitle('journey-1') : '';

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

  const filtersSlot = (
    <div className="flex w-full flex-col gap-3 pt-4">
      <p className="text-sm text-[#58595B]">
        Filter experiences using the drop-down menus below.
        <br />
        Your results will update on this page.
      </p>
      <div className="flex flex-col gap-3">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#58595B]">Year</label>
            <div className="relative">
              <select
                className={`w-full appearance-none rounded-lg bg-[#F2F2F2] px-4 py-3 pr-12 text-base transition outline-none ${
                  selectedYear === '' ? 'text-[#58595B]' : 'text-[#14477D]'
                } disabled:cursor-not-allowed disabled:bg-[#A1A1A4] disabled:text-[#58595B]`}
                onChange={event => handleYearChange(event.target.value)}
                value={selectedYear}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#14477D]"
                size={24}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#58595B]">Month</label>
            <div className="relative">
              <select
                className={`w-full appearance-none rounded-lg bg-[#F2F2F2] px-4 py-3 pr-12 text-base transition outline-none ${
                  selectedMonth === '' ? 'text-[#58595B]' : 'text-[#14477D]'
                } disabled:cursor-not-allowed disabled:bg-[#A1A1A4] disabled:text-[#58595B]`}
                disabled={isMonthDisabled}
                onChange={event => handleMonthChange(event.target.value)}
                value={selectedMonth}
              >
                <option value="">Select month</option>
                {MONTHS.map((month, index) => {
                  const hasTours = (monthAvailability.get(index) ?? 0) > 0;
                  return (
                    <option disabled={!hasTours} key={month} value={index}>
                      {month}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#14477D]"
                size={24}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#58595B]">Experience</label>
            <div className="relative">
              <select
                className={`w-full appearance-none rounded-lg bg-[#F2F2F2] px-4 py-3 pr-12 text-base transition outline-none ${
                  selectedExperience === '' ? 'text-[#58595B]' : 'text-[#14477D]'
                } disabled:cursor-not-allowed disabled:bg-[#A1A1A4] disabled:text-[#58595B]`}
                disabled={isExperienceDisabled}
                onChange={event => handleExperienceChange(event.target.value)}
                value={selectedExperience}
              >
                <option value="">Select experience</option>
                {toursByYearAndMonth.map(tour => {
                  return (
                    <option key={tour.id} value={tour.id}>
                      {tour.name}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#14477D]"
                size={24}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {experienceError ? <p className="text-sm text-destructive">{experienceError}</p> : <span />}
          <div className="flex items-center gap-3">
            {toursError ? <p className="text-sm text-destructive">{toursError}</p> : null}
            <button
              className="rounded-full bg-[#0B4175] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4175]/90 disabled:cursor-not-allowed disabled:bg-muted"
              disabled={isLoadDisabled}
              onClick={handleLoadExperience}
              type="button"
            >
              {experienceLoading ? 'Loading…' : 'Load'}
            </button>
          </div>
        </div>
      </div>

      {hasExperienceSelected && !!contentData && <hr className="border-t border-[#D0D0D3]" />}
    </div>
  );

  if (loading || toursLoading) {
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

  if (!hasExperienceSelected) {
    return (
      <div className={PAGE_CONTAINER_CLASS}>
        <div className={SECTION_WRAPPER_CLASS}>
          <HeroSection actionSlot={null} filtersSlot={filtersSlot} meta={[]} title="" />
        </div>
      </div>
    );
  }

  if (experienceLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-base text-muted-foreground">
        {loadingMessage}
      </div>
    );
  }

  if (!hasTriedExperience) {
    return (
      <div className={PAGE_CONTAINER_CLASS}>
        <div className={SECTION_WRAPPER_CLASS}>
          <HeroSection actionSlot={null} filtersSlot={filtersSlot} meta={[]} title="" />
        </div>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-base text-destructive">
        {experienceError ?? loadErrorMessage}
      </div>
    );
  }

  const { basecamp, kiosk1, kiosk2, kiosk3, meta, overlook } = contentData;

  const handlePrintClick = async () => {
    setPrintError(null);
    setIsPrinting(true);
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    try {
      await handlePrint();
    } catch (e) {
      console.error('Failed to start print job', e);
      setPrintError('Unable to generate PDF. Please try again.');
      setIsPrinting(false);
    }
  };

  const journey3Title = requireSlideTitle('journey-3');
  const journey4Title = requireSlideTitle('journey-4');
  const journey5Title = requireSlideTitle('journey-5');
  const journey6Title = requireSlideTitle('journey-6');

  const possibilitiesItems: readonly SummitPossibility[] = [
    basecamp.possibilitiesA,
    basecamp.possibilitiesB,
    basecamp.possibilitiesC,
  ];

  const solutionItems: readonly SolutionItem[] = [
    { locations: overlook.protect, title: contentData.protectTitle },
    { locations: overlook.connect, title: contentData.connectTitle },
    { locations: overlook.activate, title: contentData.activateTitle },
  ];

  const futurescapingItems: readonly SummitFuturescaping[] = [
    overlook.futurescaping1,
    overlook.futurescaping2,
    overlook.futurescaping3,
  ];

  const storiesItems: readonly SummitKioskAmbient[] = [kiosk1.ambient, kiosk2.ambient, kiosk3.ambient];

  // Render sections
  const renderMetrics = () => (
    <MetricsSection challenges={basecamp.problem3} stats={basecamp.problem2} title={basecamp.problem1.title} />
  );

  const renderPossibilities = () => (
    <StrategiesSection accentColor={STRATEGY_ACCENT_COLORS[0]} items={possibilitiesItems} title={journey3Title} />
  );

  const renderSolutions = () => (
    <StrategiesSection
      accentColor={STRATEGY_ACCENT_COLORS[1]}
      items={solutionItems}
      title={journey4Title}
      variant="solutions"
    />
  );

  const renderFuturescaping = () => (
    <StrategiesSection
      accentColor={STRATEGY_ACCENT_COLORS[2]}
      items={futurescapingItems}
      title={journey5Title}
      variant="futurescaping"
    />
  );

  const renderStories = () => (
    <StrategiesSection
      accentColor={STRATEGY_ACCENT_COLORS[3]}
      items={storiesItems}
      title={journey6Title}
      variant="stories"
    />
  );

  const storageKeyPrefix = activeTourId ? `recap-${activeTourId}` : 'recap';

  const renderRecap = (index: number) => (
    <RecapSection
      placeholder={recapPlaceholder}
      storageKey={`${storageKeyPrefix}-${index}`}
      title="Recap"
      tone={RECAP_TONES_BY_INDEX[index]}
    />
  );

  const renderRecapPrint = (index: number) => (
    <RecapPrintSection
      hideWhenEmpty
      placeholder={recapPlaceholder}
      storageKey={`${storageKeyPrefix}-${index}`}
      title="Recap"
      tone={RECAP_TONES_BY_INDEX[index]}
    />
  );

  const printablePages: readonly { readonly id: string; readonly sections: readonly ReactElement[] }[] = [
    { id: 'overview', sections: [renderMetrics(), renderRecapPrint(0)] },
    { id: 'possibilities', sections: [renderPossibilities(), renderRecapPrint(1)] },
    { id: 'solutions', sections: [renderSolutions(), renderRecapPrint(2)] },
    { id: 'futurescaping', sections: [renderFuturescaping(), renderRecapPrint(3)] },
    { id: 'stories', sections: [renderStories(), renderRecapPrint(4)] },
  ] as const;

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
          filtersSlot={filtersSlot}
          meta={meta}
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

      <SummitPrintableDocument heroTitle={heroTitle} meta={meta} pages={printablePages} ref={printableRef} />
    </div>
  );
};

export default SummitWebContent;
