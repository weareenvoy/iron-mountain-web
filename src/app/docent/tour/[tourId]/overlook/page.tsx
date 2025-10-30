"use client";

import { use, useState } from "react";
import {
  MomentsAndBeats,
  useMomentsNavigation,
} from "../../../_components/MomentsAndBeats";
import { Moment } from "@/types";
import { DocentHeader } from "../../../_components/DocentHeader";
import { useDocent } from "../../../_components/DocentProvider";
import { FiArrowLeft, FiArrowRight, FiCast } from "react-icons/fi";
import { Button } from "@/components/Button";
import Image from "next/image";

const OVERLOOK_CONTENT: Moment[] = [
  {
    id: "ambient",
    title: "Ambient state",
    beatCount: 1,
  },
  {
    id: "unlock",
    title: "Unlock",
    beatCount: 2,
  },

  {
    id: "protect",
    title: "Protect",
    beatCount: 2,
  },
  {
    id: "connect",
    title: "Connect",
    beatCount: 2,
  },
  {
    id: "activate",
    title: "Activate",
    beatCount: 2,
  },
  {
    id: "insight-dxp",
    title: "InSight DXP",
    beatCount: 5,
  },
  {
    id: "case-study",
    title: "Impact (case study)",
    beatCount: 2, // 1 normal beat, and 1 video. Video is just like a normal beat, but with a play/pause button.
  },
  {
    id: "futurescape",
    title: "Futurescape",
    beatCount: 4,
  },
];

interface OverlookPageProps {
  params: Promise<{ tourId: string }>;
}

export default function OverlookPage({ params }: OverlookPageProps) {
  const { tourId } = use(params);
  const { currentTour, overlookExhibitState, setOverlookExhibitState } =
    useDocent();
  // TODO does this live in GEC state?
  const [isOverlookCastMode, setIsOverlookCastMode] = useState(false);

  // Should the bottom controls live here, or live in MomentaAndBeats
  const { handlePrevious, handleNext, isPreviousDisabled, isNextDisabled } =
    useMomentsNavigation(
      OVERLOOK_CONTENT,
      overlookExhibitState,
      setOverlookExhibitState,
      "navigation/overlook",
    );

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

      {/* Cast Button */}
      <div className="absolute top-34 left-5 z-50">
        <Button
          variant="outline-light-grey"
          size="sm"
          className="h-18 w-18 rounded-full border-none"
          onClick={() => setIsOverlookCastMode(!isOverlookCastMode)}
        >
          {isOverlookCastMode ? (
            <div>
              <FiCast size={30} />
              <span className="h-6.25 text-xl">Pres.mode</span>
            </div>
          ) : (
            <div>
              <Image
                src="/images/cast-off.svg"
                alt="Cast Off"
                width={24}
                height={24}
              />
              <span className="h-6.25 text-xl">Stop</span>
            </div>
          )}
        </Button>
      </div>

      {/* Header */}
      <div className="mt-35 flex flex-col gap-42.5">
        {/* Title */}
        <div className="flex flex-col items-center gap-[23px]">
          <h1 className="text-primary-bg-grey text-center text-[36px] leading-loose tracking-[-1.8px]">
            Overlook
          </h1>
          <p className="text-primary-bg-grey text-center text-xl leading-loose tracking-[-1px]">
            {currentTour?.guestName || "Tour"}
          </p>
        </div>

        <MomentsAndBeats
          tourId={tourId}
          content={OVERLOOK_CONTENT}
          exhibitState={overlookExhibitState}
          setExhibitState={setOverlookExhibitState}
          mqttTopic="navigation/overlook"
        />
      </div>

      {/* Bottom Controls */}
      {/* TODO Should they live here or in MomentsAndBeats? Maybe add debounce? */}
      <div className="text-primary-im-dark-blue absolute bottom-17.5 left-1/2 flex -translate-x-1/2 items-center justify-center gap-10">
        <Button
          size="sm"
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className="size-[80px] rounded-full"
        >
          <FiArrowLeft className="size-[36px]" />
        </Button>

        <Button
          onClick={handleNext}
          size="sm"
          disabled={isNextDisabled}
          className="size-[80px] rounded-full"
        >
          <FiArrowRight className="size-[36px]" />
        </Button>
      </div>
    </div>
  );
}
