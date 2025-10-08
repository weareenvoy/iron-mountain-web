"use client";

import { Button } from "@/components/Button";

export default function InsightDXP() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#14477d] to-[#1b75bc] py-60">
      {/* Main Title */}
      <div className="h-69 w-69 rotate-45 rounded-lg border border-[#ededed]"></div>
      <div className="absolute text-center">
        <h1 className="mb-8 text-[60px] leading-[1.1] tracking-[-3px] text-[#ededed]">
          InSight® DXP
        </h1>
      </div>
      <Button>Explore features</Button>
    </div>
  );
}
