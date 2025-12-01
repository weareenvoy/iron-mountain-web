'use client';

import Link from 'next/link';
import { useDocentTranslation } from '@/hooks/use-docent-translation';

const TourNotFound = () => {
  const { t } = useDocentTranslation();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold">{t.docent.notFound.title}</h2>
      <p className="text-primary-im-dark-blue">{t.docent.notFound.description}</p>
      <Link className="text-blue-600 underline" href="/docent/schedule">
        {t.docent.navigation.backToSchedule}
      </Link>
    </div>
  );
};

export default TourNotFound;
