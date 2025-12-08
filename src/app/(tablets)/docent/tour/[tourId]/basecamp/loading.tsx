'use client';

import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const TourBasecampLoading = () => {
  const { data } = useDocent();
  return (
    <div className="flex h-full w-full items-center justify-center">
      {data?.loading.basecamp ?? 'Loading basecamp...'}
    </div>
  );
};

export default TourBasecampLoading;
