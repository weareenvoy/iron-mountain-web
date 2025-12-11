'use client';

import { Fragment, useRef, type ReactElement } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import RecapPrintSection from '@/app/(displays)/summit/_components/sections/recap-print-section';
import RecapSection, { type RecapTone } from '@/app/(displays)/summit/_components/sections/recap-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import SummitPrintableDocument from '@/app/(displays)/summit/_components/summit-printable-document';
import PrintIcon from '@/components/ui/icons/PrintIcon';
import type { SummitRecap } from '@/app/(displays)/summit/_types';

const PAGE_CONTAINER_CLASS = 'flex flex-col gap-14 py-10';
const PRINT_PAGE_STYLE =
  '@page { size: 8.5in 11in; margin: 0.25in; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }';
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

type MetricsBlock = {
  readonly kind: 'metrics';
};

type RecapBlock = {
  readonly kind: 'recap';
  readonly recapIndex: number;
  readonly storageKey: string;
  readonly tone?: RecapTone;
};

type StrategyBlock = {
  readonly accentColor: string;
  readonly kind: 'strategy';
  readonly strategyIndex: number;
  readonly title: string;
};

type SummitSegmentBlock = MetricsBlock | RecapBlock | StrategyBlock;

type SummitSegment = {
  readonly blocks: SummitSegmentBlock[];
  readonly id: string;
};

