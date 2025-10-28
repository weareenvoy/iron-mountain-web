"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DocentHeader } from "../_components/DocentHeader";
import { useDocent } from "../_components/DocentProvider";
import { FiHome, FiArrowLeft, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/Button";
import { Tour } from "@/types";

interface TourByDate {
  dayOfWeek: string;
  tours: Tour[];
}

export default function SchedulePage() {
  const router = useRouter();
  const { allTours, isLoading, isConnected, refreshTours, setCurrentTour } =
    useDocent();
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

  // TODO Will need to send the selected tour data to GEC?
  const handleLoadTour = (tourId: string) => {
    const tour = Object.values(toursByDate)
      .flatMap((group) => group.tours)
      .find((t) => t.id === tourId);
    if (tour) {
      setCurrentTour(tour); // Update context
      router.push(`/docent/tour/${tourId}`);
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
      <div className="flex h-full w-full flex-col justify-between px-10 py-11.5">
        {/* Header */}
        <h1 className="text-primary-bg-grey mt-38 text-6xl leading-[62px] font-normal tracking-[-0.05em]">
          EBC Schedule
        </h1>
        <div className="bg-primary-bg-grey relative flex w-full flex-col gap-30 rounded-[40px] p-11">
          <div className="text-primary-im-dark-blue flex items-center justify-between">
            <Button
              onClick={handleToday}
              variant="outline"
              className="border-primary-im-dark-blue text-primary-im-dark-blue h-17.5 w-26 text-[20px]"
            >
              Today
            </Button>
            <button onClick={handlePreviousMonth} className="active:opacity-50">
              <FiArrowLeft size={24} />
            </button>

            {/* Month and year */}
            <span className="text-primary-im-dark-blue w-55 text-[36px] leading-[43px] font-normal tracking-[-0.05em]">
              {currentMonthDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>

            <button onClick={handleNextMonth} className="active:opacity-50">
              <FiArrowRight size={24} />
            </button>
            <button onClick={refreshTours} className="active:opacity-50">
              <FiRefreshCw size={24} />
            </button>
          </div>

          {/* Tours list */}
          <div className="h-[550px] space-y-0 overflow-y-auto">
            {isLoading ? (
              <div>Loading...</div>
            ) : filteredTours.length === 0 ? (
              <div className="text-primary-im-dark-blue">
                No tours available for this month.
              </div>
            ) : (
              filteredTours.map(([date, { dayOfWeek, tours }]) => (
                <div key={date} className="flex border-t border-[#C9C9C9]">
                  <div className="flex w-[161px] flex-col gap-1 py-10">
                    <span className="text-primary-im-dark-blue text-[18px] leading-[22px] font-normal">
                      {new Date(date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="text-primary-im-mid-blue text-[18px] leading-[22px] font-normal">
                      {dayOfWeek}
                    </span>
                  </div>
                  <div className="flex-1">
                    {tours.map((tour) => {
                      const isSelected = selectedTourId === tour.id;
                      return (
                        <div
                          key={tour.id}
                          onClick={() => handleTourSelect(tour.id)}
                          className={`flex h-[100px] cursor-pointer items-center rounded-[20px] px-5 transition-colors ${
                            isSelected ? "bg-white" : ""
                          }`}
                        >
                          <div className="flex flex-1 items-center gap-5">
                            <div className="flex items-center gap-0">
                              <span
                                className={`w-[100px] text-center text-[18px] leading-[22px] ${
                                  isSelected ? "font-normal" : "font-light"
                                } ${isSelected ? "text-primary-im-dark-blue" : "text-black"}`}
                              >
                                {tour.startTime}
                              </span>
                              <span
                                className={`text-[18px] leading-[22px] ${
                                  isSelected ? "font-normal" : "font-light"
                                } ${isSelected ? "text-primary-im-dark-blue" : "text-black"}`}
                              >
                                -
                              </span>
                              <span
                                className={`w-[100px] text-center text-[18px] leading-[22px] ${
                                  isSelected ? "font-normal" : "font-light"
                                } ${isSelected ? "text-primary-im-dark-blue" : "text-black"}`}
                              >
                                {tour.endTime}
                              </span>
                            </div>
                            <span
                              className={`text-[18px] leading-[22px] ${
                                isSelected ? "font-normal" : "font-light"
                              } ${isSelected ? "text-primary-im-dark-blue" : "text-black"}`}
                            >
                              {tour.guestName}
                            </span>
                          </div>
                          {isSelected && (
                            <Button
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadTour(tour.id);
                              }}
                              className="h-15 w-21 text-[20px]"
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
