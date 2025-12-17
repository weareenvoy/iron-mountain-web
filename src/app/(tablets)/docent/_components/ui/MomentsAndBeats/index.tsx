'use client';

import { CirclePause, CirclePlay } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { useMqtt } from '@/components/providers/mqtt-provider';
import { cn } from '@/lib/tailwind/utils/cn';
import type { ExhibitBeatId, ExhibitNavigationState, Moment, Section } from '@/lib/internal/types';

interface MomentsAndBeatsProps {
  readonly content: Readonly<Moment[]>; // hardcoded data
  readonly exhibit: 'basecamp' | 'overlook';
  readonly exhibitState: ExhibitNavigationState;
  readonly setExhibitState: (state: Partial<ExhibitNavigationState>) => void;
}

const MomentsAndBeats = ({ content, exhibit, exhibitState, setExhibitState }: MomentsAndBeatsProps) => {
  const { client } = useMqtt();
  const { data } = useDocent();

  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  // Track whether the currently active video beat is playing or paused
  // Starts as true (playing) whenever we select a new beat
  const [videoPlaying, setVideoPlaying] = useState(true);

  // Reset to playing whenever the active beat changes (any navigation)
  useEffect(() => {
    setVideoPlaying(true);
  }, [exhibitState.momentId, exhibitState.beatIdx]);

  const publishNavigation = (momentId: Section, beatIdx: number) => {
    if (!client) return;

    const moment = content.find(m => m.id === momentId);
    if (!moment || !moment.beats[beatIdx]) return;

    const beatId = moment.beats[beatIdx].handle;

    // Send goto-beat command to exhibit
    client.gotoBeat(exhibit, beatId as ExhibitBeatId, {
      onError: (err: Error) => console.error(`Failed to send goto-beat to ${exhibit}:`, err),
      onSuccess: () => console.info(`Sent goto-beat: ${beatId} to ${exhibit}`),
    });
  };

  const goTo = (momentId: Section, beatIdx: number) => {
    setExhibitState({ beatIdx, momentId });
    publishNavigation(momentId, beatIdx);
  };

  const handleVideoBeatClick = (momentId: Section, beatIdx: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const isCurrentlyActive = momentId === exhibitState.momentId && beatIdx === exhibitState.beatIdx;

    // If we're selecting this video beat (new or re-select), always play
    // If it's already active, toggle the current play/pause state
    const playPause = isCurrentlyActive ? !videoPlaying : true;

    // Update navigation state
    setExhibitState({ beatIdx, momentId });
    // Update local video playing state for correct toggling and UI
    setVideoPlaying(playPause);

    if (!client) return;

    const moment = content.find(m => m.id === momentId);
    if (!moment || !moment.beats[beatIdx]) return;

    const beatId = moment.beats[beatIdx].handle;

    client.gotoBeatWithPlayPause(exhibit, beatId as ExhibitBeatId, playPause, {
      onError: (err: Error) => console.error(`Failed to send goto-beat with play/pause to ${exhibit}:`, err),
      onSuccess: () => console.info(`Sent goto-beat with play/pause: ${beatId} (${playPause}) to ${exhibit}`),
    });
  };

  const handleBulletPointClick = (momentId: Section) => () => {
    goTo(momentId, 0);
  };

  const handleNormalBeatClick = (momentId: Section, beatIdx: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    goTo(momentId, beatIdx);
  };

  // Helper to know if the current active beat is a video beat and its playing state
  const currentMomentObj = content.find(m => m.id === momentId);
  const currentBeatObj = currentMomentObj?.beats[currentBeatIdx];
  const isCurrentVideoPlaying = currentBeatObj?.type === 'video' && videoPlaying;

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
                className="text-primary-bg-grey text-left text-[26px] leading-[1.3]"
                onClick={handleBulletPointClick(moment.id)}
              >
                {moment.title}
              </button>
            </div>

            <div className="flex items-center gap-[10px]">
              {moment.beats.map((beat, beatIdx) => {
                const isActiveBeat = isActiveMoment && beatIdx === currentBeatIdx;
                const isVideoBeat = beat.type === 'video';

                // Determine what text/icon to show on this video beat button
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
