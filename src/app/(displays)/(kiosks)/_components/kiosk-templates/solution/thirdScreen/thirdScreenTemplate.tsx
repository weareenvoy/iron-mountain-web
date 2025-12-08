'use client';

import { type ComponentType, type ReactNode, type SVGProps } from 'react';

import { ArrowDown, ArrowUp, Diamond as DiamondIcon } from 'lucide-react';

import BlueDiamondThird from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondThird';
import GreenDiamondThird from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird';
import GreenDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondThird2';
import OrangeDiamondThird from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird';
import OrangeDiamondThird2 from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondThird2';
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
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  mediaDiamondLeftSrc = imgDiamondMediaLeft,
  mediaDiamondRightSrc = imgDiamondMediaRight,
  solutionLabel = 'Solution',
  subheadline = 'Rich media &\n cultural heritage',
  title = 'How Iron Mountain\nSmart Vault works:',
  topLeftLabel = 'Platform centralization',
  topRightLabel = 'Metadata enrichment',
  bottomLeftLabel = 'Automated workflows',
  bottomRightLabel = 'Searchable repository of pension information',
  centerLabel = 'Document digitization',
  accentDiamondSrc,
  onNavigateDown,
  onNavigateUp,
}: SolutionThirdScreenTemplateProps) {
  const textDiamonds = [
    { className: 'left-[540px] top-[1460px]', label: centerLabel, Outline: GreenDiamondThird },
    { className: 'left-[180px] top-[1880px]', label: topLeftLabel, Outline: OrangeDiamondThird },
    { className: 'left-[1020px] top-[1680px]', label: topRightLabel, Outline: BlueDiamondThird },
    { className: 'left-[480px] top-[2180px]', label: bottomLeftLabel, Outline: OrangeDiamondThird2 },
    { className: 'left-[940px] top-[2440px]', label: bottomRightLabel, Outline: GreenDiamondThird2 },
  ] as const;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9626">
      {/* Gradient backdrop */}
      <div
        className="absolute left-0 top-[-296px] h-[5416px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
        data-node-id="5168:9628"
      />

      {/* Subheadline */}
      <div className="absolute left-[120px] top-[368px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128.17px] top-[745.23px] flex items-center gap-[41px]">
        <div className="relative flex h-[100px] w-[100px] items-center justify-center">
          <DiamondIcon aria-hidden="true" className="h-[90px] w-[90px] text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1 className="whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed]">
          {solutionLabel}
        </h1>
      </div>

      {/* Title */}
      <div className="absolute left-[240px] top-[1428px] w-[1271px] text-white">
        <p className="text-[100px] font-normal leading-[1.3] tracking-[-5px] whitespace-pre-line">{renderRegisteredMark(title)}</p>
      </div>

      {/* Diamond cluster */}
      <div className="absolute left-[240px] top-[1400px] h-[2800px] w-[1680px]">
        {textDiamonds.map(({ className, label, Outline }) => (
          <Diamond className={className} key={`${className}-${label}`} label={label} Outline={Outline} textColor="#ededed" />
        ))}

        <MediaDiamond
          className="left-[140px] top-[2480px]"
          fallback={<GreenDiamondThird2 aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageSrc={mediaDiamondLeftSrc}
        />
        <MediaDiamond
          className="left-[860px] top-[2680px]"
          fallback={<BlueDiamondThird aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageSrc={mediaDiamondRightSrc}
        />
        <FilledDiamond className="left-[1380px] top-[1820px]" imageSrc={accentDiamondSrc} />
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
  textColor?: string;
};

function Diamond({ Outline, className, label, textColor = '#ededed' }: DiamondProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[666px]">
        {Outline ? (
          <Outline aria-hidden="true" className="block h-full w-full object-contain" focusable="false" />
        ) : null}
        <div className="absolute left-1/2 top-1/2 flex w-[320px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
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
};

function MediaDiamond({ className, fallback, imageSrc }: MediaDiamondProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[666px] rotate-[45deg] overflow-hidden rounded-[120px]">
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
      <div className="relative size-[360px] rotate-[45deg]">
        {imageSrc ? (
          <img alt="" className="h-full w-full -rotate-[45deg] object-cover" src={imageSrc} />
        ) : (
          <TealGradientDiamondThird aria-hidden="true" className="h-full w-full -rotate-[45deg]" focusable="false" />
        )}
      </div>
    </div>
  );
}

