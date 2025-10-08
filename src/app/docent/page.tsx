"use client";

import Image from "next/image";

export default function DocentApp() {
  return (
    <div className="bg-brand-primary flex h-[1133px] w-[744px] flex-col items-center justify-center overflow-hidden">
      {/* Logo */}
      <Image
        src="/images/iron-mountain-logo-colored.svg"
        alt="Iron Mountain logo"
        width={305}
        height={79}
      />
      <p>This is docent app. iPad MINI size 1133x744</p>
    </div>
  );
}
