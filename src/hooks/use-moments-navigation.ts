import type { ExhibitNavigationState, Moment, Section } from '@/lib/internal/types';

// moments/beats navigation hook
const useMomentsNavigation = (
  content: Readonly<Moment[]>,
  exhibitState: ExhibitNavigationState,
  setExhibitState: (state: Partial<ExhibitNavigationState>) => void,
) => {
  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  const currentMomentIdx = content.findIndex(m => m.id === momentId);
  const currentMoment = content[currentMomentIdx];

  const goTo = (momentId: Section, beatIdx: number) => {
    // setExhibitState now sends MQTT command, so no need to call publishNavigation separately
    setExhibitState({ beatIdx, momentId });
  };

  const handlePrevious = () => {
    if (currentBeatIdx > 0) {
      goTo(momentId, currentBeatIdx - 1);
    } else if (currentMomentIdx > 0) {
      const prevMoment = content[currentMomentIdx - 1];
      if (!prevMoment || prevMoment.beats.length === 0) return;
      goTo(prevMoment.id, prevMoment.beats.length - 1);
    }
  };

  const handleNext = () => {
    if (currentMoment && currentBeatIdx < currentMoment.beats.length - 1) {
      goTo(momentId, currentBeatIdx + 1);
    } else if (currentMomentIdx < content.length - 1) {
      const nextMoment = content[currentMomentIdx + 1];
      if (!nextMoment) return;
      goTo(nextMoment.id, 0);
    }
  };

  const isPreviousDisabled = currentMomentIdx === 0 && currentBeatIdx === 0;
  const isNextDisabled = currentMoment
    ? currentMomentIdx === content.length - 1 && currentBeatIdx === currentMoment.beats.length - 1
    : true;

  return {
    currentBeatIdx,
    currentMomentIdx,
    handleNext,
    handlePrevious,
    isNextDisabled,
    isPreviousDisabled,
  };
};

export default useMomentsNavigation;
