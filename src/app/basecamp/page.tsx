"use client";

import Background from "./_components/Background";
import Foreground from "./_components/Foreground";

export default function BasecampPage() {
  return (
    <div className="bg-primary-bg-grey relative flex h-[720px] w-[3840px] flex-col items-center overflow-hidden">
      {/* Background videos */}
      <Background />

      {/* Foreground content */}
      <Foreground />
    </div>
  );
}
