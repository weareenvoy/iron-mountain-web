'use client';

import { useEffect, useRef } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { getNextBeatId, isBackgroundSeamlessTransition } from '@/app/(displays)/basecamp/_utils';
import { BasecampBeatId, isValidBasecampBeatId } from '@/lib/internal/types';

const CROSSFADE_DURATION_MS = 800 as const;

// Local fallback video for when API is down
const FALLBACK_VIDEO_URL = '/videos/basecamp_fallback.webm';

const Background = () => {
  const { data, error, exhibitState, loading, setReadyBeatId } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const rawBeatId = `${momentId}-${beatIdx + 1}`;

  // Derive fallback state: only show fallback after loading completes and there's an error or no data
  // This prevents flashing the fallback during normal initial load
  const shouldUseFallback = !loading && (error || !data);

  // Derive URL outside effect. Only re-run effect when URL actually changes
  const beatId = isValidBasecampBeatId(rawBeatId) ? rawBeatId : null;
  const url = beatId && data ? data.beats[beatId].url : undefined;

  // Ref for data access inside effect without causing re-runs
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // 2 videos "ping pong" between, 1 visible, 1 invisible.
  const a = useRef<HTMLVideoElement>(null);
  const active = useRef<'a' | 'b'>('a');
  const activeDisplayRef = useRef<HTMLSpanElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const lastBeat = useRef<BasecampBeatId | null>(null);

  // Unmute videos on first user interaction (required for browsers without kiosk flags)
  useEffect(() => {
    const unmute = () => {
      if (a.current) a.current.muted = false;
      if (b.current) b.current.muted = false;
      console.info('[Video] Audio unlocked via user gesture');
      // Remove all listeners after first interaction
      document.removeEventListener('click', unmute);
      document.removeEventListener('keydown', unmute);
      document.removeEventListener('touchstart', unmute);
    };

    document.addEventListener('click', unmute, { once: true });
    document.addEventListener('keydown', unmute, { once: true });
    document.addEventListener('touchstart', unmute, { once: true });

    return () => {
      document.removeEventListener('click', unmute);
      document.removeEventListener('keydown', unmute);
      document.removeEventListener('touchstart', unmute);
    };
  }, []);

  // Helper to update active video and sync debug display
  const updateActiveDisplay = (value: 'a' | 'b') => {
    active.current = value;
    if (activeDisplayRef.current) {
      activeDisplayRef.current.textContent = value.toUpperCase();
    }
  };

  useEffect(() => {
    if (!a.current || !b.current) return;

    // We check shouldUseFallback to avoid flashing fallback during normal load
    if (shouldUseFallback) {
      const video = a.current;
      // Use getAttribute('src') for comparison
      const currentSrc = video.getAttribute('src');
      if (currentSrc !== FALLBACK_VIDEO_URL) {
        video.src = FALLBACK_VIDEO_URL;
        video.loop = true;
        video.load();
        video.play().catch(() => {});
      }

      // Reset state so recovery works when data comes back.
      a.current.style.opacity = '1';
      b.current.style.opacity = '0';
      lastBeat.current = null;
      setReadyBeatId(null);
      updateActiveDisplay('a');

      return;
    }

    if (!beatId || !url) return;

    if (beatId === lastBeat.current) return;

    const lastBeatId: BasecampBeatId | null =
      lastBeat.current && isValidBasecampBeatId(lastBeat.current) ? lastBeat.current : null;

    // First beat after page reload → force into A
    const isFirstLoad = lastBeatId === null;
    const isAmbient = momentId === 'ambient';
    const seamless = !isFirstLoad && isBackgroundSeamlessTransition(lastBeatId, beatId);

    // Determine visible and invisible
    const visible = active.current === 'a' ? a.current : b.current;
    const hidden = active.current === 'a' ? b.current : a.current;

    // Track listeners for cleanup
    const cleanupFns: (() => void)[] = [];

    // Clear ready state - foreground will wait until this beat is ready
    setReadyBeatId(null);

    // Configure the incoming video
    const setupIncomingVideo = (video: HTMLVideoElement) => {
      video.currentTime = 0;
      video.loop = isAmbient;

      // Only set src and load if URL is different
      // If URL matches, the video is already loading/loaded from preload - don't restart
      if (video.getAttribute('src') !== url) {
        video.src = url;
        video.load();
      }
    };

    const startPlaybackAndSignalReady = (video: HTMLVideoElement) => {
      video.play().catch(e => console.error('Play failed:', e));

      const handlePlaying = () => {
        if (lastBeat.current !== beatId) return; // Stale
        setReadyBeatId(beatId);
      };
      video.addEventListener('playing', handlePlaying, { once: true });
      cleanupFns.push(() => video.removeEventListener('playing', handlePlaying));
    };

    // Preload next beat into the video that will be hidden after current switch
    const preloadNextBeat = (target: HTMLVideoElement) => {
      const nextBeatId = getNextBeatId(beatId, isAmbient);
      if (nextBeatId && dataRef.current?.beats[nextBeatId].url) {
        if (lastBeat.current === beatId) {
          target.src = dataRef.current.beats[nextBeatId].url;
        }
      }
    };

    if (isFirstLoad) {
      // First load: use video A directly
      setupIncomingVideo(a.current!);
      updateActiveDisplay('a');

      const handleCanPlayThrough = () => startPlaybackAndSignalReady(a.current!);
      a.current!.addEventListener('canplaythrough', handleCanPlayThrough, { once: true });
      cleanupFns.push(() => a.current?.removeEventListener('canplaythrough', handleCanPlayThrough));

      // Preload next beat into B (hidden)
      preloadNextBeat(b.current!);
    } else {
      // Subsequent beats
      setupIncomingVideo(hidden);

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
        updateActiveDisplay(active.current === 'a' ? 'b' : 'a');

        // Preload next beat AFTER switch (visible is now hidden)
        // NOTE: For seamless (0ms) transitions, CSS `transitionend` event may not fire.
        // We preload immediately here instead of waiting for transitionend.
        if (seamless) {
          preloadNextBeat(visible);
        }
      };

      if (hidden.readyState >= 3) {
        // HAVE_ENOUGH_DATA
        performSwitch();
      } else {
        hidden.addEventListener('canplaythrough', performSwitch, { once: true });
        cleanupFns.push(() => hidden.removeEventListener('canplaythrough', performSwitch));
      }

      // Non-seamless: wait for crossfade to complete before preloading.
      // NOTE: transitionend reliably fires for non-zero duration transitions,
      if (!seamless) {
        const handleTransitionEnd = () => {
          preloadNextBeat(visible);
        };
        visible.addEventListener('transitionend', handleTransitionEnd, { once: true });
        cleanupFns.push(() => visible.removeEventListener('transitionend', handleTransitionEnd));
      }
    }

    // Update at the end. If we update early, seamless check would always be false.
    lastBeat.current = beatId;

    // Remove all listeners
    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [beatId, momentId, setReadyBeatId, shouldUseFallback, url]);

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
      {/* Videos start muted for autoplay compliance; unmuted on first user gesture */}
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

      {/* For debugging only */}
      <div className="pointer-events-none absolute top-4 left-4 rounded bg-black/60 px-3 py-2 font-mono text-sm text-white">
        <div>{beatId}</div>
        <div>
          Active: <span ref={activeDisplayRef}>A</span>
        </div>
        <p>
          Time: <span ref={timeDisplayRef}>0.0s</span>
        </p>
      </div>
    </div>
  );
};

export default Background;
