'use client';

import { type ComponentType, type SVGProps } from 'react';
import BlueDiamondThird from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondThird';
import GreenDiamondThird from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird';
import GreenDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird2';
import OrangeDiamondThird from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird';
import OrangeDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird2';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import Diamond from './components/Diamond';
import FilledDiamond from './components/FilledDiamond';
import MediaDiamond from './components/MediaDiamond';
import { SECTION_NAMES } from '../../hooks/useStickyHeader';

export type SolutionThirdScreenTemplateProps = {
  readonly accentDiamondSrc?: string;
  readonly bottomLeftLabel?: string;
  readonly bottomRightLabel?: string;
  readonly centerLabel?: string;
  readonly diamondList?: readonly string[];
  readonly headline?: string;
  readonly images?: readonly string[];
  readonly kioskId?: string;
  readonly labelText?: string;
  readonly mediaDiamondLeftSrc?: string;
  readonly mediaDiamondRightSrc?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly subheadline?: string;
  readonly topLeftLabel?: string;
  readonly topRightLabel?: string;
};

const SolutionThirdScreenTemplate = ({
  accentDiamondSrc,
  bottomLeftLabel,
  bottomRightLabel,
  centerLabel,
  headline,
  kioskId,
  mediaDiamondLeftSrc,
  mediaDiamondRightSrc,
  topLeftLabel,
  topRightLabel,
}: SolutionThirdScreenTemplateProps) => {
  const isKiosk1 = kioskId === 'kiosk-1';
  const accentDiamondImageSrc = isKiosk1 ? undefined : accentDiamondSrc;

  type TextDiamondConfig = {
    readonly className: string;
    readonly label?: string;
    readonly outline?: ComponentType<SVGProps<SVGSVGElement>>;
    readonly sizeClass?: string;
    readonly textWrapperClassName?: string;
  };

  const textDiamonds: readonly TextDiamondConfig[] = [
    {
      className: 'left-[240px] top-[350px]',
      label: centerLabel,
      outline: GreenDiamondThird,
      sizeClass: 'size-[910px]',
      textWrapperClassName: 'w-[500px] left-[460px]',
    },
    {
      className: 'left-[-270px] top-[880px]',
      label: topLeftLabel,
      outline: OrangeDiamondThird,
      sizeClass: 'size-[910px]',
    },
    {
      className: 'left-[760px] top-[880px]',
      label: topRightLabel,
      outline: BlueDiamondThird,
      sizeClass: 'size-[900px]',
      textWrapperClassName: 'w-[700px]',
    },
    {
      className: 'left-[245px] top-[1410px]',
      label: bottomLeftLabel,
      outline: OrangeDiamondThird2,
      sizeClass: 'size-[900px]',
    },
    {
      className: 'left-[760px] top-[1970px]',
      label: bottomRightLabel,
      outline: GreenDiamondThird2,
      sizeClass: 'size-[900px]',
    },
  ];

  return (
    <div
      className="relative z-1 flex h-screen w-full flex-col overflow-hidden bg-transparent"
      data-scroll-section="solution-third-section"
      data-section-end={SECTION_NAMES.SOLUTION}
    >
      {/* Gradient backdrop */}
      <div className="absolute top-[-296px] left-0 h-[5416px] w-full rounded-t-[100px] bg-transparent" />

      {/* Title */}
      <div className="absolute top-[1390px] left-[240px] w-[1300px] text-white group-data-[kiosk=kiosk-2]/kiosk:w-[1400px] group-data-[kiosk=kiosk-3]/kiosk:top-[400px]">
        <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line">
          {renderRegisteredMark(headline)}
        </p>
      </div>

      {/* Diamond cluster */}
      <div className="absolute top-[1580px] left-[240px] h-[2800px] w-[1680px]">
        {textDiamonds.map(({ className, label, outline, sizeClass, textWrapperClassName }) =>
          label ? (
            <Diamond
              className={className}
              key={`${className}-${label}`}
              label={label}
              outline={outline}
              sizeClass={sizeClass}
              textWrapperClassName={textWrapperClassName}
            />
          ) : null
        )}

        <MediaDiamond
          className="top-[1950px] left-[-280px]"
          imageAlt="Left solution media diamond"
          imageSrc={mediaDiamondLeftSrc}
          sizeClass="size-[900px]"
        />
        <MediaDiamond
          className="top-[1425px] left-[1295px]"
          imageAlt="Right solution media diamond"
          imageSrc={mediaDiamondRightSrc}
          sizeClass="size-[900px]"
        />
        <FilledDiamond
          className="top-[610px] left-[1280px] rotate-0"
          imageAlt="Accent gradient diamond"
          imageSrc={accentDiamondImageSrc}
        />
      </div>
    </div>
  );
};

export default SolutionThirdScreenTemplate;
