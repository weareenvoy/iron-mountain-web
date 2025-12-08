'use client';

import { type ComponentType, type ReactNode, type SVGProps } from 'react';

import { ArrowDown, ArrowUp } from 'lucide-react';

import BlueDiamondThird from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondThird';
import GreenDiamondThird from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird';
import GreenDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird2';
import OrangeDiamondThird from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird';
import OrangeDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird2';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import TealGradientDiamondThird from '@/components/ui/icons/Kiosks/Solutions/TealGradientDiamondThird';
import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

const imgDiamondMediaLeft = '/images/kiosks/kiosk2/02-solution/Solution-Image2-Diamond.png';
const imgDiamondMediaRight = '/images/kiosks/kiosk2/02-solution/Solution-Image3-Diamond.png';

export interface SolutionThirdScreenTemplateProps {
  gradientEndColor?: string;
  gradientStartColor?: string;
  mediaDiamondLeftSrc?: string;
  mediaDiamondRightSrc?: string;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
  topLeftLabel?: string;
  topRightLabel?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  centerLabel?: string;
  accentDiamondSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
}

export default function SolutionThirdScreenTemplate({
  accentDiamondSrc,
  bottomLeftLabel,
  bottomRightLabel,
  centerLabel,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  mediaDiamondLeftSrc = imgDiamondMediaLeft,
  mediaDiamondRightSrc = imgDiamondMediaRight,
  onNavigateDown,
  onNavigateUp,
  solutionLabel,
  subheadline,
  title,
  topLeftLabel,
  topRightLabel,
}: SolutionThirdScreenTemplateProps) {
  type TextDiamondConfig = {
    className: string;
    label?: string;
    Outline?: ComponentType<SVGProps<SVGSVGElement>>;
    sizeClass?: string;
    textWrapperClassName?: string;
    textWrapperStyles?: Record<string, string>;
  };

  const textDiamonds: ReadonlyArray<TextDiamondConfig> = [
    {
      className: 'left-[240px] top-[350px]',
      label: centerLabel,
      Outline: GreenDiamondThird,
      sizeClass: 'size-[910px]',
      textWrapperClassName: 'w-[660px] group-data-[kiosk=kiosk-1]/kiosk:w-[500px]',
      textWrapperStyles: { left: '500px' },
    },
    {
      className: 'left-[-270px] top-[880px]',
      label: topLeftLabel,
      Outline: OrangeDiamondThird,
      sizeClass: 'size-[910px]',
    },
    {
      className: 'left-[760px] top-[880px]',
      label: topRightLabel,
      Outline: BlueDiamondThird,
      sizeClass: 'size-[900px]',
      textWrapperStyles: { width: '700px' },
    },
    {
      className: 'left-[245px] top-[1410px]',
      label: bottomLeftLabel,
      Outline: OrangeDiamondThird2,
      sizeClass: 'size-[900px]',
    },
    {
      className: 'left-[760px] top-[1970px]',
      label: bottomRightLabel,
      Outline: GreenDiamondThird2,
      sizeClass: 'size-[900px]',
    },
  ];

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9626">
      {/* Gradient backdrop */}
      <div
        className="absolute left-0 top-[-296px] h-[5416px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
        data-node-id="5168:9628"
      />

      {/* Subheadline */}
      <div
        className="absolute left-[120px] top-[230px] w-[500px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:left-auto group-data-[kiosk=kiosk-3]/kiosk:top-[410px] group-data-[kiosk=kiosk-3]/kiosk:w-[380px] group-data-[kiosk=kiosk-3]/kiosk:translate-y-0"
      >
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128.17px] top-[745.23px] flex items-center gap-[41px]">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -45, top: 15 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1
          className="relative whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed] left-[-80px] top-[20px] group-data-[kiosk=kiosk-3]/kiosk:left-[-100px] group-data-[kiosk=kiosk-3]/kiosk:top-[-20px]"
        >
          {solutionLabel}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute left-[240px] top-[1210px] w-[1300px] text-white group-data-[kiosk=kiosk-3]/kiosk:top-[1260px]">
        <p className="text-[100px] font-normal leading-[1.3] tracking-[-5px] whitespace-pre-line">{renderRegisteredMark(title)}</p>
      </div>

      {/* Diamond cluster */}
      <div className="absolute left-[240px] top-[1400px] h-[2800px] w-[1680px]">
        {textDiamonds.map(({ className, label, Outline, sizeClass, textWrapperClassName, textWrapperStyles }) =>
          label ? (
            <Diamond
              className={className}
              key={`${className}-${label}`}
              label={label}
              Outline={Outline}
              sizeClass={sizeClass}
              textWrapperClassName={textWrapperClassName}
              textWrapperStyles={textWrapperStyles}
              textColor="#ededed"
            />
          ) : null,
        )}

        <MediaDiamond
          className="left-[-280px] top-[1950px]"
          fallback={<GreenDiamondThird2 aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageSrc={mediaDiamondLeftSrc}
          sizeClass="size-[900px]"
        />
        <MediaDiamond
          className="left-[1295px] top-[1425px]"
          fallback={<BlueDiamondThird aria-hidden="true" className="h-full w/full" focusable="false" />}
          imageSrc={mediaDiamondRightSrc}
          sizeClass="size-[900px]"
        />
        <FilledDiamond
          className="left-[1285px] top-[605px] rotate-[45deg] group-data-[kiosk=kiosk-1]/kiosk:left-[1330px] group-data-[kiosk=kiosk-1]/kiosk:top-[650px]"
          imageSrc={accentDiamondSrc}
        />
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute right-[120px] top-[1755px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateUp?.();
          }
        }}
        onPointerDown={() => onNavigateUp?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowUp aria-hidden="true" className="h-full w-full text-[#ffffff66]" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        className="absolute right-[120px] top-[1980px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onNavigateDown?.();
          }
        }}
        onPointerDown={() => onNavigateDown?.()}
        role="button"
        tabIndex={0}
      >
        <ArrowDown aria-hidden="true" className="h-full w-full text-[#ffffff66]" focusable="false" strokeWidth={1.5} />
      </div>
    </div>
  );
}

