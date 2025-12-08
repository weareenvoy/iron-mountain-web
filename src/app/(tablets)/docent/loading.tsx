'use client';

import { useDocentTranslation } from '@/hooks/use-docent-translation';

const DocentLoading = () => {
  const { t } = useDocentTranslation();
  return <div className="flex h-full w-full items-center justify-center">{t.loading.default}</div>;
};

export default DocentLoading;
