'use client';

import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const TourLoading = () => {
  const { data } = useDocent();
  return <div className="flex h-full w-full items-center justify-center">{data?.loading.tour ?? 'Loading tour…'}</div>;
};

export default TourLoading;
