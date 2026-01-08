import {
  isBasecampSection,
  isOverlookSection,
  isValidSummitRoomBeatId,
  type ExhibitNavigationState,
  type SummitRoomBeatId,
} from '@/lib/internal/types';

// Parse a Basecamp beat ID (e.g., "welcome-3") into navigation state.
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

// Parse an Overlook beat ID (e.g., "unlock-2") into navigation state.
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

// Parse a Summit beat ID (e.g., "journey-1", "journey-intro").
export const parseSummitBeatId = (beatId: string): null | SummitRoomBeatId => {
  return isValidSummitRoomBeatId(beatId) ? beatId : null;
};
