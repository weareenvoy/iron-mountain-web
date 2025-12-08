'use client';

import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const DocentLoading = () => {
  const { data } = useDocent();
  return <div className="flex h-full w-full items-center justify-center">{data?.loading.default ?? 'Loading…'}</div>;
};

export default DocentLoading;
