'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { use, useCallback, useEffect, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import SummitRoomDiamonds from '@/components/ui/icons/SummitRoomDiamonds';
import { cn } from '@/lib/tailwind/utils/cn';

// Summit Room has 5 slides. First slide has no border, no diamond icon, but has image. Other slides have a border and a diamond icon.

const SummitRoomPage = ({ params }: PageProps<'/docent/tour/[tourId]/summit-room'>) => {
  const { tourId } = use(params);
  const { client } = useMqtt();
  const { currentTour, data, setSummitRoomBeatId, summitRoomBeatId } = useDocent();

  const summitRoomSlides = data?.slides ?? [];
  // State is either 'journey-intro' (not launched), or 'journey-1' through 'journey-5' carousel.
  const isJourneyMapLaunched = summitRoomBeatId !== 'journey-intro';
  // Extract slide index from beatId: 'journey-1' → 0, 'journey-2' → 1, etc.
  const slideIdx = isJourneyMapLaunched ? parseInt(summitRoomBeatId.replace('journey-', ''), 10) - 1 : 0;

  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel();
  // Sync embla position when beatId changes externally
  useEffect(() => {
    if (!emblaApi || !isJourneyMapLaunched) return;
    const currentEmblaIdx = emblaApi.selectedScrollSnap();
    if (currentEmblaIdx !== slideIdx) {
      emblaApi.scrollTo(slideIdx, false);
    }
  }, [emblaApi, isJourneyMapLaunched, slideIdx]);

  // Helper to update beatId state and send MQTT command.
  const goToSlide = useCallback(
    (newSlideIdx: number) => {
      const beatId = `journey-${newSlideIdx + 1}`;
      setSummitRoomBeatId(beatId);
      client?.gotoBeat('summit', beatId, {
        onError: (err: Error) => console.error('Summit: Failed to navigate:', err),
      });
    },
    [client, setSummitRoomBeatId]
  );

  // Embla onSelect handler
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    // Only update if different from current
    if (index !== slideIdx) {
      goToSlide(index);
    }
  }, [emblaApi, goToSlide, slideIdx]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handlePrevious = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleSlideIndicatorClick = useCallback(
    (index: number) => () => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const handleLaunchJourneyMap = () => {
    // Show first slide, and send command
    goToSlide(0);
  };

  const leftButton = useMemo(
    (): HeaderProps['leftButton'] => ({
      href: `/docent/tour/${tourId}`,
      icon: <ArrowLeft />,
      text: data?.docent.navigation.backToMenu ?? 'Back to menu',
    }),
    [tourId, data]
  );

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Navigation */}
      <Header leftButton={leftButton} />

      {/* Header */}
      <div className="text-primary-bg-grey mx-5 mt-40 flex flex-col items-start gap-2 border-b border-[rgba(255,255,255,0.5)] pb-12.5">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">Summit Room</h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">{currentTour?.guestName || 'Tour'}</p>
      </div>

      {/* Main Content Area */}
      <div className="mt-30 flex items-center justify-center">
        {isJourneyMapLaunched ? (
          <div className="h-[361px] w-[605px] overflow-hidden" ref={emblaRef}>
            <div className="flex h-full">
              {summitRoomSlides.map(slide => (
                <div className="ml-[15px] flex-[0_0_100%]" key={slide.id}>
                  <div className="bg-primary-bg-grey relative flex h-[313px] w-[557px] flex-col items-center justify-center rounded-[16px] shadow-[16px_16px_16px_0px_rgba(94,94,94,0.25)]">
                    {slide.id === 1 ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                        <h2 className="text-center text-2xl leading-[normal] tracking-[-1.2px] text-black">
                          {slide.title}
                        </h2>
                      </div>
                    ) : (
                      <div className={cn('flex items-center gap-5 rounded-full border-2 px-8 py-5', slide.borderColor)}>
                        <div className={cn('h-4.25 w-4.25 rotate-45 border', slide.borderColor)}></div>
                        <h2 className="text-xl leading-[normal] tracking-[-1.2px] text-black">{slide.title}</h2>
                      </div>
                    )}
                    <SummitRoomDiamonds className="absolute right-0 bottom-0 h-[159px] w-[177px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative mt-50 flex">
            <div className="border-primary-im-light-blue absolute top-1/2 left-1/2 h-82 w-82 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[40px] border-2" />
            <Button className="relative h-17.5 w-70" onClick={handleLaunchJourneyMap} size="sm">
              <span className="text-primary-im-dark-blue text-xl tracking-[-0.05em]">
                {data?.docent.actions.launchJourneyMap ?? 'Launch journey map'}
              </span>
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>

      {/* Bottom buttons and counter */}
      {isJourneyMapLaunched && (
        <div className="absolute bottom-17.5 left-1/2 flex translate-x-[-50%] flex-col items-center justify-center gap-20">
          {/* Diamond slide indicator */}
          <div className="flex items-center justify-center gap-5">
            {summitRoomSlides.map((_, index) => {
              const slideNumber = index + 1;
              const isActive = index === slideIdx;
              return (
                <button
                  className={cn(
                    'relative h-5.5 w-5.5 rotate-45 rounded-xs border-2 border-[rgba(237,237,237,0.5)] transition-colors',
                    isActive ? 'bg-[rgba(237,237,237,0.8)]' : 'transparent'
                  )}
                  key={slideNumber}
                  onClick={handleSlideIndicatorClick(index)}
                />
              );
            })}
          </div>

          <div className="flex flex-row items-center justify-center gap-10">
            {/* Previous Button */}
            <Button className="size-[80px] rounded-full" disabled={slideIdx === 0} onClick={handlePrevious}>
              <ArrowLeft className="size-[36px]" />
            </Button>
            {/* Next Button */}
            <Button
              className="size-[80px] rounded-full"
              disabled={slideIdx === summitRoomSlides.length - 1}
              onClick={handleNext}
            >
              <ArrowRight className="size-[36px]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummitRoomPage;
