'use client';

import Link from 'next/link';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';

const TourNotFound = () => {
  const { data } = useDocent();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-2xl font-semibold">{data?.docent.notFound.title ?? 'Tour not found'}</h2>
      <p className="text-primary-im-dark-blue">
        {data?.docent.notFound.description ?? "The tour you're looking for doesn't exist or is no longer available."}
      </p>
      <Link className="text-blue-600 underline" href="/docent/schedule">
        {data?.docent.navigation.backToSchedule ?? 'Back to schedule'}
      </Link>
    </div>
  );
};

export default TourNotFound;
