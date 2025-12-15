'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import { useMqtt } from '@/components/providers/mqtt-provider';
import SummitRootDiamondsBg from '@/components/ui/icons/SummitRootDiamondsBg';
import type { SummitStrategy } from '@/app/(displays)/summit/_types';
import type { SummitMqttState } from '@/lib/mqtt/types';

type SlideDefinition = {
  readonly id: string;
  readonly render: () => ReactElement;
  readonly title: string;
};

const SLIDE_BG = 'bg-white text-[#12406A]';
const SLIDE_CONTAINER = 'relative mx-auto flex h-full w-[90vw] max-w-[2300px] flex-col overflow-hidden px-10 py-10';
const SLIDE_SCALE = 2.2;

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
  children,
  showDiamonds = false,
}: {
  readonly children: ReactNode;
  readonly showDiamonds?: boolean;
}) => {
  return (
    <div className={`${SLIDE_BG} ${SLIDE_CONTAINER}`}>
      <div
        className="relative flex h-full w-full origin-top-left flex-col gap-10"
        style={{
          height: `${100 / SLIDE_SCALE}%`,
          scale: SLIDE_SCALE,
          width: `${100 / SLIDE_SCALE}%`,
        }}
      >
        {showDiamonds ? (
          <SummitRootDiamondsBg
            aria-hidden
            className="absolute -top-8 -right-6 h-[72px] w-[72px] opacity-80 sm:h-[88px] sm:w-[88px] md:h-[108px] md:w-[108px] lg:h-[124px] lg:w-[124px] xl:h-[144px] xl:w-[144px] 2xl:h-[164px] 2xl:w-[164px]"
          />
        ) : null}
        {children}
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
        render: () => <PlaceholderSlide heading="Welcome to Iron Mountain" />,
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
    return <PlaceholderSlide heading="Welcome to Iron Mountain" />;
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
        <div className="absolute top-4 right-4 flex items-center gap-3 rounded-md bg-white/90 px-4 py-2 text-sm shadow-md">
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
