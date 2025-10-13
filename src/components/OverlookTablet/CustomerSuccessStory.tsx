"use client";

import { FiPlay } from "react-icons/fi";
import { Button } from "../Button";

export default function CustomerSuccessStory() {
  return (
    <div className="from-primary-im-mid-blue to-secondary-im-teal relative flex h-full w-full flex-col items-center justify-between bg-gradient-to-b py-60">
      {/* Title */}
      <h2 className="font-geometria text-primary-bg-grey text-[40px] leading-[1.1] tracking-[-2px] whitespace-pre">
        <p className="mb-0">Customer</p>
        <p>success story</p>
      </h2>

      <div className="flex flex-col items-center justify-center gap-20">
        {/* Main Title */}
        <h1 className="text-primary-bg-grey text-[48px] leading-[1.1] tracking-[-2.4px]">
          <p>An Iron Mountain</p>
          <p>story of impact</p>
        </h1>

        {/* Play Button send out MQTT message to play/pause video */}
        <Button variant="overlook" size="md">
          Play
          <FiPlay className="h-12 w-12" />
        </Button>

        {/* Instruction Text */}
        <p className="text-primary-bg-grey text-2xl leading-[1.4] tracking-[-1.2px]">
          Tap to play the video on the main screen
        </p>
      </div>
    </div>
  );
}
