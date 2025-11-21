'use client';

import type { BasecampSection } from '@/lib/internal/types';
import type { RefObject } from 'react';

export type TimedSection = Exclude<BasecampSection, 'ambient'>;

// Single source of truth: define sections with explicit order and times
const SECTIONS: ReadonlyArray<{
  readonly id: TimedSection;
  readonly times: readonly number[];
}> = [
  { id: 'ascend', times: [103, 117, 134] },
  { id: 'possibilities', times: [70, 75, 85, 93, 100] },
  { id: 'problem', times: [26, 45, 53, 66] },
  { id: 'welcome', times: [1, 7, 12, 22] },
] as const;

// Derivations to prevent drift
export const TIME_MAPPING = Object.fromEntries(SECTIONS.map(s => [s.id, [...s.times]])) as Record<
  TimedSection,
  number[]
>;
export const sectionOrder: TimedSection[] = SECTIONS.map(s => s.id);

export const isTimedSection = (s: string): s is TimedSection => s in TIME_MAPPING;

export const getSectionStartTime = (section: TimedSection): number => {
  const sectionIndex = sectionOrder.indexOf(section);
  if (sectionIndex === 0) return 0;
  const previousSection = sectionOrder[sectionIndex - 1];
  if (!previousSection) return 0;
  const previousTimePoints = TIME_MAPPING[previousSection];
  const lastTimePoint = previousTimePoints[previousTimePoints.length - 1];
  if (!lastTimePoint) return 0;
  return lastTimePoint;
};

export const getBeatTimeRange = (section: TimedSection, beatIndex: number) => {
  const timePoints = TIME_MAPPING[section];
  if (beatIndex >= timePoints.length || beatIndex < 0) {
    return null;
  }
  const start = beatIndex === 0 ? getSectionStartTime(section) : timePoints[beatIndex - 1];
  const end = timePoints[beatIndex];
  return { end, start };
};

export const seekAndPlay = (
  video: HTMLVideoElement,
  startSeconds: number,
  label: string,
  isSeekingRef: RefObject<boolean>
) => {
  isSeekingRef.current = true;
  video.currentTime = startSeconds;
  void video
    .play()
    .then(() => {
      console.info(`Seeking to ${startSeconds}s for ${label}`);
    })
    .catch((err: Error) => {
      console.error('Error playing main video:', err);
    });
};

export const createLoadedMetadataHandler = (
  video: HTMLVideoElement,
  startSeconds: number,
  label: string,
  isSeekingRef: RefObject<boolean>
) => {
  return () => seekAndPlay(video, startSeconds, label, isSeekingRef);
};

export const createSeekedHandler = (isSeekingRef: RefObject<boolean>) => {
  return () => {
    isSeekingRef.current = false;
  };
};

export const createAmbientTimeHandler = (
  getActive: () => boolean,
  ambient: HTMLVideoElement,
  setDisplayTime: (t: number) => void
) => {
  return () => {
    if (getActive()) setDisplayTime(ambient.currentTime);
  };
};

export const createMainTimeHandler = (
  getActive: () => boolean,
  main: HTMLVideoElement,
  setDisplayTime: (t: number) => void
) => {
  return () => {
    if (getActive()) setDisplayTime(main.currentTime);
  };
};
