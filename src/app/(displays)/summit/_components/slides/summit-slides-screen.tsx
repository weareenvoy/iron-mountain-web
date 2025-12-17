'use client';

import { Building2, MapPin, Mountain } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import { useMqtt } from '@/components/providers/mqtt-provider';
import IronMountainLogoBlue from '@/components/ui/icons/IronMountainLogoBlue';
import SummitRootDiamondsBg from '@/components/ui/icons/SummitRootDiamondsBg';
import type { SummitStrategy } from '@/app/(displays)/summit/_types';
import type { SummitMqttState } from '@/lib/mqtt/types';

type SlideDefinition = {
  readonly id: string;
  readonly render: () => ReactElement;
  readonly title: string;
};

const SLIDE_BG = 'bg-white text-[#12406A]';
const SLIDE_CONTAINER = 'relative flex h-full w-full max-w-full flex-col overflow-hidden px-10 py-10';
const SLIDE_SCALE = 2.2;
const WELCOME_BG_VIDEO =
  'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/summit/IRM_Summit_MountainLoop_V1.webm';

const PlaceholderSlide = ({ heading }: { readonly heading: string }) => {
  return (
    <div className={`${SLIDE_BG} ${SLIDE_CONTAINER} items-center justify-center`}>
      <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="text-4xl font-semibold sm:text-5xl">{heading}</p>
        <p className="text-lg text-muted-foreground sm:text-xl">Content will appear here during the session.</p>
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
  location,
  title,
}: {
  readonly company: string;
  readonly dateOfEngagement: string;
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
            <span className="text-sm font-semibold text-[#EDEDED]/80">Company</span>
            <span className="text-2xl text-[#EDEDED] sm:text-lg">{company}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#EDEDED]/80">Date of engagement</span>
            <span className="text-2xl text-[#EDEDED] sm:text-lg">{dateOfEngagement}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#EDEDED]/80">Location</span>
            <span className="text-2xl text-[#EDEDED] sm:text-lg">{location}</span>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
};

const StaticWelcomeSlide = ({
  company,
  elevation = 'Elevation 760 m (2,493.4 ft)',
  location,
  site = 'Executive Innovation Center',
  title = 'Welcome to Iron Mountain',
}: {
  readonly company?: string;
  readonly dateOfEngagement?: string;
  readonly elevation?: string;
  readonly location?: string;
  readonly site?: string;
  readonly title?: string;
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
        src={WELCOME_BG_VIDEO}
      />
      <div className="absolute inset-0 z-10 bg-linear-to-b from-white/10 via-white/5 to-[#0A5E72]/15" />
      <div className="absolute top-[5%] right-[0.5%] z-30 flex justify-end">
        <IronMountainLogoBlue className="h-16 w-auto sm:h-20 lg:h-24" />
      </div>
      <div className="relative z-20 flex h-full w-full flex-col justify-between px-[5%] py-[5%]">
        <div className="flex flex-1 items-center">
          <h1 className="w-1/2 font-[Geometria,Inter,sans-serif] text-[7rem] leading-[110%] font-normal tracking-[-10.535px] sm:text-[8.14rem]">
            {title}
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-10 text-white">
          <div className="flex items-center gap-4">
            <Building2 className="h-16 w-16" />
            <span className="text-3xl leading-tight">{site || company || 'Executive Innovation Center'}</span>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-16 w-16" />
            <span className="text-3xl leading-tight">{location || 'São Paulo, Brazil'}</span>
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

const buildStrategySlides = (strategies: readonly SummitStrategy[]) => {
  const accentPalette = ['#8A0D71', '#00A88E', '#F7931E', '#1B75BC'] as const;
  return strategies.map<SlideDefinition>((strategy, index) => ({
    id: `strategy-${index + 1}`,
    render: () => (
      <SlideFrame showDiamonds>
        <StrategiesSection accentColor={accentPalette[index] ?? '#8A0D71'} strategy={strategy} />
      </SlideFrame>
    ),
    title: strategy.title ?? strategy.eyebrow,
  }));
};

const useSlideRegistry = () => {
  const { data, error, loading } = useSummit();

  const slides = useMemo<SlideDefinition[]>(() => {
    if (!data) return [];

    const strategiesWithFallback = data.strategies.map((strategy, strategyIndex) => {
      if (strategyIndex !== 3) return strategy;

      const hasThreeBoxes = strategy.items.length >= 3;
      if (hasThreeBoxes) return strategy;

      const stories = data.stories.items;
      if (stories.length === 0) return strategy;

      return {
        eyebrow: strategy.eyebrow,
        items: stories.map(story => ({
          body: [story.description],
          title: story.title,
        })),
        summary: strategy.summary,
        title: strategy.title ?? data.stories.title,
      };
    });

    const registry: SlideDefinition[] = [
      {
        id: 'welcome',
        render: () => (
          <WelcomeSlide
            company={data.hero.clientName}
            dateOfEngagement={data.hero.date}
            location={data.hero.location}
            title={data.hero.title ?? 'Your personalized journey map'}
          />
        ),
        title: 'Welcome',
      },
      {
        id: 'metrics',
        render: () => (
          <SlideFrame showDiamonds>
            <MetricsSection metrics={data.metrics} obstacles={data.obstacles} variant="slide" />
          </SlideFrame>
        ),
        title: 'Metrics & Obstacles',
      },
    ];

    registry.push(...buildStrategySlides(strategiesWithFallback));

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

  const devControls = searchParams.get('dev') === '1' || searchParams.get('dev') === 'true';
  const requestedSlideParam = searchParams.get('slide') ?? undefined;

  const preferredSlideId = useMemo(() => {
    if (!requestedSlideParam || slides.length === 0) return undefined;

    const parsedIndex = Number.parseInt(requestedSlideParam, 10);
    if (Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < slides.length) {
      return slides[parsedIndex]?.id;
    }

    const match = slides.find(slide => slide.id === requestedSlideParam);
    return match?.id;
  }, [requestedSlideParam, slides]);

  const [activeSlideId, setActiveSlideId] = useState<string>(initialSlideId ?? 'welcome');

  useEffect(() => {
    if (!client || screen !== 'secondary' || devControls || preferredSlideId) return;

    const topic = 'state/summit';
    const handleSlideMessage = (message: Buffer) => {
      try {
        const parsed = JSON.parse(message.toString()) as { body?: SummitMqttState };
        const slideIdx = parsed.body?.['slide-idx'];
        if (typeof slideIdx !== 'number') return;

        const next = slides[slideIdx]?.id ?? 'welcome';
        setActiveSlideId(next);
      } catch (err) {
        console.error('Summit Slides: failed to parse slide message', err);
      }
    };

    client.subscribeToTopic(topic, handleSlideMessage);
    return () => {
      client.unsubscribeFromTopic(topic, handleSlideMessage);
    };
  }, [client, devControls, preferredSlideId, screen, slides]);

  if (loading) {
    return <PlaceholderSlide heading="Loading…" />;
  }

  if (error || !data || slides.length === 0) {
    return <PlaceholderSlide heading="Unable to load slides" />;
  }

  if (screen === 'primary') {
    return (
      <StaticWelcomeSlide
        company={data.hero.clientName}
        dateOfEngagement={data.hero.date}
        location={data.hero.location}
        title={data.hero.title ?? 'Welcome to Iron Mountain'}
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
