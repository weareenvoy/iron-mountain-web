"use client";

import Image from "next/image";
import { useOverlookTabletNavigation } from "../OverlookTablet/OverlookTabletNavigation";

interface OverlookTabletHeaderProps {
  showBackButton?: boolean;
  backButtonText?: string;
  logoVariant?: "colored" | "white";
  onBackClick?: () => void; // New prop for custom navigation
}

export function OverlookTabletHeader({
  showBackButton = true,
  backButtonText = "Back to Home",
  logoVariant = "white",
  onBackClick,
}: OverlookTabletHeaderProps) {
  const { navigateTo } = useOverlookTabletNavigation();

  return (
    <div className="absolute top-0 right-0 left-0 z-10 flex h-24 items-center justify-between p-10">
      {showBackButton && (
        <button
          onClick={onBackClick || (() => navigateTo("tabletHome"))} // Use onBackClick if provided, else default to tabletHome
          className="border-overlook-white-text text-overlook-white-text flex items-center gap-3 rounded-full border px-5 py-4 text-xl font-medium transition-colors active:bg-white/10"
        >
          {backButtonText}
          <div className="h-6 w-6">
            <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
              <path
                d="M3 12L21 12M3 12L9 6M3 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      )}

      <div className="h-10 w-36">
        <Image
          alt="Iron Mountain logo"
          src={`/images/iron-mountain-logo-${logoVariant}.svg`}
          width={150}
          height={39}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
