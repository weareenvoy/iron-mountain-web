'use client';

import { ChevronLeft, ChevronRight, SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import HardCodedDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/demoScreenTemplate';
import HCBlueFilledDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCBlueFilledDiamond';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond';
import HCFilledOrangeDiamond2 from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond2';
import HCFilledTealDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledTealDiamond';
import HCHollowBlueDiamond2 from '@/components/ui/icons/Kiosks/HardCoded/HCHollowBlueDiamond2';
import HCHollowGreenDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowGreenDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowOrangeDiamond';

export interface HardCodedKiosk3ThirdScreenTemplateProps {
  readonly demoIframeSrc?: string;
  readonly endTourLabel?: string;
  readonly headline?: string | string[];
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly overlayCardLabel?: string | string[];
  readonly overlayHeadline?: string | string[];
  readonly slides?: CarouselSlide[];
}

type CarouselSlide = {
  bullets: string[];
  eyebrow?: string | string[];
  headline?: string | string[];
  id: string;
  primaryImageAlt: string;
  primaryImageSrc: string;
  primaryVideoSrc?: string;
  secondaryImageAlt: string;
  secondaryImageSrc?: string;
  sectionTitle: string | string[];
};

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
    primaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/01+-+Challenge/Challenge-Image1-Diamond.webp',
    primaryVideoSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Video1-Full.webm',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Image2-Diamond.webp',
    sectionTitle: 'Data configuration',
  },
  {
    bullets: ['Asset tagging', 'Asset tracking', 'Inventory management', 'Audits', 'Legal holds'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Centralized management', 'of services via API'],
    id: 'slide-2',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/01+-+Challenge/Challenge-Image1-Diamond.webp',
    primaryVideoSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Video2-Full.webm',
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
    primaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/01+-+Challenge/Challenge-Image1-Diamond.webp',
    primaryVideoSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Video3-Full.webm',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Image3-Diamond.webp',
    sectionTitle: 'Device configuration',
  },
  {
    bullets: ['Shipment of PC and peripherals', 'Advanced exchange for repair or refresh'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device deployment'],
    id: 'slide-4',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/01+-+Challenge/Challenge-Image1-Diamond.webp',
    primaryVideoSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Video4-Full.webm',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Image4-Diamond.webp',
    sectionTitle: 'Device deployment',
  },
  {
    bullets: ['Management of warranty and support extension, including break/fix'],
    eyebrow: ['IT assets &', 'data centers'],
    headline: ['Device maintenance'],
    id: 'slide-5',
    primaryImageAlt: 'Professional with tablet in data center',
    primaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/01+-+Challenge/Challenge-Image1-Diamond.webp',
    primaryVideoSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Video5-Full.webm',
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
    primaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/01+-+Challenge/Challenge-Image1-Diamond.webp',
    primaryVideoSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Video6-Full.webm',
    secondaryImageAlt: 'Hand touching smart interface',
    secondaryImageSrc:
      'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Image5-Diamond.webp',
    sectionTitle: 'Device reverse logistics',
  },
];

const HardCodedKiosk3ThirdScreenTemplate = ({
  demoIframeSrc,
  endTourLabel = 'End tour',
  headline = defaultHeadline,
  heroImageAlt = 'Visitors smiling while viewing content',
  heroImageSrc = 'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Image1-Diamond.webp',
  overlayCardLabel = 'Demo',
  overlayHeadline = ['Section title lorem ipsum', 'dolor sit.'],
  slides = defaultSlides,
}: HardCodedKiosk3ThirdScreenTemplateProps) => {
  const [index, setIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const safeSlides = slides.length > 0 ? slides : defaultSlides;
  const total = safeSlides.length || defaultSlides.length;
  const currentIndex = total > 0 ? index % total : 0;
  const current = (safeSlides[currentIndex] ?? defaultSlides[0])!;
  const isSlide2 = current.id === 'slide-2';
  const isSlide5 = current.id === 'slide-5';
  const isSlide3 = current.id === 'slide-3';
  const isSlide6 = current.id === 'slide-6';
  const primaryDiamondClass =
    isSlide2 || isSlide5
      ? 'absolute left-[510px] bottom-[670px] h-[1200px] w-[1200px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
      : isSlide3 || isSlide6
        ? 'absolute left-[340px] bottom-[340px] h-[1130px] w-[1130px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]'
        : 'absolute left-[700px] bottom-[1120px] h-[830px] w-[830px] rotate-[45deg] overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]';
  const secondaryDiamondClass =
    isSlide3 || isSlide6
      ? 'absolute left-[1390px] bottom-[1150px] h-[800px] w-[800px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]'
      : 'absolute left-[1380px] bottom-[400px] h-[880px] w-[880px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]';

  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const eyebrowText = Array.isArray(current.eyebrow) ? current.eyebrow.join('\n') : current.eyebrow;
  const sectionTitle = Array.isArray(current.sectionTitle) ? current.sectionTitle.join('\n') : current.sectionTitle;

  const goNext = () => setIndex(i => (i + 1) % total);
  const goPrev = () => setIndex(i => (i - 1 + total) % total);

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      data-node-id="5896:13360"
      data-scroll-section="hardcoded-third-screen"
    >
      <div className="absolute inset-0" style={{ background: 'transparent' }} />
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[12px]" />

      {/* Eyebrow */}
      <h2 className="absolute top-[240px] left-[120px] text-[57px] leading-[1.5] font-normal tracking-[-1.8px] whitespace-pre-line text-[#ededed]">
        {renderRegisteredMark(eyebrowText)}
      </h2>

      {/* Main headline */}
      <h1 className="absolute top-[830px] left-[240px] max-w-[1200px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line text-white">
        {renderRegisteredMark(headlineText)}
      </h1>

      {/* Data configuration + bullets */}
      <div className="absolute top-[1650px] left-[240px] max-w-[920px] space-y-[36px] text-white">
        <h2 className="text-[80px] leading-[1.3] tracking-[-4px]">
          {renderRegisteredMark(sectionTitle)}
        </h2>
        <ul className="mt-[110px] ml-[60px] space-y-[22px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-white">
          {current.bullets.map((item, i) => (
            <li
              className="flex items-start gap-[16px] text-[64px]"
              key={`${current.id}-bullet-${i}`}
              style={{ width: '1100px' }}
            >
              <span className="mt-[20px] mr-[40px] ml-[-50px] inline-block h-[35px] w-[35px] rotate-[45deg] rounded-[4px] border border-white/80" />
              <span>{renderRegisteredMark(item)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <button
        className="absolute top-[2630px] left-[240px] flex h-[200px] items-center gap-[18px] rounded-[999px] bg-[linear-gradient(296deg,#A2115E_28.75%,#8A0D71_82.59%)] px-[110px] text-[55px] leading-[1.1] font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        onClick={() => setShowOverlay(true)}
        style={{ letterSpacing: '2px' }}
        type="button"
      >
        Launch demo
        <SquarePlay aria-hidden className="ml-[40px] h-[90px] w-[90px]" strokeWidth={2} />
      </button>

      {/* Circle carousel control */}
      <div className="absolute top-[1670px] right-[120px] h-[520px] w-[520px]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#6dcff6]/70" />
          <div className="absolute inset-[18px] rounded-full border-[12px] border-transparent" />
          <div className="absolute inset-[44px] rounded-full border-[6px] border-transparent" />

          <div className="absolute inset-0 flex items-center justify-center text-[60px] leading-[1.4] font-semibold tracking-[-3px] text-white">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Dots */}
          {[
            { left: '50%', top: '0%' },
            { left: '95%', top: '28%' },
            { left: '94%', top: '73%' },
            { left: '52%', top: '100%' },
            { left: '7%', top: '73%' },
            { left: '7%', top: '27%' },
          ].map((pos, i) => (
            <div
              className="absolute"
              key={i}
              style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
            >
              <div className="h-[49px] w-[49px] rounded-full bg-[#6dcff6]" />
            </div>
          ))}

          {/* Arrows */}
          <button
            aria-label="Previous slide"
            className="absolute top-1/2 left-[100px] flex h-[102px] w-[102px] -translate-y-1/2 items-center justify-center transition hover:opacity-80"
            onClick={goPrev}
            type="button"
          >
            <ChevronLeft className="h-[102px] w-[102px]" color="#6DCFF6" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Next slide"
            className="absolute top-1/2 right-[70px] flex h-[102px] w-[102px] -translate-y-1/2 items-center justify-center transition hover:opacity-80"
            onClick={goNext}
            type="button"
          >
            <ChevronRight className="h-[102px] w-[102px]" color="#6DCFF6" strokeWidth={2.2} />
          </button>
        </div>
      </div>

      {/* Bottom diamond collage */}
      <div className="pointer-events-none absolute inset-0">
        <div className={primaryDiamondClass}>
          <div className="absolute inset-0 -rotate-[45deg]">
            {current.primaryVideoSrc ? (
              <video
                autoPlay
                className="h-full w-full origin-center scale-[1.35] object-cover"
                loop
                muted
                playsInline
                poster={current.primaryImageSrc}
                src={current.primaryVideoSrc}
              />
            ) : (
              <Image
                alt={current.primaryImageAlt || 'Primary slide image'}
                className="origin-center scale-[1.35] object-cover"
                fill
                sizes="830px"
                src={current.primaryImageSrc}
              />
            )}
          </div>
        </div>
        {current.secondaryImageSrc && (
          <div className={secondaryDiamondClass}>
            <div className="absolute inset-0 -rotate-[45deg]">
              <Image
                alt={current.secondaryImageAlt || 'Secondary slide image'}
                className="origin-center scale-[1.35] object-cover"
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
            <HCFilledTealDiamond className="pointer-events-none absolute bottom-[670px] left-[-20px] h-[510px] w-[560px]" />
            <HCHollowBlueDiamond2 className="pointer-events-none absolute bottom-[-1560px] left-[-10px] h-[2400px] w-[2400px] overflow-visible" />
            <HCFilledOrangeDiamond2 className="pointer-events-none absolute bottom-[-1555px] left-[1100px] h-[1200px] w-[1200px] rotate-[45deg] overflow-visible" />
            <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[-980px] left-[1240px] h-[1800px] w-[1800px] overflow-visible" />
          </>
        ) : isSlide3 || isSlide6 ? (
          <>
            <HCFilledOrangeDiamond
              className={`pointer-events-none absolute ${
                isSlide3 || isSlide6
                  ? 'bottom-[670px] left-[1880px] h-[450px] w-[450px]'
                  : 'bottom-[590px] left-[490px] h-[510px] w-[560px]'
              }`}
            />
            <HCHollowBlueDiamond2 className="pointer-events-none absolute bottom-[-1650px] left-[1290px] h-[2400px] w-[2400px] overflow-visible" />
            <HCHollowGreenDiamond className="pointer-events-none absolute bottom-[-1240px] left-[0px] h-[1800px] w-[1800px] overflow-visible" />
          </>
        ) : (
          <>
            <HCBlueFilledDiamond className="pointer-events-none absolute bottom-[590px] left-[490px] h-[510px] w-[560px]" />
            <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[-1755px] left-[650px] h-[2400px] w-[2400px] overflow-visible" />
          </>
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700 z-[999]"
        style={{
          opacity: showOverlay ? 1 : 0,
          pointerEvents: showOverlay ? 'auto' : 'none',
        }}
      >
        <HardCodedDemoScreenTemplate
          cardLabel={overlayCardLabel}
          demoIframeSrc={demoIframeSrc}
          endTourLabel={endTourLabel}
          headline={overlayHeadline}
          heroImageAlt={heroImageAlt}
          heroImageSrc={heroImageSrc}
          onEndTour={() => setShowOverlay(false)}
        />
      </div>
    </div>
  );
};

export default HardCodedKiosk3ThirdScreenTemplate;
