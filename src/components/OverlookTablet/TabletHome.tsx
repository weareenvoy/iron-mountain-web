"use client";

import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { useOverlookTabletNavigation } from "../OverlookTablet/OverlookTabletNavigation";

export default function TabletHome() {
  const { navigateTo } = useOverlookTabletNavigation();

  return (
    <div className="bg-overlook-light-bg relative flex h-full w-full flex-col p-10">
      {/* Bottom Mountain Illustration */}
      <Image
        alt="Iron Mountain illustration"
        src="/images/mountain-illustration.svg"
        width={1024}
        height={511}
        className="absolute bottom-0 left-0 h-[511px] w-full object-cover"
      />

      {/* Main Content */}
      <div className="text-overlook-dark-blue flex flex-col items-center justify-center gap-16 pt-80 text-center">
        <h1 className="font-geometria text-6xl leading-tight tracking-tight">
          The Overlook
          <br />
          at Iron Mountain
        </h1>
        <p className="w-[730px] text-[28px] leading-relaxed">
          Explore how Iron Mountain is empowering organizations to maximize
          their potential.
        </p>
      </div>

      {/* Bottom Action Button */}
      <button
        onClick={() => navigateTo("mainMenu")}
        className="bg-overlook-light-bg text-overlook-dark-blue absolute bottom-65 left-1/2 flex -translate-x-1/2 items-center gap-5 rounded-full px-10 py-7 text-2xl shadow-lg transition-all active:bg-[#e0e0e0]"
      >
        Tap to begin
        <FiArrowRight className="h-6 w-6" />
      </button>
    </div>
  );
}
