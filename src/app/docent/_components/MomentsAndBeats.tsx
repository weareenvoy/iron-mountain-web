"use client";

import { useEffect, useState } from "react";
import { DocentHeader } from "./DocentHeader";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPauseCircle,
  FiPlayCircle,
} from "react-icons/fi";
import { Moment } from "@/types";
import { Button } from "@/components/Button";
import { useDocent } from "./DocentProvider";
import { useMqtt } from "@/providers/MqttProvider";

interface MomentsAndBeatsProps {
  tourId: string;
  title: string; // e.g., "Basecamp", "Overlook"
  content: Moment[]; // hardcoded data
}

export function MomentsAndBeats({
  tourId,
  title,
  content,
}: MomentsAndBeatsProps) {
  const {
    currentTour,
    basecampMomentIdx,
    basecampBeatIdx,
    overlookMomentIdx,
    overlookBeatIdx,
    setBasecampMomentIdx,
    setBasecampBeatIdx,
    setOverlookMomentIdx,
    setOverlookBeatIdx,
  } = useDocent();
  const { client } = useMqtt();

  // Determine which state to use based on current route
  const isBasecamp = window.location.pathname.includes("basecamp");
  // TODO: Same question as in docentProvider. Should they be from DocentProvider, or from a state sent from GEC.
  const currentMomentIdx = isBasecamp ? basecampMomentIdx : overlookMomentIdx;
  const currentBeatIdx = isBasecamp ? basecampBeatIdx : overlookBeatIdx;
  const setCurrentMomentIdx = isBasecamp
    ? setBasecampMomentIdx
    : setOverlookMomentIdx;
  const setCurrentBeatIdx = isBasecamp
    ? setBasecampBeatIdx
    : setOverlookBeatIdx;

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const publishNavigation = (momentIdx: number, beatIdx: number) => {
    if (!client) return;

    const currentMoment = content[momentIdx];
    // On .../overlook route, publish what's clicked to overlook.
    const topic = window.location.pathname.includes("basecamp")
      ? "basecamp/navigation"
      : "overlook/navigation";

    const message = {
      momentId: currentMoment.id, // bullet point ID e.g., "ambient", "welcome"
      beatIdx: beatIdx,
      tourId,
      timestamp: Date.now(),
    };

    client.publish(topic, JSON.stringify(message), {
      onError: (err) => {
        console.error("Failed to publish navigation:", err);
      },
      onSuccess: () => {
        console.log("Published navigation:", message);
      },
    });
  };

  // Go to next beat, if it's the last beat, go to the next bullet point.
  const handlePrevious = () => {
    // TODO: Send MQTT message.
    if (currentBeatIdx > 0) {
      const newBeatIdx = currentBeatIdx - 1;
      setCurrentBeatIdx(newBeatIdx);
      publishNavigation(currentMomentIdx, newBeatIdx);
    } else if (currentBeatIdx === 0) {
      if (currentMomentIdx > 0) {
        const newBulletPointIdx = currentMomentIdx - 1;
        const newBeatIdx = content[newBulletPointIdx].beatCount - 1;
        setCurrentMomentIdx(newBulletPointIdx);
        setCurrentBeatIdx(newBeatIdx);
        publishNavigation(newBulletPointIdx, newBeatIdx);
      }
    }
  };

  // Go to previous beat, if it's the first beat, go to the previous bullet point.
  const handleNext = () => {
    // Send MQTT message.
    if (currentBeatIdx < content[currentMomentIdx].beatCount - 1) {
      const newBeatIdx = currentBeatIdx + 1;
      setCurrentBeatIdx(newBeatIdx);
      publishNavigation(currentMomentIdx, newBeatIdx);
    } else if (currentBeatIdx === content[currentMomentIdx].beatCount - 1) {
      if (currentMomentIdx < content.length - 1) {
        const newBulletPointIdx = currentMomentIdx + 1;
        setCurrentMomentIdx(newBulletPointIdx);
        setCurrentBeatIdx(0);
        publishNavigation(newBulletPointIdx, 0);
      }
    }
  };

  // Click on a left hand side bullet point.
  const handleBulletPointClick = (momentIdx: number) => {
    // Send MQTT message.
    setCurrentMomentIdx(momentIdx);
    setCurrentBeatIdx(0);
    setIsVideoPlaying(false); // Reset video state when changing bullet points
    publishNavigation(momentIdx, 0);
  };

  // Click on a Pill-shaped beat.
  const handleBeatClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    beatIdx: number,
    momentIdx: number,
  ) => {
    // Send MQTT message.
    e.stopPropagation();

    // If clicking on a different bullet point's beat, switch to that bullet point
    if (momentIdx !== currentMomentIdx) {
      setCurrentMomentIdx(momentIdx);
      setCurrentBeatIdx(beatIdx);
      setIsVideoPlaying(false); // Reset video state
      publishNavigation(momentIdx, beatIdx);
    } else {
      // Same bullet point, just change beat
      setCurrentBeatIdx(beatIdx);
      publishNavigation(currentMomentIdx, beatIdx);
    }
  };

  useEffect(() => {
    if (
      currentBeatIdx === 1 &&
      content[currentMomentIdx]?.id === "case-study"
    ) {
      setIsVideoPlaying(true);
    } else {
      setIsVideoPlaying(false);
    }
  }, [currentBeatIdx, content, currentMomentIdx]);

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
      <div className="mt-45 flex flex-col gap-10">
        {/* Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-primary-bg-grey text-center text-[60px] leading-[72px] font-normal tracking-[-0.05em]">
            {title}
          </h1>
          <p className="text-primary-bg-grey text-center text-[28px] leading-[34px] font-normal tracking-[-0.05em]">
            {currentTour?.guestName || "Tour"}
          </p>
        </div>

        {/* Bullet Point List */}
        <div className="flex flex-col gap-6 px-11.5">
          {content.map((bulletPoint, index) => {
            const bulletPointIsActive = index === currentMomentIdx;
            return (
              <div key={index} className="flex items-center">
                {/* Diamond and title */}
                <div
                  className={`flex w-70 min-w-70 items-center gap-4 transition-opacity ${bulletPointIsActive ? "opacity-100" : "opacity-50"}`}
                >
                  {bulletPointIsActive && (
                    <div className="border-primary-bg-grey h-3.75 w-3.75 rotate-45 rounded-[2px] border-2" />
                  )}
                  <button
                    onClick={() => handleBulletPointClick(index)}
                    className="text-primary-bg-grey text-left text-[28px] leading-[1.3] font-normal"
                  >
                    {bulletPoint.title}
                  </button>
                </div>

                {/* Purple beat indicators */}
                <div className="flex items-center gap-3.25">
                  {Array.from(
                    { length: bulletPoint.beatCount },
                    (_, beatIndex) => {
                      const beatIsActive =
                        bulletPointIsActive && beatIndex === currentBeatIdx;
                      const isVideoBeat =
                        bulletPoint.id === "case-study" && beatIndex === 1; // Second beat is video

                      // Normal beat button for non-videos.
                      const normalBeatButton = (
                        <button
                          key={beatIndex}
                          onClick={(e) => handleBeatClick(e, beatIndex, index)}
                          className={`relative flex h-[56px] w-[88px] items-center justify-center rounded-full border-2 transition-colors ${
                            beatIsActive
                              ? "border-primary-bg-grey bg-transparent"
                              : bulletPointIsActive
                                ? "border-primary-bg-grey bg-transparent"
                                : "border-white/10 bg-white/10"
                          }`}
                        >
                          {/* Purple background layer that fades in/out */}
                          {beatIsActive && (
                            <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />
                          )}

                          <span className="text-primary-bg-grey relative z-10 text-center text-[24px] leading-[40px] font-normal tracking-[-0.05em]">
                            {bulletPointIsActive ? beatIndex + 1 : ""}
                          </span>
                        </button>
                      );

                      // Video beat button
                      const videoBeatButton = bulletPointIsActive &&
                        isVideoBeat && (
                          <button
                            key={beatIndex}
                            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          >
                            {isVideoPlaying ? (
                              <FiPauseCircle size={40} />
                            ) : (
                              <FiPlayCircle size={40} />
                            )}
                          </button>
                        );

                      return isVideoBeat ? videoBeatButton : normalBeatButton;
                    },
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="text-primary-im-dark-blue absolute bottom-[105px] left-1/2 flex translate-x-[-50%] flex-row items-center justify-center gap-10">
        {/* Previous Button */}
        <Button
          onClick={handlePrevious}
          disabled={currentMomentIdx === 0 && currentBeatIdx === 0}
          className="h-25 w-25 rounded-full"
        >
          <FiArrowLeft />
        </Button>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          disabled={
            currentMomentIdx === content.length - 1 &&
            currentBeatIdx === content[currentMomentIdx].beatCount - 1
          }
          className="h-25 w-25 rounded-full"
        >
          <FiArrowRight />
        </Button>
      </div>
    </div>
  );
}
