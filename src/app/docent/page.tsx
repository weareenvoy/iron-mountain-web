"use client";

import { DocentHeader } from "./_components/DocentHeader";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function DocentHomePage() {
  return (
    <div className="bg-primary-bg-grey relative flex h-full w-full flex-col items-center overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute right-0 bottom-0 left-0 h-[511px] w-full">
        <Image
          src="/images/mountain-illustration.svg"
          alt="Mountain illustration"
          fill
          className="object-cover"
        />
      </div>

      {/* Navigation */}
      <DocentHeader />

      {/* Content */}
      <div className="mt-80 flex flex-col items-center gap-[235px] px-10">
        <div className="text-primary-im-dark-blue flex flex-col items-center gap-15 text-center">
          <h1 className="font-geometria text-5xl leading-relaxed tracking-[-2.4px]">
            The Overlook
            <br />
            at Iron Mountain
          </h1>

          <p className="max-w-[572px] text-2xl leading-loose tracking-[-0.05em]">
            Explore how Iron Mountain is empowering organizations to maximize
            their potential.
          </p>
        </div>

        {/* Go to schedule */}
        <Link
          href="/docent/schedule"
          className="text-primary-im-dark-blue primary-bg-grey bg-primary-bg-grey z-1 flex items-center gap-5 rounded-full px-10 py-7 transition-opacity active:opacity-90"
        >
          <span className="text-2xl leading-loose tracking-[-1.2px]">
            Tap to begin
          </span>
          <FiArrowRight size={24} />
        </Link>
      </div>
    </div>
  );
}
