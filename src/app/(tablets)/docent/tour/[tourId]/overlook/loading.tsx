'use client';

import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const TourOverlookLoading = () => {
  const { data } = useDocent();
  return (
    <div className="flex h-full w-full items-center justify-center">
      {data?.loading.overlook ?? 'Loading overlook...'}
    </div>
  );
};

export default TourOverlookLoading;
