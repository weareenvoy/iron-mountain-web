'use client';

import { useEffect, useRef, useState } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { BEAT_ORDER, isValidBeatId } from '@/lib/internal/types';

const CROSSFADE_DURATION_MS = 800;

const Background = () => {
  const { data, exhibitState, setBackgroundReady } = useBasecamp();
  const { beatIdx, momentId } = exhibitState;
  const beatId = `${momentId}-${beatIdx + 1}`;

  // 2 videos "ping pong" between, 1 visible, 1 invisible.
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const active = useRef<'a' | 'b'>('a');
  const [activeDisplay, setActiveDisplay] = useState<'a' | 'b'>('a');
  const lastBeat = useRef<string>('');

  useEffect(() => {
    if (!data || !a.current || !b.current) return;

    if (!isValidBeatId(beatId)) return;

    const url = data.beats[beatId].url;
    if (!url || beatId === lastBeat.current) return;

    // First beat after page reload → force into A
    if (!lastBeat.current) {
      setBackgroundReady(false);
      a.current.src = url;
      a.current.currentTime = 0;
      a.current.loop = momentId === 'ambient';

      const onReady = () => {
        setBackgroundReady(true);
        a.current?.play();
      };

      a.current.addEventListener('canplaythrough', onReady, { once: true });
      a.current.load();
      lastBeat.current = beatId;

      // Preload next into B
      const nextIdx = BEAT_ORDER.indexOf(beatId) + 1;
      const nextBeatId = BEAT_ORDER[nextIdx];
      if (nextBeatId) {
        const nextUrl = data.beats[nextBeatId].url;
        if (nextUrl) b.current.src = nextUrl;
      }
      return;
    }

    // Determine visible and invisible
    const visible = active.current === 'a' ? a.current : b.current;
    const hidden = active.current === 'a' ? b.current : a.current;

    // This is used to tell foreground element when to be visible
    setBackgroundReady(false);

    // Set hidden video to use incoming beat's url
    hidden.src = url;
    hidden.currentTime = 0;
    hidden.loop = momentId === 'ambient';

    const go = () => {
      setBackgroundReady(true);

      // Fade out visible, fade in hidden
      visible.style.transition = hidden.style.transition = `opacity ${CROSSFADE_DURATION_MS}ms ease`;
      visible.style.opacity = '0';
      hidden.style.opacity = '1';

      // Play hidden video
      hidden.play();
      active.current = active.current === 'a' ? 'b' : 'a';
      setActiveDisplay(active.current);

      // Assume docent would click the "next" beat, preload it.
      const currIdx = BEAT_ORDER.indexOf(beatId);
      const nextIdx = currIdx + 1 < BEAT_ORDER.length ? currIdx + 1 : 0;
      const nextBeatId = BEAT_ORDER[nextIdx];

      // Preload next video after crossfade completes
      if (nextBeatId) {
        const nextUrl = data.beats[nextBeatId].url;
        if (nextUrl) setTimeout(() => (visible.src = nextUrl), CROSSFADE_DURATION_MS);
      }
    };

    hidden.addEventListener('canplaythrough', go, { once: true });
    hidden.load();

    lastBeat.current = beatId;
  }, [beatId, data, momentId, setBackgroundReady]);

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
