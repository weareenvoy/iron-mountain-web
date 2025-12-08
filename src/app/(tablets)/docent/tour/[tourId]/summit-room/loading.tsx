'use client';

import { useDocentTranslation } from '@/hooks/use-docent-translation';

const TourSummitLoading = () => {
  const { t } = useDocentTranslation();
  return <div className="flex h-full w-full items-center justify-center">{t.loading.summitRoom}</div>;
};

export default TourSummitLoading;
