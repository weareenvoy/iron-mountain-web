'use client';

import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

export interface HardCodedKiosk3ThirdScreenTemplateProps {
  backgroundEndColor?: string;
  backgroundStartColor?: string;
  cardBackgroundColor?: string;
  cardHeight?: number;
  cardLabel?: string | string[];
  cardTextColor?: string;
  cardWidth?: number;
  headline?: string | string[];
  onCta?: () => void;
}

const defaults = {
  backgroundEndColor: '#05254b',
  backgroundStartColor: '#1b75bc',
  cardBackgroundColor: '#e0e0e0',
  cardHeight: 1080,
  cardLabel: 'Demo',
  cardTextColor: '#4a4a4a',
  cardWidth: 1920,
  headline: ['Section title lorem ipsum', 'dolor sit.'],
};

export default function HardCodedKiosk3ThirdScreenTemplate({
  backgroundEndColor = defaults.backgroundEndColor,
  backgroundStartColor = defaults.backgroundStartColor,
  cardBackgroundColor = defaults.cardBackgroundColor,
  cardHeight = defaults.cardHeight,
  cardLabel = defaults.cardLabel,
  cardTextColor = defaults.cardTextColor,
  cardWidth = defaults.cardWidth,
  headline = defaults.headline,
  onCta,
}: HardCodedKiosk3ThirdScreenTemplateProps) {
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const cardText = Array.isArray(cardLabel) ? cardLabel.join('\n') : cardLabel;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5896:13159">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[50px]" />

      <div className="absolute left-[240px] top-[780px] w-[1680px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-white whitespace-pre-line">
        {renderRegisteredMark(headlineText)}
      </div>

      <div
        className="absolute left-[120px] top-[1290px] rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        style={{ height: `${cardHeight}px`, width: `${cardWidth}px`, backgroundColor: cardBackgroundColor }}
      >
        <button
          className="flex h-full w-full items-center justify-center rounded-[20px] text-[80px] font-normal leading-[1.3] tracking-[-4px]"
          onClick={onCta}
          type="button"
          style={{ color: cardTextColor }}
        >
          {renderRegisteredMark(cardText)}
        </button>
      </div>
    </div>
  );
}


