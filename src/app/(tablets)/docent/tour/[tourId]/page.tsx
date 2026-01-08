'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import Flag from '@/components/ui/icons/Flag';

const TourOverviewPage = ({ params }: PageProps<'/docent/tour/[tourId]'>) => {
  const { tourId } = use(params);
  const router = useRouter();
  const { client } = useMqtt();
  const { currentTour, data } = useDocent();

  const handleEndTour = useCallback(() => {
    if (!client) return;

    // Send end-tour command to all exhibits (broadcast)
    client.endTour({
      onError: (err: Error) => console.error('Failed to end tour:', err),
      onSuccess: () => {
        // Go back to home page
        router.push('/docent');
      },
    });
  }, [client, router]);

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      icon: <Flag className="h-[21px] w-[20px]" />,
      onClick: handleEndTour,
      text: data?.docent.navigation.endTour ?? 'End tour',
    }),
    [handleEndTour, data]
  );

  type TourSubPath = 'basecamp' | 'overlook' | 'summit-room';
  type TourUrl = `/docent/tour/${string}/${TourSubPath}`;
  const tourUrl = useCallback((path: TourSubPath): TourUrl => `/docent/tour/${tourId}/${path}`, [tourId]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

      {/* Header */}
      <div className="text-primary-bg-grey mx-5 mt-40 flex flex-col items-start gap-2 border-b border-[rgba(255,255,255,0.5)] pb-12.5">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">Overview</h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">{currentTour?.guestName || 'Tour'}</p>
      </div>

      {/* Grid as a whole rotate 45 deg, item text rotate -45 deg */}
      <div className="absolute top-120 left-25 grid rotate-45 grid-cols-2 gap-4">
        {/* Item 1 */}
        <Link
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          href={tourUrl('basecamp')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl tracking-[-1.2px]">Basecamp</p>
        </Link>

        {/* Item 2 */}
        <Link
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          href={tourUrl('overlook')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl tracking-[-1.2px]">Overlook</p>
        </Link>

        {/* Item 3 (manually placed in column 2, row 2) */}
        <Link
          className="bg-primary-bg-grey relative col-start-2 row-start-2 flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
          href={tourUrl('summit-room')}
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl tracking-[-1.2px]">Summit Room</p>
        </Link>
      </div>
    </div>
  );
};

export default TourOverviewPage;
