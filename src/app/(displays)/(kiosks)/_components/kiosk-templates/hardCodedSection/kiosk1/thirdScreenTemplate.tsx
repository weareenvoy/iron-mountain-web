'use client';

import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';

export interface HardCodedKiosk1ThirdScreenTemplateProps {
  readonly backgroundEndColor?: string;
  readonly backgroundStartColor?: string;
  readonly cardBackgroundColor?: string;
  readonly cardHeight?: number;
  readonly cardLabel?: string | string[];
  readonly cardTextColor?: string;
  readonly cardWidth?: number;
  readonly headline?: string | string[];
  readonly onCta?: () => void;
}

const defaults = {
  backgroundEndColor: '#05254b',
  backgroundStartColor: '#1b75bc',
  cardBackgroundColor: '#e0e0e0',
  cardHeight: 1080,
  cardLabel: 'Virtual walkthrough',
  cardTextColor: '#4a4a4a',
  cardWidth: 1920,
  headline: ['Section title lorem ipsum', 'dolor sit.'],
};

const HardCodedKiosk1ThirdScreenTemplate = ({
  backgroundEndColor = defaults.backgroundEndColor,
  backgroundStartColor = defaults.backgroundStartColor,
  cardBackgroundColor = defaults.cardBackgroundColor,
  cardHeight = defaults.cardHeight,
  cardLabel = defaults.cardLabel,
  cardTextColor = defaults.cardTextColor,
  cardWidth = defaults.cardWidth,
  headline = defaults.headline,
  onCta,
}: HardCodedKiosk1ThirdScreenTemplateProps) => {
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const cardText = Array.isArray(cardLabel) ? cardLabel.join('\n') : cardLabel;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden" data-node-id="5890:16731">
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

      <div
        className="absolute top-[1290px] left-[120px] rounded-[20px] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        style={{ backgroundColor: cardBackgroundColor, height: `${cardHeight}px`, width: `${cardWidth}px` }}
      >
        <button
          className="flex h-full w-full items-center justify-center rounded-[20px] text-[80px] leading-[1.3] font-normal tracking-[-4px]"
          onClick={onCta}
          style={{ color: cardTextColor }}
          type="button"
        >
          {renderRegisteredMark(cardText)}
        </button>
      </div>
    </div>
  );
};

export default HardCodedKiosk1ThirdScreenTemplate;
