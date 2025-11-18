'use client';

import { useEffect, useRef, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
// TODO: Please read this! We will have many chopped up videos. Each beat is a separate video!

// Time mapping for bullet point moments.
// The ambient state is a going to be a looping video. It's not a perfect loop now.
const TIME_MAPPING: Record<string, number[]> = {
  ascend: [103, 117, 134],
  possibilities: [70, 75, 85, 93, 100],
  problem: [26, 45, 53, 66],
  welcome: [1, 7, 12, 22],
};

const sectionOrder = ['welcome', 'problem', 'possibilities', 'ascend'];

// Get previous moment's last time point as start time.
const getSectionStartTime = (section: string): number => {
  const sectionIndex = sectionOrder.indexOf(section);
  if (sectionIndex === 0) return 0;
  const previousSection = sectionOrder[sectionIndex - 1];
  if (!previousSection) return 0;
  const previousTimePoints = TIME_MAPPING[previousSection];
  if (!previousTimePoints) return 0;
  const lastTimePoint = previousTimePoints[previousTimePoints.length - 1];
  if (!lastTimePoint) return 0;
  return lastTimePoint;
};

// Calculate time range for a "beat"
const getBeatTimeRange = (section: string, beatIndex: number) => {
  const timePoints = TIME_MAPPING[section];
  if (!timePoints || beatIndex >= timePoints.length || beatIndex < 0) {
    console.error(`Invalid section or beat: ${section}, beat ${beatIndex}`);
    return null;
  }

  const start = beatIndex === 0 ? getSectionStartTime(section) : timePoints[beatIndex - 1];
  const end = timePoints[beatIndex];

  return { end, start };
};

export default function Background() {
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);

  // The moment and beat might come from GEC.
  const { exhibitState } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    const ambientVideo = ambientVideoRef.current;
    if (!mainVideo || !ambientVideo) return;

    // For dev testing, read it from an S3 bucket. Where will this be hosted in prod?
    const mainVideoUrl = `${process.env.NEXT_PUBLIC_CDN_HOST_NAME}/BASECAMP-FPO-content.webm`;
    const ambientVideoUrl = `${process.env.NEXT_PUBLIC_CDN_HOST_NAME}/BASECAMP-FPO-loop.webm`;

    // Ambient: simple
    ambientVideo.src = ambientVideoUrl;
    ambientVideo.load();
    ambientVideo.play().catch(() => {});

    // Main: preload
    mainVideo.src = mainVideoUrl;
    mainVideo.preload = 'auto';
    mainVideo.load();

    // This tracks preload progress, but it does not help with loading.
    const onProgress = () => {
      if (mainVideo.buffered.length > 0 && mainVideo.duration) {
        const percent = (mainVideo.buffered.end(0) / mainVideo.duration) * 100;
        console.info(`main vid preload: ${percent.toFixed(1)}%`);
      }
    };
    mainVideo.addEventListener('progress', onProgress);

    return () => {
      mainVideo.removeEventListener('progress', onProgress);
    };
  }, []);

  // Video playback logic
  useEffect(() => {
    // Ambient
    if (momentId === 'ambient') {
      // Pause the main video if it's playing.
      if (mainVideoRef.current) mainVideoRef.current.pause();
      // Play the looping ambient video.
      if (ambientVideoRef.current) {
        ambientVideoRef.current.currentTime = 0; // Reset to start
        ambientVideoRef.current.play().catch(err => {
          console.error('Error playing ambient video:', err);
        });
      }
    } else {
      // Non-ambient: play the main video.
      if (ambientVideoRef.current) ambientVideoRef.current.pause();
      const timeRange = getBeatTimeRange(momentId, beatIdx);
      const mainVideo = mainVideoRef.current;
      if (!mainVideo?.currentTime) return;
      if (timeRange && Number.isFinite(timeRange.start)) {
        setIsSeeking(true);
        mainVideo.currentTime = timeRange.start ?? 0;
        mainVideo.play().catch((err: Error) => {
          console.error('Error playing main video:', err);
        });
        console.info(`Seeking to ${timeRange.start}s for ${momentId} beat ${beatIdx}`);
      } else {
        console.error('Invalid time range or video not ready:', {
          beatIdx,
          momentId,
          timeRange,
        });
      }
    }
  }, [momentId, beatIdx]);

  // Handle main video seeking
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      setIsSeeking(false);
    };
    video.addEventListener('seeked', handleSeeked);
    return () => {
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // Handle main video time update for non-ambient sections
  const handleVideoTimeUpdate = () => {
    if (!mainVideoRef.current || isSeeking || momentId === 'ambient') return;

    const currentTime = mainVideoRef.current.currentTime;
    const timeRange = getBeatTimeRange(momentId, beatIdx);

    if (timeRange && currentTime >= (timeRange.end ?? 0) - 0.1) {
      mainVideoRef.current.pause();
      console.info(`Paused at ${currentTime}s for ${momentId} beat ${beatIdx}`);
    }
  };

  return (
    <>
      {/* Video src is set in useEffect above */}
      {/* Ambient video (looping) */}
      <video
        autoPlay
        className={`h-full w-full object-cover ${momentId === 'ambient' ? 'block' : 'hidden'}`}
        loop
        muted
        ref={ambientVideoRef}
      />

      {/* Main video background */}
      <video
        autoPlay={false}
        className={`h-full w-full object-cover ${momentId !== 'ambient' ? 'block' : 'hidden'}`}
        muted
        onTimeUpdate={handleVideoTimeUpdate}
        ref={mainVideoRef}
      />

      {/* Debug info */}
      <div className="absolute top-4 left-4 rounded bg-black/50 p-2 text-white">
        <p>Moment: {momentId}</p>
        <p>BeatIdx: {beatIdx}</p>
        <p>
          Time:{' '}
          {(momentId === 'ambient' ? ambientVideoRef.current?.currentTime : mainVideoRef.current?.currentTime)?.toFixed(
            1
          )}
          s
        </p>
      </div>
    </>
  );
}
