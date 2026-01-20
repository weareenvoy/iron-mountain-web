'use client';

import { useEffect, useRef } from 'react';
import { useBasecamp } from '@/app/(displays)/basecamp/_components/providers/basecamp';
import { useAudio } from '@/components/providers/audio-provider';

type UseAnimationStartSfxArgs = Readonly<{
  // Ref to the container element
  containerRef: React.RefObject<HTMLElement | null>;
  // CSS selector for elements that should trigger SFX on animation start.
  selector: string;
}>;

export const useAnimationStartSfx = ({ containerRef, selector }: UseAnimationStartSfxArgs): void => {
  const audio = useAudio();
  const { data } = useBasecamp();
  const sfxUrl = data?.sfx.text;

  // Track which elements have already played SFX (prevents double-fire)
  const playedRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !sfxUrl) return;

    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (targets.length === 0) return;

    const handler = (e: AnimationEvent) => {
      // Ignore bubbled events from child animations - only fire for direct animations
      if (e.target !== e.currentTarget) return;

      const target = e.currentTarget as Element;
      // Each element only fires SFX once
      if (playedRef.current.has(target)) return;
      playedRef.current.add(target);
      audio.playSfx(sfxUrl);
    };

    for (const t of targets) {
      t.addEventListener('animationstart', handler);
    }

    return () => {
      for (const t of targets) {
        t.removeEventListener('animationstart', handler);
      }
    };
  }, [audio, containerRef, selector, sfxUrl]);
};
