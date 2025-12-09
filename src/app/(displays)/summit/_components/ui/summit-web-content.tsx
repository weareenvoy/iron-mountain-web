'use client';

import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import RecapSection from '@/app/(displays)/summit/_components/sections/recap-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import type { SummitRecap } from '@/app/(displays)/summit/_types';

const SummitWebContent = () => {
  const { data, error, loading } = useSummit();

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
  let recapList: SummitRecap[] = [];
  if (recapsFromData.length > 0) {
    recapList = [...recapsFromData];
  } else if (legacyRecap) {
    recapList = [legacyRecap];
  }

  const consideringTitle = data.strategies[0]?.eyebrow ?? 'Considering possibilities';
  const heroLabels = {
    company: 'Company',
    dateOfEngagement: 'Date of engagement',
    location: 'Location',
  };
  const heroTitle = data.hero.title ?? 'Your personalized journey map';
  const recapPlaceholder = 'Type your notes here';
  const relevantSolutionsTitle = data.strategies[1]?.eyebrow ?? 'Relevant solutions';
  const unlockFutureTitle = data.strategies[2]?.eyebrow ?? 'Unlock your future';
  const storiesOfImpactTitle = data.strategies[3]?.eyebrow ?? 'Stories of impact';

  return (
    <div className="flex flex-col gap-14 py-10">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <HeroSection hero={data.hero} labels={heroLabels} title={heroTitle} />
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <MetricsSection metrics={data.metrics} obstacles={data.obstacles} />
      </div>
      {recapList.length > 0 && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection placeholder={recapPlaceholder} recap={recapList[0]!} storageKey="recap-0" />
        </div>
      )}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <hr className="border-t border-[#D0D0D3]" />
      </div>
      {data.strategies[0] && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <StrategiesSection accentColor="#8A0D71" strategy={data.strategies[0]} title={consideringTitle} />
        </div>
      )}
      {recapList.length > 1 ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection
            placeholder={recapPlaceholder}
            recap={recapList[1]!}
            storageKey="recap-1"
            tone={{
              accentBg: '#8A0D71',
              accentColor: '#EDEDED',
              bodyColor: '#EDEDED',
              iconColor: '#EDEDED',
              rightTextColor: '#12406A',
            }}
          />
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <hr className="border-t border-[#D0D0D3]" />
      </div>
      {data.strategies[1] && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <StrategiesSection accentColor="#00A88E" strategy={data.strategies[1]} title={relevantSolutionsTitle} />
        </div>
      )}
      {recapList.length > 2 ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection
            placeholder={recapPlaceholder}
            recap={recapList[2]!}
            storageKey="recap-2"
            tone={{
              accentBg: '#00A88E',
              accentColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              iconColor: '#FFFFFF',
              rightTextColor: '#12406A',
            }}
          />
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <hr className="border-t border-[#D0D0D3]" />
      </div>
      {data.strategies[2] && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <StrategiesSection accentColor="#F7931E" strategy={data.strategies[2]} title={unlockFutureTitle} />
        </div>
      )}
      {recapList.length > 3 ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection
            placeholder={recapPlaceholder}
            recap={recapList[3]!}
            storageKey="recap-3"
            tone={{
              accentBg: '#F7931E',
              accentColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              iconColor: '#FFFFFF',
              rightTextColor: '#12406A',
            }}
          />
        </div>
      ) : null}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <hr className="border-t border-[#D0D0D3]" />
      </div>
      {data.strategies[3] && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <StrategiesSection accentColor="#1B75BC" strategy={data.strategies[3]} title={storiesOfImpactTitle} />
        </div>
      )}
      {recapList.length > 4 ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection
            placeholder={recapPlaceholder}
            recap={recapList[4]!}
            storageKey="recap-4"
            tone={{
              accentBg: '#1B75BC',
              accentColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              iconColor: '#FFFFFF',
              rightTextColor: '#12406A',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SummitWebContent;
