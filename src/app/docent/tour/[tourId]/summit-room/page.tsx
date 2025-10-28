"use client";

import { use, useEffect, useRef, useState } from "react";
import { DocentHeader } from "../../../_components/DocentHeader";
import { useDocent } from "../../../_components/DocentProvider";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Image from "next/image";
import { Button } from "@/components/Button";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface SummitRoomPageProps {
  params: Promise<{ tourId: string }>;
}

// Summit Room has 5 slides. First slide has no border, no diamond icon, but has image. Other slides have a border and a diamond icon.
const SUMMIT_ROOM_SLIDES = [
  {
    id: 1,
    title: "Your personalized journey map",
  },
  {
    id: 2,
    title: "What's standing in your way?",
    borderColor: "border-primary-im-light-blue",
  },
  {
    id: 3,
    title: "Slide 3 Content",
    borderColor: "border-secondary-im-purple",
  },
  {
    id: 4,
    title: "Unlock your future",
    borderColor: "border-secondary-im-orange",
  },
  {
    id: 5,
    title: "Stories of impact",
    borderColor: "border-secondary-im-green",
  },
];

export default function SummitRoomPage({ params }: SummitRoomPageProps) {
  const { tourId } = use(params);
  const { currentTour, summitRoomSlideIdx, setSummitRoomSlideIdx } =
    useDocent();

  const [isJourneyMapLaunched, setIsJourneyMapLaunched] = useState(false);
  const currentSlideIdx = summitRoomSlideIdx; // Use provider state
  const setCurrentSlideIdx = setSummitRoomSlideIdx; // Use provider setter

  const swiperRef = useRef<SwiperClass | null>(null); // Create a ref for Swiper instance

  // Sync Swiper with currentSlideIdx
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentSlideIdx);
    }
  }, [currentSlideIdx]);

  const handlePrevious = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
      // TODO: This would send MQTT message to change slide
    }
  };

  const handleNext = () => {
    if (currentSlideIdx < SUMMIT_ROOM_SLIDES.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
      // This would send MQTT message to change slide
    }
  };

  const handleSlideIndicatorClick = (index: number) => {
    setCurrentSlideIdx(index);
    // This would send MQTT message to change slide
  };

  const handleLaunchJourneyMap = () => {
    setIsJourneyMapLaunched(true);
    setCurrentSlideIdx(0); // Go to first slide
    // This would send MQTT message to launch journey map
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <DocentHeader
        leftButton={{
          text: "Back to menu",
          href: `/docent/tour/${tourId}`,
          icon: <FiArrowLeft />,
        }}
      />

      {/* Header */}
      <div className="mt-45 flex flex-col items-center gap-3">
        <h1 className="text-primary-bg-grey text-center text-[60px] leading-[72px] font-normal tracking-[-0.05em]">
          Summit room
        </h1>
        <p className="text-primary-bg-grey text-center text-[28px] leading-[34px] font-normal tracking-[-0.05em]">
          {currentTour?.guestName || "Tour"}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="mt-20 flex items-center justify-center">
        {isJourneyMapLaunched ? (
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={false}
            pagination={false}
            onSwiper={(swiper) => {
              swiperRef.current = swiper; // Store Swiper instance
            }}
            onSlideChange={(swiper) => {
              setCurrentSlideIdx(swiper.activeIndex);
            }}
            initialSlide={currentSlideIdx}
            className="h-[441px] w-[746px]" // Make the area bigger so the box shadow is visible? Is there a better way than this?
            allowTouchMove={true}
            keyboard={{
              enabled: true,
            }}
          >
            {SUMMIT_ROOM_SLIDES.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="bg-primary-bg-grey relative ml-5 flex h-[391px] w-[696px] flex-col items-center justify-center rounded-[20px] shadow-[20px_20px_20px_0px_rgba(94,94,94,0.25)]">
                  {slide.id === 1 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                      <h2 className="text-center text-[32px] leading-[38px] font-normal tracking-[-0.05em] text-black">
                        {slide.title}
                      </h2>
                      <Image
                        src="/images/summit-root-diamonds-bg.svg"
                        alt="Journey Map Image"
                        width={208}
                        height={187}
                        className="absolute right-0 bottom-0"
                      />
                    </div>
                  ) : (
                    <div
                      className={`${slide.borderColor} flex items-center gap-3 rounded-full border-4 p-10 px-6 py-7`}
                    >
                      <div
                        className={`${slide.borderColor} h-5.5 w-5.5 rotate-45 border`}
                      ></div>
                      <h2 className="text-[32px] leading-[38px] font-normal tracking-[-0.05em] text-black">
                        {slide.title}
                      </h2>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative mt-50 flex">
            <div className="border-primary-im-light-blue absolute top-1/2 left-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[40px] border-2" />
            <Button onClick={handleLaunchJourneyMap} className="relative">
              <span className="text-primary-im-dark-blue text-[24px] font-normal tracking-[-0.05em]">
                Launch journey map
              </span>
              <FiArrowRight />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom buttons and counter */}
      {isJourneyMapLaunched && (
        <div className="absolute bottom-[105px] left-1/2 flex translate-x-[-50%] flex-col items-center justify-center gap-20">
          {/* Diamond slide indicator */}
          <div className="flex items-center justify-center gap-5">
            {SUMMIT_ROOM_SLIDES.map((_, index) => {
              const slideNumber = index + 1;
              const isActive = index === currentSlideIdx;
              return (
                <button
                  onClick={() => handleSlideIndicatorClick(index)}
                  key={slideNumber}
                  className={`border-primary-bg-grey h-4.75 w-4.75 rotate-45 rounded-[2px] border transition-colors ${
                    isActive ? "bg-primary-bg-grey" : "transparent"
                  }`}
                />
              );
            })}
          </div>

          <div className="flex flex-row items-center justify-center gap-10">
            {/* Previous Button */}
            <Button
              onClick={handlePrevious}
              disabled={currentSlideIdx === 0}
              className="h-[88px] w-[88px] rounded-full"
            >
              <FiArrowLeft />
            </Button>
            {/* Next Button */}
            <Button
              onClick={handleNext}
              disabled={currentSlideIdx === SUMMIT_ROOM_SLIDES.length - 1}
              className="h-[88px] w-[88px] rounded-full"
            >
              <FiArrowRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
