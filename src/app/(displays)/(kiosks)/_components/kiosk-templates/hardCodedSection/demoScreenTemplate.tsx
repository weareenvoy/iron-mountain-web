'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowOrangeDiamond';

export interface HardCodedDemoScreenTemplateProps {
  readonly backgroundEndColor?: string;
  readonly backgroundStartColor?: string;
  readonly cardBackgroundColor?: string;
  readonly cardHeight?: number;
  readonly cardLabel?: string | string[];
  readonly cardTextColor?: string;
  readonly cardWidth?: number;
  readonly demoIframeSrc?: string;
  readonly endTourLabel?: string;
  readonly headline?: string | string[];
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly onCta?: () => void;
  readonly onEndTour?: () => void;
}

const defaults = {
  backgroundEndColor: '#05254b',
  backgroundStartColor: '#1b75bc',
  cardBackgroundColor: '#e0e0e0',
  cardHeight: 1080,
  cardLabel: 'Virtual walkthrough',
  cardTextColor: '#4a4a4a',
  cardWidth: 1920,
  demoIframeSrc: '',
  endTourLabel: 'End tour',
  headline: ['Section title lorem ipsum', 'dolor sit.'],
  heroImageAlt: 'Visitors smiling while viewing content',
  heroImageSrc: '/images/kiosks/kiosk1/04-custom-interactive/CU-Image1-Diamond.png',
};

const HardCodedDemoScreenTemplate = ({
  backgroundEndColor = defaults.backgroundEndColor,
  backgroundStartColor = defaults.backgroundStartColor,
  cardBackgroundColor = defaults.cardBackgroundColor,
  cardHeight = defaults.cardHeight,
  cardLabel = defaults.cardLabel,
  cardTextColor = defaults.cardTextColor,
  cardWidth = defaults.cardWidth,
  demoIframeSrc = defaults.demoIframeSrc,
  endTourLabel = defaults.endTourLabel,
  headline = defaults.headline,
  heroImageAlt = defaults.heroImageAlt,
  heroImageSrc = defaults.heroImageSrc,
  onCta,
  onEndTour,
}: HardCodedDemoScreenTemplateProps) => {
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const cardText = Array.isArray(cardLabel) ? cardLabel.join('\n') : cardLabel;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="7189:7471">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]" />

      <h1 className="absolute top-[780px] left-[240px] w-[1680px] text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-white">
        {renderRegisteredMark(headlineText)}
      </h1>

      {/* End tour button */}
      <button
        className="absolute top-[2618px] left-[240px] flex h-[200px] items-center gap-[46px] rounded-[1000px] bg-[#ededed] px-[90px] py-[60px] transition-transform duration-150 hover:scale-[1.01]"
        onClick={onEndTour}
        type="button"
      >
        <span className="text-center text-[54.545px] leading-[1.4] font-normal tracking-[-2.7273px] whitespace-nowrap text-[#14477d]">
          {endTourLabel}
        </span>
        <LogOut aria-hidden className="h-[54.55px] w-[54.55px]" color="#14477d" strokeWidth={2} />
      </button>

      <div
        className="absolute top-[1290px] left-[120px] rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: cardBackgroundColor, height: `${cardHeight}px`, width: `${cardWidth}px` }}
      >
        {demoIframeSrc ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full rounded-[20px]"
            src={demoIframeSrc}
            title={cardText}
          />
        ) : (
          <button
            className="flex h-full w-full items-center justify-center rounded-[20px] text-[80px] leading-[1.3] font-normal tracking-[-4px]"
            onClick={onCta}
            style={{ color: cardTextColor }}
            type="button"
          >
            {renderRegisteredMark(cardText)}
          </button>
        )}
      </div>

      {/* Hero diamond image */}
      <div className="pointer-events-none absolute bottom-[160px] left-[1100px] h-[1380px] w-[1380px] rotate-[45deg] overflow-hidden rounded-[140px]">
        <Image alt={heroImageAlt} className="-rotate-[45deg] object-cover" fill sizes="680px" src={heroImageSrc} />
      </div>

      {/* Decorative diamonds */}
      <HCHollowBlueDiamond className="pointer-events-none absolute bottom-[1400px] left-[510px] h-[520px] w-[520px] overflow-visible" />
      <HCFilledOrangeDiamond className="pointer-events-none absolute bottom-[640px] left-[280px] h-[420px] w-[800px]" />
      <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[410px] left-[500px] h-[340px] w-[340px] overflow-visible" />
    </div>
  );
};

export default HardCodedDemoScreenTemplate;
