'use client';

// React import removed - not needed with new JSX transform
import Image from 'next/image';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowOrangeDiamond';

export interface HardCodedKiosk3FourthScreenTemplateProps {
  readonly backgroundEndColor?: string;
  readonly backgroundStartColor?: string;
  readonly cardBackgroundColor?: string;
  readonly cardHeight?: number;
  readonly cardLabel?: string;
  readonly cardTextColor?: string;
  readonly cardWidth?: number;
  readonly headline?: string;
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly onCta?: () => void;
}

const HardCodedKiosk3FourthScreenTemplate = ({
  backgroundEndColor,
  backgroundStartColor,
  cardBackgroundColor,
  cardHeight,
  cardLabel,
  cardTextColor,
  cardWidth,
  headline,
  heroImageAlt,
  heroImageSrc,
  onCta,
}: HardCodedKiosk3FourthScreenTemplateProps) => {
  if (!headline || !cardLabel || !heroImageSrc || !heroImageAlt) {
    return null;
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13159">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor ?? '#1b75bc'} 0%, ${backgroundEndColor ?? '#05254b'} 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]" />

      <h1 className="absolute top-[780px] left-[240px] w-[1680px] text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-white">
        {renderRegisteredMark(headline)}
      </h1>

      <div
        className="absolute top-[1290px] left-[120px] rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        style={{
          backgroundColor: cardBackgroundColor ?? '#e0e0e0',
          height: `${cardHeight ?? 1080}px`,
          width: `${cardWidth ?? 1920}px`,
        }}
      >
        <button
          className="flex h-full w-full items-center justify-center rounded-[20px] text-[80px] leading-[1.3] font-normal tracking-[-4px]"
          onClick={onCta}
          style={{ color: cardTextColor ?? '#4a4a4a' }}
          type="button"
        >
          {renderRegisteredMark(cardLabel)}
        </button>
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

export default HardCodedKiosk3FourthScreenTemplate;
