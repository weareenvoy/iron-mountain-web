'use client';

import { useEffect, useRef, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { getNextBeatId, isSeamlessVideoTransition } from '@/app/(displays)/basecamp/_utils';
import { BasecampBeatId, isValidBasecampBeatId } from '@/lib/internal/types';

const CROSSFADE_DURATION_MS = 800 as const;

const Background = () => {
  const { data, exhibitState, setReadyBeatId } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const beatId = `${momentId}-${beatIdx + 1}`;

  // 2 videos "ping pong" between, 1 visible, 1 invisible.
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const active = useRef<'a' | 'b'>('a');
  const [activeDisplay, setActiveDisplay] = useState<'a' | 'b'>('a');
  const lastBeat = useRef<null | string>(null);

  useEffect(() => {
    if (!data || !a.current || !b.current) return;

    if (!isValidBasecampBeatId(beatId)) return;

    const url = data.beats[beatId].url;
    if (!url || beatId === lastBeat.current) return;

    // First beat after page reload → force into A
    const isFirstLoad = lastBeat.current === null;
    const isAmbient = momentId === 'ambient';

    // Determine visible and invisible
    const visible = active.current === 'a' ? a.current : b.current;
    const hidden = active.current === 'a' ? b.current : a.current;

    // Clear ready state - foreground will wait until this beat is ready
    setReadyBeatId(null);

    // Configure the incoming video
    const setupIncomingVideo = (video: HTMLVideoElement) => {
      video.src = url;
      video.currentTime = 0;
      video.loop = isAmbient;
      video.load();
    };

    const startPlaybackAndSignalReady = (video: HTMLVideoElement) => {
      video.play().catch(e => console.error('Play failed:', e));

      video.addEventListener(
        'playing',
        () => {
          if (lastBeat.current !== beatId) return; // Stale
          setReadyBeatId(beatId);
        },
        { once: true }
      );
    };

    if (isFirstLoad) {
      // First load: use video A directly
      setupIncomingVideo(a.current!);
      active.current = 'a';

      a.current!.addEventListener('canplaythrough', () => startPlaybackAndSignalReady(a.current!), { once: true });
    } else {
      // Subsequent beats
      setupIncomingVideo(hidden);

      const seamless = isSeamlessVideoTransition(lastBeat.current as BasecampBeatId | null, beatId);

      const performSwitch = () => {
        if (lastBeat.current !== beatId) return;

        if (seamless) {
          // Instant switch. No fade, perfect continuity
          visible.style.transition = hidden.style.transition = 'opacity 0ms';
          visible.style.opacity = '0';
          hidden.style.opacity = '1';
        } else {
          // Normal crossfade on moment change
          visible.style.transition = hidden.style.transition = `opacity ${CROSSFADE_DURATION_MS}ms ease`;
          visible.style.opacity = '0';
          hidden.style.opacity = '1';
        }

        startPlaybackAndSignalReady(hidden);
        active.current = active.current === 'a' ? 'b' : 'a';
        setActiveDisplay(active.current);
      };

      if (hidden.readyState >= 3) {
        // HAVE_ENOUGH_DATA
        performSwitch();
      } else {
        hidden.addEventListener('canplaythrough', performSwitch, { once: true });
      }
    }

    // Preload next beat into the now-visible (soon-to-be-hidden) video
    const nextBeatId = getNextBeatId(beatId, isAmbient);

    if (nextBeatId && data.beats[nextBeatId].url) {
      // For first load: preload into B immediately
      // For transitions: preload into the video that will be hidden next (i.e. current visible)
      const preloadTarget = isFirstLoad ? b.current! : visible;

      if (isFirstLoad) {
        preloadTarget.src = data.beats[nextBeatId].url;
      } else {
        // Wait until crossfade ends
        visible.addEventListener(
          'transitionend',
          () => {
            if (lastBeat.current === beatId) {
              preloadTarget.src = data.beats[nextBeatId].url;
            }
          },
          { once: true }
        );
      }
    }

    lastBeat.current = beatId;
  }, [beatId, data, momentId, setReadyBeatId]);

  // For debugging only. Update display time
  const timeDisplayRef = useRef<HTMLSpanElement>(null);
  const handleTimeUpdate = () => {
    const currentVideo = active.current === 'a' ? a.current : b.current;
    if (currentVideo && timeDisplayRef.current) {
      timeDisplayRef.current.textContent = currentVideo.currentTime.toFixed(3) + 's';
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        muted
        onTimeUpdate={handleTimeUpdate}
        playsInline
        preload="auto"
        ref={a}
        style={{ opacity: 1, transition: `opacity ${CROSSFADE_DURATION_MS}ms ease` }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        muted
        onTimeUpdate={handleTimeUpdate}
        playsInline
        preload="auto"
        ref={b}
        style={{ opacity: 0, transition: `opacity ${CROSSFADE_DURATION_MS}ms ease` }}
      />

      <div className="pointer-events-none absolute top-4 left-4 rounded bg-black/60 px-3 py-2 font-mono text-sm text-white">
        <div>{beatId}</div>
        <div>Active: {activeDisplay.toUpperCase()}</div>
        <p>
          Time: <span ref={timeDisplayRef}>0.0s</span>
        </p>
      </div>
    </div>
  );
};

export default Background;
