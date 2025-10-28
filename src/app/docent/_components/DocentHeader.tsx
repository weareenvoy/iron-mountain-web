"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocentHeaderProps {
  leftButton?: {
    text: string;
    href: string;
    icon?: React.ReactNode;
  };
}

export function DocentHeader({ leftButton }: DocentHeaderProps) {
  return (
    <div className="absolute top-0 left-0 flex h-37.5 w-full items-center justify-between px-10">
      {/* Left Button */}
      {leftButton && (
        <Link
          href={leftButton.href}
          className="text-primary-bg-grey border-primary-bg-grey flex items-center gap-3 rounded-full border px-5 py-4 text-[20px] transition-opacity hover:opacity-80"
        >
          {leftButton.icon}
          <span>{leftButton.text}</span>
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
