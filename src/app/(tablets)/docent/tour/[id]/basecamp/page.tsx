'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { use } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import Header from '@/app/(tablets)/docent/_components/ui/Header';
import MomentsAndBeats from '@/app/(tablets)/docent/_components/ui/MomentsAndBeats';
import useMomentsNavigation from '@/app/(tablets)/docent/_hooks/use-moments-navigation';
import { Button } from '@/components/shadcn/button';
import { Moment } from '@/lib/_internal/types';

const BASECAMP_CONTENT: Moment[] = [
  {
    beatCount: 1,
    id: 'ambient',
    title: 'Ambient state',
  },
  {
    beatCount: 4,
    id: 'welcome',
    title: 'Welcome',
  },
  {
    beatCount: 4,
    id: 'problem',
    title: 'Problem',
  },
  {
    beatCount: 5,
    id: 'possibilities',
    title: 'Possibilities',
  },
  {
    beatCount: 3,
    id: 'ascend',
    title: 'Ascend',
  },
];
interface BasecampPageProps {
  params: Promise<{ id: string }>;
}

export default function BasecampPage({ params }: BasecampPageProps) {
  const { id } = use(params);
  const { basecampExhibitState, currentTour, setBasecampExhibitState } = useDocent();

  // MomentsAndBeats navigation.
  const { handleNext, handlePrevious, isNextDisabled, isPreviousDisabled } = useMomentsNavigation(
    BASECAMP_CONTENT,
    basecampExhibitState,
    setBasecampExhibitState,
    'basecamp'
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

      {/* Header */}
      <div className="mt-35 flex flex-col gap-42.5">
        {/* Title */}
        <div className="flex flex-col items-center gap-[23px]">
          <h1 className="text-primary-bg-grey text-center text-[36px] leading-loose tracking-[-1.8px]">Basecamp</h1>
          <p className="text-primary-bg-grey text-center text-xl leading-loose tracking-[-1px]">
            {currentTour?.guestName || 'Tour'}
          </p>
        </div>

        <MomentsAndBeats
          content={BASECAMP_CONTENT}
          exhibit="basecamp"
          exhibitState={basecampExhibitState}
          setExhibitState={setBasecampExhibitState}
        />
      </div>

      {/* Bottom Controls */}
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
