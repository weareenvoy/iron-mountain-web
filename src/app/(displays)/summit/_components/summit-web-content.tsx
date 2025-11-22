'use client';

import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import RecapSection from '@/app/(displays)/summit/_components/sections/recap-section';

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

  return (
    <div className="flex flex-col gap-14 py-10">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <HeroSection hero={data.hero} />
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <MetricsSection metrics={data.metrics} obstacles={data.obstacles} />
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <RecapSection recap={data.recap} />
      </div>
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 lg:px-12">
        <hr className="border-t border-[#D0D0D3]" />
      </div>
    </div>
  );
};

export default SummitWebContent;
