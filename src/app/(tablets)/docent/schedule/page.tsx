'use client';

import { ArrowLeft, ArrowRight, House, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import Header from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { Button } from '@/components/shadcn/button';
import type { Tour } from '@/app/(tablets)/docent/_types';

interface TourByDate {
  dayOfWeek: string;
  tours: Tour[];
}

export default function SchedulePage() {
  const router = useRouter();
  const { client } = useMqtt();
  const { allTours, isConnected, isTourDataLoading, refreshTours, setCurrentTour } = useDocent();
  const [selectedTourId, setSelectedTourId] = useState<null | string>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [toursByDate, setToursByDate] = useState<Record<string, TourByDate>>({});

  useEffect(() => {
    if (allTours.length > 0) {
      const groupedTours = allTours.reduce(
        (acc, tour) => {
          // Parse date string as local date
          const [year, month, day] = tour.date.split('-').map(Number);
          const tourDate = new Date(year, month - 1, day); // month is 0-indexed
          const date = tourDate.toDateString();
          const dayOfWeek = tourDate.toLocaleDateString('en-US', {
            weekday: 'long',
          });

          // Group tours by date, and also save a dayOfWeek to use for display later.
          if (!acc[date]) {
            acc[date] = { dayOfWeek: dayOfWeek, tours: [] };
          }
          acc[date].tours.push(tour);
          // sort tours by startTime
          acc[date].tours.sort((a, b) => {
            const startTimeA = new Date(`${tour.date} ${a.startTime}`);
            const startTimeB = new Date(`${tour.date} ${b.startTime}`);
            return startTimeA.getTime() - startTimeB.getTime();
          });
          return acc;
        },
        {} as Record<string, TourByDate>
      );
      setToursByDate(groupedTours);
    } else {
      setToursByDate({});
    }
  }, [allTours]);

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

  const handleTourSelect = (tourId: string) => {
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

  const filteredTours = Object.entries(toursByDate).filter(([date]) => {
    const tourDate = new Date(date);
    return (
      tourDate.getMonth() === currentMonthDate.getMonth() && tourDate.getFullYear() === currentMonthDate.getFullYear()
    );
  });

  if (!isConnected) {
    return <div>Connecting to MQTT...</div>;
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Navigation */}
      <Header
        leftButton={{
          href: '/docent',
          icon: <House />,
          text: 'Back to home',
        }}
      />
      <div className="flex h-full w-full flex-col justify-between">
        {/* Header */}
        <h1 className="text-primary-bg-grey mt-35 pl-5 text-4xl leading-loose tracking-[-1.8px]">EBC schedule</h1>
        <div className="bg-primary-bg-grey relative flex w-full flex-col gap-[87px] rounded-t-[20px] px-6 py-11">
          <div className="text-primary-im-dark-blue flex items-center justify-between">
            <Button
              className="border-primary-im-dark-blue text-primary-im-dark-blue h-13 w-24.5 text-xl leading-[1.4] tracking-[-1px]"
              onClick={handleToday}
              size="sm"
              variant="outline"
            >
              Today
            </Button>
            <div className="flex items-center gap-7">
              <button className="active:opacity-50" onClick={handlePreviousMonth}>
                <ArrowLeft className="size-[24px]" />
              </button>

              {/* Month and year */}
              <span className="text-primary-im-dark-blue text-[28px] leading-[1.2] tracking-[-1.4px]">
                {currentMonthDate.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>

              <button className="active:opacity-50" onClick={handleNextMonth}>
                <ArrowRight className="size-[24px]" />
              </button>
            </div>
            <button className="active:opacity-50" onClick={refreshTours}>
              <RotateCw className="size-[24px]" />
            </button>
          </div>

          {/* Tours list */}
          <div className="h-[624px] space-y-0 overflow-y-auto">
            {isTourDataLoading ? (
              <div>Loading...</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-primary-im-dark-blue">No tours available for this month.</div>
            ) : (
              filteredTours.map(([date, { dayOfWeek, tours }]) => (
                <div className="flex flex-col border-t border-[#C9C9C9] py-5" key={date}>
                  {/* Day of week and date */}
                  <p className="text-primary-im-mid-blue ml-7.5 text-[18px] leading-loose">
                    <span>{dayOfWeek}, </span>
                    <span className="text-primary-im-dark-blue">
                      {new Date(date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </p>

                  {/* Tours for the date */}
                  <div className="flex-1">
                    {tours.map(tour => {
                      const isSelected = selectedTourId === tour.id;
                      return (
                        <div
                          className={`flex h-[100px] cursor-pointer items-center rounded-[14px] px-3 transition-colors ${
                            isSelected ? 'bg-white' : ''
                          }`}
                          key={tour.id}
                          onClick={() => handleTourSelect(tour.id)}
                        >
                          <div className="flex flex-1 items-center gap-6">
                            <div className="flex items-center gap-0">
                              <span
                                className={`w-[117px] text-center text-xl leading-[1.2] tracking-[-0.8px] ${
                                  isSelected ? 'font-normal' : 'font-light'
                                } ${isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'}`}
                              >
                                {tour.startTime}
                              </span>
                              <span
                                className={`text-[23px] leading-[1.2] ${
                                  isSelected ? 'font-normal' : 'font-light'
                                } ${isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'}`}
                              >
                                -
                              </span>
                              <span
                                className={`w-[117px] text-center text-xl leading-[1.2] tracking-[-0.8px] ${
                                  isSelected ? 'font-normal' : 'font-light'
                                } ${isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'}`}
                              >
                                {tour.endTime}
                              </span>
                            </div>
                            <span
                              className={`w-[228px] text-xl leading-[1.2] tracking-[-0.8px] ${
                                isSelected ? 'font-normal' : 'font-light'
                              } ${isSelected ? 'text-primary-im-dark-blue' : 'text-primary-im-grey'}`}
                            >
                              {tour.guestName}
                            </span>
                          </div>
                          {isSelected && (
                            <Button
                              className="h-[52px] w-[97px] text-xl tracking-[-1px]"
                              onClick={e => {
                                e.stopPropagation();
                                handleLoadTour(tour.id);
                              }}
                              size="sm"
                              variant="secondary"
                            >
                              Load
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
}
