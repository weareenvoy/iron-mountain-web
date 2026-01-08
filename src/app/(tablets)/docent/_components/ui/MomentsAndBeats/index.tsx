'use client';

import { CirclePause, CirclePlay } from 'lucide-react';
import { MouseEvent } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { useMqtt } from '@/components/providers/mqtt-provider';
import {
  isValidBasecampBeatId,
  isValidOverlookBeatId,
  type ExhibitBeatId,
  type ExhibitNavigationState,
  type Moment,
  type OverlookBeatId,
  type Section,
} from '@/lib/internal/types';
import { cn } from '@/lib/tailwind/utils/cn';

interface MomentsAndBeatsProps {
  readonly content: Readonly<Moment[]>; // hardcoded data
  readonly exhibit: 'basecamp' | 'overlook-wall';
  readonly exhibitState: ExhibitNavigationState;
  readonly goTo: (momentId: Section, beatIdx: number) => void;
}

const MomentsAndBeats = ({ content, exhibit, exhibitState, goTo }: MomentsAndBeatsProps) => {
  const { client } = useMqtt();
  const { data, docentAppState } = useDocent();

  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  // Read playpause from GEC state for overlook
  const currentPlaypause =
    exhibit === 'overlook-wall' ? (docentAppState?.exhibits['overlook-wall']?.['playpause'] ?? true) : true;

  const handleVideoBeatClick = (momentId: Section, beatIdx: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!client) return;

    const moment = content.find(m => m.id === momentId);
    if (!moment || !moment.beats[beatIdx]) return;

    const beatId = moment.beats[beatIdx].handle;
    const isCurrentlyActive = momentId === exhibitState.momentId && beatIdx === exhibitState.beatIdx;

    // Validate beat ID before sending MQTT command
    const isValidBeatId = exhibit === 'basecamp' ? isValidBasecampBeatId(beatId) : isValidOverlookBeatId(beatId);
    if (!isValidBeatId) {
      console.error(`Invalid beat ID: ${beatId} for exhibit ${exhibit}`);
      return;
    }

    // Only overlook-wall supports playpause in GEC state
    if (exhibit === 'basecamp') {
      // Basecamp doesn't support playpause - use gotoBeat instead
      client.gotoBeat(exhibit, beatId as ExhibitBeatId, {
        onError: (err: Error) => console.error(`Failed to send goto-beat to ${exhibit}:`, err),
        onSuccess: () => console.info(`Sent goto-beat: ${beatId} to ${exhibit}`),
      });
    } else {
      // exhibit is 'overlook-wall' here - supports playpause
      // If clicking a different beat → start playing
      // If clicking the active video beat → toggle play/pause based on current GEC state
      const newPlaypause = isCurrentlyActive ? !currentPlaypause : true;
      client.gotoBeatWithPlayPause(
        exhibit,
        beatId as OverlookBeatId,
        newPlaypause,
        {
          onError: (err: Error) => console.error(`Failed to send goto-beat with play/pause to ${exhibit}:`, err),
          onSuccess: () => console.info(`Sent goto-beat with play/pause: ${beatId} (${newPlaypause}) to ${exhibit}`),
        },
        false
      );
    }
  };

  const handleBulletPointClick = (momentId: Section) => () => {
    goTo(momentId, 0);
  };

  const handleNormalBeatClick = (momentId: Section, beatIdx: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    goTo(momentId, beatIdx);
  };

  // Helper to determine if the current active beat is a video and should show as playing
  const currentMomentObj = content.find(m => m.id === momentId);
  const currentBeatObj = currentMomentObj?.beats[currentBeatIdx];
  const isCurrentVideoPlaying = currentBeatObj?.type === 'video' && currentPlaypause;

  return (
    <div className="flex flex-col gap-6 px-11.5">
      {content.map(moment => {
        const isActiveMoment = moment.id === momentId;

        return (
          <div className="flex items-center" key={moment.id}>
            <div
              className={cn(
                'flex w-70 min-w-70 items-center gap-[12.4px] transition-opacity',
                isActiveMoment ? 'opacity-100' : 'opacity-50'
              )}
            >
              {isActiveMoment && <div className="border-primary-bg-grey h-4 w-4 rotate-45 rounded-[2px] border-2" />}
              <button
                className="text-primary-bg-grey text-left text-[26px] leading-[1.3] tracking-normal"
                onClick={handleBulletPointClick(moment.id)}
              >
                {moment.title}
              </button>
            </div>

            <div className="flex items-center gap-[10px]">
              {moment.beats.map((beat, beatIdx) => {
                const isActiveBeat = isActiveMoment && beatIdx === currentBeatIdx;
                const isVideoBeat = beat.type === 'video';

                // Show pause only on the active video beat when it is playing
                const showPause = isActiveBeat && isCurrentVideoPlaying;

                return (
                  <div className="flex items-center gap-2.5 text-white" key={beatIdx}>
                    {isVideoBeat ? (
                      <button
                        className={cn(
                          'relative flex h-[42px] items-center justify-center gap-2 rounded-full border-[1.5px] px-5 transition-colors',
                          isActiveBeat
                            ? 'border-primary-bg-grey bg-transparent'
                            : isActiveMoment
                              ? 'border-primary-bg-grey bg-transparent'
                              : 'border-white/0 bg-white/10 text-white/10'
                        )}
                        onClick={handleVideoBeatClick(moment.id, beatIdx)}
                      >
                        {isActiveBeat && (
                          <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />
                        )}
                        <div className="pointer-events-none relative z-10 flex items-center gap-2">
                          <span className={cn('text-primary-bg-grey', !isActiveMoment && 'opacity-30')}>
                            {showPause ? (data?.ui.pause ?? 'Pause') : (data?.ui.play ?? 'Play')}
                          </span>
                          {showPause ? <CirclePause className="size-6" /> : <CirclePlay className="size-6" />}
                        </div>
                      </button>
                    ) : (
                      <button
                        className={cn(
                          'relative flex h-[42px] w-[60px] items-center justify-center rounded-full border-[1.5px] transition-colors',
                          isActiveBeat
                            ? 'border-primary-bg-grey bg-transparent'
                            : isActiveMoment
                              ? 'border-primary-bg-grey bg-transparent'
                              : 'border-white/0 bg-white/10'
                        )}
                        onClick={handleNormalBeatClick(moment.id, beatIdx)}
                      >
                        {isActiveBeat && (
                          <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />
                        )}
                        <span className="text-primary-bg-grey relative z-10 text-center text-lg leading-[1.2] tracking-[-5%]">
                          {isActiveMoment ? beatIdx + 1 : ''}
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MomentsAndBeats;
