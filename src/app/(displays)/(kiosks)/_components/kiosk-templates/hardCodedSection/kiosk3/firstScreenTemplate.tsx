'use client';

import Image from 'next/image';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultHeroImageSrc = '/images/kiosks/kiosk3/01-challenge/Challenge-Image1-Diamond.png';
const defaultEyebrow = ['IT assets &', 'data centers'];
const defaultHeadline = [
  'Learn more about how we unlocked new possibilities',
  'for our partners',
];
const defaultPrimaryCtaLabel = 'Centralized management of services';
const defaultSecondaryCtaLabel = 'Launch demo';
const defaultSaveForLaterLabel = 'Save for later';

type DecorativeDiamondConfig = {
  borderColor?: string;
  borderWidth?: number;
  bottom?: number;
  cornerRadius?: number;
  fillColor?: string;
  height?: number;
  left?: number;
  opacity?: number;
  right?: number;
  top?: number;
  width?: number;
};

const defaultDecorativeDiamonds: DecorativeDiamondConfig[] = [
  {
    borderColor: 'rgba(151,233,255,0.7)',
    borderWidth: 6,
    bottom: 320,
    cornerRadius: 90,
    height: 520,
    left: 460,
    opacity: 1,
    width: 520,
  },
  {
    borderColor: 'rgba(237,237,237,0.25)',
    borderWidth: 4,
    bottom: 40,
    cornerRadius: 110,
    height: 640,
    left: 620,
    opacity: 0.6,
    width: 640,
  },
  {
    bottom: 380,
    cornerRadius: 48,
    fillColor: '#f26522',
    height: 160,
    left: 320,
    opacity: 0.95,
    width: 160,
  },
];

export interface HardCodedKiosk3FirstScreenTemplateProps {
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  decorativeDiamonds?: DecorativeDiamondConfig[];
  eyebrow?: string | string[];
  headline?: string | string[];
  heroImageAlt?: string;
  heroImageSrc?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  primaryCtaLabel?: string;
  saveForLaterLabel?: string;
  secondaryCtaLabel?: string;
}

const gradientDefaults = {
  backgroundEndColor: '#14477d',
  backgroundStartColor: '#1b75bc',
};

const SaveIcon = () => (
  <svg
    aria-hidden="true"
    className="h-[68px] w-[76px]"
    fill="none"
    viewBox="0 0 76 68"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M38 63.01S6 47.377 6 25.5C6 13.073 15.402 5 26.625 5 33.094 5 38 10.833 38 10.833S42.906 5 49.375 5C60.598 5 70 13.073 70 25.5 70 47.377 38 63.01 38 63.01Z"
      stroke="#ededed"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="6"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg
    aria-hidden="true"
    className="h-[61px] w-[126px]"
    fill="none"
    viewBox="0 0 126 61"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 30.5h120M94.5 6l24 24.5-24 24.5"
      stroke="#14477d"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="6"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    aria-hidden="true"
    className="h-[88px] w-[88px]"
    fill="none"
    viewBox="0 0 88 88"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect height="82" rx="19" stroke="#ededed" strokeWidth="6" width="82" x="3" y="3" />
    <path d="M36 61V27l24 17-24 17Z" fill="#ededed" />
  </svg>
);

const DecorativeDiamond = ({
  borderColor,
  borderWidth = 4,
  bottom,
  cornerRadius = 72,
  fillColor,
  height = 320,
  left,
  opacity = 1,
  right,
  top,
  width = 320,
}: DecorativeDiamondConfig) => (
  <div
    className="pointer-events-none absolute rotate-[45deg]"
    style={{
      borderColor,
      borderRadius: cornerRadius,
      borderStyle: borderColor ? 'solid' : undefined,
      borderWidth: borderColor ? borderWidth : undefined,
      bottom,
      height,
      left,
      opacity,
      right,
      top,
      width,
    }}
  >
    <div
      className="absolute inset-[12%]"
      style={{
        backgroundColor: fillColor,
        borderRadius: cornerRadius * 0.7,
      }}
    />
  </div>
);

export default function HardCodedKiosk3FirstScreenTemplate({
  backgroundEndColor = gradientDefaults.backgroundEndColor,
  backgroundStartColor = gradientDefaults.backgroundStartColor,
  decorativeDiamonds = defaultDecorativeDiamonds,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  heroImageAlt = 'Two professionals collaborating at a computer',
  heroImageSrc = defaultHeroImageSrc,
  onPrimaryCta,
  onSecondaryCta,
  primaryCtaLabel = defaultPrimaryCtaLabel,
  saveForLaterLabel = defaultSaveForLaterLabel,
  secondaryCtaLabel = defaultSecondaryCtaLabel,
}: HardCodedKiosk3FirstScreenTemplateProps) {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      data-node-id="5896:13238"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20" />

      {/* Eyebrow */}
      <div className="absolute left-[120px] top-[220px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      {/* Headline */}
      <div className="absolute left-[240px] top-[760px] w-[1400px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      {/* Save for later */}
      <div className="absolute left-[240px] top-[1540px] flex items-center gap-[40px] text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-[#ededed]">
        <SaveIcon />
        <p>{renderRegisteredMark(saveForLaterLabel)}</p>
      </div>

      {/* CTA buttons */}
      <div className="absolute left-[240px] top-[1820px] flex w-[1013px] flex-col gap-[84px]">
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] bg-[#ededed] px-[100px] text-[60px] font-normal leading-[1.2] tracking-[-1.8px] text-[#14477d] transition-transform duration-150 hover:scale-[1.01] shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          onClick={onPrimaryCta}
          type="button"
        >
          <span>{renderRegisteredMark(primaryCtaLabel)}</span>
          <ArrowIcon />
        </button>
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] bg-gradient-to-r from-[#c00077] to-[#a40087] px-[100px] text-[60px] font-normal leading-[1.2] tracking-[-1.8px] text-white transition-transform duration-150 hover:scale-[1.01] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          onClick={onSecondaryCta}
          type="button"
        >
          <span>{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center">
            <PlayIcon />
          </div>
        </button>
      </div>

      {/* Hero diamond image */}
      <div className="pointer-events-none absolute right-[200px] bottom-[160px] h-[720px] w-[720px] rotate-[45deg] overflow-hidden rounded-[140px] border border-[#ededed]/40 bg-[#0a2f5c] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <Image
          alt={heroImageAlt}
          className="-rotate-[45deg] object-cover"
          src={heroImageSrc}
          fill
          sizes="720px"
        />
      </div>

      {/* Decorative diamonds */}
      {decorativeDiamonds.map((diamond, index) => (
        <DecorativeDiamond
          borderColor={diamond.borderColor}
          borderWidth={diamond.borderWidth}
          bottom={diamond.bottom}
          cornerRadius={diamond.cornerRadius}
          fillColor={diamond.fillColor}
          height={diamond.height}
          key={`${diamond.left ?? 0}-${diamond.top ?? diamond.bottom ?? 0}-${index}`}
          left={diamond.left}
          opacity={diamond.opacity}
          right={diamond.right}
          top={diamond.top}
          width={diamond.width}
        />
      ))}
    </div>
  );
}
