"use client";

import { Button } from "@/components/Button";

export default function InsightDXP() {
  return (
    <div className="from-overlook-dark-blue to-overlook-mid-blue relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b py-60">
      {/* Main Title */}
      <div className="border-overlook-white-text h-69 w-69 rotate-45 rounded-lg border"></div>
      <div className="absolute text-center">
        <h1 className="text-overlook-white-text mb-8 text-[60px] leading-[1.1] tracking-[-3px]">
          InSight® DXP
        </h1>
      </div>
      <Button>Explore features</Button>
    </div>
  );
}
