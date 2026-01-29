'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useCallback, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import MomentsAndBeats from '@/app/(tablets)/docent/_components/ui/MomentsAndBeats';
import { useMqtt } from '@/components/providers/mqtt-provider';
import useMomentsNavigation from '@/hooks/use-moments-navigation';
import { parseBasecampBeatId } from '@/lib/internal/utils/parse-beat-id';
import type { Section } from '@/lib/internal/types';

const BasecampPage = ({ params }: PageProps<'/docent/tour/[tourId]/basecamp'>) => {
  const { tourId } = use(params);
  const router = useRouter();
  const { client } = useMqtt();
  const { currentTour, data, docentAppState } = useDocent();

  // Extract beat-id
  const basecampBeatId = docentAppState?.exhibits.basecamp['beat-id'];

  // Derive exhibitState from GEC state
  const basecampExhibitState = useMemo(() => {
    if (basecampBeatId) {
      const parsed = parseBasecampBeatId(basecampBeatId);
      if (parsed) return parsed;
    }
    return { beatIdx: 0, momentId: 'ambient' as const };
  }, [basecampBeatId]);

  // Transform basecampMoments
  const basecampContent = useMemo(() => {
    if (!data?.basecampMoments) return [];
    return data.basecampMoments.map(moment => ({
      beats: moment.beats,
      id: moment.handle as Section,
      title: moment.title,
    }));
  }, [data]);

  // MomentsAndBeats navigation.
  const { goTo, handleNext, handlePrevious, isNextDisabled, isPreviousDisabled } = useMomentsNavigation(
    basecampContent,
    basecampExhibitState,
    'basecamp'
  );

  const handleBackToMenu = useCallback(() => {
    client?.gotoBeat('basecamp', 'ambient-1', {
      onError: (err: Error) => console.error('Failed to send ambient-1 to basecamp:', err),
      onSuccess: () => console.info('Sent ambient-1 to basecamp'),
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

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

      {/* Header */}
      <div className="mt-40 flex flex-col gap-20">
        {/* Title */}
        <div className="mx-5 flex flex-col items-start gap-2 border-b border-[rgba(255,255,255,0.5)] pb-12.5">
          <h1 className="text-primary-bg-grey text-center text-[36px] leading-loose tracking-[-1.8px]">Basecamp</h1>
          <p className="text-primary-bg-grey text-center text-xl leading-loose tracking-[-1px]">
            {currentTour?.name || 'Tour'}
          </p>
        </div>

        <MomentsAndBeats content={basecampContent} exhibit="basecamp" exhibitState={basecampExhibitState} goTo={goTo} />
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
