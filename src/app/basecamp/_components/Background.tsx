"use client";

import { useEffect, useRef, useState } from "react";
import { useBasecamp } from "./BasecampProvider";

// Time mapping for bullet point moments.
const TIME_MAPPING: Record<string, number[]> = {
  // Comment it out for now, because the ambient state might be a separate looping gif, not a part of the main video.
  // ambient: [8], // 1 beat: 0s -> 8s.
  welcome: [4, 10, 16, 26],
  problem: [29, 48, 57, 68],
  possibilities: [72, 78, 88, 96, 103],
  ascend: [107, 120, 138],
};

const sectionOrder = ["welcome", "problem", "possibilities", "ascend"];

// Get previous moment's last time point as start time.
const getSectionStartTime = (section: string): number => {
  const sectionIndex = sectionOrder.indexOf(section);
  if (sectionIndex === 0) return 0;
  const previousSection = sectionOrder[sectionIndex - 1];
  const previousTimePoints = TIME_MAPPING[previousSection];
  return previousTimePoints[previousTimePoints.length - 1];
};

// Calculate time range for a "beat"
const getBeatTimeRange = (section: string, beatIndex: number) => {
  const timePoints = TIME_MAPPING[section];
  if (!timePoints || beatIndex >= timePoints.length || beatIndex < 0) {
    console.error(`Invalid section or beat: ${section}, beat ${beatIndex}`);
    return null;
  }

  const start =
    beatIndex === 0 ? getSectionStartTime(section) : timePoints[beatIndex - 1];
  const end = timePoints[beatIndex];

  return { start, end };
};

export default function Background() {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);

  // The moment and beat might come from GEC.
  const { currentMoment, currentBeatIdx } = useBasecamp();
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  // Preload and start ambient video on mount
  useEffect(() => {
    if (ambientVideoRef.current) {
      ambientVideoRef.current.load();
      ambientVideoRef.current.play().catch((err) => {
        console.error("Error playing ambient video on mount:", err);
      });
    }
    if (mainVideoRef.current) {
      mainVideoRef.current.load();
    }
  }, []);

  // Video playback logic
  useEffect(() => {
    // Ambient
    if (currentMoment === "ambient") {
      // Pause the main video if it's playing.
      if (mainVideoRef.current) mainVideoRef.current.pause();
      // Play the looping ambient video.
      if (ambientVideoRef.current) {
        ambientVideoRef.current.currentTime = 0; // Reset to start
        ambientVideoRef.current.play().catch((err) => {
          console.error("Error playing ambient video:", err);
        });
      }
    } else {
      // Non-ambient: play the main video.
      if (ambientVideoRef.current) ambientVideoRef.current.pause();
      const timeRange = getBeatTimeRange(currentMoment, currentBeatIdx);
      if (
        mainVideoRef.current &&
        timeRange &&
        Number.isFinite(timeRange.start)
      ) {
        setIsSeeking(true);
        mainVideoRef.current.currentTime = timeRange.start;
        mainVideoRef.current.play().catch((err) => {
          console.error("Error playing main video:", err);
        });
        console.log(
          `Seeking to ${timeRange.start}s for ${currentMoment} beat ${currentBeatIdx}`,
        );
      } else {
        console.error("Invalid time range or video not ready:", {
          currentMoment,
          currentBeatIdx,
          timeRange,
        });
      }
    }
  }, [currentMoment, currentBeatIdx]);

  // Handle main video seeking
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      setIsSeeking(false);
    };
    video.addEventListener("seeked", handleSeeked);
    return () => {
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  // Handle main video time update for non-ambient sections
  const handleVideoTimeUpdate = () => {
    if (!mainVideoRef.current || isSeeking || currentMoment === "ambient")
      return;

    const currentTime = mainVideoRef.current.currentTime;
    const timeRange = getBeatTimeRange(currentMoment, currentBeatIdx);

    if (timeRange && currentTime >= timeRange.end - 0.1) {
      mainVideoRef.current.pause();
      console.log(
        `Paused at ${currentTime}s for ${currentMoment} beat ${currentBeatIdx}`,
      );
    }
  };

  return (
    <>
      {/* Ambient video (looping) */}
      <video
        ref={ambientVideoRef}
        className={`h-full w-full object-cover ${currentMoment === "ambient" ? "block" : "hidden"}`}
        // Ask where will this be hosted?
        src={`${process.env.NEXT_PUBLIC_CDN_HOST_NAME}/basecamp_loop.webm`}
        // src="/videos/IRM_Basecamp_Motion_R2_part_loop.mp4"
        loop
        autoPlay
        muted
      />

      {/* Main video background */}
      <video
        ref={mainVideoRef}
        className={`h-full w-full object-cover ${currentMoment !== "ambient" ? "block" : "hidden"}`}
        src={`${process.env.NEXT_PUBLIC_CDN_HOST_NAME}/basecamp_content.webm`}
        // src="/videos/IRM_Basecamp_Motion_R2_part_content.mp4"
        onTimeUpdate={handleVideoTimeUpdate}
        autoPlay={false}
        muted
      />

      {/* Debug info */}
      <div className="absolute top-4 left-4 rounded bg-black/50 p-2 text-white">
        <p>Moment: {currentMoment}</p>
        <p>BeatIdx: {currentBeatIdx}</p>
        <p>
          Time:{" "}
          {(currentMoment === "ambient"
            ? ambientVideoRef.current?.currentTime
            : mainVideoRef.current?.currentTime
          )?.toFixed(1)}
          s
        </p>
      </div>
    </>
  );
}
