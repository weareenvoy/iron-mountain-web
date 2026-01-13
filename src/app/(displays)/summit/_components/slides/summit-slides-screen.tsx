'use client';

import { Building2, MapPin, Mountain } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import { useMqtt } from '@/components/providers/mqtt-provider';
import IronMountainLogoBlue from '@/components/ui/icons/IronMountainLogoBlue';
import SummitRootDiamondsBg from '@/components/ui/icons/SummitRootDiamondsBg';
import { getSlideIndexFromBeatId, isValidSummitRoomBeatId } from '@/lib/internal/types';
import { cn } from '@/lib/tailwind/utils/cn';
import type { SummitFuturescaping, SummitKioskAmbient, SummitPossibility } from '@/app/(displays)/summit/_types';
import type { SolutionItem } from '@/app/(displays)/summit/_utils';
import type { ExhibitMqttStateSummit } from '@/lib/mqtt/types';

// Local fallback video for when API is down
const FALLBACK_VIDEO_URL = '/videos/summit_fallback.webm';

type MetaLabelMap = {
  readonly company: string;
  readonly dateOfEngagement: string;
  readonly location: string;
};

type SlideDefinition = {
  readonly id: string;
  readonly render: () => ReactElement;
  readonly title: string;
};

const SLIDE_BG = 'bg-white text-[#12406A]';
const SLIDE_CONTAINER = 'relative flex h-full w-full max-w-full flex-col overflow-hidden px-10 py-10';
const SLIDE_SCALE = 2.2;
const STRATEGY_ACCENT_COLORS = ['#8A0D71', '#00A88E', '#F7931E', '#1B75BC'] as const;

const PlaceholderSlide = ({ description, heading }: { readonly description: string; readonly heading: string }) => {
  return (
    <div className={cn('items-center justify-center', SLIDE_BG, SLIDE_CONTAINER)}>
      <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="text-4xl font-semibold sm:text-5xl">{heading}</p>
        <p className="text-lg text-muted-foreground sm:text-xl">{description}</p>
      </div>
    </div>
  );
};

const SlideFrame = ({
  backgroundClassName = SLIDE_BG,
  children,
  diamondSize = 'default',
  showDiamonds = false,
}: {
  readonly backgroundClassName?: string;
  readonly children: ReactNode;
  readonly diamondSize?: 'default' | 'lg';
  readonly showDiamonds?: boolean;
}) => {
  const diamondClass =
    diamondSize === 'lg'
      ? 'absolute -top-10 -right-8 h-[94px] w-[94px] opacity-80 sm:h-[114px] sm:w-[114px] md:h-[140px] md:w-[140px] lg:h-[161px] lg:w-[161px] xl:h-[187px] xl:w-[187px] 2xl:h-[213px] 2xl:w-[213px]'
      : 'absolute -top-8 -right-6 h-[72px] w-[72px] opacity-80 sm:h-[88px] sm:w-[88px] md:h-[108px] md:w-[108px] lg:h-[124px] lg:w-[124px] xl:h-[144px] xl:w-[144px] 2xl:h-[164px] 2xl:w-[164px]';

  return (
    <div className={`${backgroundClassName} ${SLIDE_CONTAINER}`}>
      <div
        className="relative flex h-full w-full origin-top-left flex-col gap-10"
        style={{
          height: `${100 / SLIDE_SCALE}%`,
          scale: SLIDE_SCALE,
          width: `${100 / SLIDE_SCALE}%`,
        }}
      >
        {showDiamonds ? <SummitRootDiamondsBg aria-hidden className={diamondClass} /> : null}
        {children}
      </div>
    </div>
  );
};

