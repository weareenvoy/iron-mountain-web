'use client';

import Image from 'next/image';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/CustomInteractive/HCHollowOrangeDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

export interface CustomInteractiveKiosk1ThirdScreenTemplateProps {
  readonly cardLabel?: string;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly onCta?: () => void;
}

const CustomInteractiveKiosk1ThirdScreenTemplate = ({
  cardLabel,
  headline,
  heroImageAlt,
  heroImageSrc,
  onCta,
}: CustomInteractiveKiosk1ThirdScreenTemplateProps) => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b75bc] to-[#05254b]" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]" />

      <h1 className="absolute top-[780px] left-[240px] w-[1680px] text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-white">
        {renderRegisteredMark(headline)}
      </h1>

      <div className="absolute top-[1290px] left-[120px] h-[1080px] w-[1920px] rounded-[20px] bg-[#e0e0e0] shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <button
          className="flex h-full w-full items-center justify-center rounded-[20px] text-[80px] leading-[1.3] font-normal tracking-[-4px] text-[#4a4a4a]"
          onClick={onCta}
          type="button"
        >
          {renderRegisteredMark(cardLabel)}
        </button>
      </div>

      {/* Hero diamond image */}
      <div className="pointer-events-none absolute bottom-[160px] left-[1100px] h-[1380px] w-[1380px]">
        {heroImageSrc && (
          <Image
            alt={heroImageAlt || ''}
            className="object-cover"
            fill
            sizes="680px"
            src={heroImageSrc}
            className="clip-diamond-rounded object-cover"
          />
        )}
      </div>

      {/* Decorative diamonds */}
      <HCHollowBlueDiamond className="pointer-events-none absolute bottom-[1400px] left-[510px] h-[520px] w-[520px] overflow-visible" />
      <HCFilledOrangeDiamond className="pointer-events-none absolute bottom-[640px] left-[280px] h-[420px] w-[800px]" />
      <HCHollowOrangeDiamond className="pointer-events-none absolute bottom-[410px] left-[500px] h-[340px] w-[340px] overflow-visible" />
    </div>
  );
};

export default CustomInteractiveKiosk1ThirdScreenTemplate;
