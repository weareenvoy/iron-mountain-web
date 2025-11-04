"use client";

import { DocentHeader } from "./_components/DocentHeader";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { useDocent } from "./_contexts/DocentProvider";
import { Button } from "@/components/Button";

export default function DocentHomePage() {
  // const { isTourDataLoading, isGecStateLoading } = useDocent();
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
            Iron Mountain
            <br />
            EBC Controls
          </h1>

          <p className="max-w-[572px] text-2xl leading-loose tracking-[-0.05em]">
            Manage and direct the Iron Mountain EBC experience.
          </p>
        </div>

        {/* Go to schedule */}
        <Link
          href="/docent/schedule"
          className="text-primary-im-dark-blue z-1 h-22 w-60"
        >
          <Button
            variant="primary"
            size="sm"
            className="h-full w-full"
            // TODO instead of using a loading spinner, we could disable the button when data is loading.
            // disabled={isTourDataLoading || isGecStateLoading}
          >
            <span className="text-2xl leading-loose tracking-[-1.2px]">
              Tap to begin
            </span>
            <FiArrowRight size={24} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
