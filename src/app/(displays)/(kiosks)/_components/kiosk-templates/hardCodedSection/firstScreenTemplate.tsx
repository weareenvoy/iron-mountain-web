'use client';

import Image from 'next/image';
import { Heart, SquarePlay } from 'lucide-react';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowOrangeDiamond';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

const defaultHeroImageSrc = '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png';
const defaultEyebrow = ['Rich media &', 'cultural heritage'];
const defaultHeadline = [
  'Learn more about how we',
  'unlocked new possibilities',
  'for our partners',
];
const defaultPrimaryCtaLabel = 'From archive to access';
const defaultSecondaryCtaLabel = 'Virtual walkthrough';
const defaultSaveForLaterLabel = 'Save for later';

export interface HardCodedKiosk1FirstScreenTemplateProps {
  backgroundEndColor?: string;
  backgroundStartColor?: string;
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

export default function HardCodedKiosk1FirstScreenTemplate({
  backgroundEndColor = gradientDefaults.backgroundEndColor,
  backgroundStartColor = gradientDefaults.backgroundStartColor,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  heroImageAlt = 'Visitors smiling while viewing content',
  heroImageSrc = defaultHeroImageSrc,
  onPrimaryCta,
  onSecondaryCta,
  primaryCtaLabel = defaultPrimaryCtaLabel,
  saveForLaterLabel = defaultSaveForLaterLabel,
  secondaryCtaLabel = defaultSecondaryCtaLabel,
}: HardCodedKiosk1FirstScreenTemplateProps) {
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      data-node-id="5893:7411"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
        }}
      />

      {/* Eyebrow */}
      <div className="absolute left-[120px] top-[200px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(eyebrowText)}
      </div>

      {/* Headline */}
      <div className="absolute left-[250px] top-[1250px] w-full text-[100px] font-normal leading-[1.3] tracking-[-5px] text-[#ededed] whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      {/* Save for later */}
      <div className="absolute left-[230px] top-[1890px] flex items-center gap-[32px] text-[52px] font-normal leading-[1.4] tracking-[-2.6px] text-[#ededed]">
        <Heart aria-hidden className="h-[90px] w-[90px]" color="#ededed" strokeWidth={3} />
        <p>{renderRegisteredMark(saveForLaterLabel)}</p>
      </div>

      {/* CTA buttons */}
      <div className="absolute left-[245px] top-[2220px] flex w-[1360px] flex-col gap-[90px]">
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] bg-[#ededed] px-[100px] text-[60px] font-normal leading-[1.2] tracking-[-1.8px] text-[#14477d] transition-transform duration-150 hover:scale-[1.01] shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          onClick={onPrimaryCta}
          type="button"
        >
          <span className="pt-[10px] pl-[10px]">{renderRegisteredMark(primaryCtaLabel)}</span>
          <ArrowIcon />
        </button>
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] px-[100px] text-[60px] font-normal leading-[1.2] tracking-[-1.8px] text-white transition-transform duration-150 hover:scale-[1.01] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[19px]"
          onClick={onSecondaryCta}
          style={{
            background: 'linear-gradient(296deg, #A2115E 28.75%, #8A0D71 82.59%)',
          }}
          type="button"
        >
          <span className="pl-[330px]">{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center">
            <SquarePlay
              aria-hidden
              className="relative left-[-330px] h-[90px] w-[90px]"
              color="#ededed"
              strokeWidth={2}
            />
          </div>
        </button>
      </div>

      {/* Hero diamond image */}
      <div className="pointer-events-none absolute left-[1100px] bottom-[160px] h-[2550px] w-[2550px] rotate-[45deg] overflow-hidden rounded-[140px]">
        <Image
          alt={heroImageAlt}
          className="-rotate-[45deg] object-cover"
          src={heroImageSrc}
          fill
          sizes="680px"
        />
      </div>

      {/* Decorative diamonds */}
      <HCHollowBlueDiamond className="pointer-events-none absolute left-[510px] bottom-[1400px] h-[520px] w-[520px] overflow-visible" />
      <HCFilledOrangeDiamond className="pointer-events-none absolute left-[280px] bottom-[640px] h-[420px] w-[800px]" />
      <HCHollowOrangeDiamond className="pointer-events-none absolute left-[500px] bottom-[410px] h-[340px] w-[340px] overflow-visible" />
    </div>
  );
}
