'use client';

import { useEffect, useId } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import renderRegisteredMark from '../challenge/utils/renderRegisteredMark';

const defaultHeroVideoSrc = '/_videos/v1/7b46056515a038f40d95647dc31113a9e8ce2a8c';
const defaultLabelIconSrc = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';
const defaultArrowColor = '#9d9d9d';
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
      { color: '#f26522', label: 'Operational benefits' },
      { color: '#1b75bc', label: 'Economic benefits' },
      { color: '#8a0d71', label: 'Strategic benefits' },
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
      { color: '#f99d1c', label: 'Operational benefits' },
      { color: '#00a89c', label: 'Economic benefits' },
      { color: '#6dcff6', label: 'Strategic benefits' },
    ],
    id: 'customer-outcomes',
  },
];

export type ValueDiamondCard = {
  color: string;
  label?: string;
  textColor?: string;
};

export type ValueCarouselSlide = {
  badgeLabel?: string;
  bullets?: string[];
  diamondCards?: ValueDiamondCard[];
  id?: string;
};

export interface ValueCarouselTemplateProps {
  carouselId?: string;
  description?: string | string[];
  eyebrow?: string | string[];
  headline?: string;
  heroImageAlt?: string;
  heroImageSrc?: string;
  heroVideoPosterSrc?: string;
  heroVideoSrc?: string;
  labelIconSrc?: string;
  labelText?: string;
  slides?: ValueCarouselSlide[];
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
}

const Arrow = ({ direction = 'down', color = defaultArrowColor }: { color?: string; direction?: 'up' | 'down' }) => (
  <svg
    aria-hidden="true"
    className={`h-[118px] w-[118px] ${direction === 'up' ? '-scale-y-100 opacity-40' : ''}`}
    fill="none"
    viewBox="0 0 120 344"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M59.5 6v210"
      stroke={color}
      strokeLinecap="round"
      strokeWidth="12"
      style={{ opacity: direction === 'up' ? 0.4 : 1 }}
    />
    <path
      d="M26 310l33.5 28L93 310"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="12"
    />
  </svg>
);

