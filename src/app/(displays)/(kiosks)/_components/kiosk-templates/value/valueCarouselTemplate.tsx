'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useId, type ComponentType, type CSSProperties, type SVGProps } from 'react';
import BlueFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/BlueFilledDiamond';
import OrangeFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/OrangeFilledDiamond';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import PurpleFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/PurpleFilledDiamond';
import renderRegisteredMark from '../challenge/utils/renderRegisteredMark';

const defaultHeroVideoSrc = '/_videos/v1/7b46056515a038f40d95647dc31113a9e8ce2a8c';
const defaultHeadline = 'Expanding possibilities';
const defaultDescription =
  'The partnership with Iron Mountain and implementation of InSight DXP transitioned the organization from unknown to certainty and clarity in pension administration.';
const defaultEyebrow = ['Information', '& data lifecycle'];
const defaultLabelText = 'Value';

const defaultSlides = [
  {
    badgeLabel: 'Operational benefits',
    bullets: [
      'Rendered an accessible, searchable system for pension employees to quickly answer employee and regulatory queries',
      'Provided scalability for future growth, including adding additional automated intelligent document processing (IDP) workflows',
      'Enabled the organization to validate paid claims faster and more accurately upon deployment',
    ],
    diamondCards: [
      { color: '#f26522', label: 'Strategic benefits' },
      { color: '#8a0d71', label: 'Operational benefits' },
      { color: '#1b75bc', label: 'Economic benefits' },
    ],
    id: 'operational-benefits',
  },
  {
    badgeLabel: 'Customer outcomes',
    bullets: [
      'Accelerated response times with proactive insights surfaced from digitized archives',
      'Created transparency for stakeholders through live dashboards and auditable workflows',
      'Unlocked downstream automation opportunities across governance, risk, and compliance teams',
    ],
    diamondCards: [
      { color: '#8a0d71', label: 'Operational benefits' },
      { color: '#1b75bc', label: 'Economic benefits' },
      { color: '#f26522', label: 'Strategic benefits' },
    ],
    id: 'customer-outcomes',
  },
];

const fallbackDiamondCards: readonly ValueDiamondCard[] = defaultSlides[0]?.diamondCards ?? [];
const paletteColors = ['#f26522', '#8a0d71', '#1b75bc'] as const;
const paletteTextColors = ['#4a154b', undefined, undefined] as const;

const normalizeDiamondCards = (cards?: readonly ValueDiamondCard[]) => {
  const base = cards && cards.length > 0 ? cards : fallbackDiamondCards;
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

const normalizeMultiline = (value?: readonly string[] | string): string | undefined => {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.join('\n');
  if (typeof value === 'string') return value;
  return undefined;
};

export type ValueDiamondCard = Readonly<{
  color?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  label?: string;
  textColor?: string;
}>;

export type ValueCarouselSlide = Readonly<{
  badgeLabel?: string;
  bullets?: readonly string[];
  diamondCards?: readonly ValueDiamondCard[];
  id?: string;
}>;

export type ValueCarouselTemplateProps = Readonly<{
  carouselId?: string;
  description?: readonly string[] | string;
  eyebrow?: readonly string[] | string;
  headline?: string;
  heroImageAlt?: string;
  heroImageSrc?: string;
  heroVideoPosterSrc?: string;
  heroVideoSrc?: string;
  labelText?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  slides?: readonly ValueCarouselSlide[];
}>;

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
                  className="flex h-[320px] w-[320px] -rotate-[45deg] items-center justify-center px-10 text-center text-[48px] leading-[1.2] font-normal tracking-[-2.4px]"
                  style={{ color: '#ededed' }}
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
    description = defaultDescription,
    eyebrow = defaultEyebrow,
    headline = defaultHeadline,
    heroImageAlt = 'Value hero',
    heroImageSrc,
    heroVideoPosterSrc,
    heroVideoSrc,
    labelText = defaultLabelText,
    onNavigateDown,
    onNavigateUp,
    slides,
  } = props;
  const generatedId = useId();
  const resolvedCarouselId = carouselId ?? `value-carousel-${generatedId}`;
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const isOverview = resolvedCarouselId.includes('overview');
  const contentHeight = isOverview ? '9360px' : '4150px';
  const contentBackground = isOverview ? '#ededed' : 'transparent';
  const heroVideo = isOverview ? (heroVideoSrc ?? defaultHeroVideoSrc) : undefined;

  const slidesToRender = slides?.length ? slides : defaultSlides;
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

  const handleArrowUp = () => {
    if (emblaApi?.canScrollPrev()) {
      emblaApi.scrollPrev();
      return;
    }
    onNavigateUp?.();
  };

  const handleArrowDown = () => {
    if (emblaApi?.canScrollNext()) {
      emblaApi.scrollNext();
      return;
    }
    onNavigateDown?.();
  };

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-carousel-id={resolvedCarouselId}
      data-node-id="5688:14628"
      style={{ background: 'transparent', overflow: 'visible' }}
    >
      <div className="absolute top-0 left-0 z-[1] h-[1284px] w-full overflow-hidden">
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
        ) : heroImageSrc ? (
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
        data-node-id="5688:14630"
      >
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
          {renderRegisteredMark(normalizeMultiline(eyebrow))}
        </p>
        <div className="flex items-center gap-[41px]" style={{ left: 10, position: 'relative', top: -100 }}>
          <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -55, top: 25 }}>
            <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
          </div>
          <h1
            className="text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]"
            style={{ left: -90, position: 'relative', top: 30 }}
          >
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      <div
        className="absolute top-[1060px] left-0 z-[3] h-[4093px] w-full rounded-t-[100px] px-[240px] pt-[200px] pb-[1166px]"
        data-node-id="5688:14631"
        style={{ background: contentBackground, height: contentHeight }}
      >
        <div className="flex flex-col gap-[360px] text-[#8a0d71]" style={{ position: 'relative', top: -10 }}>
          <div>
            <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px]">{renderRegisteredMark(headline)}</p>
            <p className="mt-[80px] text-[60px] leading-[1.4] font-normal tracking-[-3px]" style={{ width: '1480px' }}>
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

      <div
        aria-label="Previous"
        className="absolute top-[1755px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center text-[#58595B]"
        data-node-id="5688:12459"
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleArrowUp();
          }
        }}
        onPointerDown={handleArrowUp}
        role="button"
        tabIndex={0}
      >
        <ArrowUp aria-hidden="true" className="h-full w-full" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        className="absolute top-[1980px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center text-[#58595B]"
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleArrowDown();
          }
        }}
        onPointerDown={handleArrowDown}
        role="button"
        tabIndex={0}
      >
        <ArrowDown aria-hidden="true" className="h-full w-full" focusable="false" strokeWidth={1.5} />
      </div>
    </div>
  );
};

ValueCarouselTemplate.displayName = 'ValueCarouselTemplate';

export default ValueCarouselTemplate;
