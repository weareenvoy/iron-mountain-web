'use client';

import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import RecapSection from '@/app/(displays)/summit/_components/sections/recap-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import type { SummitRecap } from '@/app/(displays)/summit/_types';

const SummitWebContent = () => {
  const { data, error, loading } = useSummit();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-base text-muted-foreground">
        Loading summit experience…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-base text-destructive">
        {error ?? 'Unable to load summit content.'}
      </div>
    );
  }

  const recapsFromData = data.recaps ?? [];
  const recapList: SummitRecap[] = recapsFromData.length > 0 ? [...recapsFromData] : [];
  const fallbackRecap = (data as { recap?: SummitRecap }).recap;
  if (!recapList.length && fallbackRecap) {
    recapList.push(fallbackRecap);
  }

  return (
    <div className="flex flex-col gap-14 py-10">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <HeroSection hero={data.hero} />
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <MetricsSection metrics={data.metrics} obstacles={data.obstacles} />
      </div>
      {recapList.length > 0 && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection recap={recapList[0]!} />
        </div>
      )}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <hr className="border-t border-[#D0D0D3]" />
      </div>
      {data.strategies[0] && (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <StrategiesSection accentColor="#8A0D71" strategy={data.strategies[0]} />
        </div>
      )}
      {recapList.length > 1 ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection
            recap={recapList[1]!}
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
          <StrategiesSection accentColor="#F7931E" strategy={data.strategies[1]} />
        </div>
      )}
      {recapList.length > 2 ? (
        <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
          <RecapSection
            recap={recapList[2]!}
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
    </div>
  );
};

export default SummitWebContent;
