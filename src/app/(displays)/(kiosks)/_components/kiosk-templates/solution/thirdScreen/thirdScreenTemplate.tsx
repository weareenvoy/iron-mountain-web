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

const imgBackgroundVideo = '/_videos/v1/a532f40a2a6848e2a80788002b6cb925a1f4c3c2';
const imgDiamondMediaLeft = 'http://localhost:3845/assets/bb9d9dd13fdcc4e78ef8886b4114de7fb75d7586.png';
const imgDiamondMediaRight = 'http://localhost:3845/assets/2f62e81abe58763bf6bdbf710843b3c886f19583.png';

export interface SolutionThirdScreenTemplateProps {
  backgroundVideoSrc?: string;
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
  accentDiamondSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
}

export default function SolutionThirdScreenTemplate({
  backgroundVideoSrc = imgBackgroundVideo,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  mediaDiamondLeftSrc = imgDiamondMediaLeft,
  mediaDiamondRightSrc = imgDiamondMediaRight,
  solutionLabel = 'Solution',
  subheadline = 'Rich media &\n cultural heritage',
  title = 'How Iron Mountain\nSmart Vault works:',
  topLeftLabel = 'Secure physical\nstorage',
  topRightLabel = 'Digital\ntransformation',
  bottomLeftLabel = 'Smart Vault\narchiving',
  bottomRightLabel = 'AI-powered\nsearch',
  accentDiamondSrc,
  onNavigateDown,
  onNavigateUp,
}: SolutionThirdScreenTemplateProps) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9626">
      {/* Background video */}
      <div className="absolute left-0 top-0 h-[1291px] w-full">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative h-full w-full">
            <video
              autoPlay
              className="absolute left-[-30.42%] top-[-30.96%] h-[172.5%] w-[181.73%] object-cover"
              controlsList="nodownload"
              loop
              muted
              playsInline
            >
              <source src={backgroundVideoSrc} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>
        </div>
      </div>

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
      <div className="absolute left-[240px] top-[1850px] h-[2500px] w-[1680px]">
        {/* Top-left text diamond */}
        <Diamond className="left-[0px] top-[0px]" label={topLeftLabel} Outline={BlueDiamondThird} textColor="#ededed" />
        {/* Top-right text diamond */}
        <Diamond className="left-[900px] top-[450px]" label={topRightLabel} Outline={GreenDiamondThird} textColor="#ededed" />
        {/* Bottom-left text diamond */}
        <Diamond className="left-[450px] top-[900px]" label={bottomLeftLabel} Outline={OrangeDiamondThird} textColor="#ededed" />
        {/* Bottom-right text diamond */}
        <Diamond
          className="left-[1050px] top-[1400px]"
          label={bottomRightLabel}
          Outline={TealGradientDiamondThird}
          textColor="#ededed"
        />

        {/* Media diamonds */}
        <MediaDiamond
          className="left-[620px] top-[1230px]"
          fallback={<GreenDiamondThird2 aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageSrc={mediaDiamondLeftSrc}
        />
        <MediaDiamond
          className="left-[1220px] top-[1730px]"
          fallback={<BlueDiamondThird aria-hidden="true" className="h-full w-full" focusable="false" />}
          imageSrc={mediaDiamondRightSrc}
        />
        <MediaDiamond
          className="left-[1180px] top-[2360px]"
          fallback={<OrangeDiamondThird2 aria-hidden="true" className="h-full w-full" focusable="false" />}
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

