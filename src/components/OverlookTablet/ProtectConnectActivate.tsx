"use client";

import Image from "next/image";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { Button } from "../Button";

enum SectionKey {
  Protect = "protect",
  Connect = "connect",
  Activate = "activate",
}

type Block = { title: string; description: string };
type Section = {
  title: string;
  description: string;
  bgColor: string;
  selectedColor: string;
  blocks: Block[];
};

// 3 types of UI. Nothing is selected, a section is selected, a block of a section is selected
type ViewState =
  | { mode: "none" }
  | { mode: "section"; section: SectionKey }
  | { mode: "details"; section: SectionKey; selectedBlockIdx: number | null };

// Section Data. TBD if it's in CMS or hardcoded.
const sections: Record<SectionKey, Section> = {
  [SectionKey.Protect]: {
    title: "Protect",
    description: "Safeguard and preserve your most valuable assets.",
    bgColor: "bg-linear-[30deg,#308477_-9.61%,#6EF4D4_158.3%]",
    selectedColor: "bg-secondary-im-purple",
    blocks: [
      {
        title: "Museum-grade security",
        description:
          "Secure content with Smart Vault, a digital repository purpose built for rich media workflows",
      },
      {
        title: "World-class data sanitization",
        description:
          "Ensures your data is protected, along with on-site and off-site destruction for all media types",
      },
      {
        title: "Secure chain of custody",
        description:
          "Enhanced with certifications including GDPR, SOC 2 Type II, ISO, HIPA and FEDRAMP",
      },
    ],
  },
  [SectionKey.Connect]: {
    title: "Connect",
    description:
      "Prepare, integrate, and optimize data and assets across your organization.",
    bgColor:
      "bg-linear-[221deg,#8B2269_-11.55%,#7C2C73_-0.39%,#5A468D_34.94%,#3E5AA1_68.41%,#2B69B0_103.75%,#1F72B9_137.22%,#1C75BC_174.41%]",
    selectedColor: "bg-secondary-im-orange",
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
  [SectionKey.Activate]: {
    title: "Activate",
    description:
      "Generate new forms of value built on a trusted data foundation.",
    bgColor: "bg-linear-[227deg,#6DCFF6_-22.73%,#1B75BC_87.69%]",
    selectedColor: "bg-secondary-im-green",
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

// Main Component
export default function ProtectConnectActivate() {
  const [viewState, setViewState] = useState<ViewState>({ mode: "none" });

  const currentSection =
    viewState.mode !== "none" ? sections[viewState.section] : null;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-between py-50 ${
        currentSection?.bgColor || "bg-linear-[0deg,#00A88E_0%,#1B75BC_100%]"
      }`}
    >
      {/* No section selected */}
      {viewState.mode === "none" && (
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-primary-bg-grey text-[28px] leading-[1.2] tracking-[-1.4px]">
            Protect, Connect, Activate
          </h1>
          <p className="font-geometria mt-70 mb-28 text-[60px] leading-[1.1] tracking-[-3px]">
            We unlock what’s possible
          </p>
          <p className="w-125 text-[28px] leading-[1.2] tracking-[-1.4px]">
            Tap to discover how Iron Mountain can transform your organization
            through our key pillars of operation
          </p>
        </div>
      )}

      {/* Section selected */}
      {currentSection && viewState.mode === "section" && (
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-geometria text-[40px] leading-[1.1] tracking-[-2px]">
            {currentSection.title}
          </h1>
          <Image
            src="/images/dotted-line-with-circles.svg"
            alt="Dotted line with circles"
            width={38}
            height={215}
          />

          <p className="max-w-100 pt-12.75 pb-22.5 text-[28px] leading-[1.2] tracking-[-1.4px]">
            {currentSection.description}
          </p>
          <Button
            variant="overlook"
            size="md"
            onClick={() =>
              setViewState({
                mode: "details",
                section: viewState.section,
                selectedBlockIdx: null,
              })
            }
          >
            Explore details
          </Button>
        </div>
      )}

      {/* Details view */}
      {currentSection && viewState.mode === "details" && (
        <div className="relative flex h-[1084px] w-[879px] flex-col items-center rounded-[40px] bg-linear-[337deg,rgba(237,237,237,0.51)_-12.2%,rgba(237,237,237,0.00)_142.5%] px-8 pt-18.75 pb-22.5 text-center">
          <h1 className="text-primary-bg-grey text-[28px] leading-[1.1] tracking-[-3px]">
            {currentSection.title}
          </h1>
          <div className="flex w-full flex-col gap-2.5">
            {currentSection.blocks.map((block, index) => (
              <div
                key={block.title}
                className={`bg-primary-bg-grey text-primary-im-dark-blue w-full overflow-hidden rounded-[20px] p-10 transition-all duration-300 ease-in-out ${
                  viewState.selectedBlockIdx === index
                    ? "h-[346px]"
                    : "h-[121px]"
                }`}
              >
                <div className="flex flex-row items-center justify-between">
                  <div />
                  <p className="text-[28px] leading-[1.2] tracking-[-1.4px]">
                    {block.title}
                  </p>
                  {viewState.selectedBlockIdx === index ? (
                    <FiMinus
                      className="h-6 w-6 cursor-pointer"
                      onClick={() =>
                        setViewState({
                          mode: "details",
                          section: viewState.section,
                          selectedBlockIdx: null,
                        })
                      }
                    />
                  ) : (
                    <FiPlus
                      className="h-6 w-6 cursor-pointer"
                      onClick={() =>
                        setViewState({
                          mode: "details",
                          section: viewState.section,
                          selectedBlockIdx: index,
                        })
                      }
                    />
                  )}
                </div>
                {viewState.selectedBlockIdx === index && (
                  <p className="mt-4 text-[20px] leading-[1.4] tracking-[-0.6px]">
                    {block.description}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Button
            className="absolute bottom-22.5 w-60 rounded-full text-2xl"
            variant="overlook-inverted"
            size="md"
            onClick={() =>
              setViewState({ mode: "section", section: viewState.section })
            }
          >
            Close details
          </Button>
        </div>
      )}

      {/* Navigation buttons */}
      {viewState.mode !== "details" && (
        <div className="mt-16 flex flex-row gap-20">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() =>
                setViewState({ mode: "section", section: key as SectionKey })
              }
              className={`h-41.5 w-41.5 rotate-45 rounded-lg font-medium transition-colors ${
                viewState.mode !== "none" && viewState.section === key
                  ? `${section.selectedColor} text-primary-bg-grey`
                  : "text-primary-im-dark-blue bg-white active:bg-white/15"
              }`}
            >
              <p className="-rotate-45 text-2xl">{section.title}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
