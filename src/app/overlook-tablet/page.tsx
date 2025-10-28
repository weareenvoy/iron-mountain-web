"use client";

import { Button } from "@/components/Button";
import { FiArrowRight } from "react-icons/fi";
import Image from "next/image";

export default function OverlookTablet() {
  return (
    <div className="bg-primary-bg-grey relative flex h-full w-full flex-col p-10">
      {/* Bottom Mountain Illustration */}
      <Image
        alt="Iron Mountain illustration"
        src="/images/mountain-illustration.svg"
        width={1024}
        height={511}
        className="absolute bottom-0 left-0 h-[511px] w-full object-cover"
      />

      {/* Main Content */}
      <div className="text-primary-im-dark-blue flex flex-col items-center justify-center gap-16 pt-80 text-center">
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
      <Button
        variant="primary"
        className="absolute bottom-65 left-1/2 -translate-x-1/2 shadow-lg"
        size="md"
      >
        Tap to begin
        <FiArrowRight className="h-6 w-6" />
      </Button>
    </div>  
  );
}
