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
  exhibitType: "basecamp" | "overlook";
  content: Moment[]; // hardcoded data
}

export function MomentsAndBeats({
  tourId,
  exhibitType,
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

  // Need this to determine use setBasecampXXX or setOverlookXXX.
  const isBasecamp = exhibitType === "basecamp";
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

    const moment = content[momentIdx];
    const topic = isBasecamp ? "basecamp/navigation" : "overlook/navigation";

    const message = {
      momentId: moment.id,
      beatIdx,
      tourId,
      timestamp: Date.now(),
    };

    client.publish(topic, JSON.stringify(message), {
      onError: (err) => console.error("Failed to publish navigation:", err),
      onSuccess: () => console.log("Published navigation:", message),
    });
  };

  // TODO: Same question across the app. Do we need to store moment and beat here, or send msg to GEC, and GEC keeps track of the state.
  const goTo = (momentIdx: number, beatIdx: number) => {
    setCurrentMomentIdx(momentIdx);
    setCurrentBeatIdx(beatIdx);
    publishNavigation(momentIdx, beatIdx);
  };

  const handlePrevious = () => {
    if (currentBeatIdx > 0) {
      goTo(currentMomentIdx, currentBeatIdx - 1);
    } else if (currentMomentIdx > 0) {
      const prevMoment = content[currentMomentIdx - 1];
      goTo(currentMomentIdx - 1, prevMoment.beatCount - 1);
    }
  };

  const handleNext = () => {
    const currentMoment = content[currentMomentIdx];
    if (currentBeatIdx < currentMoment.beatCount - 1) {
      goTo(currentMomentIdx, currentBeatIdx + 1);
    } else if (currentMomentIdx < content.length - 1) {
      goTo(currentMomentIdx + 1, 0);
    }
  };

  const handleBulletPointClick = (momentIdx: number) => {
    goTo(momentIdx, 0);
    setIsVideoPlaying(false);
  };

  const handleBeatClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    beatIdx: number,
    momentIdx: number,
  ) => {
    e.stopPropagation();
    goTo(momentIdx, beatIdx);
    if (momentIdx !== currentMomentIdx) {
      setIsVideoPlaying(false);
    }
  };

  // Auto-play video on case-study beat 1, for overlook.
  useEffect(() => {
    const isCaseStudyVideo =
      content[currentMomentIdx]?.id === "case-study" && currentBeatIdx === 1;
    setIsVideoPlaying(isCaseStudyVideo);
  }, [currentMomentIdx, currentBeatIdx, content]);

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
            {exhibitType === "basecamp" ? "Basecamp" : "Overlook"}
          </h1>
          <p className="text-primary-bg-grey text-center text-[28px] leading-[34px] font-normal tracking-[-0.05em]">
            {currentTour?.guestName || "Tour"}
          </p>
        </div>

        {/* Bullet Point List */}
        <div className="flex flex-col gap-6 px-11.5">
          {content.map((moment, momentIdx) => {
            const isActiveMoment = momentIdx === currentMomentIdx;

            return (
              <div key={momentIdx} className="flex items-center">
                <div
                  className={`flex w-70 min-w-70 items-center gap-4 transition-opacity ${
                    isActiveMoment ? "opacity-100" : "opacity-50"
                  }`}
                >
                  {isActiveMoment && (
                    <div className="border-primary-bg-grey h-3.75 w-3.75 rotate-45 rounded-[2px] border-2" />
                  )}
                  <button
                    onClick={() => handleBulletPointClick(momentIdx)}
                    className="text-primary-bg-grey text-left text-[28px] leading-[1.3] font-normal"
                  >
                    {moment.title}
                  </button>
                </div>

                <div className="flex items-center gap-3.25">
                  {Array.from({ length: moment.beatCount }, (_, beatIdx) => {
                    const isActiveBeat =
                      isActiveMoment && beatIdx === currentBeatIdx;
                    const isVideoBeat =
                      moment.id === "case-study" && beatIdx === 1;

                    if (isVideoBeat && isActiveMoment) {
                      return (
                        <button
                          key={beatIdx}
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="text-primary-bg-grey"
                        >
                          {isVideoPlaying ? (
                            <FiPauseCircle size={40} />
                          ) : (
                            <FiPlayCircle size={40} />
                          )}
                        </button>
                      );
                    }

                    return (
                      <button
                        key={beatIdx}
                        onClick={(e) => handleBeatClick(e, beatIdx, momentIdx)}
                        className={`relative flex h-[56px] w-[88px] items-center justify-center rounded-full border-2 transition-colors ${
                          isActiveBeat
                            ? "border-primary-bg-grey bg-transparent"
                            : isActiveMoment
                              ? "border-primary-bg-grey bg-transparent"
                              : "border-white/10 bg-white/10"
                        }`}
                      >
                        {isActiveBeat && (
                          <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />
                        )}
                        <span className="text-primary-bg-grey relative z-10 text-center text-[24px] leading-[40px] font-normal tracking-[-0.05em]">
                          {isActiveMoment ? beatIdx + 1 : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="text-primary-im-dark-blue absolute bottom-[105px] left-1/2 flex -translate-x-1/2 items-center justify-center gap-10">
        <Button
          onClick={handlePrevious}
          disabled={currentMomentIdx === 0 && currentBeatIdx === 0}
          className="h-25 w-25 rounded-full"
        >
          <FiArrowLeft />
        </Button>

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
