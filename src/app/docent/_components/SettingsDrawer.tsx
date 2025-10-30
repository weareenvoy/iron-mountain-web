"use client";

import { useState } from "react";
import { FiX, FiVolume2, FiVolumeX, FiExternalLink, FiArrowRight } from "react-icons/fi";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { Button } from "@/components/Button";
import Link from "next/link";
import { useMqtt } from "@/providers/MqttProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/Switch";

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
  const { client } = useMqtt();
  const router = useRouter();
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
    // This would send MQTT message to control exhibit
    setExhibitControls((prev) =>
      prev.map((control) =>
        control.id === id ? { ...control, isMuted: !control.isMuted } : control,
      ),
    );
  };

  const handleEndTour = () => {
    // This would send MQTT message to GEC
    client?.publish("tour/end", JSON.stringify({}));
    console.log("Ending tour");

    // Go back to home page, or schedule page
    router.push("/docent");
    onClose();
  };

  const handleToggleEBCLights = (checked: boolean) => {
    // This would send MQTT message to control EBC Lights
    console.log("Toggling EBC Lights, will send MQTT message", checked);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="absolute inset-0 z-40 bg-black/50" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`absolute top-0 right-0 z-50 h-full w-[600px] transform bg-[#2e2e2e] px-15 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} `}
      >
        {/* Header */}
        <div className="mt-35 mb-19 flex items-center justify-between">
          <h2 className="text-primary-bg-grey text-4xl leading-[48px]">
            Settings
          </h2>
          <Button
            variant="outline-light-grey"
            onClick={onClose}
            className="mr-[-30px] h-13 gap-3.5 px-5"
          >
            <FiX size={24} />
            <span className="h-6.25 text-[20px]">Close</span>
          </Button>
        </div>

        {/* Controls List */}
        <div className="space-y-8">
          {exhibitControls.map((control) => (
            <div
              key={control.id}
              className="flex h-15 items-center justify-between"
            >
              <div className="flex flex-col gap-1">
                {/* Status Icon and control name*/}
                <div className="flex items-center gap-3.5">
                  {control.isOn ? (
                    <FaCircleCheck size={28} color="#8dc13f" />
                  ) : (
                    <FaCircleExclamation size={28} color="#f7931e" />
                  )}
                  <span
                    className={`${control.isOn ? "text-primary-im-light-blue" : "text-secondary-im-orange"} text-2xl`}
                  >
                    {control.name}
                  </span>
                </div>

                {/* Error message */}
                {control.hasError && (
                  <span className="text-secondary-im-orange ml-11 text-[16px]">
                    {control.errorMessage}
                  </span>
                )}
              </div>

              {/* Mute/Unmute Icon Button */}
              <button
                onClick={() => handleToggleMute(control.id)}
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                  control.isMuted
                    ? "text-primary-im-grey"
                    : "text-primary-im-light-blue"
                }`}
              >
                {control.isMuted ? (
                  <FiVolumeX size={24} />
                ) : (
                  <FiVolume2 size={24} />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* EBC Lights Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex h-15 items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Lightbulb icon */}
            <Image
              src="/images/lightbulb.svg"
              alt="Lightbulb"
              width={24}
              height={24}
            />

            <span className="text-primary-im-light-blue text-2xl">
              EBC Lights
            </span>
          </div>

          {/* Switch to toggle EBC Lights. TODO Is the value from GEC state? */}
          <Switch id="ebc-lights" onLabel="On" offLabel="Off" onCheckedChange={handleToggleEBCLights} />
        </div>

        {/* End Tour Button */}
        <div className="my-8 border-t border-[#58595B]"></div>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Button
            className="flex h-16 w-full text-xl"
            variant="primary"
            onClick={handleEndTour}
          >
            <span>End tour & activate idle</span>
            <FiArrowRight size={24} />
          </Button>
          <p className="text-primary-bg-grey w-70 text-[16px] leading-loose tracking-[-0.8px]">
            Tap to end the experience and bring all screens back to idle mode.
          </p>
        </div>
        {/* Open EBC Manual Link */}
        <Link
          href="https://www.ebcmanual.com"
          target="_blank"
          className="text-primary-im-light-blue mt-10.5 flex items-center justify-center gap-3"
        >
          <FiExternalLink size={24} />
          <span className="text-[16px] leading-loose">Open EBC Manual</span>
        </Link>
      </div>
    </>
  );
}
