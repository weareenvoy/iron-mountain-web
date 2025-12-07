'use client';

import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';

import BlueDiamondMain from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondMain';
import GreenDiamondMain from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondMain';
import OrangeDiamondMain from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondMain';

import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

export interface SolutionFirstScreenTemplateProps {
  accentDiamondSrc?: string;
  backgroundVideoSrc?: string;
  description?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  largeDiamondSrc?: string;
  mediumDiamondSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
}

export default function SolutionFirstScreenTemplate({
  accentDiamondSrc,
  backgroundVideoSrc = '/_videos/v1/872a6328a0acba2e645646ef71d669f72bbd05db',
  description = 'With a focus on physical storage and a secure digital archive, Iron Mountain provided climate-controlled, private vaults for physical artifacts and implemented Smart Vault for digital preservation.',
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  largeDiamondSrc,
  mediumDiamondSrc,
  onNavigateDown,
  onNavigateUp,
  solutionLabel = 'Solution',
  subheadline = 'Rich media &\n cultural heritage',
  title = 'A partnership with Iron Mountain',
}: SolutionFirstScreenTemplateProps) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9669">
      {/* Background video */}
      <div className="absolute left-0 top-[-5px] h-[1545px] w-full">
        <div className="relative h-full w-full">
          <video
            autoPlay
            className="absolute h-full w-full bg-black object-cover"
            controlsList="nodownload"
            loop
            playsInline
            muted
          >
            <source src={backgroundVideoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Gradient body */}
      <div
        className="absolute left-0 top-[1058px] h-[4085px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
        data-node-id="5168:9671"
      />

      {/* Subheadline */}
      <div className="absolute left-[120px] top-[368px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128.17px] top-[745.23px] flex items-center gap-[41px]" data-node-id="5168:9697">
        <div className="relative flex h-[100px] w-[100px] items-center justify-center">
          <Diamond aria-hidden="true" className="h-[90px] w-[90px] text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1 className="whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed]">
          {solutionLabel}
        </h1>
      </div>

      {/* Body copy */}
      <div className="absolute left-[239.94px] top-[1540px] flex w-auto max-w-[1271px] flex-col gap-[80px] text-white">
        <p className="text-[100px] font-normal leading-[1.3] tracking-[-5px]">{renderRegisteredMark(title)}</p>
        <p className="text-[60px] font-normal leading-[1.4] tracking-[-3px]">{renderRegisteredMark(description)}</p>
      </div>

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute left-[-220px] top-[2550px] z-[3] h-[1330px] w-[1330px] opacity-60">
        {largeDiamondSrc ? (
          <img alt="" className="h-full w-full object-contain" src={largeDiamondSrc} />
        ) : (
          <BlueDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1410px] top-[2500px] z-[3] h-[660px] w-[660px] opacity-70">
        {mediumDiamondSrc ? (
          <img alt="" className="h-full w-full object-contain" src={mediumDiamondSrc} />
        ) : (
          <GreenDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1520px] top-[3350px] z-[3] h-[520px] w-[520px] opacity-70">
        {accentDiamondSrc ? (
          <img alt="" className="h-full w-full object-contain" src={accentDiamondSrc} />
        ) : (
          <OrangeDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute right-[120px] top-[1755px] z-[10] flex h-[118px] w-[118px] items-center justify-center"
        data-node-id="5168:9695"
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
        data-node-id="5168:9693"
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

