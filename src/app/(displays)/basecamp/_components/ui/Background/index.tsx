'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { cn } from '@/lib/tailwind/utils/cn';
import DebugOverlay from './DebugOverlay';
import {
  createAmbientTimeHandler,
  createLoadedMetadataHandler,
  createMainTimeHandler,
  createProgressHandler,
  createSeekedHandler,
  getBeatTimeRange,
  isTimedSection,
  seekAndPlay,
  type Section,
  type TimedSection,
} from './utils';

const Background = () => {
  // The moment and beat might come from GEC.
  const { exhibitState } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;

  const [displayTime, setDisplayTime] = useState<number>(0);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const ambientVideoRef = useRef<HTMLVideoElement>(null);
  const isSeekingRef = useRef<boolean>(false);

  // Pre-compute the current time range whenever moment/beat change
  const timeRange = useMemo(() => {
    if (momentId === 'ambient') return null;
    const section = momentId as Section;
    if (section === 'ambient') return null;
    if (!isTimedSection(section)) {
      return null;
    }
    return getBeatTimeRange(section as TimedSection, beatIdx);
  }, [momentId, beatIdx]);

  // onTimeUpdate handler (memoized)
  const handleVideoTimeUpdate = useCallback(() => {
    if (!mainVideoRef.current || isSeekingRef.current || momentId === 'ambient') return;

    const currentTime = mainVideoRef.current.currentTime;
    const section = momentId as Section;
    const tr =
      section !== 'ambient' && isTimedSection(section) ? getBeatTimeRange(section as TimedSection, beatIdx) : null;

    if (tr && currentTime >= (tr.end ?? 0) - 0.1) {
      mainVideoRef.current.pause();
      console.info(`Paused at ${currentTime}s for ${momentId} beat ${beatIdx}`);
    }
  }, [beatIdx, momentId]);

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

    // Preload progress (informational)
    const onProgress = createProgressHandler(mainVideo);
    mainVideo.addEventListener('progress', onProgress);

    return () => {
      mainVideo.removeEventListener('progress', onProgress);
    };
  }, []);

  // Video playback logic
  useEffect(() => {
    // Ambient
    if (momentId === 'ambient') {
      if (mainVideoRef.current) mainVideoRef.current.pause();
      if (ambientVideoRef.current) {
        ambientVideoRef.current.currentTime = 0; // Reset to start
        ambientVideoRef.current.play().catch(err => {
          console.error('Error playing ambient video:', err);
        });
      }
    } else {
      if (ambientVideoRef.current) ambientVideoRef.current.pause();
      const mainVideo = mainVideoRef.current;
      if (!mainVideo) return;
      if (!timeRange || !Number.isFinite(timeRange.start)) {
        console.error('Invalid time range or video not ready:', {
          beatIdx,
          momentId,
          timeRange,
        });
        return;
      }

      const label = `${momentId} beat ${beatIdx}`;
      if (mainVideo.readyState >= 1) {
        seekAndPlay(mainVideo, timeRange.start ?? 0, label, isSeekingRef);
      } else {
        const onLoaded = createLoadedMetadataHandler(mainVideo, timeRange.start ?? 0, label, isSeekingRef);
        mainVideo.addEventListener('loadedmetadata', onLoaded, { once: true });
        try {
          mainVideo.load();
        } catch {
          // ignore
        }
      }
    }
  }, [momentId, beatIdx, timeRange]);

  // Handle main video seeking
  useEffect(() => {
    const video = mainVideoRef.current;
    if (!video) return;

    const handleSeeked = createSeekedHandler(isSeekingRef);
    video.addEventListener('seeked', handleSeeked);
    return () => {
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // Handle main/ambient time updates and display
  useEffect(() => {
    const ambient = ambientVideoRef.current;
    const main = mainVideoRef.current;
    if (!ambient || !main) return;

    const handleAmbientTime = createAmbientTimeHandler(() => momentId === 'ambient', ambient, setDisplayTime);
    const handleMainTime = createMainTimeHandler(() => momentId !== 'ambient', main, setDisplayTime);

    ambient.addEventListener('timeupdate', handleAmbientTime);
    main.addEventListener('timeupdate', handleMainTime);

    const rafId = requestAnimationFrame(() => {
      setDisplayTime(momentId === 'ambient' ? ambient.currentTime : main.currentTime);
    });

    return () => {
      ambient.removeEventListener('timeupdate', handleAmbientTime);
      main.removeEventListener('timeupdate', handleMainTime);
      cancelAnimationFrame(rafId);
    };
  }, [momentId]);

  return (
    <>
      {/* Video src is set in useEffect above */}
      {/* Ambient video (looping) */}
      <video
        autoPlay
        className={cn('h-full w-full object-cover', momentId === 'ambient' ? 'block' : 'hidden')}
        loop
        muted
        ref={ambientVideoRef}
      />

      {/* Main video background */}
      <video
        autoPlay={false}
        className={cn('h-full w-full object-cover', momentId !== 'ambient' ? 'block' : 'hidden')}
        muted
        onTimeUpdate={handleVideoTimeUpdate}
        ref={mainVideoRef}
      />

      {/* Debug info */}
      <DebugOverlay beatIdx={beatIdx} momentId={momentId} time={displayTime} />
    </>
  );
};

export default Background;
