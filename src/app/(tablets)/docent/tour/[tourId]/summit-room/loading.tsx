'use client';

import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const TourSummitLoading = () => {
  const { data } = useDocent();
  return (
    <div className="flex h-full w-full items-center justify-center">
      {data?.loading.summitRoom ?? 'Loading summit room...'}
    </div>
  );
};

export default TourSummitLoading;
