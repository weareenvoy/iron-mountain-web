"use client";

import { useState } from "react";

export default function ProtectConnectActivate() {
  const [activeSection, setActiveSection] = useState<
    "protect" | "connect" | "activate" | null
  >(null);

  const sections = {
    protect: {
      title: "Protect",
      description: "Safeguard and preserve your most valuable assets.",
      bgColor: "bg-linear-[30deg,#308477_-9.61%,#6EF4D4_158.3%]", // background: linear-gradient(30deg, #308477 -9.61%, #6EF4D4 158.3%);
      textColor: "text-overlook-white-text",
      blocks: [
        {
          title: "Museum-grade security",
          description:
            "Advanced physical and digital security measures to protect your assets.",
        },
        {
          title: "World-class data sanitization",
          description:
            "Comprehensive data destruction and sanitization services.",
        },
        {
          title: "Secure chain of custody",
          description: "Complete tracking and documentation of asset handling.",
        },
      ],
    },
    connect: {
      title: "Connect",
      description:
        "Prepare, integrate, and optimize data and assets across your organization.",
      bgColor:
        "bg-linear-[221deg,#8B2269_-11.55%,#7C2C73_-0.39%,#5A468D_34.94%,#3E5AA1_68.41%,#2B69B0_103.75%,#1F72B9_137.22%,#1C75BC_174.41%]",
      // background: linear-gradient(221deg, #8B2269 -11.55%, #7C2C73 -0.39%, #5A468D 34.94%, #3E5AA1 68.41%, #2B69B0 103.75%, #1F72B9 137.22%, #1C75BC 174.41%);
      textColor: "text-overlook-white-text",
      blocks: [
        {
          title: "Data integration",
          description:
            "Seamlessly connect and integrate your data across systems.",
        },
        {
          title: "Digital transformation",
          description: "Modernize your data management infrastructure.",
        },
        {
          title: "Cloud connectivity",
          description: "Secure cloud-based data management solutions.",
        },
      ],
    },
    activate: {
      title: "Activate",
      description:
        "Generate new forms of value built on a trusted data foundation.",
      bgColor: "bg-linear-[227deg,#6DCFF6_-22.73%,#1B75BC_87.69%]",
      // background: linear-gradient(227deg, #6DCFF6 -22.73%, #1B75BC 87.69%);
      textColor: "text-overlook-white-text",
      blocks: [
        {
          title: "Analytics & insights",
          description: "Transform data into actionable business insights.",
        },
        {
          title: "AI and machine learning",
          description: "Leverage AI to unlock hidden value in your data.",
        },
        {
          title: "Innovation acceleration",
          description:
            "Accelerate innovation through data-driven decision making.",
        },
      ],
    },
  };

  const currentSection = activeSection && sections[activeSection];

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-between py-60 ${currentSection?.bgColor || "bg-linear-[180deg,#00A88E_0%,#1B75BC_100%]"}`}
    >
      {/* Text Content */}
      {currentSection ? (
        <div className="flex flex-col items-center justify-center text-center">
          <h1
            className={`mb-8 text-[60px] leading-[1.1] tracking-[-3px] ${currentSection.textColor}`}
          >
            {currentSection.title}
          </h1>
          <p
            className={`max-w-2xl text-[28px] leading-[1.2] tracking-[-1.4px] ${currentSection.textColor}`}
          >
            {currentSection.description}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-overlook-white-text mb-8 text-[60px] leading-[1.1] tracking-[-3px]">
            Protect, Connect, Activate
          </h1>
        </div>
      )}

      {/* Section Navigation */}
      <div className="flex flex-row gap-20">
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key as keyof typeof sections)}
            className={`h-41.5 w-41.5 rotate-45 rounded-lg font-medium transition-colors ${
              activeSection === key
                ? "bg-white/20 text-white"
                : "bg-white/10 text-white/70 active:bg-white/15"
            }`}
          >
            <p className="-rotate-45 text-2xl">{section.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
