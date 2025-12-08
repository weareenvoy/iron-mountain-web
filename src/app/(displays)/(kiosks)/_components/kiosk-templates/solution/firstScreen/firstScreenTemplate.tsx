'use client';

import BlueDiamondMain from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondMain';
import GreenDiamondMain from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondMain';
import OrangeDiamondMain from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondMain';

import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import { ArrowDown, ArrowUp } from 'lucide-react';
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
    <div className="bg-black flex flex-col h-screen overflow-hidden relative w-full" data-node-id="5168:9669">
      {/* Background video */}
      <div className="absolute h-[1545px] left-0 top-[-5px] w-full">
        <div className="h-full relative w-full">
        <video
          autoPlay
          className="absolute bg-black h-full object-cover w-full"
          controlsList="nodownload"
          loop
          playsInline
          muted
        >
          <source src={backgroundVideoSrc} type="video/mp4" />
        </video>
          <div className="absolute bg-black/20 inset-0 pointer-events-none" />
        </div>
      </div>

      {/* Gradient body */}
      <div
        className="absolute h-[4085px] left-0 rounded-t-[100px] top-[1058px] w-full"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
        data-node-id="5168:9671"
      />

      {/* Subheadline */}
      <div className="absolute font-normal leading-[1.4] left-[120px] text-[#ededed] text-[60px] top-[240px] tracking-[-3px] w-[500px]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute flex gap-[41px] items-center left-[140px] top-[790px]" data-node-id="5168:9697">
        <div className="flex h-[200px] items-center justify-center relative w-[200px]" style={{ left: -55, top: -25 }}>
          <OutlinedDiamond aria-hidden="true" focusable="false" />
        </div>
        <h1
          className="font-normal leading-[1.3] relative text-[#ededed] text-[126.031px] tracking-[-6.3015px] whitespace-nowrap"
          style={{ top: -20, left: -100 }}
        >
          {solutionLabel}
        </h1>
      </div>

      {/* Body copy */}
      <div className="absolute flex flex-col gap-[80px] left-[120px] max-w-[1271px] text-white top-[1260px] w-auto">
        <p className="font-normal leading-[1.3] text-[100px] tracking-[-5px] w-[900px]">{renderRegisteredMark(title)}</p>
        <p className="font-normal leading-[1.4] text-[60px] tracking-[-3px]">{renderRegisteredMark(description)}</p>
      </div>

      {/* Decorative diamonds */}
      <div className="absolute h-[1770px] left-[-180px] opacity-60 pointer-events-none top-[2400px] w-[1770px] z-[3]">
        {largeDiamondSrc ? (
        <img alt="" className="h-full object-contain w-full" src={largeDiamondSrc} />
        ) : (
          <BlueDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="absolute h-[800px] left-[1240px] opacity-70 pointer-events-none top-[2370px] w-[800px] z-[3]">
        {mediumDiamondSrc ? (
        <img alt="" className="h-full object-contain w-full" src={mediumDiamondSrc} />
        ) : (
          <GreenDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="absolute h-[795px] left-[1235px] opacity-70 pointer-events-none top-[3394px] w-[795px] z-[3]">
        {accentDiamondSrc ? (
          <img alt="" className="h-full object-contain w-full" src={accentDiamondSrc} />
        ) : (
          <OrangeDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1755px] w-[118px] z-[10]"
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
        <ArrowUp aria-hidden="true" className="h-full text-[#ffffff66] w-full" focusable="false" strokeWidth={1.5} />
      </div>
      <div
        aria-label="Next"
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1980px] w-[118px] z-[10]"
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
        <ArrowDown aria-hidden="true" className="h-full text-[#ffffff66] w-full" focusable="false" strokeWidth={1.5} />
      </div>
    </div>
  );
}

