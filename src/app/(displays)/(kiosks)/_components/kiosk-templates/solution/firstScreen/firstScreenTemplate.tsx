'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';

import BlueDiamondMain from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondMain';
import GreenDiamondMain from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondMain';
import OrangeDiamondMain from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondMain';

import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
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
      <div className="absolute left-[120px] top-[240px] w-[500px] text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[140px] top-[790px] flex items-center gap-[41px]" data-node-id="5168:9697">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -55, top: -25 }}>
          <OutlinedDiamond aria-hidden="true" focusable="false" />
        </div>
        <h1
          className="relative whitespace-nowrap text-[126.031px] font-normal leading-[1.3] tracking-[-6.3015px] text-[#ededed]"
          style={{ top: -20, left: -100 }}
        >
          {solutionLabel}
        </h1>
      </div>

      {/* Body copy */}
      <div className="absolute left-[120px] top-[1260px] flex w-auto max-w-[1271px] flex-col gap-[80px] text-white">
        <p className="w-[900px] text-[100px] font-normal leading-[1.3] tracking-[-5px]">{renderRegisteredMark(title)}</p>
        <p className="text-[60px] font-normal leading-[1.4] tracking-[-3px]">{renderRegisteredMark(description)}</p>
      </div>

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute left-[-180px] top-[2400px] z-[3] h-[1770px] w-[1770px] opacity-60">
        {largeDiamondSrc ? (
        <img alt="" className="h-full w-full object-contain" src={largeDiamondSrc} />
        ) : (
          <BlueDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1240px] top-[2370px] z-[3] h-[800px] w-[800px] opacity-70">
        {mediumDiamondSrc ? (
        <img alt="" className="h-full w-full object-contain" src={mediumDiamondSrc} />
        ) : (
          <GreenDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1235px] top-[3394px] z-[3] h-[795px] w-[795px] opacity-70">
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