const SummitWebContent = () => {
  const { data, error, loading } = useSummit();
  const printableRef = useRef<HTMLDivElement>(null);

  const heroTitleFallback = data?.hero.title ?? 'Your personalized journey map';

  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: heroTitleFallback,
    pageStyle: PRINT_PAGE_STYLE,
  });

  const loadErrorMessage = 'Unable to load summit content.';
  const loadingMessage = 'Loading summit experience…';

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

  const recapsFromData = data.recaps ?? [];
  const legacyRecap = (data as { recap?: SummitRecap }).recap;
  const recapList = recapsFromData.length > 0 ? [...recapsFromData] : legacyRecap ? [legacyRecap] : [];

  const strategiesWithFallback = data.strategies.map((strategy, strategyIndex) => {
    if (strategyIndex !== 3) return strategy;

    const hasThreeBoxes = strategy.items.length >= 3;
    if (hasThreeBoxes) return strategy;

    const stories = data.stories.items;
    if (stories.length === 0) return strategy;

    return {
      eyebrow: strategy.eyebrow,
      items: stories.map(story => ({
        body: [story.description],
        title: story.title,
      })),
      summary: strategy.summary,
      title: strategy.title ?? data.stories.title,
    };
  });

  const consideringTitle = strategiesWithFallback[0]?.title ?? 'Considering possibilities';
  const heroLabels = {
    company: 'Company',
    dateOfEngagement: 'Date of engagement',
    location: 'Location',
  };
  const heroTitle = data.hero.title ?? 'Your personalized journey map';
  const recapPlaceholder = 'Type your notes here';
  const relevantSolutionsTitle = strategiesWithFallback[1]?.title ?? 'Relevant solutions';
  const unlockFutureTitle = strategiesWithFallback[2]?.title ?? 'Unlock your future';
  const storiesOfImpactTitle =
    strategiesWithFallback[3]?.title ?? strategiesWithFallback[3]?.eyebrow ?? 'Stories of impact';
  const strategyTitles = [consideringTitle, relevantSolutionsTitle, unlockFutureTitle, storiesOfImpactTitle];

  const segments: SummitSegment[] = (() => {
    const assembled: SummitSegment[] = [];
    const overviewBlocks: SummitSegmentBlock[] = [{ kind: 'metrics' }];
    if (recapList[0]) {
      overviewBlocks.push({
        kind: 'recap',
        recapIndex: 0,
        storageKey: 'recap-0',
        tone: RECAP_TONES_BY_INDEX[0],
      });
    }
    assembled.push({ blocks: overviewBlocks, id: 'overview' });

    strategiesWithFallback.forEach((strategy, strategyIndex) => {
      const blocks: SummitSegmentBlock[] = [
        {
          accentColor: STRATEGY_ACCENT_COLORS[strategyIndex] ?? '#8A0D71',
          kind: 'strategy',
          strategyIndex,
          title: strategyTitles[strategyIndex] ?? strategy.title ?? strategy.eyebrow,
        },
      ];

      const recapIndex = strategyIndex + 1;
      if (recapList[recapIndex]) {
        blocks.push({
          kind: 'recap',
          recapIndex,
          storageKey: `recap-${recapIndex}`,
          tone: RECAP_TONES_BY_INDEX[recapIndex],
        });
      }

      assembled.push({
        blocks,
        id: `strategy-${strategyIndex}`,
      });
    });

    return assembled;
  })();

  const renderWebBlock = (block: SummitSegmentBlock) => {
    if (block.kind === 'metrics') {
      return <MetricsSection metrics={data.metrics} obstacles={data.obstacles} />;
    }

    if (block.kind === 'strategy') {
      const strategy = strategiesWithFallback[block.strategyIndex];
      if (!strategy) return null;
      return <StrategiesSection accentColor={block.accentColor} strategy={strategy} title={block.title} />;
    }

    const recap = recapList[block.recapIndex];
    if (!recap) return null;
    return (
      <RecapSection placeholder={recapPlaceholder} recap={recap} storageKey={block.storageKey} tone={block.tone} />
    );
  };

  const renderPrintBlock = (block: SummitSegmentBlock) => {
    if (block.kind === 'metrics') {
      return <MetricsSection metrics={data.metrics} obstacles={data.obstacles} />;
    }

    if (block.kind === 'strategy') {
      const strategy = strategiesWithFallback[block.strategyIndex];
      if (!strategy) return null;
      return <StrategiesSection accentColor={block.accentColor} strategy={strategy} title={block.title} />;
    }

    const recap = recapList[block.recapIndex];
    if (!recap) return null;
    return (
      <RecapPrintSection placeholder={recapPlaceholder} recap={recap} storageKey={block.storageKey} tone={block.tone} />
    );
  };

  const printablePages = segments
    .map(page => ({
      id: page.id,
      sections: page.blocks.map(renderPrintBlock).filter((section): section is ReactElement => Boolean(section)),
    }))
    .filter(page => page.sections.length > 0);

  const handlePrintClick = () => {
    handlePrint();
  };

  return (
    <div className={PAGE_CONTAINER_CLASS}>
      <div className={SECTION_WRAPPER_CLASS}>
        <HeroSection
          actionSlot={
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#14477D] bg-white px-5 py-2 text-sm font-semibold text-[#14477D] shadow-[0_2px_6px_rgba(20,71,125,0.15)] transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#14477D]/30 focus-visible:outline-none"
              onClick={handlePrintClick}
              type="button"
            >
              <span>Generate PDF</span>
              <PrintIcon aria-hidden className="h-4 w-4" />
            </button>
          }
          hero={data.hero}
          labels={heroLabels}
          title={heroTitle}
        />
      </div>

      {segments.map((segment, segmentIndex) => (
        <Fragment key={segment.id}>
          {segment.blocks.map((block, blockIndex) => (
            <div className={SECTION_WRAPPER_CLASS} key={`${segment.id}-${block.kind}-${blockIndex}`}>
              {renderWebBlock(block)}
            </div>
          ))}
          {segmentIndex < segments.length - 1 ? (
            <div className={SECTION_WRAPPER_CLASS}>
              <hr className="border-t border-[#D0D0D3]" />
            </div>
          ) : null}
        </Fragment>
      ))}

      <SummitPrintableDocument
        hero={data.hero}
        heroLabels={heroLabels}
        heroTitle={heroTitle}
        pages={printablePages}
        ref={printableRef}
      />
    </div>
  );
};

export default SummitWebContent;
