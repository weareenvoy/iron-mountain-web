'use client';

import { useDocentTranslation } from '@/hooks/use-docent-translation';

const TourLoading = () => {
  const { t } = useDocentTranslation();
  return <div className="flex h-full w-full items-center justify-center">{t.loading.tour}</div>;
};

export default TourLoading;
