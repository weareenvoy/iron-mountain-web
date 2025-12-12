'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { type ComponentType, type ReactNode, type SVGProps } from 'react';
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

export type SolutionThirdScreenTemplateProps = Readonly<{
  accentDiamondSrc?: string;
  bottomLeftLabel?: string;
  bottomRightLabel?: string;
  centerLabel?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  kioskId?: string;
  mediaDiamondLeftSrc?: string;
  mediaDiamondRightSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
  topLeftLabel?: string;
  topRightLabel?: string;
}>;

type DiamondProps = Readonly<{
  className: string;
  label?: string;
  outline?: ComponentType<SVGProps<SVGSVGElement>>;
  sizeClass?: string;
  textColor?: string;
  textWrapperClassName?: string;
  textWrapperStyles?: Record<string, string>;
}>;

type MediaDiamondProps = {
  readonly className: string;
  readonly fallback?: ReactNode;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
  readonly sizeClass?: string;
};

const SolutionThirdScreenTemplate = ({
  accentDiamondSrc,
  bottomLeftLabel,
  bottomRightLabel,
  centerLabel,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  kioskId,
  mediaDiamondLeftSrc = imgDiamondMediaLeft,
  mediaDiamondRightSrc = imgDiamondMediaRight,
  onNavigateDown,
  onNavigateUp,
  solutionLabel,
  subheadline,
  title,
  topLeftLabel,
  topRightLabel,
}: SolutionThirdScreenTemplateProps) => {
  const isKiosk1 = kioskId === 'kiosk-1';
  const accentDiamondImageSrc = isKiosk1 ? undefined : accentDiamondSrc;
  type TextDiamondConfig = {
    className: string;
    label?: string;
    outline?: ComponentType<SVGProps<SVGSVGElement>>;
    sizeClass?: string;
    textWrapperClassName?: string;
    textWrapperStyles?: Record<string, string>;
  };

  const textDiamonds: ReadonlyArray<TextDiamondConfig> = [
    {
      className: 'left-[240px] top-[350px]',
      label: centerLabel,
      outline: GreenDiamondThird,
      sizeClass: 'size-[910px]',
      textWrapperClassName: 'w-[660px] group-data-[kiosk=kiosk-1]/kiosk:w-[500px]',
      textWrapperStyles: { left: '500px' },
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
      textWrapperStyles: { width: '700px' },
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
      className="group/kiosk relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-kiosk={kioskId}
      data-node-id="5168:9626"
    >
      {/* Gradient backdrop */}
      <div
        className="absolute top-[-296px] left-0 h-[5416px] w-full rounded-t-[100px]"
        data-node-id="5168:9628"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
      />

      {/* Subheadline */}
      <div className="absolute top-[230px] left-[120px] w-[500px] -translate-y-full text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[250px] group-data-[kiosk=kiosk-2]/kiosk:translate-y-0 group-data-[kiosk=kiosk-3]/kiosk:relative group-data-[kiosk=kiosk-3]/kiosk:top-[410px] group-data-[kiosk=kiosk-3]/kiosk:left-auto group-data-[kiosk=kiosk-3]/kiosk:w-[380px] group-data-[kiosk=kiosk-3]/kiosk:translate-y-0">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute top-[745.23px] left-[128.17px] flex items-center gap-[41px]">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -45, top: 15 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1 className="relative top-[20px] left-[-80px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed] group-data-[kiosk=kiosk-3]/kiosk:top-[-20px] group-data-[kiosk=kiosk-3]/kiosk:left-[-100px]">
          {solutionLabel}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute top-[1210px] left-[240px] w-[1300px] text-white group-data-[kiosk=kiosk-3]/kiosk:top-[1260px]">
        <p className="text-[100px] leading-[1.3] font-normal tracking-[-5px] whitespace-pre-line">
          {renderRegisteredMark(title)}
        </p>
      </div>

      {/* Diamond cluster */}
      <div className="absolute top-[1400px] left-[240px] h-[2800px] w-[1680px]">
        {textDiamonds.map(({ className, label, outline, sizeClass, textWrapperClassName, textWrapperStyles }) =>
          label ? (
            <Diamond
              className={className}
              key={`${className}-${label}`}
              label={label}
              outline={outline}
              sizeClass={sizeClass}
              textColor="#ededed"
              textWrapperClassName={textWrapperClassName}
              textWrapperStyles={textWrapperStyles}
            />
          ) : null
        )}

        <MediaDiamond
          className="top-[1950px] left-[-280px]"
          fallback={<GreenDiamondThird2 aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageAlt="Left solution media diamond"
          imageSrc={mediaDiamondLeftSrc}
          sizeClass="size-[900px]"
        />
        <MediaDiamond
          className="top-[1425px] left-[1295px]"
          fallback={<BlueDiamondThird aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageAlt="Right solution media diamond"
          imageSrc={mediaDiamondRightSrc}
          sizeClass="size-[900px]"
        />
        <FilledDiamond
          className="top-[605px] left-[1285px] rotate-0 group-data-[kiosk=kiosk-1]/kiosk:top-[650px] group-data-[kiosk=kiosk-1]/kiosk:left-[1330px]"
          imageAlt="Accent gradient diamond"
          imageSrc={accentDiamondImageSrc}
        />
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute top-[1755px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        onKeyDown={event => {
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
        className="absolute top-[1980px] right-[120px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        onKeyDown={event => {
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
};

export default SolutionThirdScreenTemplate;

const Diamond = ({
  className,
  label,
  outline: OutlineComponent,
  sizeClass = 'size-[666px]',
  textColor = '#ededed',
  textWrapperClassName,
  textWrapperStyles,
}: DiamondProps) => {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass}`}>
        {OutlineComponent ? (
          <OutlineComponent aria-hidden="true" className="block h-full w-full object-contain" focusable="false" />
        ) : null}
        <div
          className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center ${
            textWrapperClassName ?? 'w-[460px]'
          }`}
          style={textWrapperStyles}
        >
          <p className="text-[67px] leading-[1.4] font-normal tracking-[-3.3px]" style={{ color: textColor }}>
            {renderRegisteredMark(label)}
          </p>
        </div>
      </div>
    </div>
  );
};

const MediaDiamond = ({
  className,
  fallback,
  imageAlt = 'Solution media diamond image',
  imageSrc,
  sizeClass = 'size-[666px]',
}: MediaDiamondProps) => {
  return (
    <div className={`absolute ${className}`}>
      <div className={`relative ${sizeClass} rotate-[45deg] overflow-hidden rounded-[120px]`}>
        {imageSrc ? (
          <Image alt={imageAlt} className="-rotate-[45deg] object-cover" fill sizes="900px" src={imageSrc} />
        ) : (
          <div className="flex h-full w-full -rotate-[45deg] items-center justify-center">{fallback}</div>
        )}
      </div>
    </div>
  );
};

const FilledDiamond = ({
  className,
  imageAlt = 'Accent gradient diamond',
  imageSrc,
}: {
  readonly className: string;
  readonly imageAlt?: string;
  readonly imageSrc?: string;
}) => {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[390px] rotate-[45deg] group-data-[kiosk=kiosk-1]/kiosk:size-[290px] group-data-[kiosk=kiosk-2]/kiosk:rotate-[0deg]">
        {imageSrc ? (
          <Image alt={imageAlt} className="-rotate-[45deg] object-cover" fill sizes="390px" src={imageSrc} />
        ) : (
          <TealGradientDiamondThird aria-hidden="true" className="h-full w-full -rotate-[45deg]" focusable="false" />
        )}
      </div>
    </div>
  );
};
