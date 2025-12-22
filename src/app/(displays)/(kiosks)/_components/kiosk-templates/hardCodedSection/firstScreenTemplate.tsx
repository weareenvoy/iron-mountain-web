import { SquarePlay } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import renderRegisteredMark from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/utils/renderRegisteredMark';
import HardCodedDemoScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/demoScreenTemplate';
import HCFilledOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCFilledOrangeDiamond';
import HCHollowBlueDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowBlueDiamond';
import HCHollowOrangeDiamond from '@/components/ui/icons/Kiosks/HardCoded/HCHollowOrangeDiamond';

const defaultHeroImageSrc =
  'https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/IT+assets+%26+data+centers/04+-+Custom+Interactive/CU-Image1-Diamond.webp';
const defaultEyebrow = ['Rich media &', 'cultural heritage'];
const defaultHeadline = ['Learn more about how we', 'unlocked new possibilities', 'for our partners'];
const defaultPrimaryCtaLabel = 'From archive to access';
const defaultSecondaryCtaLabel = 'Virtual walkthrough';

export interface HardCodedKiosk1FirstScreenTemplateProps {
  readonly backgroundEndColor?: string;
  readonly backgroundStartColor?: string;
  readonly eyebrow?: string | string[];
  readonly headline?: string | string[];
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: 'kiosk-1' | 'kiosk-2' | 'kiosk-3';
  readonly onPrimaryCta?: () => void;
  readonly onSecondaryCta?: () => void;
  readonly overlayCardLabel?: string | string[];
  readonly overlayHeadline?: string | string[];
  readonly primaryCtaLabel?: string;
  readonly secondaryCtaLabel?: string;
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
    height="61"
    viewBox="0 0 126 61"
    width="126"
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

const HardCodedKiosk1FirstScreenTemplate = ({
  backgroundEndColor = gradientDefaults.backgroundEndColor,
  backgroundStartColor = gradientDefaults.backgroundStartColor,
  eyebrow = defaultEyebrow,
  headline = defaultHeadline,
  heroImageAlt = 'Visitors smiling while viewing content',
  heroImageSrc = defaultHeroImageSrc,
  kioskId,
  onPrimaryCta,
  onSecondaryCta,
  overlayCardLabel = 'Virtual walkthrough',
  overlayHeadline = ['Section title lorem ipsum', 'dolor sit.'],
  primaryCtaLabel = defaultPrimaryCtaLabel,
  secondaryCtaLabel = defaultSecondaryCtaLabel,
}: HardCodedKiosk1FirstScreenTemplateProps) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const isKiosk1 = kioskId === 'kiosk-1';
  const eyebrowText = Array.isArray(eyebrow) ? eyebrow.join('\n') : eyebrow;
  const headlineText = Array.isArray(headline) ? headline.join('\n') : headline;
  const isKiosk3 = kioskId === 'kiosk-3';
  const ctaWidthClass = isKiosk3 ? 'w-[1360px]' : 'w-[1020px]';
  const secondaryLabelPadding = isKiosk3 ? 'pl-[320px]' : 'pl-[80px]';
  const secondaryIconOffset = isKiosk3 ? 'left-[-330px]' : 'left-[-70px]';

  const handleSecondaryClick = () => {
    setShowOverlay(true);
    onSecondaryCta?.();
  };

  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col overflow-hidden"
      data-kiosk={kioskId}
      data-node-id="5893:7411"
      data-scroll-section="hardcoded-first-screen"
      style={isKiosk1 || isKiosk3 ? { overflow: 'visible' } : undefined}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${backgroundStartColor} 0%, ${backgroundEndColor} 100%)`,
          height: isKiosk1 ? '10530px' : isKiosk3 ? '15630px' : undefined,
        }}
      />

      {/* Eyebrow */}
      <h2 className="absolute top-[200px] left-[120px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[240px]">
        {renderRegisteredMark(eyebrowText)}
      </h2>

      {/* Headline */}
      <h1
        className="absolute top-[1250px] left-[250px] w-full text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line text-[#ededed] group-data-[kiosk=kiosk-3]/kiosk:top-[830px]"
        data-scroll-section="hardcoded-headline"
      >
        {renderRegisteredMark(headlineText)}
      </h1>

      {/* CTA buttons */}
      <div
        className={`absolute top-[2220px] left-[245px] flex flex-col gap-[90px] group-data-[kiosk=kiosk-3]/kiosk:top-[2350px] ${ctaWidthClass}`}
      >
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] bg-[#ededed] px-[100px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-[#14477d] shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-[19px] transition-transform duration-150 group-data-[kiosk=kiosk-2]/kiosk:hidden hover:scale-[1.01]"
          onClick={onPrimaryCta}
          type="button"
        >
          <span className="pt-[10px] pl-[10px]">{renderRegisteredMark(primaryCtaLabel)}</span>
          <ArrowIcon />
        </button>
        <button
          className="flex h-[200px] items-center justify-between rounded-[999px] px-[100px] py-[70px] text-[60px] leading-[1.2] font-normal tracking-[-1.8px] text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-[19px] transition-transform duration-150 hover:scale-[1.01]"
          onClick={handleSecondaryClick}
          style={{
            background: 'linear-gradient(296deg, #A2115E 28.75%, #8A0D71 82.59%)',
          }}
          type="button"
        >
          <span className={secondaryLabelPadding}>{renderRegisteredMark(secondaryCtaLabel)}</span>
          <div className="flex items-center justify-center">
            <SquarePlay
              aria-hidden
              className={`relative h-[90px] w-[90px] ${secondaryIconOffset}`}
              color="#ededed"
              strokeWidth={2}
            />
          </div>
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

      {/* Overlay - Demo Screen */}
      <div
        className="absolute inset-0 z-[999] transition-opacity duration-700"
        style={{
          opacity: showOverlay ? 1 : 0,
          pointerEvents: showOverlay ? 'auto' : 'none',
        }}
      >
        <HardCodedDemoScreenTemplate
          cardLabel={overlayCardLabel}
          headline={overlayHeadline}
          heroImageAlt={heroImageAlt}
          heroImageSrc={heroImageSrc}
          onEndTour={() => setShowOverlay(false)}
        />
      </div>
    </div>
  );
};

export default HardCodedKiosk1FirstScreenTemplate;
