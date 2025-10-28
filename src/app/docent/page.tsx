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
      <div className="mt-80 flex flex-col items-center gap-70 px-10">
        <div className="text-primary-im-dark-blue flex flex-col items-center gap-25 text-center">
          <h1 className="font-geometria text-[60px] leading-[66px] font-normal tracking-[-0.05em]">
            Iron Mountain
            <br />
            EBC Controls
          </h1>

          <p className="max-w-[651px] text-[28px] leading-[34px] font-normal tracking-[-0.05em]">
            This will be a message for the Docent app - can be a general intro
            lorem ipsum dolor sit.
          </p>
        </div>

        {/* Go to schedule */}
        <Link
          href="/docent/schedule"
          className="text-primary-im-dark-blue primary-bg-grey bg-primary-bg-grey z-1 flex items-center gap-5 rounded-full px-10 py-7 transition-opacity active:opacity-90"
        >
          <span className="text-[24px] leading-[34px] font-normal tracking-[-0.05em]">
            Launch Calendar
          </span>
          <FiArrowRight size={24} />
        </Link>
      </div>
    </div>
  );
}
