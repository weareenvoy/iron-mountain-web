'use client';

import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultEyebrow = ['Rich media &', 'cultural heritage'];
const defaultHeadline = ['Centralized management', 'of services via API'];
const defaultDescription = 'Explore each section to learn how Iron Mountain can transform your enterprise';
const defaultPrimaryCtaLabel = 'Centralized management of services';
const defaultSecondaryCtaLabel = 'Launch demo';
const defaultSaveForLaterLabel = 'Save for later';
const defaultTapLabel = 'Tap to begin';
const defaultHeroImageSrc = 'http://localhost:3845/assets/3a4d46cd05506bd4cd1111ed8cd2d3dfe9681cd9.png';

type DecorativeDiamondConfig = {
  borderColor?: string;
  fillColor?: string;
  height?: number;
  left?: number;
  opacity?: number;
  top?: number;
  width?: number;
};

const defaultDecorativeDiamonds: DecorativeDiamondConfig[] = [
  { borderColor: 'rgba(237,237,237,0.25)', height: 360, left: 500, top: 1900, width: 360 },
  { borderColor: 'rgba(237,237,237,0.25)', height: 520, left: 720, top: 2120, width: 520 },
  { fillColor: '#f26522', height: 140, left: 540, top: 2280, width: 140 },
];

export interface HardCodedKiosk3FirstScreenTemplateProps {
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  description?: string | string[];
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
  tapLabel?: string;
}

const gradientDefaults = {
  backgroundEndColor: '#0a2f5c',
  backgroundStartColor: '#1b75bc',
};

const SaveIcon = () => (
  <svg aria-hidden className="h-[68px] w-[76px]" fill="none" viewBox="0 0 76 68">
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
  <svg aria-hidden className="h-[61px] w-[126px]" fill="none" viewBox="0 0 126 61">
    <path d="M3 30.5h120M94.5 6l24 24.5-24 24.5" stroke="#14477d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
  </svg>
);

const PlayIcon = () => (
  <svg aria-hidden className="h-[88px] w-[88px]" fill="none" viewBox="0 0 88 88">
    <rect height="82" rx="19" stroke="#ededed" strokeWidth="6" width="82" x="3" y="3" />
    <path d="M36 61V27l24 17-24 17Z" fill="#ededed" />
  </svg>
);

const DecorativeDiamond = ({
  borderColor,
  fillColor,
  height = 300,
  left = 0,
  opacity = 1,
  top = 0,
  width = 300,
}: DecorativeDiamondConfig) => (
  <div
    className="pointer-events-none absolute rotate-[45deg]"
    style={{
      borderColor,
      borderStyle: borderColor ? 'solid' : undefined,
      borderWidth: borderColor ? '4px' : undefined,
      height,
      left,
      opacity,
      top,
      width,
    }}
  >
    <div className="absolute inset-[12%] rounded-[48px]" style={{ backgroundColor: fillColor }} />
  </div>
);

export default function HardCodedKiosk3FirstScreenTemplate({
  backgroundEndColor = gradientDefaults.backgroundEndColor,
  backgroundStartColor = gradientDefaults.backgroundStartColor,
  description = defaultDescription,
  decorativeDiamonds = defaultDecorativeDiamonds,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  heroImageAlt = 'Visitors exploring a virtual demo',
  heroImageSrc = defaultHeroImageSrc,
  onPrimaryCta,
  onSecondaryCta,
  primaryCtaLabel = defaultPrimaryCtaLabel,
  saveForLaterLabel = defaultSaveForLaterLabel,
  secondaryCtaLabel = defaultSecondaryCtaLabel,
  tapLabel = defaultTapLabel,
}: HardCodedKiosk3FirstScreenTemplateProps) {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const descriptionText = Array.isArray(description) ? description.join('\n') : description;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13301">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)` }}
      />

      <div className="absolute left-[120px] top-[240px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(eyebrowText)}
      </div>

      <div className="absolute left-[240px] top-[820px] w-[1280px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      <p className="absolute left-[240px] top-[1310px] w-[660px] text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-[#ededed]">
        {renderRegisteredMark(descriptionText)}
      </p>

      <div className="absolute left-[240px] top-[1925px] flex items-center gap-[40px] text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-[#ededed]">
        <SaveIcon />
        <p>{renderRegisteredMark(saveForLaterLabel)}</p>
      </div>

      <div className="absolute left-[240px] top-[2249px] flex w-[1013px] flex-col gap-[84px]">
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] bg-[#ededed] px-[100px] text-[60px] font-normal leading-[1.2] tracking-[-1.8px] text-[#14477d] transition-transform duration-150 hover:scale-[1.01]"
          onClick={onPrimaryCta}
          type="button"
        >
          <span>{renderRegisteredMark(primaryCtaLabel)}</span>
          <ArrowIcon />
        </button>
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] bg-[#8a0d71] px-[100px] text-[60px] font-normal leading-[1.2] tracking-[-1.8px] text-white transition-transform duration-150 hover:scale-[1.01]"
          onClick={onSecondaryCta}
          type="button"
        >
          <span>{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center">
            <PlayIcon />
          </div>
        </button>
      </div>

      <p className="absolute left-[880px] top-[2210px] text-[80px] font-normal leading-[1.3] tracking-[-4px] text-white">
        {renderRegisteredMark(tapLabel)}
      </p>

      <div className="pointer-events-none absolute right-[160px] top-[1850px] h-[640px] w-[640px] rotate-[45deg] overflow-hidden rounded-[120px] border border-[#ededed]/40 bg-[#14477d] shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
        <img alt={heroImageAlt} className="h-full w-full -rotate-[45deg] object-cover" src={heroImageSrc} />
      </div>

      {decorativeDiamonds.map((diamond, index) => (
        <DecorativeDiamond key={`${diamond.left}-${diamond.top}-${index}`} {...diamond} />
      ))}
    </div>
  );
}


