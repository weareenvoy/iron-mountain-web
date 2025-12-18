'use client';

import { ArrowLeft, ArrowRight, Cast } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo, useState } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import MomentsAndBeats from '@/app/(tablets)/docent/_components/ui/MomentsAndBeats';
import CastOff from '@/components/ui/icons/CastOff';
import useMomentsNavigation from '@/hooks/use-moments-navigation';
import type { Section } from '@/lib/internal/types';

const OverlookPage = ({ params }: PageProps<'/docent/tour/[tourId]/overlook'>) => {
  const { tourId } = use(params);
  const router = useRouter();
  const { currentTour, data, overlookExhibitState, setOverlookExhibitState } = useDocent();
  // TODO does this live in GEC state?
  const [isOverlookCastMode, setIsOverlookCastMode] = useState(false);

  // Transform overlookMoments
  const overlookContent = useMemo(() => {
    if (!data?.overlookMoments) return [];
    return data.overlookMoments.map(moment => ({
      beats: moment.beats,
      id: moment.handle as Section,
      title: moment.title,
    }));
  }, [data]);

  // Should the bottom controls live here, or live in MomentaAndBeats
  const { handleNext, handlePrevious, isNextDisabled, isPreviousDisabled } = useMomentsNavigation(
    overlookContent,
    overlookExhibitState,
    setOverlookExhibitState
  );

  const toggleOverlookCastMode = () => {
    setIsOverlookCastMode(castMode => !castMode);
  };

  const handleBackToMenu = useCallback(() => {
    router.push(`/docent/tour/${tourId}`);
  }, [router, tourId]);

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      icon: <ArrowLeft />,
      onClick: handleBackToMenu,
      text: data?.docent.navigation.backToMenu ?? 'Back to menu',
    }),
    [handleBackToMenu, data]
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

      {/* Cast Button */}
      <div className="text-primary-bg-grey absolute top-51.5 right-5 z-50 flex flex-row items-center gap-2 p-0.5">
        {isOverlookCastMode ? (
          <span className="text-lg">{data?.docent.actions.startPresenting ?? 'Start presenting'}</span>
        ) : (
          <span className="text-lg">{data?.docent.actions.stopPresenting ?? 'Stop presenting'}</span>
        )}
        <button className="active: border-none p-0" onClick={toggleOverlookCastMode}>
          {isOverlookCastMode ? (
            <Cast className="size-[20px] text-[#ededed]" />
          ) : (
            <CastOff className="size-[20px] text-[#ededed]" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="mt-40 flex flex-col gap-20">
        {/* Title */}
        <div className="mx-5 flex flex-col items-start gap-2 border-b border-[rgba(255,255,255,0.5)] pb-12.5">
          <h1 className="text-primary-bg-grey text-center text-[36px] leading-loose tracking-[-1.8px]">Overlook</h1>
          <p className="text-primary-bg-grey text-center text-xl leading-loose tracking-[-1px]">
            {currentTour?.guestName || 'Tour'}
          </p>
        </div>

        <MomentsAndBeats
          content={overlookContent}
          exhibit="overlook-wall"
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
};

export default OverlookPage;
