"use client";

import { use } from "react";
import {
  MomentsAndBeats,
  useMomentsNavigation,
} from "../../../_components/MomentsAndBeats";
import { Moment } from "@/types";
import { DocentHeader } from "../../../_components/DocentHeader";
import { useDocent } from "../../../_contexts/DocentProvider";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/Button";

const BASECAMP_CONTENT: Moment[] = [
  {
    id: "ambient",
    title: "Ambient state",
    beatCount: 1,
  },
  {
    id: "welcome",
    title: "Welcome",
    beatCount: 4,
  },
  {
    id: "problem",
    title: "Problem",
    beatCount: 4,
  },
  {
    id: "possibilities",
    title: "Possibilities",
    beatCount: 5,
  },
  {
    id: "ascend",
    title: "Ascend",
    beatCount: 3,
  },
];
interface BasecampPageProps {
  params: Promise<{ tourId: string }>;
}

export default function BasecampPage({ params }: BasecampPageProps) {
  const { tourId } = use(params);
  const { currentTour, basecampExhibitState, setBasecampExhibitState } =
    useDocent();

  // MomentsAndBeats navigation.
  const { handlePrevious, handleNext, isPreviousDisabled, isNextDisabled } =
    useMomentsNavigation(
      BASECAMP_CONTENT,
      basecampExhibitState,
      setBasecampExhibitState,
      "basecamp",
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

      {/* Header */}
      <div className="mt-35 flex flex-col gap-42.5">
        {/* Title */}
        <div className="flex flex-col items-center gap-[23px]">
          <h1 className="text-primary-bg-grey text-center text-[36px] leading-loose tracking-[-1.8px]">
            Basecamp
          </h1>
          <p className="text-primary-bg-grey text-center text-xl leading-loose tracking-[-1px]">
            {currentTour?.guestName || "Tour"}
          </p>
        </div>

        <MomentsAndBeats
          tourId={tourId}
          content={BASECAMP_CONTENT}
          exhibitState={basecampExhibitState}
          setExhibitState={setBasecampExhibitState}
          exhibit="basecamp"
        />
      </div>

      {/* Bottom Controls */}
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
