'use client';

import { ArrowLeft, ArrowRight, House, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type MouseEventHandler } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { useDocentTranslation } from '@/hooks/use-docent-translation';
import { cn } from '@/lib/tailwind/utils/cn';
import type { Tour } from '@/lib/internal/types';

interface TourByDate {
  readonly dayOfWeek: string;
  readonly tours: Tour[];
}

const SchedulePageClient = () => {
  const { t } = useDocentTranslation();
  const router = useRouter();
  const { client } = useMqtt();
  const { data, isConnected, isTourDataLoading, refreshData, setCurrentTour } = useDocent();

  const [selectedTourId, setSelectedTourId] = useState<null | string>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const toursByDate = useMemo<Record<string, TourByDate>>(() => {
    const allTours = data?.tours ?? [];

    if (allTours.length === 0) {
      return {};
    }

    return allTours.reduce(
      (acc, tour) => {
        // Parse date string as local date
        const [yearStr, monthStr, dayStr] = tour.date.split('-');
        const year = Number.parseInt(yearStr ?? '', 10);
        const month = Number.parseInt(monthStr ?? '', 10);
        const day = Number.parseInt(dayStr ?? '', 10);

        if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
          return acc;
        }

        const tourDate = new Date(year, month - 1, day); // month is 0-indexed
        const date = tourDate.toDateString();
        const dayOfWeek = tourDate.toLocaleDateString('en-US', {
          weekday: 'long',
        });

        // Group tours by date, and also save a dayOfWeek to use for display later.
        const group = (acc[date] ??= { dayOfWeek, tours: [] });
        group.tours.push(tour);

        // sort tours by startTime
        group.tours.sort((a, b) => {
          const startTimeA = new Date(`${tour.date} ${a.startTime}`);
          const startTimeB = new Date(`${tour.date} ${b.startTime}`);
          return startTimeA.getTime() - startTimeB.getTime();
        });

        return acc;
      },
      {} as Record<string, TourByDate>
    );
  }, [data?.tours]);

  // For the 4 buttons in header
  const handlePreviousMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonthDate(new Date());
  };

  const handleTourSelect = (tourId: string) => () => {
    setSelectedTourId(tourId);
  };

  const handleLoadTour = (tourId: string) => {
    const tour = Object.values(toursByDate)
      .flatMap(group => group.tours)
      .find(t => t.id === tourId);

    if (tour && client) {
      setCurrentTour(tour); // Update context

      // Send load-tour command to GEC
      client.loadTour(tourId, {
        onError: (err: Error) => {
          console.error('Failed to send load-tour command:', err);
          // Still navigate even if MQTT fails
          router.push(`/docent/tour/${tourId}`);
        },
        onSuccess: () => {
          router.push(`/docent/tour/${tourId}`);
        },
      });
    }
  };

  const formatScheduleDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
    });
  };

  const handleLoadButtonClick =
    (tourId: string): MouseEventHandler<HTMLButtonElement> =>
    event => {
      event.stopPropagation();
      handleLoadTour(tourId);
    };

  const filteredTours = useMemo(() => {
    return Object.entries(toursByDate).filter(([date]) => {
      const tourDate = new Date(date);
      return (
        tourDate.getMonth() === currentMonthDate.getMonth() && tourDate.getFullYear() === currentMonthDate.getFullYear()
      );
    });
  }, [toursByDate, currentMonthDate]);

  const currentMonthLabel = useMemo(() => {
    return currentMonthDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonthDate]);

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      href: '/docent',
      icon: <House className="size-[20px]" />,
      text: t.docent.navigation.backToHome,
    }),
    [t]
  );

  if (!isConnected) {
    return <div>{t.connection.connecting}</div>;
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Navigation */}
      <Header leftButton={leftButton} />
      <div className="flex h-full w-full flex-col justify-between">
        {/* Header */}
<<<<<<< HEAD
        <h1 className="text-primary-bg-grey mt-40 pl-5 text-3xl leading-loose tracking-[-1.8px]">
          {t.docent.schedule.title}
        </h1>
