'use client';

import { type ComponentType, type SVGProps } from 'react';
import BlueDiamondThird from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondThird';
import GreenDiamondThird from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird';
import GreenDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird2';
import OrangeDiamondThird from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird';
import OrangeDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird2';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import Diamond from './components/Diamond';
import FilledDiamond from './components/FilledDiamond';
import MediaDiamond from './components/MediaDiamond';

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
  labelText,
  mediaDiamondLeftSrc,
  mediaDiamondRightSrc,
  subheadline,
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
    <div className="relative z-1 flex h-screen w-full flex-col overflow-hidden bg-transparent">
      {/* Gradient backdrop */}
      <div className="absolute top-[-296px] left-0 h-[5416px] w-full rounded-t-[100px] bg-transparent" />

      {/* Subheadline */}
      <h2 className="absolute top-[230px] left-[120px] z-1 w-[500px] -translate-y-full text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[250px] group-data-[kiosk=kiosk-2]/kiosk:translate-y-0 group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:top-[410px] group-data-[kiosk=kiosk-3]/kiosk:left-auto group-data-[kiosk=kiosk-3]/kiosk:w-[380px] group-data-[kiosk=kiosk-3]/kiosk:translate-y-0">
        {renderRegisteredMark(subheadline)}
      </h2>

      {/* Solution label */}
      <div className="absolute top-[570px] left-[120px] flex items-center gap-[45px]">
        <div className="relative top-[15px] left-[-45px] flex h-[200px] w-[200px] items-center justify-center">
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1 className="relative top-[20px] left-[-80px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed] group-data-[kiosk=kiosk-3]/kiosk:top-[-20px] group-data-[kiosk=kiosk-3]/kiosk:left-[-100px]">
          {labelText}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute top-[1010px] left-[240px] w-[1300px] text-white group-data-[kiosk=kiosk-2]/kiosk:w-[1400px] group-data-[kiosk=kiosk-3]/kiosk:top-[1260px]">
        <p
          className="text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line"
          data-scroll-section="solution-third-title"
        >
          {renderRegisteredMark(headline)}
        </p>
      </div>

      {/* Diamond cluster */}
      <div className="absolute top-[1220px] left-[240px] h-[2800px] w-[1680px]">
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
