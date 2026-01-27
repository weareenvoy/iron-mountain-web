'use client';

import { ArrowLeft, ArrowRight, House, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState, type MouseEventHandler } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { cn } from '@/lib/tailwind/utils/cn';
import { formatUTCDayOfWeek, formatUTCTourDisplayDate, getUTCTourDateKey } from '@/lib/utils/iso-date';
import type { ApiTour } from '@/lib/internal/types';

interface TourByDate {
  readonly dayOfWeek: string;
  readonly tours: ApiTour[];
}

// Format time from "HH:MM:SS.ssssss" to "HH:MM AM/PM"
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = Number.parseInt(hours ?? '0', 10);
  const minute = minutes ?? '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};

const SchedulePageClient = () => {
  const router = useRouter();
  const { client } = useMqtt();
  const { data, isConnected, isTourDataLoading, refreshData, tours } = useDocent();

  const [selectedTourId, setSelectedTourId] = useState<null | string>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const toursByDate = useMemo<Record<string, TourByDate>>(() => {
    if (tours.length === 0) {
      return {};
    }

    return tours.reduce(
      (acc, tour) => {
        // Parse ISO datetime string
        const dateKey = getUTCTourDateKey(tour.date);
        if (!dateKey) {
          return acc;
        }

        const dayOfWeek = formatUTCDayOfWeek(tour.date);

        // Group tours by date, and also save a dayOfWeek to use for display later.
        const group = (acc[dateKey] ??= { dayOfWeek, tours: [] });
        group.tours.push(tour);

        // sort tours by time
        group.tours.sort((a, b) => {
          // Compare time strings directly (HH:MM:SS format sorts correctly)
          return a.time.localeCompare(b.time);
        });

        return acc;
      },
      {} as Record<string, TourByDate>
    );
  }, [tours]);

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
    if (!client) return;

    // Send load-tour command to GEC
    // Navigation is handled by the docent provider when GEC confirms the tour-id
    client.loadTour(tourId, {
      onError: (err: Error) => {
        console.error('Failed to send load-tour command:', err);
      },
    });
  };

  const handleLoadButtonClick =
    (tourId: string): MouseEventHandler<HTMLButtonElement> =>
    event => {
      event.stopPropagation();
      handleLoadTour(tourId);
    };

  const filteredTours = useMemo(() => {
    return Object.entries(toursByDate).filter(([dateKey]) => {
      const [yearStr, monthStr] = dateKey.split('-');
      const year = Number(yearStr);
      const month = Number(monthStr);

      if (Number.isNaN(year) || Number.isNaN(month)) {
        return false;
      }

      return year === currentMonthDate.getFullYear() && month - 1 === currentMonthDate.getMonth();
    });
  }, [toursByDate, currentMonthDate]);

  const currentMonthLabel = useMemo(() => {
    return currentMonthDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonthDate]);

  const handleBackToHome = useCallback(() => {
    router.push('/docent');
  }, [router]);

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      icon: <House className="size-[20px]" />,
      onClick: handleBackToHome,
      text: data?.docent.navigation.backToHome ?? 'Back to home',
    }),
    [data, handleBackToHome]
  );

  if (!isConnected) {
    return <div>{data?.connection.connecting ?? 'Connecting to MQTT...'}</div>;
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Navigation */}
      <Header leftButton={leftButton} />
      <div className="flex h-full w-full flex-col justify-between">
        {/* Header */}
        <h1 className="text-primary-bg-grey mt-40 pl-5 text-3xl leading-loose tracking-[-1.8px]">
          {data?.docent.schedule.title ?? 'EBC schedule'}
        </h1>
        <div className="bg-primary-bg-grey relative flex w-full flex-col gap-[87px] rounded-t-[20px] px-6 py-11">
          <div className="text-primary-im-dark-blue relative flex items-center justify-between">
            <Button
              className="border-primary-im-dark-blue text-primary-im-dark-blue h-13 min-w-24.5 text-xl leading-snug tracking-[-1px]"
              onClick={handleToday}
              size="sm"
              variant="outline"
            >
              {data?.docent.actions.today ?? 'Today'}
            </Button>
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-7">
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
              <div>{data?.docent.schedule.loading ?? 'Loading...'}</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-primary-im-dark-blue">
                {data?.docent.schedule.noTours ?? 'No tours available for this month.'}
              </div>
            ) : (
              filteredTours.map(([date, { dayOfWeek, tours: toursForDate }]) => (
                <div className="flex flex-col gap-5 border-t border-[#C9C9C9] py-5" key={date}>
                  {/* Day of week and date */}
                  <p className="text-primary-im-mid-blue ml-7.5 text-[18px] leading-loose">
                    <span>{dayOfWeek}, </span>
                    <span className="text-primary-im-dark-blue">{formatUTCTourDisplayDate(date)}</span>
                  </p>

                  {/* Tours for the date */}
                  <div className="flex-1">
                    {toursForDate.map(tour => {
                      const tourIdStr = String(tour.id);
                      const isSelected = selectedTourId === tourIdStr;
                      return (
                        <div
                          className={cn(
                            'flex h-[100px] cursor-pointer items-center rounded-[14px] pr-6 pl-3 transition-colors',
                            isSelected ? 'bg-white' : ''
                          )}
                          key={tour.id}
                          onClick={handleTourSelect(tourIdStr)}
                        >
                          <div className="flex flex-1 items-center gap-6">
                            {/* Time display - only start time now */}
                            <span
                              className={cn(
                                'w-[150px] text-center text-xl leading-[1.2] tracking-[-0.8px]',
                                isSelected ? 'font-normal' : 'font-light',
                                isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'
                              )}
                            >
                              {formatTime(tour.time)}
                            </span>
                            {/* Tour name */}
                            <span
                              className={cn(
                                'flex-1 text-xl leading-[1.2] tracking-[-0.8px]',
                                isSelected ? 'font-normal' : 'font-light',
                                isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'
                              )}
                            >
                              {tour.name}
                            </span>
                          </div>
                          {isSelected && (
                            <Button
                              className="h-[52px] w-[97px] text-xl leading-snug tracking-[-1px]"
                              onClick={handleLoadButtonClick(tourIdStr)}
                              size="sm"
                              variant="secondary"
                            >
                              {data?.docent.actions.load ?? 'Load'}
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
