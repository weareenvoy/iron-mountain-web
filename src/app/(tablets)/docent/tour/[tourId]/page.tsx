'use client';

import Link from 'next/link';
import { use, useCallback, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import Flag from '@/components/ui/icons/Flag';
import { useDocentTranslation } from '@/hooks/use-docent-translation';

const TourOverviewPage = ({ params }: PageProps<'/docent/tour/[tourId]'>) => {
  const { t } = useDocentTranslation();
  const { tourId } = use(params);
  const currentTour = useDocent().currentTour;

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      href: '/docent',
      icon: <Flag className="h-[21px] w-[20px]" />,
      text: t.docent.navigation.endTour,
    }),
    [t]
  );

  type TourSubPath = 'basecamp' | 'overlook' | 'summit-room';
  type TourUrl = `/docent/tour/${string}/${TourSubPath}`;
  const tourUrl = useCallback((path: TourSubPath): TourUrl => `/docent/tour/${tourId}/${path}`, [tourId]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

      {/* Header */}
      <div className="text-primary-bg-grey mt-35 flex flex-col items-center gap-[23px]">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">{t.docent.tour.overview}</h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">{currentTour?.guestName || 'Tour'}</p>
      </div>

      {/* Grid as a whole rotate 45 deg, item text rotate -45 deg */}
      <div className="absolute top-110 left-25 grid rotate-45 grid-cols-2 gap-4">
        {/* Item 1 */}
        <Link
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          href={tourUrl('basecamp')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">{t.docent.tour.basecamp}</p>
        </Link>

        {/* Item 2 */}
        <Link
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          href={tourUrl('overlook')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">{t.docent.tour.overlook}</p>
        </Link>

        {/* Item 3 (manually placed in column 2, row 2) */}
        <Link
          className="bg-primary-bg-grey relative col-start-2 row-start-2 flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          href={tourUrl('summit-room')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">{t.docent.tour.summitRoom}</p>
        </Link>
      </div>
    </div>
  );
};

export default TourOverviewPage;