const WelcomeSlide = ({
  company,
  dateOfEngagement,
  labels,
  location,
  title,
}: {
  readonly company: string;
  readonly dateOfEngagement: string;
  readonly labels: {
    readonly company: string;
    readonly dateOfEngagement: string;
    readonly location: string;
  };
  readonly location: string;
  readonly title: string;
}) => {
  return (
    <SlideFrame backgroundClassName="bg-[#1B75BC] text-[#EDEDED]" diamondSize="lg" showDiamonds>
      <div className="flex h-full w-full flex-col justify-between px-[5%] py-[5%]">
        <div className="flex flex-1 items-center">
          <h1 className="text-[2.32rem] leading-tight font-normal sm:text-[2.72rem]">{title}</h1>
        </div>
        <div className="grid grid-cols-3 gap-8 text-lg sm:text-xl">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#EDEDED]/80">{labels.company}</span>
            <span className="text-2xl text-[#EDEDED] sm:text-lg">{company}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#EDEDED]/80">{labels.dateOfEngagement}</span>
            <span className="text-2xl text-[#EDEDED] sm:text-lg">{dateOfEngagement}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#EDEDED]/80">{labels.location}</span>
            <span className="text-2xl text-[#EDEDED] sm:text-lg">{location}</span>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const StaticWelcomeSlide = ({
  elevation,
  location,
  site,
  title,
  videoUrl,
}: {
  readonly elevation: string;
  readonly location: string;
  readonly site: string;
  readonly title: string;
  readonly videoUrl: string;
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F3F5F7] text-[#58595B]">
      <video
        aria-hidden
        autoPlay
        className="absolute inset-0 z-0 h-full w-full object-cover"
        crossOrigin="anonymous"
        loop
        muted
        onError={event => {
          const video = event.currentTarget;
          video.style.display = 'none';
        }}
        playsInline
        preload="auto"
        src={videoUrl}
      />
      <div className="absolute inset-0 z-10 bg-linear-to-b from-white/10 via-white/5 to-[#0A5E72]/15" />
      <div className="absolute top-[5%] right-[0.5%] z-30 flex justify-end">
        <IronMountainLogoBlue className="h-16 w-auto sm:h-20 lg:h-24" />
      </div>
      <div className="relative z-20 flex h-full w-full flex-col justify-between px-[5%] py-[5%]">
        <div className="flex flex-1 items-center">
          <h1 className="w-1/2 font-geometria text-[7rem] leading-[110%] font-normal tracking-[-10.535px] sm:text-[8.14rem]">
            {title}
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-10 text-white">
          <div className="flex items-center gap-4">
            <Building2 className="h-16 w-16" />
            <span className="text-3xl leading-tight">{site}</span>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-16 w-16" />
            <span className="text-3xl leading-tight">{location}</span>
          </div>
          <div className="flex items-center gap-4">
            <Mountain className="h-16 w-16" />
            <span className="text-3xl leading-tight">{elevation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const useSlideRegistry = () => {
  const { data, error, loading } = useSummit();

  const slides = useMemo<SlideDefinition[]>(() => {
    if (!data) return [];

    const basecamp = data.basecamp;
    const kiosk1 = data.kiosk1;
    const kiosk2 = data.kiosk2;
    const kiosk3 = data.kiosk3;
    const meta = data.meta;
    const overlook = data.overlook;
    const summitSlides = data.summitSlides;

    const requiredMeta = (label: string) => {
      const match = meta.find(item => item.label.toLowerCase() === label.toLowerCase());
      if (!match) {
        throw new Error(`Missing meta label: ${label}`);
      }
      return match;
    };

    const companyMeta = requiredMeta('company');
    const dateMeta = requiredMeta('date of engagement');
    const locationMeta = requiredMeta('location');

    const company = companyMeta.value;
    const dateOfEngagement = dateMeta.value;
    const location = locationMeta.value;

    const metaLabels: MetaLabelMap = {
      company: companyMeta.label,
      dateOfEngagement: dateMeta.label,
      location: locationMeta.label,
    };

    const getSlideTitle = (handle: string) => {
      const slide = summitSlides.find(item => item.handle === handle);
      if (!slide) {
        throw new Error(`Missing summit slide: ${handle}`);
      }
      return slide.title;
    };

    const journey1Title = getSlideTitle('journey-1');
    const journey3Title = getSlideTitle('journey-3');
    const journey4Title = getSlideTitle('journey-4');
    const journey5Title = getSlideTitle('journey-5');
    const journey6Title = getSlideTitle('journey-6');

    const challenges = basecamp.problem3;
    const possibilitiesItems: readonly SummitPossibility[] = [
      basecamp.possibilitiesA,
      basecamp.possibilitiesB,
      basecamp.possibilitiesC,
    ];

    const stats = basecamp.problem2;

    const solutionItems: readonly SolutionItem[] = [
      { locations: overlook.protect, title: data.protectTitle },
      { locations: overlook.connect, title: data.connectTitle },
      { locations: overlook.activate, title: data.activateTitle },
    ];

    const futurescapingItems: readonly SummitFuturescaping[] = [
      overlook.futurescaping1,
      overlook.futurescaping2,
      overlook.futurescaping3,
    ];

    const storyItems: readonly SummitKioskAmbient[] = [kiosk1.ambient, kiosk2.ambient, kiosk3.ambient];

    const registry: SlideDefinition[] = [
      {
        id: 'welcome',
        render: () => (
          <WelcomeSlide
            company={company}
            dateOfEngagement={dateOfEngagement}
            labels={metaLabels}
            location={location}
            title={journey1Title}
          />
        ),
        title: 'Welcome',
      },
      {
        id: 'metrics',
        render: () => (
          <SlideFrame showDiamonds>
            <MetricsSection challenges={challenges} stats={stats} title={basecamp.problem1.title} variant="slide" />
          </SlideFrame>
        ),
        title: basecamp.problem1.title,
      },
      {
        id: 'possibilities',
        render: () => (
          <SlideFrame showDiamonds>
            <StrategiesSection
              accentColor={STRATEGY_ACCENT_COLORS[0]}
              density="compact"
              items={possibilitiesItems}
              title={journey3Title}
            />
          </SlideFrame>
        ),
        title: journey3Title,
      },
      {
        id: 'solutions',
        render: () => (
          <SlideFrame showDiamonds>
            <StrategiesSection
              accentColor={STRATEGY_ACCENT_COLORS[1]}
              density="compact"
              items={solutionItems}
              title={journey4Title}
              variant="solutions"
            />
          </SlideFrame>
        ),
        title: journey4Title,
      },
      {
        id: 'futurescaping',
        render: () => (
          <SlideFrame showDiamonds>
            <StrategiesSection
              accentColor={STRATEGY_ACCENT_COLORS[2]}
              density="compact"
              items={futurescapingItems}
              title={journey5Title}
              variant="futurescaping"
            />
          </SlideFrame>
        ),
        title: journey5Title,
      },
      {
        id: 'stories',
        render: () => (
          <SlideFrame showDiamonds>
            <StrategiesSection
              accentColor={STRATEGY_ACCENT_COLORS[3]}
              density="compact"
              items={storyItems}
              title={journey6Title}
              variant="stories"
            />
          </SlideFrame>
        ),
        title: journey6Title,
      },
    ];

    return registry;
  }, [data]);

  return { data, error, loading, slides };
};

const SummitSlidesScreen = ({
  initialSlideId,
  screen,
}: {
  readonly initialSlideId?: string;
  readonly screen: 'primary' | 'secondary';
}) => {
  const { client } = useMqtt();
  const { data, error, loading, slides } = useSlideRegistry();
  const searchParams = useSearchParams();

  // Ref to access latest slides without recreating handler
  const slidesRef = useRef(slides);

  const devControls = searchParams.get('dev') === '1' || searchParams.get('dev') === 'true';
  const requestedSlideParam = searchParams.get('slide') ?? undefined;

  const [activeSlideId, setActiveSlideId] = useState<string>(initialSlideId ?? 'welcome');

  const preferredSlideId = useMemo(() => {
    if (!requestedSlideParam || slides.length === 0) return undefined;

    const parsedIndex = Number.parseInt(requestedSlideParam, 10);
    if (Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < slides.length) {
      return slides[parsedIndex]?.id;
    }

    const match = slides.find(slide => slide.id === requestedSlideParam);
    return match?.id;
  }, [requestedSlideParam, slides]);

  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    if (!client || screen !== 'secondary' || devControls || preferredSlideId) return;

    const topic = 'state/summit';
    const handleSlideMessage = (message: Buffer) => {
      try {
        const parsed = JSON.parse(message.toString()) as { body?: ExhibitMqttStateSummit };
        const beatId = parsed.body?.['beat-id'];

        // Validate beat ID before use
        if (!beatId || !isValidSummitRoomBeatId(beatId)) {
          console.warn('Summit Slides: invalid beat ID:', beatId);
          return;
        }

        const slideIdx = getSlideIndexFromBeatId(beatId);
        if (typeof slideIdx !== 'number') return;

        // Use ref to access latest slides
        const currentSlides = slidesRef.current;
        const firstSlideId = currentSlides[0]?.id;
        if (!firstSlideId) {
          console.warn('Summit Slides: no registered slides available');
          return;
        }

        const next = currentSlides[slideIdx]?.id ?? firstSlideId;
        setActiveSlideId(next);
      } catch (err) {
        console.error('Summit Slides: failed to parse slide message', err);
      }
    };

    client.subscribeToTopic(topic, handleSlideMessage);
    return () => {
      client.unsubscribeFromTopic(topic, handleSlideMessage);
    };
  }, [client, devControls, preferredSlideId, screen]);

  if (loading) {
    return <PlaceholderSlide description="" heading="Loading…" />;
  }

  // Determine failure states
  const isOfflineOrError = error || !data;
  const hasNoSlides = slides.length === 0;

  // Primary screen: show fallback video for ANY failure (offline, error, or no slides)
  // Secondary screen: show specific text placeholders for debugging
  if (isOfflineOrError || hasNoSlides) {
    if (screen === 'primary') {
      return (
        <div className="relative h-full w-full overflow-hidden bg-[#F3F5F7]">
          <video
            aria-hidden
            autoPlay
            className="absolute inset-0 z-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            src={FALLBACK_VIDEO_URL}
          />
        </div>
      );
    }
    // Secondary screen: show specific error message
    const heading = isOfflineOrError ? 'Unable to load data' : 'No slides available';
    return <PlaceholderSlide description="" heading={heading} />;
  }

  const requiredMeta = (label: string) => {
    const match = data.meta.find(item => item.label.toLowerCase() === label.toLowerCase());
    if (!match) {
      throw new Error(`Missing meta label: ${label}`);
    }
    return match;
  };

  const summitSlides = data.summitSlides;

  if (screen === 'primary') {
    const journeyIntroSlide = summitSlides.find(slide => slide.handle === 'journey-intro');
    if (!journeyIntroSlide || !journeyIntroSlide.backgroundVideoUrl) {
      throw new Error('Missing journey-intro slide video');
    }

    return (
      <StaticWelcomeSlide
        elevation={requiredMeta('elevation').value}
        location={requiredMeta('location').value}
        site={requiredMeta('site').value}
        title={journeyIntroSlide.title}
        videoUrl={journeyIntroSlide.backgroundVideoUrl}
      />
    );
  }

  const effectiveActiveId = preferredSlideId ?? activeSlideId;
  const active = slides.find(slide => slide.id === effectiveActiveId) ?? slides[0]!;

  const goRelative = (delta: number) => {
    const idx = slides.findIndex(slide => slide.id === active.id);
    const next = slides[idx + delta];
    if (next) setActiveSlideId(next.id);
  };

  return (
    <div className="relative h-full w-full">
      {active.render()}
      {devControls ? (
        <div className="absolute top-4 right-4 flex items-center gap-4 rounded-md bg-white/90 px-4 py-2 text-sm shadow-md">
          <span className="font-semibold text-[#12406A]">Dev controls</span>
          <button
            className="rounded border border-[#12406A] px-3 py-1 font-medium text-[#12406A] transition hover:bg-[#12406A]/10"
            onClick={() => goRelative(-1)}
            type="button"
          >
            Prev
          </button>
          <button
            className="rounded border border-[#12406A] px-3 py-1 font-medium text-[#12406A] transition hover:bg-[#12406A]/10"
            onClick={() => goRelative(1)}
            type="button"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SummitSlidesScreen;
