import {
  isBasecampSection,
  isOverlookSection,
  isValidSummitRoomBeatId,
  type ExhibitNavigationState,
  type SummitRoomBeatId,
} from '@/lib/internal/types';
import type { DocentAppState } from '@/app/(tablets)/docent/_types';
import type { Route } from 'next';

export const parseBasecampBeatId = (beatId: string): ExhibitNavigationState | null => {
  const lastDashIndex = beatId.lastIndexOf('-');
  if (lastDashIndex === -1) return null;

  const momentId = beatId.substring(0, lastDashIndex);
  const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

  if (Number.isNaN(beatNumber) || beatNumber < 1 || !isBasecampSection(momentId)) {
    return null;
  }

  return {
    beatIdx: beatNumber - 1,
    momentId,
  };
};

export const parseOverlookBeatId = (beatId: string): ExhibitNavigationState | null => {
  const lastDashIndex = beatId.lastIndexOf('-');
  if (lastDashIndex === -1) return null;

  const momentId = beatId.substring(0, lastDashIndex);
  const beatNumber = parseInt(beatId.substring(lastDashIndex + 1), 10);

  if (Number.isNaN(beatNumber) || beatNumber < 1 || !isOverlookSection(momentId)) {
    return null;
  }

  return {
    beatIdx: beatNumber - 1,
    momentId,
  };
};

export const parseSummitBeatId = (beatId: string): null | SummitRoomBeatId => {
  return isValidSummitRoomBeatId(beatId) ? beatId : null;
};

export const getExhibitAvailability = (docentAppState: DocentAppState | null) => {
  return {
    basecamp: !!docentAppState?.exhibits?.basecamp,
    overlook: !!docentAppState?.exhibits?.overlook,
    overlookTablet: !!docentAppState?.exhibits?.summit,
    summit: !!docentAppState?.exhibits?.summit,
  } as const;
};

export const getTourIdFromGecState = (state: DocentAppState): null | string => {
  return (
    state.exhibits?.basecamp?.['tour-id'] ||
    state.exhibits?.overlook?.['tour-id'] ||
    state.exhibits?.summit?.['tour-id'] ||
    null
  );
};

// Check if a path is a valid docent route
export const isDocentRoute = (path: string): path is Route => {
  return /^\/docent\/tour\/[^/]+(?:\/(?:basecamp|overlook|summit-room))?$/.test(path);
};

// Update tour ID in a docent route path
export const updateTourIdInPath = (pathname: string, tourId: string): null | string => {
  if (!pathname.includes('/tour/')) return null;

  const tourPathRegex = /\/tour\/[^\/]+/;
  const newPathname = pathname.replace(tourPathRegex, `/tour/${tourId}`);

  return isDocentRoute(newPathname) ? newPathname : null;
};
