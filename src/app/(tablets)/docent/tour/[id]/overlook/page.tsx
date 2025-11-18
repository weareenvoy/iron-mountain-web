'use client';

import { ArrowLeft, ArrowRight, Cast } from 'lucide-react';
import Image from 'next/image';
import { use, useState } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import Header from '@/app/(tablets)/docent/_components/ui/Header';
import MomentsAndBeats from '@/app/(tablets)/docent/_components/ui/MomentsAndBeats';
import useMomentsNavigation from '@/app/(tablets)/docent/_hooks/use-moments-navigation';
import { Button } from '@/components/shadcn/button';
import { Moment } from '@/lib/_internal/types';

const OVERLOOK_CONTENT: Moment[] = [
  {
    beatCount: 1,
    id: 'ambient',
    title: 'Ambient state',
  },
  {
    beatCount: 2,
    id: 'unlock',
    title: 'Unlock',
  },

  {
    beatCount: 2,
    id: 'protect',
    title: 'Protect',
  },
  {
    beatCount: 2,
    id: 'connect',
    title: 'Connect',
  },
  {
    beatCount: 2,
    id: 'activate',
    title: 'Activate',
  },
  {
    beatCount: 5,
    id: 'insight-dxp',
    title: 'InSight DXP',
  },
  {
    beatCount: 2, // 1 normal beat, and 1 video. Video is just like a normal beat, but with a play/pause button.
    id: 'case-study',
    title: 'Impact (case study)',
  },
  {
    beatCount: 4,
    id: 'futurescape',
    title: 'Futurescape',
  },
];

interface OverlookPageProps {
  params: Promise<{ id: string }>;
}

export default function OverlookPage({ params }: OverlookPageProps) {
  const { id } = use(params);
  const { currentTour, overlookExhibitState, setOverlookExhibitState } = useDocent();
  // TODO does this live in GEC state?
  const [isOverlookCastMode, setIsOverlookCastMode] = useState(false);

  // Should the bottom controls live here, or live in MomentaAndBeats
  const { handleNext, handlePrevious, isNextDisabled, isPreviousDisabled } = useMomentsNavigation(
    OVERLOOK_CONTENT,
    overlookExhibitState,
    setOverlookExhibitState,
    'overlook'
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header
        leftButton={{
          href: `/docent/tour/${id}`,
          icon: <ArrowLeft />,
          text: 'Back to menu',
        }}
      />

      {/* Cast Button */}
      <div className="text-primary-bg-grey absolute top-34 left-5 z-50 flex flex-col items-start">
        <button className="active: border-none p-0" onClick={() => setIsOverlookCastMode(!isOverlookCastMode)}>
          {isOverlookCastMode ? (
            <Cast className="size-[30px] text-[#ededed]" />
          ) : (
            <Image alt="Cast Off" height={30} src="/images/cast-off.svg" width={30} />
          )}
        </button>
        {isOverlookCastMode ? (
          <span className="h-6.25 text-sm">Start presenting</span>
        ) : (
          <span className="h-6.25 text-sm">Stop presenting</span>
        )}
      </div>

      {/* Header */}
      <div className="mt-35 flex flex-col gap-42.5">
        {/* Title */}
        <div className="flex flex-col items-center gap-[23px]">
          <h1 className="text-primary-bg-grey text-center text-[36px] leading-loose tracking-[-1.8px]">Overlook</h1>
          <p className="text-primary-bg-grey text-center text-xl leading-loose tracking-[-1px]">
            {currentTour?.guestName || 'Tour'}
          </p>
        </div>

        <MomentsAndBeats
          content={OVERLOOK_CONTENT}
          exhibit="overlook"
          exhibitState={overlookExhibitState}
          setExhibitState={setOverlookExhibitState}
        />
      </div>

      {/* Bottom Controls */}
      {/* TODO Should they live here or in MomentsAndBeats? Maybe add debounce? */}
      <div className="text-primary-im-dark-blue absolute bottom-17.5 left-1/2 flex -translate-x-1/2 items-center justify-center gap-10">
        <Button className="size-[80px] rounded-full" disabled={isPreviousDisabled} onClick={handlePrevious} size="sm">
          <ArrowLeft className="size-[36px]" />
        </Button>

        <Button className="size-[80px] rounded-full" disabled={isNextDisabled} onClick={handleNext} size="sm">
          <ArrowRight className="size-[36px]" />
        </Button>
      </div>
    </div>
  );
}