const DiamondStack = ({ cards }: { cards: ValueDiamondCard[] }) => (
  <div className="relative flex h-[565px] w-[920px] items-center">
    {cards.map((card, index) => (
      <div
        key={`${card.label ?? card.color}-${index}`}
        className="absolute h-[400px] w-[400px] rotate-[45deg] rounded-[80px] shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
        style={{
          backgroundColor: card.color,
          left: index * 160,
        }}
      >
        {card.label ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[320px] w-[320px] -rotate-[45deg] items-center justify-center px-10 text-center text-[48px] font-normal leading-[1.2] tracking-[-2.4px]" style={{ color: card.textColor ?? '#ededed' }}>
              {renderRegisteredMark(card.label)}
            </div>
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export default function ValueCarouselTemplate({
  carouselId,
  description = defaultDescription,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  heroImageAlt = 'Value hero',
  heroImageSrc,
  heroVideoPosterSrc,
  heroVideoSrc = defaultHeroVideoSrc,
  labelIconSrc = defaultLabelIconSrc,
  labelText = defaultLabelText,
  slides,
  onNavigateDown,
  onNavigateUp,
}: ValueCarouselTemplateProps) {
  const generatedId = useId();
  const resolvedCarouselId = carouselId ?? `value-carousel-${generatedId}`;
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  const controller = useKioskController();

  useEffect(() => {
    if (!emblaApi) return;

    controller.register(resolvedCarouselId, {
      next: () => {
        if (emblaApi && emblaApi.canScrollNext()) {
          emblaApi.scrollNext();
          return true;
        }
        return false;
      },
      prev: () => {
        if (emblaApi && emblaApi.canScrollPrev()) {
          emblaApi.scrollPrev();
          return true;
        }
        return false;
      },
    });

    return () => controller.unregister(resolvedCarouselId);
  }, [controller, emblaApi, resolvedCarouselId]);

  const slidesToRender = slides?.length ? slides : defaultSlides;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5688:14628">
      <div className="absolute left-0 top-0 z-[1] h-[1284px] w-full overflow-hidden">
        {heroVideoSrc ? (
          <video
            autoPlay
            className="h-full w-full bg-red-500 object-cover object-center"
            controlsList="nodownload"
            loop
            muted
            playsInline
            poster={heroVideoPosterSrc}
          >
            <source src={heroVideoSrc} type="video/mp4" />
          </video>
        ) : heroImageSrc ? (
          <img alt={heroImageAlt} className="h-full w-full object-cover" src={heroImageSrc} />
        ) : (
          <div className="h-full w-full bg-neutral-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      </div>

      <div className="absolute left-0 top-0 z-[2] flex h-[1284px] w-full flex-col justify-between px-[120px] py-[240px]" data-node-id="5688:14630">
        <p className="text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
          {renderRegisteredMark(Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow)}
        </p>
        <div className="flex items-center gap-[41px]">
          <div className="relative flex h-[122px] w-[122px] items-center justify-center">
            <div className="relative size-[86px] rotate-[225deg] scale-y-[-1]">
              <img alt="" className="block h-full w-full object-contain" src={labelIconSrc} />
            </div>
          </div>
          <h1 className="text-[126px] font-normal leading-[1.3] tracking-[-6.3px] text-[#ededed]">
            {renderRegisteredMark(labelText)}
          </h1>
        </div>
      </div>

      <div
        className="absolute left-0 top-[1060px] z-[3] h-[4093px] w-full rounded-t-[100px] bg-[#ededed] px-[240px] pb-[1166px] pt-[200px]"
        data-node-id="5688:14631"
      >
        <div className="flex flex-col gap-[360px] text-[#8a0d71]">
          <div>
            <p className="text-[100px] font-normal leading-[1.3] tracking-[-5px]">
              {renderRegisteredMark(headline)}
            </p>
            <p className="mt-[80px] text-[60px] font-normal leading-[1.4] tracking-[-3px]">
              {renderRegisteredMark(Array.isArray(description) ? description.join('\n') : description)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-[80px]">
            <div className="w-full overflow-hidden" ref={emblaRef}>
              <div className="flex w-full">
                {slidesToRender.map((slide) => {
                  const cards =
                    slide.diamondCards && slide.diamondCards.length > 0 ? slide.diamondCards : defaultSlides[0].diamondCards!;
                  const bulletItems = slide.bullets?.filter((entry) => entry && entry.trim().length > 0) ?? [];
                  const hasBullets = bulletItems.length > 0;
                  return (
                    <div
                      key={slide.id ?? slide.badgeLabel}
                      className="flex min-h-[1600px] w-full min-w-full flex-row gap-[53px] pr-[80px]"
                    >
                      <div className="flex w-[900px] flex-col items-center gap-[71px]">
                        <DiamondStack cards={cards} />
                        {slide.badgeLabel ? (
                          <p className="text-center text-[48px] font-normal leading-[1.4] tracking-[-2.4px] text-[#8a0d71]">
                            {renderRegisteredMark(slide.badgeLabel)}
                          </p>
                        ) : null}
                      </div>
                      {hasBullets ? (
                        <ul className="flex-1 text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-[#8a0d71]">
                          {bulletItems.map((bullet, idx) => (
                            <li
                              className="relative mb-[48px] pl-[78px] last:mb-0"
                              key={`${slide.id ?? slide.badgeLabel ?? 'bullet'}-${idx}`}
                            >
                              <span className="absolute left-0 top-[30px] size-[16px] -translate-y-1/2 rounded-full bg-[#8a0d71]" />
                              <span>{renderRegisteredMark(bullet)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-1 items-center justify-start">
                          <div className="text-[48px] font-normal leading-[1.4] tracking-[-2.4px] text-[#8a0d71]">
                            {renderRegisteredMark(slide.badgeLabel ?? 'Value')}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute right-[120px] top-[1755px] z-[5] flex w-[120px] flex-col items-center gap-[108px]"
        data-node-id="5688:12459"
      >
        <button
          aria-label="Previous"
          className="h-[118px] w-[118px]"
          onClick={() => onNavigateUp?.()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onNavigateUp?.();
            }
          }}
          type="button"
        >
          <Arrow direction="up" />
        </button>
        <button
          aria-label="Next"
          className="h-[118px] w-[118px]"
          onClick={() => onNavigateDown?.()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onNavigateDown?.();
            }
          }}
          type="button"
        >
          <Arrow direction="down" />
        </button>
      </div>
    </div>
  );
}


