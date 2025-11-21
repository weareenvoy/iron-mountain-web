'use client';

import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import HeroSection from '@/app/(displays)/summit/_components/sections/hero-section';

const SummitWebContent = () => {
  const { data, error, loading } = useSummit();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-base text-muted-foreground">
        Loading summit experience…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-base text-destructive">
        {error ?? 'Unable to load summit content.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 lg:px-12 px-4 py-10 sm:px-8">
      <HeroSection hero={data.hero} />
    </div>
  );
};

export default SummitWebContent;

