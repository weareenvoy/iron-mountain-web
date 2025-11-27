'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { use, useEffect, useMemo, useRef } from 'react';
import { A11y, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header, { type HeaderProps } from '@/app/(tablets)/docent/_components/ui/Header';
import { useMqtt } from '@/components/providers/mqtt-provider';
import SummitRoomDiamonds from '@/components/ui/icons/SummitRoomDiamonds';
import { useDocentTranslation } from '@/hooks/use-docent-translation';
import { cn } from '@/lib/tailwind/utils/cn';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

// Summit Room has 5 slides. First slide has no border, no diamond icon, but has image. Other slides have a border and a diamond icon.

const SummitRoomPage = ({ params }: PageProps<'/docent/tour/[tourId]/summit-room'>) => {
  const { t } = useDocentTranslation();
  const { tourId } = use(params);
  const { client } = useMqtt();
  const {
    currentTour,
    data,
    isSummitRoomJourneyMapLaunched,
    setIsSummitRoomJourneyMapLaunched,
    setSummitRoomSlideIdx,
    summitRoomSlideIdx,
  } = useDocent();

  // Local UI state
  const summitRoomSlides = data?.slides ?? [];
  const isJourneyMapLaunched = isSummitRoomJourneyMapLaunched;
  const setIsJourneyMapLaunched = setIsSummitRoomJourneyMapLaunched;
  const currentSlideIdx = summitRoomSlideIdx;
  const setCurrentSlideIdx = setSummitRoomSlideIdx;

  const swiperRef = useRef<null | SwiperClass>(null); // Create a ref for Swiper instance

  // Helper to send MQTT command when slide changes
  const sendSummitSlideCommand = (slideIdx: number) => {
    if (!client) return;

    // Generate slide name based on index
    // journey-intro for intro screen (slideIdx 0)
    const slideName = slideIdx === 0 ? 'journey-intro' : `journey-${slideIdx}`;

    console.info(`Sending summit goto-beat: ${slideName}`);

    client.gotoBeat('summit', slideName, {
      onError: (err: Error) => console.error('Summit: Failed to navigate:', err),
      onSuccess: () => console.info(`Summit: Navigated to ${slideName}`),
    });
  };

  // Sync Swiper with currentSlideIdx
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(currentSlideIdx);
    }
  }, [currentSlideIdx]);

  const handlePrevious = () => {
    if (currentSlideIdx > 0) {
      const newIdx = currentSlideIdx - 1;
      setCurrentSlideIdx(newIdx);
      // Send MQTT command
      sendSummitSlideCommand(newIdx);
    }
  };

  const handleNext = () => {
    if (currentSlideIdx < summitRoomSlides.length - 1) {
      const newIdx = currentSlideIdx + 1;
      setCurrentSlideIdx(newIdx);
      // Send MQTT command
      sendSummitSlideCommand(newIdx);
    }
  };

  const handleSlideIndicatorClick = (index: number) => () => {
    setCurrentSlideIdx(index);
    // Send MQTT command
    sendSummitSlideCommand(index);
  };

  const handleLaunchJourneyMap = () => {
    setIsJourneyMapLaunched(true);
    setCurrentSlideIdx(0);
    // Send MQTT command (journey-intro)
    sendSummitSlideCommand(0);
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    setCurrentSlideIdx(swiper.activeIndex);
    // Send MQTT command
    sendSummitSlideCommand(swiper.activeIndex);
  };

  const handleSwiper = (swiper: SwiperClass) => {
    swiperRef.current = swiper;
  };

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
      <div className="text-primary-bg-grey mt-35 flex flex-col items-center gap-[23px]">
        <h1 className="text-center text-4xl leading-loose tracking-[-1.8px]">Summit Room</h1>
        <p className="text-center text-xl leading-loose tracking-[-1px]">{currentTour?.guestName || 'Tour'}</p>
      </div>

      {/* Main Content Area */}
      <div className="mt-46 flex items-center justify-center">
        {isJourneyMapLaunched ? (
          <Swiper
            allowTouchMove={true}
            className="h-[361px] w-[605px]" // Make the area bigger so the box shadow is visible
            initialSlide={currentSlideIdx}
            keyboard={{
              enabled: true,
            }}
            modules={[Navigation, Pagination, A11y]}
            navigation={false}
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiper}
            pagination={false}
            slidesPerView={1}
            spaceBetween={30}
          >
            {summitRoomSlides.map(slide => (
              <SwiperSlide key={slide.id}>
                <div className="bg-primary-bg-grey relative ml-5 flex h-[313px] w-[557px] flex-col items-center justify-center rounded-[16px] shadow-[16px_16px_16px_0px_rgba(94,94,94,0.25)]">
                  {slide.id === 1 ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
                      <h2 className="text-center text-2xl leading-[normal] tracking-[-1.2px] text-black">
                        {slide.title}
                      </h2>
                      <SummitRoomDiamonds className="absolute right-0 bottom-0 h-[159px] w-[177px]" />
                    </div>
                  ) : (
                    <div className={cn('flex items-center gap-5 rounded-full border-2 px-8 py-5', slide.borderColor)}>
                      <div className={cn('h-4.25 w-4.25 rotate-45 border', slide.borderColor)}></div>
                      <h2 className="text-xl leading-[normal] tracking-[-1.2px] text-black">{slide.title}</h2>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative mt-50 flex">
            <div className="border-primary-im-light-blue absolute top-1/2 left-1/2 h-82 w-82 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[40px] border-2" />
            <Button className="relative h-17.5 w-70" onClick={handleLaunchJourneyMap} size="sm">
              <span className="text-primary-im-dark-blue text-xl tracking-[-0.05em]">
                {t.docent.actions.launchJourneyMap}
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
              const isActive = index === currentSlideIdx;
              return (
                <button
                  className={cn(
                    'border-primary-bg-grey relative h-5.5 w-5.5 rotate-45 rounded-[2px] border-2 transition-colors',
                    isActive ? 'bg-primary-bg-grey' : 'transparent'
                  )}
                  key={slideNumber}
                  onClick={handleSlideIndicatorClick(index)}
                />
              );
            })}
          </div>

          <div className="flex flex-row items-center justify-center gap-10">
            {/* Previous Button */}
            <Button className="size-[80px] rounded-full" disabled={currentSlideIdx === 0} onClick={handlePrevious}>
              <ArrowLeft className="size-[36px]" />
            </Button>
            {/* Next Button */}
            <Button
              className="size-[80px] rounded-full"
              disabled={currentSlideIdx === summitRoomSlides.length - 1}
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
