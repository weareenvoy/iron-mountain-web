'use client';

import Image from 'next/image';
import { useId, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import BlueFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/BlueFilledDiamond';
import OrangeFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/OrangeFilledDiamond';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import PurpleFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/PurpleFilledDiamond';
import renderRegisteredMark from '../challenge/utils/renderRegisteredMark';
import ValueCarousel from './components/ValueCarousel';

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

export const getDiamondIcon = (card: ValueDiamondCard) => {
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
    onRegisterCarouselHandlers,
    slides,
  } = props;
  const generatedId = useId();
  const resolvedCarouselId = carouselId ?? `value-carousel-${generatedId}`;
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

      <div className="absolute top-0 left-0 z-[2] flex h-[1284px] w-full flex-col justify-between px-[120px] py-[240px]">
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(normalizeMultiline(eyebrow))}
        </p>
        <div className="relative top-[-100px] left-[10px] flex items-center gap-[41px]">
          <div className="relative top-[25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
            <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
          </div>
          <h1 className="relative top-[30px] left-[-90px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]">
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
          <ValueCarousel
            carouselColumnStyle={carouselColumnStyle}
            onRegisterCarouselHandlers={onRegisterCarouselHandlers}
            slides={slidesWithDefaults}
          />
        </div>
      </div>
    </div>
  );
};

export default ValueCarouselTemplate;
