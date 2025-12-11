'use client';

import { useEffect, useMemo, useState } from 'react';
import MetricsSection from '@/app/(displays)/summit/_components/sections/metrics-section';
import StrategiesSection from '@/app/(displays)/summit/_components/sections/strategies-section';
import type { SummitStrategy } from '@/app/(displays)/summit/_types';
import { useSummit } from '@/app/(displays)/summit/_components/providers/summit-provider';
import { useMqtt } from '@/components/providers/mqtt-provider';
import type { SummitMqttState } from '@/lib/mqtt/types';

type SlideDefinition = {
  readonly id: string;
  readonly render: () => JSX.Element;
  readonly title: string;
};

const SLIDE_BG = 'bg-white text-[#12406A]';
const SLIDE_CONTAINER = 'flex h-full w-full flex-col overflow-hidden px-12 py-10';

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

const SlideFrame = ({ children }: { readonly children: React.ReactNode }) => {
  return <div className={`${SLIDE_BG} ${SLIDE_CONTAINER} gap-10`}>{children}</div>;
};

const buildStrategySlides = (strategies: readonly SummitStrategy[]) => {
  const accentPalette = ['#8A0D71', '#00A88E', '#F7931E', '#1B75BC'] as const;
  return strategies.map<SlideDefinition>((strategy, index) => ({
    id: `strategy-${index + 1}`,
    render: () => (
      <SlideFrame>
        <StrategiesSection accentColor={accentPalette[index] ?? '#8A0D71'} strategy={strategy} />
      </SlideFrame>
    ),
    title: strategy.title ?? strategy.eyebrow ?? `Strategy ${index + 1}`,
  }));
};

const useSlideRegistry = () => {
  const { data, error, loading } = useSummit();

  const slides = useMemo<SlideDefinition[]>(() => {
    if (!data) return [];

    const registry: SlideDefinition[] = [
      {
        id: 'welcome',
        render: () => <PlaceholderSlide heading="Welcome to Iron Mountain" />,
        title: 'Welcome',
      },
      {
        id: 'metrics',
        render: () => (
          <SlideFrame>
            <MetricsSection metrics={data.metrics} obstacles={data.obstacles} />
          </SlideFrame>
        ),
        title: 'Metrics & Obstacles',
      },
    ];

    registry.push(...buildStrategySlides(data.strategies ?? []));

    return registry;
  }, [data]);

  return { data, error, loading, slides };
};

const SummitSlidesScreen = ({
  screen,
  initialSlideId,
}: {
  readonly initialSlideId?: string;
  readonly screen: 'primary' | 'secondary';
}) => {
  const { client } = useMqtt();
  const { data, error, loading, slides } = useSlideRegistry();
  const [activeSlideId, setActiveSlideId] = useState<string>(initialSlideId ?? 'welcome');

  useEffect(() => {
    if (!client || screen !== 'secondary') return;

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
  }, [client, screen, slides]);

  useEffect(() => {
    if (initialSlideId) {
      setActiveSlideId(initialSlideId);
    }
  }, [initialSlideId]);

  if (loading) {
    return <PlaceholderSlide heading="Loading…" />;
  }

  if (error || !data || slides.length === 0) {
    return <PlaceholderSlide heading="Unable to load slides" />;
  }

  if (screen === 'primary') {
    return <PlaceholderSlide heading="Welcome to Iron Mountain" />;
  }

  const active = slides.find(slide => slide.id === activeSlideId) ?? slides[0];

  return active.render();
};

export default SummitSlidesScreen;

