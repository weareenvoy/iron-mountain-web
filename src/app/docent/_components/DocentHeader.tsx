"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";

interface DocentHeaderProps {
  leftButton?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function DocentHeader({ leftButton }: DocentHeaderProps) {
  return (
    <div className="absolute top-0 left-0 flex h-30 w-full items-center justify-between px-5">
      {/* Left Button */}
      {leftButton && (
        <Link href={leftButton.href}>
          <Button
            variant="outline-light-grey"
            size="sm"
            className="flex h-13 items-center gap-3.5 px-6"
          >
            {leftButton.icon}
            <span className="text-[20px] h-6.25">
              {leftButton.text}
            </span>
          </Button>
        </Link>
      )}
      {!leftButton && <div />}

      {/* Logo. Use colored one on home page, white one on other pages */}
      {usePathname() === "/docent" ? (
        <Image
          src="/images/iron-mountain-logo-colored.svg"
          alt="Iron Mountain Logo"
          width={150}
          height={39}
          className="object-contain"
        />
      ) : (
        <Image
          src="/images/iron-mountain-logo-white.svg"
          alt="Iron Mountain Logo"
          width={150}
          height={39}
          className="object-contain"
        />
      )}
    </div>
  );
}
