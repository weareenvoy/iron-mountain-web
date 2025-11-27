'use client';

import { useMqtt } from '@/components/providers/mqtt-provider';
import { cn } from '@/lib/tailwind/utils/cn';
import CaseStudyToggle from './CaseStudyToggle';
import type { ExhibitNavigationState, Moment, Section } from '@/lib/internal/types';
import type { MouseEvent } from 'react';

interface MomentsAndBeatsProps {
  readonly content: Readonly<Moment[]>; // hardcoded data
  readonly exhibit: 'basecamp' | 'overlook';
  readonly exhibitState: ExhibitNavigationState;
  readonly setExhibitState: (state: Partial<ExhibitNavigationState>) => void;
}

const MomentsAndBeats = ({ content, exhibit, exhibitState, setExhibitState }: MomentsAndBeatsProps) => {
  const { client } = useMqtt();

  const { beatIdx: currentBeatIdx, momentId } = exhibitState;

  const publishNavigation = (momentId: Section, beatIdx: number) => {
    if (!client) return;

    // Format: ${moment}-${beatNumber} (1-indexed)
    const beatId = `${momentId}-${beatIdx + 1}`;

    // Send goto-beat command to exhibit
    client.gotoBeat(exhibit, beatId, {
      onError: (err: Error) => console.error(`Failed to send goto-beat to ${exhibit}:`, err),
      onSuccess: () => console.info(`Sent goto-beat: ${beatId} to ${exhibit}`),
    });
  };

  const goTo = (momentId: Section, beatIdx: number) => {
    setExhibitState({ beatIdx, momentId });
    publishNavigation(momentId, beatIdx);
  };

  const handleBulletPointClick = (momentId: Section) => () => {
    goTo(momentId, 0);
  };

  const handleBeatClick = (momentId: Section, beatIdx: number) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    goTo(momentId, beatIdx);
  };

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
              {Array.from({ length: moment.beatCount }, (_, beatIdx) => {
                const isActiveBeat = isActiveMoment && beatIdx === currentBeatIdx;
                const isCaseStudyFirstBeat = moment.id === 'case-study' && beatIdx === 0;

                return (
                  <div className="flex items-center gap-2.5" key={beatIdx}>
                    {/* Beat button */}
                    <button
                      className={cn(
                        'relative flex h-[42px] w-[60px] items-center justify-center rounded-full border-[1.5px] transition-colors',
                        isActiveBeat
                          ? 'border-primary-bg-grey bg-transparent'
                          : isActiveMoment
                            ? 'border-primary-bg-grey bg-transparent'
                            : 'border-white/0 bg-white/10'
                      )}
                      onClick={handleBeatClick(moment.id, beatIdx)}
                    >
                      {isActiveBeat && <div className="animate-flash-purple-gradient absolute inset-0 rounded-full" />}
                      <span className="text-primary-bg-grey relative z-10 text-center text-lg leading-[1.2] tracking-[-5%]">
                        {isActiveMoment ? beatIdx + 1 : ''}
                      </span>
                    </button>

                    {/* Insert the toggle right AFTER case-study 0 */}
                    {isCaseStudyFirstBeat && <CaseStudyToggle isActive={isActiveMoment} />}
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
