'use client';

import Image from 'next/image';
import { ArrowLeft, ArrowRight, SquarePlay } from 'lucide-react';
import { useMemo, useState } from 'react';
import HCBlueFilledDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCBlueFilledDiamond';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond';
import HCFilledOrangeDiamond2 from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond2';
import HCFilledTealDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledTealDiamond';
import HCHollowBlueDiamond2 from '@/components/ui/icons/Kiosks/HardCoded/HCHollowBlueDiamond2';
import HCHollowGreenDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowGreenDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowOrangeDiamond';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

type CarouselSlide = {
  bullets: string[];
  id: string;
  sectionTitle: string | string[];
  primaryImageAlt: string;
  primaryImageSrc: string;
  primaryVideoSrc?: string;
  secondaryImageAlt: string;
  secondaryImageSrc?: string;
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
    primaryVideoSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Video1-Full.mp4',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Image2-Diamond.png',
    sectionTitle: 'Data configuration',
  },
  {
    bullets: ['Asset tagging', 'Asset tracking', 'Inventory management', 'Audits', 'Legal holds'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Centralized management', 'of services via API'],
    id: 'slide-2',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    primaryVideoSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Video2-Full.mp4',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: undefined,
    sectionTitle: 'Device storage',
  },
  {
    bullets: ['Kitting', 'Cleaning', 'Planning/scheduling', 'Imaging', 'Required upgrades'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device configuration'],
    id: 'slide-3',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    primaryVideoSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Video3-Full.mp4',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Image3-Diamond.png',
    sectionTitle: 'Device configuration',
  },
  {
    bullets: ['Shipment of PC and peripherals', 'Advanced exchange for repair or refresh'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device deployment'],
    id: 'slide-4',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    primaryVideoSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Video4-Full.mp4',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Image4-Diamond.png',
    sectionTitle: 'Device deployment',
  },
  {
    bullets: ['Management of warranty and support extension, including break/fix'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device maintenance'],
    id: 'slide-5',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    primaryVideoSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Video5-Full.mp4',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: undefined,
    sectionTitle: 'Device maintenance',
  },
  {
    bullets: ['Retrieval of PC and peripherals'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device reverse logistics'],
    id: 'slide-6',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc: '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png',
    primaryVideoSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Video6-Full.mp4',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc: '/images/kiosks/kiosk3/04-custom-interactive/CU-Image5-Diamond.png',
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
  const isSlide2 = current?.id === 'slide-2';
  const isSlide5 = current?.id === 'slide-5';
  const isSlide3 = current?.id === 'slide-3';
  const isSlide6 = current?.id === 'slide-6';
  const primaryDiamondClass = isSlide2 || isSlide5
    ? 'absolute left-[510px] bottom-[670px] h-[1200px] w-[1200px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
    : isSlide3 || isSlide6
      ? 'absolute left-[340px] bottom-[340px] h-[1130px] w-[1130px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
      : 'absolute left-[700px] bottom-[1120px] h-[830px] w-[830px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]';
  const secondaryDiamondClass = isSlide3 || isSlide6
    ? 'absolute left-[1390px] bottom-[1150px] h-[800px] w-[800px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]'
    : 'absolute left-[1380px] bottom-[400px] h-[880px] w-[880px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]';

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
      <div className="absolute left-[120px] top-[240px] text-[57px] font-normal leading-[1.5] tracking-[-1.8px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      {/* Main headline */}
      <div className="absolute left-[240px] top-[830px] max-w-[1200px] text-[100px] font-semibold leading-[1.2] tracking-[-5px] text-white whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      {/* Data configuration + bullets */}
      <div className="absolute left-[240px] top-[1650px] max-w-[920px] space-y-[36px] text-white">
        <h2 className="text-[78px] font-semibold leading-[1.2] tracking-[-2.7px]">{renderRegisteredMark(sectionTitle)}</h2>
        <ul className="space-y-[22px] text-[38px] font-normal leading-[1.3] tracking-[-2px] text-white mt-[110px] ml-[60px] tracking-[-4.3px]">
          {current?.bullets.map((item, i) => (
            <li
              key={`${current?.id}-bullet-${i}`}
              className="flex items-start gap-[16px] text-[64px]"
              style={{ width: '1100px' }}
            >
              <span className="mt-[14px] inline-block h-[18px] w-[18px] rotate-[45deg] rounded-[4px] border border-white/80" />
              <span>{renderRegisteredMark(item)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="absolute left-[240px] top-[2630px] flex h-[200px] items-center gap-[18px] rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[110px] text-[55px] font-semibold leading-[1.1] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        style={{ letterSpacing: '2px' }}
        type="button"
      >
        Launch demo
        <SquarePlay aria-hidden className="ml-[60px] h-[40px] w-[40px]" strokeWidth={2} />
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
      <div className="pointer-events-none absolute inset-0">
        <div className={primaryDiamondClass}>
          <div className="absolute inset-0 -rotate-[45deg]">
            {current?.primaryVideoSrc ? (
              <video
                autoPlay
            className="h-full w-full origin-center scale-[1.35] object-cover"
                loop
                muted
                playsInline
                poster={current?.primaryImageSrc ?? defaultSlides[0]?.primaryImageSrc ?? ''}
                src={current.primaryVideoSrc}
              />
            ) : (
              <Image
                alt={current?.primaryImageAlt ?? 'Primary slide image'}
                className="object-cover origin-center scale-[1.35]"
                fill
                sizes="830px"
                src={current?.primaryImageSrc ?? defaultSlides[0]?.primaryImageSrc ?? ''}
              />
            )}
          </div>
        </div>
        {current?.secondaryImageSrc && (
          <div className={secondaryDiamondClass}>
            <div className="absolute inset-0 -rotate-[45deg]">
              <Image
                alt={current?.secondaryImageAlt ?? 'Secondary slide image'}
                className="object-cover origin-center scale-[1.35]"
                fill
                sizes="880px"
                src={current.secondaryImageSrc}
              />
            </div>
          </div>
        )}

        {/* Decorative diamonds */}
        {isSlide2 || isSlide5 ? (
          <>
            <HCFilledTealDiamond className="pointer-events-none absolute left-[-20px] bottom-[670px] h-[510px] w-[560px]" />
            <HCHollowBlueDiamond2 className="pointer-events-none absolute left-[-10px] bottom-[-1560px] h-[2400px] w-[2400px] overflow-visible" />
            <HCFilledOrangeDiamond2 className="pointer-events-none absolute left-[1100px] bottom-[-1555px] h-[1200px] w-[1200px] overflow-visible rotate-[45deg]" />
            <HCHollowOrangeDiamond className="pointer-events-none absolute left-[1240px] bottom-[-980px] h-[1800px] w-[1800px] overflow-visible" />
          </>
        ) : isSlide3 || isSlide6 ? (
          <>
            <HCFilledOrangeDiamond
              className={`pointer-events-none absolute ${
                isSlide3 || isSlide6
                  ? 'left-[1880px] bottom-[670px] h-[450px] w-[450px]'
                  : 'left-[490px] bottom-[590px] h-[510px] w-[560px]'
              }`}
            />
            <HCHollowBlueDiamond2 className="pointer-events-none absolute left-[1290px] bottom-[-1650px] h-[2400px] w-[2400px] overflow-visible" />
            <HCHollowGreenDiamond className="pointer-events-none absolute left-[0px] bottom-[-1240px] h-[1800px] w-[1800px] overflow-visible" />
          </>
        ) : (
          <>
            <HCBlueFilledDiamond className="pointer-events-none absolute left-[490px] bottom-[590px] h-[510px] w-[560px]" />
            <HCHollowOrangeDiamond className="pointer-events-none absolute left-[650px] bottom-[-1755px] h-[2400px] w-[2400px] overflow-visible" />
          </>
        )}
      </div>
    </div>
  );
}

