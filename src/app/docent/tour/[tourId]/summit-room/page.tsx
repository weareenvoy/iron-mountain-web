"use client";

import { use, useEffect, useRef } from "react";
import { DocentHeader } from "../../../_components/DocentHeader";
import { useDocent } from "../../../_contexts/DocentProvider";
import { useMqtt } from "@/providers/MqttProvider";
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
    title: "Considering possibilities",
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
  const { client } = useMqtt();
  const {
    currentTour,
    summitRoomSlideIdx,
    setSummitRoomSlideIdx,
    isSummitRoomJourneyMapLaunched,
    setIsSummitRoomJourneyMapLaunched,
  } = useDocent();

  // Local UI state
  const isJourneyMapLaunched = isSummitRoomJourneyMapLaunched;
  const setIsJourneyMapLaunched = setIsSummitRoomJourneyMapLaunched;
  const currentSlideIdx = summitRoomSlideIdx;
  const setCurrentSlideIdx = setSummitRoomSlideIdx;

  const swiperRef = useRef<SwiperClass | null>(null); // Create a ref for Swiper instance

  // Helper to send MQTT command when slide changes
  const sendSummitSlideCommand = (slideIdx: number) => {
    if (!client) return;

    // Generate slide name based on index
    // journey-intro for intro screen (slideIdx 0)
    const slideName = slideIdx === 0 ? "journey-intro" : `journey-${slideIdx}`;

    console.log(`Sending summit goto-beat: ${slideName}`);
    client.gotoBeat("summit", slideName, {
      onSuccess: () => console.log(`Summit: Navigated to ${slideName}`),
      onError: (err) => console.error(`Summit: Failed to navigate:`, err),
    });
  };

  // Sync Swiper with currentSlideIdx
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentSlideIdx);
    }
  }, [currentSlideIdx]);

  const handlePrevious = () => {
    if (currentSlideIdx > 0) {
      const newIdx = currentSlideIdx - 1;
      setCurrentSlideIdx(newIdx);
      // Send MQTT command
      sendSummitSlideCommand(newIdx);
    }
  };

  const handleNext = () => {
    if (currentSlideIdx < SUMMIT_ROOM_SLIDES.length - 1) {
      const newIdx = currentSlideIdx + 1;
      setCurrentSlideIdx(newIdx);
      // Send MQTT command
      sendSummitSlideCommand(newIdx);
    }
  };

  const handleSlideIndicatorClick = (index: number) => {
    setCurrentSlideIdx(index);
    // Send MQTT command
    sendSummitSlideCommand(index);
  };

  const handleLaunchJourneyMap = () => {
    setIsJourneyMapLaunched(true);
    setCurrentSlideIdx(0);
    // Send MQTT command (journey-intro)
    sendSummitSlideCommand(0);
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
      <div className="text-primary-bg-grey mt-35 flex flex-col items-center gap-[23px]">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">
          Summit room
        </h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">
          {currentTour?.guestName || "Tour"}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="mt-46 flex items-center justify-center">
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
              // Send MQTT command
              sendSummitSlideCommand(swiper.activeIndex);
            }}
            initialSlide={currentSlideIdx}
            className="h-[361px] w-[605px]" // Make the area bigger so the box shadow is visible
            allowTouchMove={true}
            keyboard={{
              enabled: true,
            }}
          >
            {SUMMIT_ROOM_SLIDES.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="bg-primary-bg-grey relative ml-5 flex h-[313px] w-[557px] flex-col items-center justify-center rounded-[16px] shadow-[16px_16px_16px_0px_rgba(94,94,94,0.25)]">
                  {slide.id === 1 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                      <h2 className="text-center text-2xl leading-[normal] tracking-[-1.2px] text-black">
                        {slide.title}
                      </h2>
                      <Image
                        src="/images/summit-root-diamonds-bg.svg"
                        alt="Journey Map Image"
                        width={177}
                        height={159}
                        className="absolute right-0 bottom-0"
                      />
                    </div>
                  ) : (
                    <div
                      className={`${slide.borderColor} flex items-center gap-5 rounded-full border-2 px-8 py-5`}
                    >
                      <div
                        className={`${slide.borderColor} h-4.25 w-4.25 rotate-45 border`}
                      ></div>
                      <h2 className="text-xl leading-[normal] tracking-[-1.2px] text-black">
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
            <div className="border-primary-im-light-blue absolute top-1/2 left-1/2 h-82 w-82 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[40px] border-2" />
            <Button
              onClick={handleLaunchJourneyMap}
              size="sm"
              className="relative h-17.5 w-70"
            >
              <span className="text-primary-im-dark-blue text-xl tracking-[-0.05em]">
                Launch journey map
              </span>
              <FiArrowRight />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom buttons and counter */}
      {isJourneyMapLaunched && (
        <div className="absolute bottom-17.5 left-1/2 flex translate-x-[-50%] flex-col items-center justify-center gap-20">
          {/* Diamond slide indicator */}
          <div className="flex items-center justify-center gap-5">
            {SUMMIT_ROOM_SLIDES.map((_, index) => {
              const slideNumber = index + 1;
              const isActive = index === currentSlideIdx;
              return (
                <button
                  onClick={() => handleSlideIndicatorClick(index)}
                  key={slideNumber}
                  className={`border-primary-bg-grey relative h-5.5 w-5.5 rotate-45 rounded-[2px] border-2 transition-colors ${
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
              className="size-[80px] rounded-full"
            >
              <FiArrowLeft className="size-[36px]" />
            </Button>
            {/* Next Button */}
            <Button
              onClick={handleNext}
              disabled={currentSlideIdx === SUMMIT_ROOM_SLIDES.length - 1}
              className="size-[80px] rounded-full"
            >
              <FiArrowRight className="size-[36px]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
