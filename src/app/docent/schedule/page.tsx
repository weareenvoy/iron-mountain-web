"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocentHeader } from "../_components/DocentHeader";
import { useDocent } from "../_contexts/DocentProvider";
import { useMqtt } from "@/providers/MqttProvider";
import { FiHome, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { GrRefresh } from "react-icons/gr";
import { Button } from "@/components/Button";
import { Tour } from "@/types";

interface TourByDate {
  dayOfWeek: string;
  tours: Tour[];
}

export default function SchedulePage() {
  const router = useRouter();
  const { client } = useMqtt();
  const {
    allTours,
    isTourDataLoading,
    isConnected,
    refreshTours,
    setCurrentTour,
  } = useDocent();
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [toursByDate, setToursByDate] = useState<Record<string, TourByDate>>(
    {},
  );

  useEffect(() => {
    if (allTours.length > 0) {
      const groupedTours = allTours.reduce(
        (acc, tour) => {
          // Parse date string as local date
          const [year, month, day] = tour.date.split("-").map(Number);
          const tourDate = new Date(year, month - 1, day); // month is 0-indexed
          const date = tourDate.toDateString();
          const dayOfWeek = tourDate.toLocaleDateString("en-US", {
            weekday: "long",
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
        {} as Record<string, TourByDate>,
      );
      setToursByDate(groupedTours);
    } else {
      setToursByDate({});
    }
  }, [allTours]);

  // For the 4 buttons in header
  const handlePreviousMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1),
    );
  };

  const handleToday = () => {
    setCurrentMonthDate(new Date());
  };

  const handleTourSelect = (tourId: string) => {
    setSelectedTourId(tourId);
  };

  const handleLoadTour = (tourId: string) => {
    const tour = Object.values(toursByDate)
      .flatMap((group) => group.tours)
      .find((t) => t.id === tourId);
    if (tour && client) {
      setCurrentTour(tour); // Update context

      // Send load-tour command to GEC
      client.loadTour(tourId, {
        onSuccess: () => {
          console.log("Successfully sent load-tour command to GEC");
          router.push(`/docent/tour/${tourId}`);
        },
        onError: (err) => {
          console.error("Failed to send load-tour command:", err);
          // Still navigate even if MQTT fails
          router.push(`/docent/tour/${tourId}`);
        },
      });
    }
  };

  const filteredTours = Object.entries(toursByDate).filter(([date]) => {
    const tourDate = new Date(date);
    return (
      tourDate.getMonth() === currentMonthDate.getMonth() &&
      tourDate.getFullYear() === currentMonthDate.getFullYear()
    );
  });

  if (!isConnected) {
    return <div>Connecting to MQTT...</div>;
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* Navigation */}
      <DocentHeader
        leftButton={{
          text: "Back to home",
          href: "/docent",
          icon: <FiHome />,
        }}
      />
      <div className="flex h-full w-full flex-col justify-between">
        {/* Header */}
        <h1 className="text-primary-bg-grey mt-35 pl-5 text-4xl leading-loose tracking-[-1.8px]">
          EBC schedule
        </h1>
        <div className="bg-primary-bg-grey relative flex w-full flex-col gap-[87px] rounded-t-[20px] px-6 py-11">
          <div className="text-primary-im-dark-blue flex items-center justify-between">
            <Button
              onClick={handleToday}
              variant="outline"
              size="sm"
              className="border-primary-im-dark-blue text-primary-im-dark-blue h-13 w-24.5 text-xl leading-[1.4] tracking-[-1px]"
            >
              Today
            </Button>
            <div className="flex items-center gap-7">
              <button
                onClick={handlePreviousMonth}
                className="active:opacity-50"
              >
                <FiArrowLeft size={24} />
              </button>

              {/* Month and year */}
              <span className="text-primary-im-dark-blue text-[28px] leading-[1.2] tracking-[-1.4px]">
                {currentMonthDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button onClick={handleNextMonth} className="active:opacity-50">
                <FiArrowRight size={24} />
              </button>
            </div>
            <button onClick={refreshTours} className="active:opacity-50">
              <GrRefresh size={24} />
            </button>
          </div>

          {/* Tours list */}
          <div className="h-[624px] space-y-0 overflow-y-auto">
            {isTourDataLoading ? (
              <div>Loading...</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-primary-im-dark-blue">
                No tours available for this month.
              </div>
            ) : (
              filteredTours.map(([date, { dayOfWeek, tours }]) => (
                <div
                  key={date}
                  className="flex flex-col border-t border-[#C9C9C9] py-5"
                >
                  {/* Day of week and date */}
                  <p className="text-primary-im-mid-blue ml-7.5 text-[18px] leading-loose">
                    <span>{dayOfWeek}, </span>
                    <span className="text-primary-im-dark-blue">
                      {new Date(date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </p>

                  {/* Tours for the date */}
                  <div className="flex-1">
                    {tours.map((tour) => {
                      const isSelected = selectedTourId === tour.id;
                      return (
                        <div
                          key={tour.id}
                          onClick={() => handleTourSelect(tour.id)}
                          className={`flex h-[100px] cursor-pointer items-center rounded-[14px] px-3 transition-colors ${
                            isSelected ? "bg-white" : ""
                          }`}
                        >
                          <div className="flex flex-1 items-center gap-6">
                            <div className="flex items-center gap-0">
                              <span
                                className={`w-[117px] text-center text-xl leading-[1.2] tracking-[-0.8px] ${
                                  isSelected ? "font-normal" : "font-light"
                                } ${isSelected ? "text-primary-im-dark-blue" : "text-primary-im-grey"}`}
                              >
                                {tour.startTime}
                              </span>
                              <span
                                className={`text-[23px] leading-[1.2] ${
                                  isSelected ? "font-normal" : "font-light"
                                } ${isSelected ? "text-primary-im-dark-blue" : "text-primary-im-grey"}`}
                              >
                                -
                              </span>
                              <span
                                className={`w-[117px] text-center text-xl leading-[1.2] tracking-[-0.8px] ${
                                  isSelected ? "font-normal" : "font-light"
                                } ${isSelected ? "text-primary-im-dark-blue" : "text-primary-im-grey"}`}
                              >
                                {tour.endTime}
                              </span>
                            </div>
                            <span
                              className={`w-[228px] text-xl leading-[1.2] tracking-[-0.8px] ${
                                isSelected ? "font-normal" : "font-light"
                              } ${isSelected ? "text-primary-im-dark-blue" : "text-primary-im-grey"}`}
                            >
                              {tour.guestName}
                            </span>
                          </div>
                          {isSelected && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadTour(tour.id);
                              }}
                              className="h-[52px] w-[97px] text-xl tracking-[-1px]"
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
