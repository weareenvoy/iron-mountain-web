"use client";

import Image from "next/image";
import { useOverlookTabletNavigation } from "../OverlookTablet/OverlookTabletNavigation";
import { Button } from "../Button";

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
        <Button
          onClick={onBackClick || (() => navigateTo("tabletHome"))} // Use onBackClick if provided, else default to tabletHome
          variant="overlook-outline"
          size="sm"
        >
          {backButtonText}
        </Button>
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
