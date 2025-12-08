'use client';

import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const ScheduleLoading = () => {
  const { data } = useDocent();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-primary-im-dark-blue">{data?.loading.schedule ?? 'Loading schedule...'}</div>
    </div>
  );
};

export default ScheduleLoading;
