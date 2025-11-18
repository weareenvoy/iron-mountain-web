import { useMqtt } from '@/components/providers/mqtt-provider';
import type { ExhibitNavigationState, Moment } from '@/lib/_internal/types';

// moments/beats navigation hook
const useMomentsNavigation = (
  content: Moment[],
  exhibitState: ExhibitNavigationState,
  setExhibitState: (state: Partial<ExhibitNavigationState>) => void,
  exhibit: 'basecamp' | 'overlook'
) => {
  const { client } = useMqtt();
  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  const currentMomentIdx = content.findIndex(m => m.id === momentId);
  const currentMoment = content[currentMomentIdx];

  const publishNavigation = (momentId: string, beatIdx: number) => {
    if (!client) return;

    // Format: ${moment}-${beatNumber} (1-indexed)
    const beatId = `${momentId}-${beatIdx + 1}`;

    // Send goto-beat command to exhibit
    client.gotoBeat(exhibit, beatId, {
      onError: (err: Error) => console.error(`Failed to send goto-beat to ${exhibit}:`, err),
      onSuccess: () => console.info(`Sent goto-beat: ${beatId} to ${exhibit}`),
    });
  };

  const goTo = (momentId: string, beatIdx: number) => {
    setExhibitState({ beatIdx, momentId });
    publishNavigation(momentId, beatIdx);
  };

  const handlePrevious = () => {
    if (currentBeatIdx > 0) {
      goTo(momentId, currentBeatIdx - 1);
    } else if (currentMomentIdx > 0) {
      const prevMoment = content[currentMomentIdx - 1];
      if (!prevMoment) return;
      goTo(prevMoment.id, prevMoment.beatCount - 1);
    }
  };

  const handleNext = () => {
    if (currentMoment && currentBeatIdx < currentMoment.beatCount - 1) {
      goTo(momentId, currentBeatIdx + 1);
    } else if (currentMomentIdx < content.length - 1) {
      const nextMoment = content[currentMomentIdx + 1];
      if (!nextMoment) return;
      goTo(nextMoment.id, 0);
    }
  };

  const isPreviousDisabled = currentMomentIdx === 0 && currentBeatIdx === 0;
  const isNextDisabled = currentMoment
    ? currentMomentIdx === content.length - 1 && currentBeatIdx === currentMoment.beatCount - 1
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
