"use client";

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { useOverlookTabletNavigation } from "../OverlookTablet/OverlookTabletNavigation";

export default function TabletHome() {
  const { navigateTo } = useOverlookTabletNavigation();

  return (
    <div className="relative flex h-full w-full flex-col bg-[#ededed] p-10">
      {/* Bottom Mountain Illustration */}
      <Image
        alt="Iron Mountain illustration"
        src="/images/mountain-illustration.svg"
        width={1024}
        height={511}
        className="absolute bottom-0 left-0 h-[511px] w-full object-cover"
      />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center gap-16 pt-80 text-center text-[#14477d]">
        <h1 className="text-6xl leading-tight font-bold tracking-tight">
          The Overlook
          <br />
          at Iron Mountain
        </h1>
        <p className="max-w-2xl text-3xl leading-relaxed">
          Explore how Iron Mountain is empowering organizations to maximize
          their potential.
        </p>
      </div>

      {/* Bottom Action Button */}
      <button
        onClick={() => navigateTo("mainMenu")}
        className="absolute bottom-65 left-1/2 flex -translate-x-1/2 items-center gap-5 rounded-full bg-[#ededed] px-10 py-7 text-2xl font-medium text-[#14477d] shadow-lg transition-all hover:bg-[#e0e0e0] hover:shadow-xl"
      >
        Tap to begin
        <FiArrowRight className="h-6 w-6" />
      </button>
    </div>
  );
}
