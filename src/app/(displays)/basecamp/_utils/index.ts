import { BASECAMP_BEAT_ORDER, type BasecampBeatId } from '@/lib/internal/types';

export const getMomentPrefix = (beatId: string): null | string => {
  return beatId.split('-')[0] ?? null;
};

// If same moment, and consecutive, we don't want crossfade.
export const isSeamlessVideoTransition = (from: BasecampBeatId | null, to: BasecampBeatId): boolean => {
  if (!from) return false;

  const fromIndex = BASECAMP_BEAT_ORDER.indexOf(from);
  const toIndex = BASECAMP_BEAT_ORDER.indexOf(to);

  if (fromIndex === -1 || toIndex === -1) return false;

  const isConsecutive = toIndex === fromIndex + 1;
  const sameMoment = getMomentPrefix(from) === getMomentPrefix(to);

  return isConsecutive && sameMoment;
};

// Get the next beat ID in presentation order
export const getNextBeatId = (currentBeatId: BasecampBeatId, isAmbient: boolean): BasecampBeatId | null => {
  const currentIndex = BASECAMP_BEAT_ORDER.indexOf(currentBeatId);
  if (currentIndex === -1) return null;

  const nextIndex = isAmbient
    ? currentIndex // stay on same beat for looping
    : (currentIndex + 1) % BASECAMP_BEAT_ORDER.length;

  return BASECAMP_BEAT_ORDER[nextIndex] ?? null;
};
