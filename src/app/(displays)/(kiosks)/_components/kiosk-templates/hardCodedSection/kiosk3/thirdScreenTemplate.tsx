'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { useMemo, useState } from 'react';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

type CarouselSlide = {
  bullets: string[];
  id: string;
  sectionTitle: string | string[];
  primaryImageAlt: string;
  primaryImageSrc: string;
  secondaryImageAlt: string;
  secondaryImageSrc: string;
  eyebrow?: string | string[];
  headline?: string | string[];
};

export interface HardCodedKiosk3ThirdScreenTemplateProps {
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  headline?: string | string[];
  slides?: CarouselSlide[];
}

const defaultHeadline = ['Centralized management', 'of services via API'];

const defaultSlides: CarouselSlide[] = [
  {
    bullets: [
      'Decommissioning services',
      'Packaging / logistics / transportation',
      'Data sanitization',
      'Lease returns',
      'ITAD',
    ],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Centralized management', 'of services via API'],
    id: 'slide-1',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image2-Diamond.png',
    sectionTitle: 'Data configuration',
  },
  {
    bullets: ['Asset tagging', 'Asset tracking', 'Inventory management', 'Audits', 'Legal holds'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Centralized management', 'of services via API'],
    id: 'slide-2',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image2-Diamond.png',
    sectionTitle: 'Device storage',
  },
  {
    bullets: ['Kitting', 'Cleaning', 'Planning/scheduling', 'Imaging', 'Required upgrades'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device configuration'],
    id: 'slide-3',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image2-Diamond.png',
    sectionTitle: 'Device configuration',
  },
  {
    bullets: ['Shipment of PC and peripherals', 'Advanced exchange for repair or refresh'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device deployment'],
    id: 'slide-4',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image2-Diamond.png',
    sectionTitle: 'Device deployment',
  },
  {
    bullets: ['Management of warranty and support extension, including break/fix'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device maintenance'],
    id: 'slide-5',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image2-Diamond.png',
    sectionTitle: 'Device maintenance',
  },
  {
    bullets: ['Retrieval of PC and peripherals'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device reverse logistics'],
    id: 'slide-6',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image2-Diamond.png',
    sectionTitle: 'Device reverse logistics',
  },
];

export default function HardCodedKiosk3ThirdScreenTemplate({
  backgroundEndColor = '#0a2f5c',
  backgroundStartColor = '#1b75bc',
  headline = defaultHeadline,
  slides = defaultSlides,
}: HardCodedKiosk3ThirdScreenTemplateProps) {
  const [index, setIndex] = useState(0);

  const total = slides.length;
  const current = slides[index] ?? slides[0] ?? defaultSlides[0];

  const headlineText = useMemo(
    () => (Array.isArray(headline) ? headline.join('\n') : headline ?? ''),
    [headline]
  );

  const eyebrowText = useMemo(
    () => (Array.isArray(current?.eyebrow) ? current.eyebrow.join('\n') : current?.eyebrow ?? ''),
    [current?.eyebrow]
  );
  const sectionTitle = useMemo(
    () => (Array.isArray(current?.sectionTitle) ? current.sectionTitle.join('\n') : current?.sectionTitle ?? ''),
    [current?.sectionTitle]
  );

  const goNext = () => setIndex((i) => (i + 1) % total);
  const goPrev = () => setIndex((i) => (i - 1 + total) % total);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13360">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)` }}
      />
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[12px]" />

      {/* Eyebrow */}
      <div className="absolute left-[120px] top-[140px] text-[48px] font-normal leading-[1.35] tracking-[-2.5px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      {/* Main headline */}
      <div className="absolute left-[120px] top-[260px] max-w-[1200px] text-[74px] font-semibold leading-[1.15] tracking-[-3.5px] text-white whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      {/* Data configuration + bullets */}
      <div className="absolute left-[120px] top-[520px] max-w-[920px] space-y-[36px] text-white">
        <h2 className="text-[54px] font-semibold leading-[1.2] tracking-[-2.7px]">{renderRegisteredMark(sectionTitle)}</h2>
        <ul className="space-y-[22px] text-[38px] font-normal leading-[1.3] tracking-[-2px] text-white">
          {current?.bullets.map((item, i) => (
            <li key={`${current?.id}-bullet-${i}`} className="flex items-start gap-[16px]">
              <span className="mt-[14px] inline-block h-[18px] w-[18px] rotate-[45deg] rounded-[4px] border border-white/80" />
              <span>{renderRegisteredMark(item)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="absolute left-[120px] top-[900px] flex h-[140px] items-center gap-[18px] rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[80px] text-[46px] font-semibold leading-[1.1] tracking-[-2px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        type="button"
      >
        Launch demo
        <Play aria-hidden className="h-[40px] w-[40px]" strokeWidth={2.2} />
      </button>

      {/* Circle carousel control */}
      <div className="absolute right-[160px] top-[460px] h-[320px] w-[320px]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#6dcff6]/70" />
          <div className="absolute inset-[18px] rounded-full border-[12px] border-[#1b75bc]" />
          <div className="absolute inset-[44px] rounded-full border-[6px] border-[#6dcff6]/70" />

          <div className="absolute inset-0 flex items-center justify-center text-white text-[38px] font-semibold">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Dots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-150px)`,
              }}
            >
              <div className="h-[18px] w-[18px] rounded-full bg-[#6dcff6]" />
            </div>
          ))}

          {/* Arrows */}
          <button
            aria-label="Previous slide"
            className="absolute left-[44px] top-1/2 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
            onClick={goPrev}
            type="button"
          >
            <ArrowLeft className="h-[28px] w-[28px]" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-[44px] top-1/2 flex h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/35"
            onClick={goNext}
            type="button"
          >
            <ArrowRight className="h-[28px] w-[28px]" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Bottom diamond collage */}
      <div className="absolute bottom-[120px] left-1/2 flex -translate-x-1/2 items-end gap-[80px]">
        <div className="relative h-[520px] w-[520px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-0 -rotate-[45deg]">
            <Image
              alt={current?.primaryImageAlt ?? 'Primary slide image'}
              className="object-cover"
              fill
              sizes="520px"
              src={current?.primaryImageSrc ?? defaultSlides[0]?.primaryImageSrc ?? ''}
            />
          </div>
        </div>
        <div className="relative h-[440px] w-[440px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
          <div className="absolute inset-0 -rotate-[45deg]">
            <Image
              alt={current?.secondaryImageAlt ?? 'Secondary slide image'}
              className="object-cover"
              fill
              sizes="440px"
              src={current?.secondaryImageSrc ?? defaultSlides[0]?.secondaryImageSrc ?? ''}
            />
          </div>
        </div>
      </div>

      {/* Decorative diamonds */}
      <div className="absolute left-[180px] bottom-[220px] h-[220px] w-[220px] rotate-[45deg] rounded-[50px] bg-gradient-to-br from-[#5bbbf5] to-[#1b75bc] shadow-[0_20px_60px_rgba(0,0,0,0.25)]" />
      <div className="absolute left-1/2 bottom-[80px] h-[360px] w-[360px] -translate-x-1/2 rotate-[45deg] rounded-[80px] border-[6px] border-[#f79420] opacity-85" />
    </div>
  );
}

