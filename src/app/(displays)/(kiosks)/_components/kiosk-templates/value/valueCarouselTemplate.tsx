'use client';

import { useEffect, useId, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import BlueFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/BlueFilledDiamond';
import OrangeFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/OrangeFilledDiamond';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import PurpleFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/PurpleFilledDiamond';
import renderRegisteredMark from '../challenge/utils/renderRegisteredMark';

const fallbackDiamondCards: readonly ValueDiamondCard[] = [];
const paletteColors = ['#8a0d71', '#1b75bc', '#f26522'] as const;
const paletteTextColors = [undefined, undefined, undefined] as const;

const normalizeDiamondCards = (cards?: readonly ValueDiamondCard[]) => {
  const base = cards && cards.length > 0 ? cards : fallbackDiamondCards;

  // Check if this is a carousel slide (has a labeled card at the end with empty labels before it)
  const lastCard = base[base.length - 1];
  const hasCarouselPattern =
    base.length === 3 && lastCard?.label && base.slice(0, -1).every(card => !card.label || card.label === '');

  if (hasCarouselPattern) {
    // Apply Kiosk 1's carousel color logic based on the labeled benefit
    const labelNormalized = (lastCard.label ?? '').toLowerCase();

    if (labelNormalized.includes('operational')) {
      // Operational: [Orange, Blue, Purple (labeled)]
      return [
        { ...base[0], color: '#f26522', textColor: '#4a154b' },
        { ...base[1], color: '#1b75bc' },
        { ...base[2], color: '#8a0d71', label: lastCard.label },
      ];
    }

    if (labelNormalized.includes('economic')) {
      // Economic: [Purple, Orange, Blue (labeled)]
      return [
        { ...base[0], color: '#8a0d71' },
        { ...base[1], color: '#f26522', textColor: '#4a154b' },
        { ...base[2], color: '#1b75bc', label: lastCard.label },
      ];
    }

    // Strategic (default): [Blue, Purple, Orange (labeled)]
    return [
      { ...base[0], color: '#1b75bc' },
      { ...base[1], color: '#8a0d71' },
      { ...base[2], color: '#f26522', label: lastCard.label, textColor: '#4a154b' },
    ];
  }

  // For overview slides or other patterns, use the palette
  return base.map((card, idx) => ({
    ...card,
    color: card.color ?? paletteColors[idx % paletteColors.length],
    textColor: card.textColor ?? paletteTextColors[idx % paletteTextColors.length],
  }));
};

const diamondIconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  '#1b75bc': BlueFilledDiamond,
  '#6dcff6': BlueFilledDiamond,
  '#8a0d71': PurpleFilledDiamond,
  '#a2115e': PurpleFilledDiamond,
  '#f99d1c': OrangeFilledDiamond,
  '#f7931e': OrangeFilledDiamond,
  '#f26522': OrangeFilledDiamond,
};

const getDiamondIcon = (card: ValueDiamondCard) => {
  if (card.icon) return card.icon;

  const normalizedColor = card.color?.toLowerCase();
  return normalizedColor ? diamondIconMap[normalizedColor] : undefined;
};

const normalizeMultiline = (value?: string): string | undefined => {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  return undefined;
};

export type ValueDiamondCard = {
  readonly color?: string;
  readonly icon?: ComponentType<SVGProps<SVGSVGElement>>;
  readonly label?: string;
  readonly textColor?: string;
};

export type ValueCarouselSlide = {
  readonly badgeLabel?: string;
  readonly bullets?: readonly string[];
  readonly diamondCards?: readonly ValueDiamondCard[];
  readonly id?: string;
};

export type ValueCarouselTemplateProps = {
  readonly carouselId?: string;
  readonly description?: string;
  readonly eyebrow?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly heroVideoPosterSrc?: string;
  readonly heroVideoSrc?: string;
  readonly labelText?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly onRegisterCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly slides?: readonly ValueCarouselSlide[];
};

type DiamondStackVariant = 'carousel' | 'overview';

const diamondLayouts: Record<
  DiamondStackVariant,
  Readonly<{ containerStyle?: CSSProperties; positions: readonly number[] }>
> = {
  carousel: {
    containerStyle: { left: -330, position: 'relative' },
    positions: [335, 490, 650],
  },
  overview: {
    containerStyle: undefined,
    positions: [0, 565, 1130],
  },
} as const;