=======
        <h1 className="text-primary-bg-grey mt-40 pl-5 text-3xl leading-loose tracking-[-1.8px]">EBC schedule</h1>
>>>>>>> main
        <div className="bg-primary-bg-grey relative flex w-full flex-col gap-[87px] rounded-t-[20px] px-6 py-11">
          <div className="text-primary-im-dark-blue flex items-center justify-between">
            <Button
              className="border-primary-im-dark-blue text-primary-im-dark-blue h-13 min-w-24.5 text-xl leading-[1.4] tracking-[-1px]"
              onClick={handleToday}
              size="sm"
              variant="outline"
            >
              {t.docent.actions.today}
            </Button>
            <div className="flex items-center gap-7">
              <button className="active:opacity-50" onClick={handlePreviousMonth}>
                <ArrowLeft className="size-[24px]" />
              </button>

              {/* Month and year */}
              <span className="text-primary-im-dark-blue text-[28px] leading-[1.2] tracking-[-1.4px]">
                {currentMonthLabel}
              </span>

              <button className="active:opacity-50" onClick={handleNextMonth}>
                <ArrowRight className="size-[24px]" />
              </button>
            </div>
            <button className="active:opacity-50" onClick={refreshData}>
              <RotateCw className="size-[24px]" />
            </button>
          </div>

          {/* Tours list */}
          <div className="h-[624px] space-y-0 overflow-y-auto">
            {isTourDataLoading ? (
              <div>{t.docent.schedule.loading}</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-primary-im-dark-blue">{t.docent.schedule.noTours}</div>
            ) : (
              filteredTours.map(([date, { dayOfWeek, tours }]) => (
                <div className="flex flex-col gap-5 border-t border-[#C9C9C9] py-5" key={date}>
                  {/* Day of week and date */}
                  <p className="text-primary-im-mid-blue ml-7.5 text-[18px] leading-loose">
                    <span>{dayOfWeek}, </span>
                    <span className="text-primary-im-dark-blue">{formatScheduleDate(date)}</span>
                  </p>

                  {/* Tours for the date */}
                  <div className="flex-1">
                    {tours.map(tour => {
                      const isSelected = selectedTourId === tour.id;
                      return (
                        <div
                          className={cn(
                            'flex h-[100px] cursor-pointer items-center rounded-[14px] px-3 transition-colors',
                            isSelected ? 'bg-white' : ''
                          )}
                          key={tour.id}
                          onClick={handleTourSelect(tour.id)}
                        >
                          <div className="flex flex-1 items-center gap-6">
                            <div className="flex items-center gap-0">
                              <span
                                className={cn(
                                  'w-[117px] text-center text-xl leading-[1.2] tracking-[-0.8px]',
                                  isSelected ? 'font-normal' : 'font-light',
                                  isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'
                                )}
                              >
                                {tour.startTime}
                              </span>
                              <span
                                className={cn(
                                  'text-[23px] leading-[1.2]',
                                  isSelected ? 'font-normal' : 'font-light',
                                  isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'
                                )}
                              >
                                -
                              </span>
                              <span
                                className={cn(
                                  'w-[117px] text-center text-xl leading-[1.2] tracking-[-0.8px]',
                                  isSelected ? 'font-normal' : 'font-light',
                                  isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'
                                )}
                              >
                                {tour.endTime}
                              </span>
                            </div>
                            <span
                              className={cn(
                                'w-[228px] text-xl leading-[1.2] tracking-[-0.8px]',
                                isSelected ? 'font-normal' : 'font-light',
                                isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'
                              )}
                            >
                              {tour.guestName}
                            </span>
                          </div>
                          {isSelected && (
                            <Button
                              className="h-[52px] w-[97px] text-xl tracking-[-1px]"
                              onClick={handleLoadButtonClick(tour.id)}
                              size="sm"
                              variant="secondary"
                            >
                              {t.docent.actions.load}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePageClient;
