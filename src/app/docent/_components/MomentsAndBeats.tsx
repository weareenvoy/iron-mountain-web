"use client";

import { useEffect, useState } from "react";
import { FaRegCirclePlay, FaRegCirclePause } from "react-icons/fa6";

import { Moment, ExhibitState } from "@/types";
import { useMqtt } from "@/providers/MqttProvider";

// moments/beats navigation hook
export function useMomentsNavigation(
  content: Moment[],
  exhibitState: ExhibitState,
  setExhibitState: (state: Partial<ExhibitState>) => void,
  mqttTopic: string,
) {
  const { client } = useMqtt();
  const { momentId, beatIdx: currentBeatIdx } = exhibitState;

  const currentMomentIdx = content.findIndex((m) => m.id === momentId);
  const currentMoment = content[currentMomentIdx];

  const publishNavigation = (momentId: string, beatIdx: number) => {
    if (!client) return;

    const message = {
      momentId,
      beatIdx,
    };

    client.publish(mqttTopic, JSON.stringify(message));
  };

  const goTo = (momentId: string, beatIdx: number) => {
    setExhibitState({ momentId, beatIdx });
    publishNavigation(momentId, beatIdx);
  };

  const handlePrevious = () => {
    if (currentBeatIdx > 0) {
      goTo(momentId, currentBeatIdx - 1);
    } else if (currentMomentIdx > 0) {
      const prevMoment = content[currentMomentIdx - 1];
      goTo(prevMoment.id, prevMoment.beatCount - 1);
    }
  };

  const handleNext = () => {
    if (currentBeatIdx < currentMoment.beatCount - 1) {
      goTo(momentId, currentBeatIdx + 1);
    } else if (currentMomentIdx < content.length - 1) {
      const nextMoment = content[currentMomentIdx + 1];
      goTo(nextMoment.id, 0);
    }
  };

  const isPreviousDisabled = currentMomentIdx === 0 && currentBeatIdx === 0;
  const isNextDisabled =
    currentMomentIdx === content.length - 1 &&
    currentBeatIdx === currentMoment.beatCount - 1;

  return {
    handlePrevious,
    handleNext,
    isPreviousDisabled,
    isNextDisabled,
    currentMomentIdx,
    currentBeatIdx,
  };
}

interface MomentsAndBeatsProps {
  tourId: string;
  content: Moment[]; // hardcoded data
  exhibitState: ExhibitState;
  setExhibitState: (state: Partial<ExhibitState>) => void;
  mqttTopic: string;
}

export function MomentsAndBeats({
  tourId,
  content,
  exhibitState,
  setExhibitState,
  mqttTopic,
}: MomentsAndBeatsProps) {
  const { client } = useMqtt();

  const { momentId, beatIdx: currentBeatIdx } = exhibitState;
  const currentMomentIdx = content.findIndex((m) => m.id === momentId);

  // Edge case: Overlook's case-study video.
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const publishNavigation = (momentId: string, beatIdx: number) => {
    if (!client) return;

    const message = {
      momentId,
      beatIdx,
    };

    client.publish(mqttTopic, JSON.stringify(message));
  };

  const goTo = (momentId: string, beatIdx: number) => {
    setExhibitState({ momentId, beatIdx });
    publishNavigation(momentId, beatIdx);
  };

  const handleBulletPointClick = (momentId: string) => {
    goTo(momentId, 0);
  };

  const handleBeatClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    beatIdx: number,
    momentId: string,
  ) => {
    e.stopPropagation();
    goTo(momentId, beatIdx);
  };

  // Handle video state when navigating to case-study
  useEffect(() => {
    const isCaseStudyVideo = momentId === "case-study" && currentBeatIdx === 1;

    if (isCaseStudyVideo) {
      setIsVideoPlaying(true);
      // send mqtt message to play video
    } else {
      setIsVideoPlaying(false);
      // send mqtt message to pause video
    }
  }, [momentId, currentBeatIdx]);

  return (
    <div className="flex flex-col gap-6 px-11.5">
      {content.map((moment, idx) => {
        const isActiveMoment = moment.id === momentId;

        return (
          <div key={moment.id} className="flex items-center">
            <div
              className={`flex w-70 min-w-70 items-center gap-[12.4px] transition-opacity ${
                isActiveMoment ? "opacity-100" : "opacity-50"
              }`}
            >
              {isActiveMoment && (
                <div className="border-primary-bg-grey h-4 w-4 rotate-45 rounded-[2px] border-2" />
              )}
              <button
                onClick={() => handleBulletPointClick(moment.id)}
                className="text-primary-bg-grey text-left text-[26px] leading-[1.3]"
              >
                {moment.title}
              </button>
            </div>

            <div className="flex items-center gap-[10px]">
              {Array.from({ length: moment.beatCount }, (_, beatIdx) => {
                const isActiveBeat =
                  isActiveMoment && beatIdx === currentBeatIdx;
                const isVideoBeat = moment.id === "case-study" && beatIdx === 1;

                if (isVideoBeat) {
                  return (
                    <button
                      key={beatIdx}
                      // TODO: Send mqtt message to play/pause video
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className={`text-primary-bg-grey transition-opacity ${
                        isActiveMoment
                          ? "opacity-100"
                          : "pointer-events-none opacity-0"
                      }`}
                    >
                      {isVideoPlaying ? (
                        <FaRegCirclePause size={40} />
                      ) : (
                        <FaRegCirclePlay size={40} />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={beatIdx}
                    onClick={(e) => handleBeatClick(e, beatIdx, moment.id)}
                    className={`relative flex h-[42px] w-[60px] items-center justify-center rounded-full border-[1.5px] transition-colors ${
                      isActiveBeat
                        ? "border-primary-bg-grey bg-transparent"
                        : isActiveMoment
                          ? "border-primary-bg-grey bg-transparent"
                          : "border-white/0 bg-white/10"
                    }`}
                  >
                    {isActiveBeat && (
                      <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />
                    )}
                    <span className="text-primary-bg-grey relative z-10 text-center text-xl leading-[1.2] tracking-[-1px]">
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
  );
}
