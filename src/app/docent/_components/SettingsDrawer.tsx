"use client";

import { useState } from "react";
import { FiX, FiVolume2, FiVolumeX, FiExternalLink } from "react-icons/fi";
import { Button } from "@/components/Button";
import Link from "next/link";

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExhibitControl {
  id: string;
  name: string;
  isOn: boolean;
  isMuted: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export function SettingsDrawer({ isOpen, onClose }: SettingsDrawerProps) {
  // TODO Mock settings state. Very TBD. Is this data from a specific endpoint, or a json from mqtt, so we dont even need a state.
  const [exhibitControls, setExhibitControls] = useState<ExhibitControl[]>([
    {
      id: "welcome-wall",
      name: "Entryway",
      isOn: true,
      hasError: false,
      isMuted: false,
    },
    {
      id: "basecamp",
      name: "Basecamp",
      isOn: true,
      hasError: false,
      isMuted: false,
    },
    {
      id: "overlook",
      name: "Overlook",
      isOn: false,
      hasError: true,
      errorMessage: "Failed to start program",
      isMuted: false,
    },
    {
      id: "solution-pathways",
      name: "Solution pathways",
      isOn: true,
      hasError: false,
      isMuted: false,
    },
    {
      id: "summit-room",
      name: "Summit room",
      isOn: true,
      hasError: false,
      isMuted: false,
    },
  ]);

  const handleToggleMute = (id: string) => {
    // TODO: This would send MQTT message to control exhibit
    setExhibitControls((prev) =>
      prev.map((control) =>
        control.id === id ? { ...control, isMuted: !control.isMuted } : control,
      ),
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`bg-primary-bg-grey fixed top-0 right-0 z-50 h-full w-[600px] transform p-10 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-primary-im-dark-blue text-[40px] leading-[48px] font-normal">
            Settings
          </h2>
        </div>

        {/* Controls List */}
        <div className="space-y-8">
          {exhibitControls.map((control) => (
            <div
              key={control.id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                {/* Status Icon */}
                {control.hasError ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#DA1E28"
                  >
                    <circle cx="12" cy="12" r="12" />
                    <path
                      d="M12 7v6M12 17h.01"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : control.isOn ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#8DC13F"
                  >
                    <circle cx="12" cy="12" r="12" />
                    <path
                      d="M7 13l3 3 7-7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <div className="h-6 w-6" />
                )}

                <span className="text-primary-im-dark-blue text-[28px]">
                  {control.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {control.hasError && (
                  <div className="flex items-center gap-2 text-[20px] text-[#58595B]">
                    <span>Error:</span>
                    <span>{control.errorMessage}</span>
                  </div>
                )}

                {/* Mute/Unmute Icon Button */}
                <button
                  onClick={() => handleToggleMute(control.id)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    control.isMuted
                      ? "bg-[#1B75BC] text-white"
                      : "bg-[#58595B] text-white"
                  }`}
                >
                  {control.isMuted ? (
                    <FiVolume2 size={24} />
                  ) : (
                    <FiVolumeX size={24} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EBC Lights Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="31"
              height="43"
              viewBox="0 0 31 43"
              fill="none"
            >
              <path
                d="M10.5416 40.8012H20.3025M11.5177 17.3752H19.3264M15.422 17.3752L15.422 29.0882M21.2786 27.7732C25.8953 25.58 29.0872 20.8743 29.0872 15.423C29.0872 7.87593 22.9691 1.75781 15.422 1.75781C7.87495 1.75781 1.75684 7.87593 1.75684 15.423C1.75684 20.8743 4.94874 25.58 9.56552 27.7732V29.0882C9.56552 30.9074 9.56552 31.817 9.86272 32.5345C10.259 33.4912 11.0191 34.2513 11.9757 34.6475C12.6932 34.9447 13.6028 34.9447 15.422 34.9447C17.2412 34.9447 18.1508 34.9447 18.8683 34.6475C19.825 34.2513 20.5851 33.4912 20.9814 32.5345C21.2786 31.817 21.2786 30.9074 21.2786 29.0882V27.7732Z"
                stroke="#6DCFF6"
                strokeWidth="3.51391"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-primary-im-dark-blue text-[28px]">
              EBC Lights
            </span>
          </div>
        </div>

        {/* End Tour Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <Button className="flex h-16 w-full text-[28px]" variant="secondary">
            <span>End tour & activate idle</span>
          </Button>
          <p className="w-100 text-primary-im-dark-blue text-[20px]">
            Tap to end the experience and bring all screens back to idle mode.
          </p>
        </div>
        {/* Open EBC Manual Link */}
        <Link
          href="https://www.ebcmanual.com"
          target="_blank"
          className="text-primary-im-light-blue flex items-center justify-center gap-3"
        >
          <FiExternalLink size={24} />
          <span className="text-[23px] font-normal">Open EBC Manual</span>
        </Link>

        {/* Close button */}
        <Button
          variant="outline"
          onClick={onClose}
          className="text-primary-im-dark-blue absolute top-10 right-10 active:opacity-70"
        >
          <FiX />
          <span className="text-[20px]">Close</span>
        </Button>
      </div>
    </>
  );
}
