'use client';

import { ArrowLeft, ArrowRight, Cast } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import MomentsAndBeats from '@/app/(tablets)/docent/_components/ui/MomentsAndBeats';
import { useMqtt } from '@/components/providers/mqtt-provider';
import CastOff from '@/components/ui/icons/CastOff';
import useMomentsNavigation from '@/hooks/use-moments-navigation';
import { parseOverlookBeatId } from '@/lib/internal/utils/parse-beat-id';
import type { Section } from '@/lib/internal/types';

const OverlookPage = ({ params }: PageProps<'/docent/tour/[tourId]/overlook'>) => {
  const { tourId } = use(params);
  const router = useRouter();
  const { client } = useMqtt();
  const { currentTour, data, docentAppState } = useDocent();

  // Extract beat-id
  const overlookBeatId = docentAppState?.exhibits['overlook-wall']?.['beat-id'];

  // Derive exhibitState from GEC state
  const overlookExhibitState = useMemo(() => {
    if (overlookBeatId) {
      const parsed = parseOverlookBeatId(overlookBeatId);
      if (parsed) return parsed;
    }
    return { beatIdx: 0, momentId: 'ambient' as const };
  }, [overlookBeatId]);

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
  const { goTo, handleNext, handlePrevious, isNextDisabled, isPreviousDisabled } = useMomentsNavigation(
    overlookContent,
    overlookExhibitState,
    'overlook-wall'
  );

  const handleBackToMenu = useCallback(() => {
    client?.gotoBeat('overlook-wall', 'ambient-1', {
      onError: (err: Error) => console.error('Failed to send ambient-1 to overlook:', err),
      onSuccess: () => console.info('Sent ambient-1 to overlook'),
    });

    // Navigate after sending MQTT commands
    router.push(`/docent/tour/${tourId}`);
  }, [client, router, tourId]);

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      icon: <ArrowLeft />,
      onClick: handleBackToMenu,
      text: data?.docent.navigation.backToMenu ?? 'Back to menu',
    }),
    [handleBackToMenu, data]
  );

  // Get current presentation mode from GEC state
  const currentPresentationMode = docentAppState?.exhibits['overlook-wall']?.['presentation-mode'] ?? false;

  const handleTogglePresentationMode = useCallback(() => {
    if (!client) return;
    client.setPresentationMode('overlook-wall', !currentPresentationMode, {
      onError: (err: Error) => console.error('Failed to send presentation-mode to overlook:', err),
      onSuccess: () => console.info(`Sent presentation-mode: ${!currentPresentationMode} to overlook`),
    });
  }, [client, currentPresentationMode]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

      {/* Presentation Mode Button */}
      <div className="text-primary-bg-grey absolute top-51.5 right-2 z-50">
        <Button
          className="h-7 gap-2 border-none px-3"
          onClick={handleTogglePresentationMode}
          size="sm"
          variant="outline-light-grey"
        >
          <span className="h-6.25 text-lg">
            {currentPresentationMode
              ? (data?.docent.actions.stopPresenting ?? 'Stop presenting')
              : (data?.docent.actions.startPresenting ?? 'Start presenting')}
          </span>
          {currentPresentationMode ? <Cast className="size-[24px]" /> : <CastOff className="size-[24px]" />}
        </Button>
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
          goTo={goTo}
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
