'use client';

import { useDocentTranslation } from '@/hooks/use-docent-translation';

const ScheduleLoading = () => {
  const { t } = useDocentTranslation();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-primary-im-dark-blue">{t.loading.schedule}</div>
    </div>
  );
};

export default ScheduleLoading;
