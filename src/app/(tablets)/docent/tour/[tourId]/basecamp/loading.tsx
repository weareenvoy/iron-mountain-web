'use client';

import { useDocentTranslation } from '@/hooks/use-docent-translation';

const TourBasecampLoading = () => {
  const { t } = useDocentTranslation();
  return <div className="flex h-full w-full items-center justify-center">{t.loading.basecamp}</div>;
};

export default TourBasecampLoading;
