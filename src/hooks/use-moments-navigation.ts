import { useCallback } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import {
  isValidBasecampBeatId,
  isValidOverlookBeatId,
  type BasecampBeatId,
  type ExhibitNavigationState,
  type Moment,
  type OverlookBeatId,
  type Section,
} from '@/lib/internal/types';

// moments/beats navigation hook
const useMomentsNavigation = (
  content: Readonly<Moment[]>,
  exhibitState: ExhibitNavigationState,
  exhibit: 'basecamp' | 'overlook-wall'
) => {
  const { client } = useMqtt();
  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  const currentMomentIdx = content.findIndex(m => m.id === momentId);
  const currentMoment = content[currentMomentIdx];

  const goTo = useCallback(
    (momentId: Section, beatIdx: number) => {
      if (!client) return;

      const moment = content.find(m => m.id === momentId);
      if (!moment || !moment.beats[beatIdx]) return;

      const beatId = moment.beats[beatIdx].handle;
      const isVideoBeat = moment.beats[beatIdx].type === 'video';

      // Validate beat ID before sending MQTT command
      const isValidBeatId = exhibit === 'basecamp' ? isValidBasecampBeatId(beatId) : isValidOverlookBeatId(beatId);
      if (!isValidBeatId) {
        console.error(`Invalid beat ID: ${beatId} for exhibit ${exhibit}`);
        return;
      }

      // Send MQTT command - GEC will update state/gec which will update our derived state
      // Type narrowing for overloads - TypeScript needs explicit branches
      if (exhibit === 'basecamp') {
        if (isVideoBeat) {
          // For video beats, always start playing when navigating
          client.gotoBeatWithPlayPause(exhibit, beatId as BasecampBeatId, true, {
            onError: (err: Error) => console.error(`Failed to send goto-beat with play/pause to ${exhibit}:`, err),
            onSuccess: () => console.info(`Sent goto-beat with play/pause: ${beatId} (true) to ${exhibit}`),
          });
        } else {
          // For normal beats, always send playpause: false
          client.gotoBeatWithPlayPause(exhibit, beatId as BasecampBeatId, false, {
            onError: (err: Error) => console.error(`Failed to send goto-beat with play/pause to ${exhibit}:`, err),
            onSuccess: () => console.info(`Sent goto-beat with play/pause: ${beatId} (false) to ${exhibit}`),
          });
        }
      } else {
        // exhibit is 'overlook-wall' here
        if (isVideoBeat) {
          // For video beats, always start playing when navigating
          client.gotoBeatWithPlayPause(
            exhibit,
            beatId as OverlookBeatId,
            true,
            {
              onError: (err: Error) => console.error(`Failed to send goto-beat with play/pause to ${exhibit}:`, err),
              onSuccess: () => console.info(`Sent goto-beat with play/pause: ${beatId} (true) to ${exhibit}`),
            },
            false
          );
        } else {
          // For normal beats, always send playpause: false
          client.gotoBeatWithPlayPause(
            exhibit,
            beatId as OverlookBeatId,
            false,
            {
              onError: (err: Error) => console.error(`Failed to send goto-beat with play/pause to ${exhibit}:`, err),
              onSuccess: () => console.info(`Sent goto-beat with play/pause: ${beatId} (false) to ${exhibit}`),
            },
            false
          );
        }
      }
    },
    [client, content, exhibit]
  );

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
    goTo,
    handleNext,
    handlePrevious,
    isNextDisabled,
    isPreviousDisabled,
  };
};

export default useMomentsNavigation;
