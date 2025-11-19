'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import Header from '@/app/(tablets)/docent/_components/ui/Header';

interface TourOverviewPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

const TourOverviewPage = ({ params }: TourOverviewPageProps) => {
  const { id } = use(params);
  const router = useRouter();
  const currentTour = useDocent().currentTour;

  const handleSectionClick = (section: 'basecamp' | 'overlook' | 'summit-room') => () => {
    router.push(`/docent/tour/${id}/${section}`);
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header
        leftButton={{
          href: '/docent',
          icon: <Image alt="Flag" height={21} src="/images/flag.svg" width={20} />,
          text: 'End tour',
        }}
      />

      {/* Header */}
      <div className="text-primary-bg-grey mt-35 flex flex-col items-center gap-[23px]">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">Overview</h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">{currentTour?.guestName || 'Tour'}</p>
      </div>

      {/* Grid as a whole rotate 45 deg, item text rotate -45 deg */}
      <div className="absolute top-110 left-25 grid rotate-45 grid-cols-2 gap-4">
        {/* Item 1 */}
        <button
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          onClick={handleSectionClick('basecamp')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">Basecamp</p>
        </button>

        {/* Item 2 */}
        <button
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          onClick={handleSectionClick('overlook')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">Overlook</p>
        </button>

        {/* Item 3 (manually placed in column 2, row 2) */}
        <button
          className="bg-primary-bg-grey relative col-start-2 row-start-2 flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          onClick={handleSectionClick('summit-room')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">Summit Room</p>
        </button>
      </div>
    </div>
  );
};

export default TourOverviewPage;
