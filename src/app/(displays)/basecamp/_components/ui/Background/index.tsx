'use client';

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { cn } from '@/lib/tailwind/utils/cn';
import { getBeatTimeRange, isTimedSection } from './utils';

const Background = () => {
  // The moment and beat might come from GEC.
  const { exhibitState } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const ambientVideoRef = useRef<HTMLVideoElement | null>(null);
  // Tracks the last played moment/beat to prevent re-triggering playback
  const lastPlayedRef = useRef<null | { id: string; idx: number }>(null);

  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  // For dev testing, read it from an S3 bucket. Where will this be hosted in prod?
  const mainVideoUrl = `${process.env.NEXT_PUBLIC_CDN_HOST_NAME}/BASECAMP-FPO-content.webm`;
  const ambientVideoUrl = `${process.env.NEXT_PUBLIC_CDN_HOST_NAME}/BASECAMP-FPO-loop.webm`;

  // This tracks preload progress, but it does not help with loading.
  const progressHandler = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.buffered.length > 0 && video.duration) {
      const percent = (video.buffered.end(0) / video.duration) * 100;
      console.info(`main vid preload: ${percent.toFixed(1)}%`);
    }
  };

  const timeUpdateHandler = useCallback(
    (event: SyntheticEvent<HTMLVideoElement>) => {
      if (isSeeking || momentId === 'ambient' || !isTimedSection(momentId)) return;

      const video = event.currentTarget;
      const currentTime = video.currentTime;
      const timeRange = getBeatTimeRange(momentId, beatIdx);

      if (timeRange && timeRange.end && currentTime >= timeRange.end - 0.1) {
        video.pause();
        console.info(`Paused at ${currentTime}s for ${momentId} beat ${beatIdx}`);
      }
    },
    [isSeeking, momentId, beatIdx]
  );

  const seekingHandler = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const currentTime = video.currentTime;
    console.info(`Seeking to ${currentTime}s for ${momentId}`);
    setIsSeeking(true);
  };

  const seekedHandler = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    const currentTime = video.currentTime;
    console.info(`Seeked to ${currentTime}s for ${momentId}`);
    setIsSeeking(false);
  };

  // Core Video Playback Logic: Synchronizes React state (momentId, beatIdx) to the external video system
  useEffect(() => {
    const mainVideo = mainVideoRef.current;
    const ambientVideo = ambientVideoRef.current;

    // Create keys to check if the current state is the same as the last played state
    const currentMomentKey = `${momentId}-${beatIdx}`;
    const lastMomentKey = `${lastPlayedRef.current?.id}-${lastPlayedRef.current?.idx}`;

    // Optimization: If the target beat/moment hasn't changed, do nothing.
    if (currentMomentKey === lastMomentKey) {
      return;
    }

    // Update the ref right away to prevent re-triggering this logic on simple re-renders
    lastPlayedRef.current = { id: momentId, idx: beatIdx };

    // A. Ambient Mode
    if (momentId === 'ambient') {
      if (mainVideo) mainVideo.pause();
      if (ambientVideo) {
        ambientVideo.currentTime = 0; // Reset to start
        ambientVideo.play().catch(err => {
          console.error('Error playing ambient video:', err);
        });
      }
      return;
    }

    // B. Non-Ambient (Main Video) Logic
    if (ambientVideo) ambientVideo.pause();

    if (!isTimedSection(momentId)) return;

    const timeRange = getBeatTimeRange(momentId, beatIdx);

    // Perform a strict type check and cast
    if (
      mainVideo instanceof HTMLVideoElement && // Ensure it's a valid video element
      timeRange &&
      typeof timeRange.start === 'number' && // Check the type explicitly
      Number.isFinite(timeRange.start)
    ) {
      // TypeScript is now satisfied because we have explicitly checked the type.
      mainVideo.currentTime = timeRange.start;

      mainVideo.play().catch(err => {
        console.error('Error playing main video after seek:', err);
      });
      console.info(`Seeking to ${timeRange.start}s for ${momentId} beat ${beatIdx}`);
    } else {
      console.error('Invalid state or time range:', { beatIdx, momentId, timeRange });
    }
  }, [momentId, beatIdx]);

  return (
    <>
      {/* Ambient video (looping). Playback controlled in effects. */}
      <video
        className={cn('h-full w-full object-cover', momentId === 'ambient' ? 'block' : 'hidden')}
        loop
        muted
        playsInline
        ref={ambientVideoRef}
        src={ambientVideoUrl}
      />

      {/* Main video background */}
      <video
        className={cn('h-full w-full object-cover', momentId !== 'ambient' ? 'block' : 'hidden')}
        muted
        onProgress={progressHandler}
        onSeeked={seekedHandler}
        onSeeking={seekingHandler}
        onTimeUpdate={timeUpdateHandler}
        playsInline
        ref={mainVideoRef}
        src={mainVideoUrl}
      />
    </>
  );
};

export default Background;
