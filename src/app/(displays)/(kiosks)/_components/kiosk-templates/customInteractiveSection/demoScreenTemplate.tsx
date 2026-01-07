'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

export interface CustomInteractiveDemoScreenTemplateProps {
  readonly cardLabel?: string;
  readonly demoIframeSrc?: string;
  readonly endTourLabel?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly onCta?: () => void;
  readonly onEndTour?: () => void;
}

const CustomInteractiveDemoScreenTemplate = ({
  cardLabel,
  demoIframeSrc,
  endTourLabel,
  headline,
  heroImageAlt,
  heroImageSrc,
  onCta,
  onEndTour,
}: CustomInteractiveDemoScreenTemplateProps) => {
  const headlineText = headline;
  const cardText = cardLabel;

  // Add autoplay and mute parameters for YouTube embed
  // For 360° VR videos, we need: autoplay=1&mute=1&controls=1
  const autoplayUrl = demoIframeSrc
    ? demoIframeSrc.includes('?')
      ? `${demoIframeSrc}&autoplay=1&mute=1`
      : `${demoIframeSrc}?autoplay=1&mute=1`
    : undefined;

  return (
    <div className="pointer-events-auto relative flex h-screen w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[#14477D]" />
      <div className="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur-[50px]" />

      <h1 className="pointer-events-none absolute top-[780px] left-[240px] z-[1] w-[1680px] text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-white">
        {renderRegisteredMark(headlineText)}
      </h1>

      {/* End tour button */}
      <button
        className="absolute top-[2618px] left-[240px] z-[10] flex h-[200px] items-center gap-[46px] rounded-[1000px] bg-[#ededed] px-[90px] py-[60px] transition-transform duration-150 hover:scale-[1.01]"
        onClick={onEndTour}
        type="button"
      >
        <span className="text-center text-[54.545px] leading-[1.4] font-normal tracking-[-2.7273px] whitespace-nowrap text-[#14477d]">
          {endTourLabel}
        </span>
        <LogOut aria-hidden className="h-[54.55px] w-[54.55px]" color="#14477d" strokeWidth={2} />
      </button>

      <div className="pointer-events-auto absolute top-[1290px] left-[120px] z-[10] h-[1080px] w-[1920px] rounded-[20px] bg-[#e0e0e0] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        {autoplayUrl ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="pointer-events-auto h-full w-full rounded-[20px] border-0"
            src={autoplayUrl}
            title={cardText}
          />
        ) : (
          <button
            className="flex h-full w-full items-center justify-center rounded-[20px] text-[80px] leading-[1.3] font-normal tracking-[-4px] text-[#4a4a4a]"
            onClick={onCta}
            type="button"
          >
            {renderRegisteredMark(cardText)}
          </button>
        )}
      </div>

      {/* Hero diamond image */}
      {heroImageSrc ? (
        <div className="pointer-events-none absolute bottom-[160px] left-[1100px] h-[1380px] w-[1380px]">
          <Image
            alt={heroImageAlt ?? 'Hero image'}
            className="clip-diamond-rounded object-cover"
            fill
            quality={85} // 85 Quality here since it's a secondary image to the Demo iframe itself.
            sizes="680px"
            src={heroImageSrc}
          />
        </div>
      ) : null}

      {/* Decorative diamonds */}
      <HCHollowBlueDiamond className="pointer-events-none absolute bottom-[1400px] left-[510px] h-[520px] w-[520px] overflow-visible" />
      <HCFilledOrangeDiamond className="pointer-events-none absolute bottom-[640px] left-[280px] h-[420px] w-[800px]" />
      <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[410px] left-[500px] h-[340px] w-[340px] overflow-visible" />
    </div>
  );
};

export default CustomInteractiveDemoScreenTemplate;
