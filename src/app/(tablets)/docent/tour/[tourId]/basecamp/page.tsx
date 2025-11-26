'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { use, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import MomentsAndBeats from '@/app/(tablets)/docent/_components/ui/MomentsAndBeats';
import { useDocentTranslation } from '@/hooks/use-docent-translation';
import useMomentsNavigation from '@/hooks/use-moments-navigation';
import type { Moment } from '@/lib/internal/types';

const BASECAMP_CONTENT: Readonly<Moment[]> = [
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
] as const;

const BasecampPage = ({ params }: PageProps<'/docent/tour/[tourId]/basecamp'>) => {
  const { t } = useDocentTranslation();
  const { tourId } = use(params);
  const { basecampExhibitState, currentTour, setBasecampExhibitState } = useDocent();

  // MomentsAndBeats navigation.
  const { handleNext, handlePrevious, isNextDisabled, isPreviousDisabled } = useMomentsNavigation(
    BASECAMP_CONTENT,
    basecampExhibitState,
    setBasecampExhibitState,
    'basecamp'
  );

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      href: `/docent/tour/${tourId}`,
      icon: <ArrowLeft />,
      text: t.docent.navigation.backToMenu,
    }),
    [tourId, t]
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

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
};

export default BasecampPage;