type DiamondProps = {
  Outline?: ComponentType<SVGProps<SVGSVGElement>>;
  className: string;
  label?: string;
  sizeClass?: string;
  textColor?: string;
  textWrapperClassName?: string;
  textWrapperStyles?: Record<string, string>;
};

function Diamond({
  Outline,
  className,
  label,
  sizeClass = 'size-[666px]',
  textColor = '#ededed',
  textWrapperClassName,
  textWrapperStyles,
}: DiamondProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass}`}>
        {Outline ? (
          <Outline aria-hidden="true" className="block h-full w-full object-contain" focusable="false" />
        ) : null}
        <div
          className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center ${
            textWrapperClassName ?? 'w-[460px]'
          }`}
          style={textWrapperStyles}
        >
          <p className="text-[67px] font-normal leading-[1.4] tracking-[-3.3px]" style={{ color: textColor }}>
            {renderRegisteredMark(label)}
          </p>
        </div>
      </div>
    </div>
  );
}

type MediaDiamondProps = {
  className: string;
  fallback?: ReactNode;
  imageSrc?: string;
  sizeClass?: string;
};

function MediaDiamond({ className, fallback, imageSrc, sizeClass = 'size-[666px]' }: MediaDiamondProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass} rotate-[45deg] overflow-hidden rounded-[120px]`}>
        {imageSrc ? (
          <img alt="" className="h-full w-full -rotate-[45deg] object-cover" src={imageSrc} />
        ) : (
          <div className="flex h-full w-full -rotate-[45deg] items-center justify-center">{fallback}</div>
        )}
      </div>
    </div>
  );
}

function FilledDiamond({ className, imageSrc }: { className: string; imageSrc?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[390px] rotate-[45deg] group-data-[kiosk=kiosk-1]/kiosk:size-[290px]">
        {imageSrc ? (
        <img alt="" className="h-full w-full -rotate-[45deg] object-cover" src={imageSrc} />
        ) : (
          <TealGradientDiamondThird aria-hidden="true" className="h-full w-full -rotate-[45deg]" focusable="false" />
        )}
      </div>
    </div>
  );
}

