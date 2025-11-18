'use client';

import { CirclePause, CirclePlay } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMqtt } from '@/components/providers/mqtt-provider';
import type { ExhibitNavigationState, Moment } from '@/lib/_internal/types';

interface MomentsAndBeatsProps {
  content: Moment[]; // hardcoded data
  exhibit: 'basecamp' | 'overlook';
  exhibitState: ExhibitNavigationState;
  setExhibitState: (state: Partial<ExhibitNavigationState>) => void;
}

const MomentsAndBeats = ({ content, exhibit, exhibitState, setExhibitState }: MomentsAndBeatsProps) => {
  const { client } = useMqtt();

  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  // Edge case: Overlook's case-study video.
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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

  const handleBulletPointClick = (momentId: string) => {
    goTo(momentId, 0);
  };

  const handleBeatClick = (e: React.MouseEvent<HTMLButtonElement>, beatIdx: number, momentId: string) => {
    e.stopPropagation();
    goTo(momentId, beatIdx);
  };

  // TODO TBD on mqtt msg to details
  // Handle video state when navigating to case-study
  useEffect(() => {
    const isCaseStudyVideo = momentId === 'case-study' && currentBeatIdx === 1;

    if (isCaseStudyVideo) {
      setIsVideoPlaying(true);
      // send mqtt message to play video
    } else {
      setIsVideoPlaying(false);
      // send mqtt message to pause video
    }
  }, [momentId, currentBeatIdx]);

  return (
    <div className="flex flex-col gap-6 px-11.5">
      {content.map(moment => {
        const isActiveMoment = moment.id === momentId;

        return (
          <div className="flex items-center" key={moment.id}>
            <div
              className={`flex w-70 min-w-70 items-center gap-[12.4px] transition-opacity ${
                isActiveMoment ? 'opacity-100' : 'opacity-50'
              }`}
            >
              {isActiveMoment && <div className="border-primary-bg-grey h-4 w-4 rotate-45 rounded-[2px] border-2" />}
              <button
                className="text-primary-bg-grey text-left text-[26px] leading-[1.3]"
                onClick={() => handleBulletPointClick(moment.id)}
              >
                {moment.title}
              </button>
            </div>

            <div className="flex items-center gap-[10px]">
              {Array.from({ length: moment.beatCount }, (_, beatIdx) => {
                const isActiveBeat = isActiveMoment && beatIdx === currentBeatIdx;
                const isVideoBeat = moment.id === 'case-study' && beatIdx === 1;

                if (isVideoBeat) {
                  return (
                    <button
                      className={`text-primary-bg-grey transition-opacity ${
                        isActiveMoment ? 'opacity-100' : 'pointer-events-none opacity-0'
                      }`}
                      key={beatIdx}
                      // TODO: Send mqtt message to play/pause video
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                    >
                      {isVideoPlaying ? (
                        <CirclePause className="size-[40px]" />
                      ) : (
                        <CirclePlay className="size-[40px]" />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    className={`relative flex h-[42px] w-[60px] items-center justify-center rounded-full border-[1.5px] transition-colors ${
                      isActiveBeat
                        ? 'border-primary-bg-grey bg-transparent'
                        : isActiveMoment
                          ? 'border-primary-bg-grey bg-transparent'
                          : 'border-white/0 bg-white/10'
                    }`}
                    key={beatIdx}
                    onClick={e => handleBeatClick(e, beatIdx, moment.id)}
                  >
                    {isActiveBeat && <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />}
                    <span className="text-primary-bg-grey relative z-10 text-center text-xl leading-[1.2] tracking-[-1px]">
                      {isActiveMoment ? beatIdx + 1 : ''}
                    </span>
                  </button>
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
