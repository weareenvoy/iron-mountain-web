"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { DocentHeader } from "../../_components/DocentHeader";
import { useDocent } from "../../_components/DocentProvider";
import { FiCalendar } from "react-icons/fi";
interface TourOverviewPageProps {
  params: Promise<{ tourId: string }>;
}

export default function TourOverviewPage({ params }: TourOverviewPageProps) {
  const { tourId } = use(params);
  const router = useRouter();
  const currentTour = useDocent().currentTour;

  const handleSectionClick = (section: string) => {
    router.push(`/docent/tour/${tourId}/${section}`);
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <DocentHeader
        leftButton={{
          text: "Back to schedule",
          href: "/docent/schedule",
          icon: <FiCalendar />,
        }}
      />

      {/* Header */}
      <div className="text-primary-bg-grey mt-35 flex flex-col items-center gap-[23px]">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">
          Overview
        </h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">
          {currentTour?.guestName || "Tour"}
        </p>
      </div>

      {/* Grid as a whole rotate 45 deg, item text rotate -45 deg */}
      <div className="absolute top-110 left-25 grid rotate-45 grid-cols-2 gap-4">
        {/* Item 1 */}
        <button
          onClick={() => handleSectionClick("basecamp")}
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">
            Basecamp
          </p>
        </button>

        {/* Item 2 */}
        <button
          onClick={() => handleSectionClick("overlook")}
          className="bg-primary-bg-grey relative flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">
            Overlook
          </p>
        </button>

        {/* Item 3 (manually placed in column 2, row 2) */}
        <button
          onClick={() => handleSectionClick("summit-room")}
          className="bg-primary-bg-grey relative col-start-2 row-start-2 flex h-50 w-50 items-center justify-center rounded-lg transition-opacity ease-in-out active:opacity-80"
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-2xl">
            Summit Room
          </p>
        </button>
      </div>
    </div>
  );
}
