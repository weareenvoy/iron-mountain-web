'use client';

import { useDocentTranslation } from '@/hooks/use-docent-translation';

const TourOverlookLoading = () => {
  const { t } = useDocentTranslation();
  return <div className="flex h-full w-full items-center justify-center">{t.loading.overlook}</div>;
};

export default TourOverlookLoading;