const DiamondStack = ({
  cards,
  variant = 'overview',
}: Readonly<{ cards: readonly ValueDiamondCard[]; variant?: DiamondStackVariant }>) => {
  const layout = diamondLayouts[variant];

  return (
    <div className="relative flex h-[565px] w-[920px] items-center" style={layout.containerStyle}>
      {cards.map((card, index) => {
        const Icon = getDiamondIcon(card);
        const fallbackColor = card.color ?? '#8a0d71';
        const leftOffset = layout.positions[index] ?? index * 160;

        return (
          <div
            className="absolute h-[550px] w-[550px] rotate-[45deg] rounded-[80px]"
            key={`${card.label ?? fallbackColor}-${index}`}
            style={{ left: leftOffset }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-full w-full -rotate-[45deg]">
                {Icon ? (
                  <Icon aria-hidden className="h-full w-full" focusable="false" />
                ) : (
                  <div className="h-full w-full rounded-[80px]" style={{ backgroundColor: fallbackColor }} />
                )}
              </div>
            </div>
            {card.label ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="flex h-[320px] w-[320px] -rotate-[45deg] items-center justify-center px-10 text-center text-[48px] leading-[1.4] font-normal tracking-[-2.4px] text-[#ededed]"
                >
                  {renderRegisteredMark(card.label)}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const ValueCarouselTemplate = (props: ValueCarouselTemplateProps) => {
  const {
    carouselId,
    description,
    eyebrow,
    headline,
    heroImageAlt,
    heroImageSrc,
    heroVideoPosterSrc,
    heroVideoSrc,
    labelText,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onNavigateDown: _onNavigateDown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onNavigateUp: _onNavigateUp,
    onRegisterCarouselHandlers,
    slides,
  } = props;
  const generatedId = useId();
  const resolvedCarouselId = carouselId ?? `value-carousel-${generatedId}`;
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const isOverview = resolvedCarouselId.includes('overview');
  const heroVideo = isOverview ? heroVideoSrc : undefined;

  const slidesToRender = slides?.length ? slides : [];
  const slidesWithDefaults = slidesToRender.map(slide => ({
    ...slide,
    diamondCards: normalizeDiamondCards(slide.diamondCards),
  }));

  const getBulletItems = (slide: ValueCarouselSlide) =>
    slide.bullets?.filter(entry => entry && entry.trim().length > 0) ?? [];

  const hasCarouselSlides = slidesWithDefaults.some(slide => getBulletItems(slide).length > 0);
  const carouselColumnStyle: CSSProperties | undefined = hasCarouselSlides
    ? { alignSelf: 'baseline', left: -330, position: 'relative' }
    : undefined;

  // Register carousel handlers with parent when emblaApi is ready
  useEffect(() => {
    if (emblaApi && onRegisterCarouselHandlers) {
      onRegisterCarouselHandlers({
        canScrollNext: () => emblaApi.canScrollNext(),
        canScrollPrev: () => emblaApi.canScrollPrev(),
        scrollNext: () => emblaApi.scrollNext(),
        scrollPrev: () => emblaApi.scrollPrev(),
      });
    }
  }, [emblaApi, onRegisterCarouselHandlers]);

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-visible bg-transparent"
      data-carousel-id={resolvedCarouselId}
      {...(isOverview ? { 'data-scroll-section': 'value-carousel' } : {})}
    >
      <div className="absolute top-0 left-0 z-[0] h-[1284px] w-full overflow-hidden">
        {heroVideo ? (
          <video
            autoPlay
            className="absolute h-full w-full bg-black object-cover object-center"
            controlsList="nodownload"
            loop
            muted
            playsInline
            poster={heroVideoPosterSrc}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : heroImageSrc && heroImageAlt ? (
          <div className="relative h-full w-full">
            <Image alt={heroImageAlt} className="object-cover" fill sizes="1284px" src={heroImageSrc} />
          </div>
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div
        className="absolute top-0 left-0 z-[2] flex h-[1284px] w-full flex-col justify-between px-[120px] py-[240px]"
      >
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(normalizeMultiline(eyebrow))}
        </p>
        <div className="relative left-[10px] top-[-100px] flex items-center gap-[41px]">
          <div className="relative left-[-55px] top-[25px] flex h-[200px] w-[200px] items-center justify-center">
            <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
          </div>
          <h1
            className="relative left-[-90px] top-[30px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]"
          >
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      <div
        className={`absolute top-[1060px] left-0 z-[3] w-full rounded-t-[100px] px-[240px] pt-[200px] pb-[1166px] ${
          isOverview ? 'h-[9360px] bg-[#ededed]' : 'h-[4150px] bg-transparent'
        }`}
      >
        <div className="relative top-[-10px] flex flex-col gap-[360px] text-[#8a0d71]">
          <div>
            <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px]">{renderRegisteredMark(headline)}</p>
            <p
              className="mt-[80px] w-[1480px] text-[60px] leading-[1.4] font-normal tracking-[-3px]"
              {...(!isOverview ? { 'data-scroll-section': 'value-description' } : {})}
            >
              {renderRegisteredMark(normalizeMultiline(description))}
            </p>
          </div>
          <div className="flex flex-col items-end gap-[80px]" style={carouselColumnStyle}>
            <div className="w-full overflow-hidden" ref={emblaRef}>
              <div className="flex w-full">
                {slidesWithDefaults.map(slide => {
                  const cards: readonly ValueDiamondCard[] = slide.diamondCards;
                  const bulletItems = getBulletItems(slide);
                  const hasBullets = bulletItems.length > 0;
                  const stackVariant: DiamondStackVariant = hasBullets ? 'carousel' : 'overview';
                  return (
                    <div className="flex min-h-[1600px] w-full min-w-full flex-row gap-[53px] pr-[80px]" key={slide.id}>
                      <div className="flex w-[920px] flex-col items-center gap-[71px]">
                        <DiamondStack cards={cards} variant={stackVariant} />
                      </div>
                      {hasBullets ? (
                        <ul className="flex-1 text-[52px] leading-[1.4] font-normal tracking-[-2.6px] text-[#8a0d71]">
                          {bulletItems.map((bullet, idx) => (
                            <li
                              className="relative mb-[80px] w-[840px] pl-[40px] last:mb-0"
                              key={`${slide.id}-bullet-${idx}`}
                            >
                              <span className="absolute top-[30px] left-0 size-[16px] -translate-y-1/2 rounded-full bg-[#8a0d71]" />
                              <span>{renderRegisteredMark(bullet)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ValueCarouselTemplate.displayName = 'ValueCarouselTemplate';

export default ValueCarouselTemplate;
