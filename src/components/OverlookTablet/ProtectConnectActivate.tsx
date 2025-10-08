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
      bgColor: "bg-[#14477d]",
      textColor: "text-[#ededed]",
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
      bgColor: "bg-[#00a88e]",
      textColor: "text-[#ededed]",
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
      bgColor: "bg-[#1b75bc]",
      textColor: "text-[#ededed]",
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
      className={`relative flex h-full w-full flex-col items-center justify-between py-60 ${currentSection?.bgColor || "bg-[#14477d]"}`}
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
          <h1 className="mb-8 text-[60px] leading-[1.1] tracking-[-3px] text-[#ededed]">
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
                : "bg-white/10 text-white/70 hover:bg-white/15"
            }`}
          >
            <p className="-rotate-45 text-2xl">{section.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
