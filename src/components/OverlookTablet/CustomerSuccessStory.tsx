"use client";

import { FiPlay } from "react-icons/fi";

export default function CustomerSuccessStory() {
  return (
    <div className="from-overlook-mid-blue to-overlook-teal relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-b py-60">
      {/* Title */}
      <h2 className="font-geometria text-overlook-white-text text-[40px] leading-[1.1] tracking-[-2px] whitespace-pre">
        <p className="mb-0">Customer</p>
        <p>success story</p>
      </h2>

      <div className="flex flex-col items-center justify-center gap-20">
        {/* Main Title */}
        <h1 className="text-overlook-white-text text-[48px] leading-[1.1] tracking-[-2.4px]">
          <p>An Iron Mountain</p>
          <p>story of impact</p>
        </h1>

        {/* Play Button send out MQTT message to play/pause video */}
        <button className="bg-overlook-light-bg text-overlook-dark-blue flex items-center gap-5 rounded-full px-8 py-8 text-2xl font-medium transition-all active:bg-[#e0e0e0]">
          Play
          <FiPlay className="h-12 w-12" />
        </button>

        {/* Instruction Text */}
        <p className="text-overlook-white-text text-2xl leading-[1.4] tracking-[-1.2px]">
          Tap to play the video on the main screen
        </p>
      </div>
    </div>
  );
}
