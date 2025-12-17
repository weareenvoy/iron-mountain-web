'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { use, useCallback, useEffect, useMemo } from 'react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import SummitRoomDiamonds from '@/components/ui/icons/SummitRoomDiamonds';
import { getBeatIdFromSlideIndex, getSlideIndexFromBeatId, type SummitRoomBeatId } from '@/lib/internal/types';
import { cn } from '@/lib/tailwind/utils/cn';

const INITIAL_BEAT_ID: SummitRoomBeatId = 'journey-intro';

// Confirmed with design that the colors will be hardcoded.
const getSlideBorderColor = (handle: string): null | string => {
  switch (handle) {
    case 'journey-1':
      return null; // First slide has no border
    case 'journey-2':
      return 'border-primary-im-light-blue';
    case 'journey-3':
      return 'border-secondary-im-purple';
    case 'journey-4':
      return 'border-secondary-im-teal';
    case 'journey-5':
      return 'border-secondary-im-orange';
    case 'journey-6':
      return 'border-primary-im-mid-blue';
    default:
      return null;
  }
};

const SummitRoomPage = ({ params }: PageProps<'/docent/tour/[tourId]/summit-room'>) => {
  const { tourId } = use(params);
  const { client } = useMqtt();
  const { currentTour, data, setSummitRoomBeatId, summitRoomBeatId } = useDocent();

  const summitRoomSlidesInitial = data?.summitSlides ?? [];
  const summitRoomSlides = summitRoomSlidesInitial.filter(slide => slide.handle !== 'journey-intro');
  const slideCount = summitRoomSlides.length;

  // State is either 'journey-intro' (not launched), or 'journey-1' through 'journey-5' carousel.
  const isJourneyMapLaunched = summitRoomBeatId !== INITIAL_BEAT_ID;
  // Extract slide index from beatId
  const slideIdx = isJourneyMapLaunched ? getSlideIndexFromBeatId(summitRoomBeatId) : 0;

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
      // Bounds checking
      if (newSlideIdx < 0 || newSlideIdx >= slideCount) {
        console.error('Invalid slide index:', newSlideIdx);
        return;
      }
      const beatId = getBeatIdFromSlideIndex(newSlideIdx, slideCount - 1);
      setSummitRoomBeatId(beatId);
      client?.gotoBeat('summit', beatId, {
        onError: (err: Error) => console.error('Summit: Failed to navigate:', err),
        onSuccess: () => console.info(`Sent goto-beat: ${beatId} to summit`),
      });
    },
    [client, setSummitRoomBeatId, slideCount]
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
                <div className="ml-[15px] flex-[0_0_100%]" key={slide.handle}>
                  <div className="bg-primary-bg-grey relative flex h-[313px] w-[557px] flex-col items-center justify-center rounded-[16px] shadow-[16px_16px_16px_0px_rgba(94,94,94,0.25)]">
                    {slide.handle === 'journey-1' ? (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                        <h2 className="text-center text-2xl leading-[normal] tracking-[-1.2px] text-black">
                          {slide.title}
                        </h2>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          'flex items-center gap-5 rounded-full border-2 px-8 py-5',
                          getSlideBorderColor(slide.handle)
                        )}
                      >
                        <div className={cn('h-4.25 w-4.25 rotate-45 border', getSlideBorderColor(slide.handle))}></div>
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
            <Button className="size-[80px] rounded-full" disabled={slideIdx === slideCount - 1} onClick={handleNext}>
              <ArrowRight className="size-[36px]" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummitRoomPage;
