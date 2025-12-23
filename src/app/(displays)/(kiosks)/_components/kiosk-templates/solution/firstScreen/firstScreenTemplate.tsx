'use client';

import Image from 'next/image';
import BlueDiamondMain from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondMain';
import GreenDiamondMain from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondMain';
import OrangeDiamondMain from '@/components/ui/icons/Kiosks/Solutions/OrangeDiamondMain';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

export type SolutionFirstScreenTemplateProps = {
  readonly accentDiamondSrc?: string;
  readonly backgroundVideoSrc?: string;
  readonly description?: string;
  readonly kioskId?: string;
  readonly largeDiamondSrc?: string;
  readonly mediumDiamondSrc?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly labelText?: string;
  readonly subheadline?: string;
  readonly title?: string;
};

const SolutionFirstScreenTemplate = ({
  accentDiamondSrc,
  backgroundVideoSrc,
  description,
  kioskId,
  largeDiamondSrc,
  mediumDiamondSrc,
  onNavigateDown: _onNavigateDown,
  onNavigateUp: _onNavigateUp,
  labelText,
  subheadline,
  title,
}: SolutionFirstScreenTemplateProps) => {
  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col overflow-visible bg-black"
      data-kiosk={kioskId}
    >
      {/* Background video */}
      <div className="absolute top-[-5px] left-0 h-[1545px] w-full">
        <div className="relative h-full w-full">
          <video
            autoPlay
            className="absolute h-full w-full bg-black object-cover"
            controlsList="nodownload"
            data-scroll-section="solution-first-video"
            loop
            muted
            playsInline
          >
            <source src={backgroundVideoSrc} type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-black/20" />
        </div>
      </div>

      {/* Gradient body */}
      <div
        className="absolute top-[1058px] left-0 z-[1] h-[14575px] w-full rounded-[100px] bg-gradient-to-b from-[#A2115E] to-[#8A0D71] group-data-[kiosk=kiosk-2]/kiosk:top-[1110px] group-data-[kiosk=kiosk-3]/kiosk:top-[1060px]"
      />

      {/* Subheadline */}
      <h2
        className="absolute top-[240px] left-[120px] z-[1] w-[500px] text-[60px] leading-[1.4] font-normal tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[290px] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-2]/kiosk:w-[450px] group-data-[kiosk=kiosk-3]/kiosk:top-[300px] group-data-[kiosk=kiosk-3]/kiosk:left-[240px] group-data-[kiosk=kiosk-3]/kiosk:w-[330px]"
      >
        {renderRegisteredMark(subheadline)}
      </h2>

      {/* Solution label */}
      <div
        className="absolute top-[790px] left-[140px] flex items-center gap-[41px] group-data-[kiosk=kiosk-2]/kiosk:top-[830px] group-data-[kiosk=kiosk-3]/kiosk:top-[860px] group-data-[kiosk=kiosk-3]/kiosk:left-[260px]"
      >
        <div className="relative left-[-55px] top-[-25px] flex h-[200px] w-[200px] items-center justify-center">
          <OutlinedDiamond aria-hidden="true" focusable="false" />
        </div>
        <h1
          className="relative left-[-100px] top-[-20px] text-[126.031px] leading-[1.3] font-normal tracking-[-6.3015px] whitespace-nowrap text-[#ededed]"
        >
          {labelText}
        </h1>
      </div>

      {/* Body copy */}
      <div className="absolute top-[1270px] left-[120px] z-[1] flex w-auto max-w-[1271px] flex-col gap-[80px] text-white group-data-[kiosk=kiosk-2]/kiosk:top-[1300px] group-data-[kiosk=kiosk-2]/kiosk:left-[120px] group-data-[kiosk=kiosk-3]/kiosk:top-[1260px] group-data-[kiosk=kiosk-3]/kiosk:left-[120px]">
        <p className="w-[900px] text-[100px] leading-[1.3] font-normal tracking-[-5px]">
          {renderRegisteredMark(title)}
        </p>
        <p className="text-[60px] leading-[1.4] font-normal tracking-[-3px]">{renderRegisteredMark(description)}</p>
      </div>

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute top-[2420px] left-[-170px] z-[3] h-[1770px] w-[1770px] opacity-60 group-data-[kiosk=kiosk-2]/kiosk:top-[2420px] group-data-[kiosk=kiosk-2]/kiosk:top-[2450px] group-data-[kiosk=kiosk-3]/kiosk:top-[2420px] group-data-[kiosk=kiosk-3]/kiosk:left-[-180px] group-data-[kiosk=kiosk-3]/kiosk:size-[1780px]">
        {largeDiamondSrc ? (
          <div className="relative h-full w-full">
            <Image
              alt="Large gradient diamond accent"
              className="object-contain"
              fill
              sizes="1770px"
              src={largeDiamondSrc}
            />
          </div>
        ) : (
          <BlueDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute top-[2400px] left-[1250px] z-[3] h-[800px] w-[800px] opacity-70 group-data-[kiosk=kiosk-2]/kiosk:top-[2420px] group-data-[kiosk=kiosk-2]/kiosk:left-[1240px] group-data-[kiosk=kiosk-2]/kiosk:size-[805px] group-data-[kiosk=kiosk-3]/kiosk:top-[2390px] group-data-[kiosk=kiosk-3]/kiosk:left-[1250px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        {mediumDiamondSrc ? (
          <div className="relative h-full w-full">
            <Image
              alt="Medium green diamond accent"
              className="object-contain"
              fill
              sizes="800px"
              src={mediumDiamondSrc}
            />
          </div>
        ) : (
          <GreenDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute top-[3440px] left-[1250px] z-[3] h-[795px] w-[795px] opacity-70 group-data-[kiosk=kiosk-3]/kiosk:top-[3420px] group-data-[kiosk=kiosk-3]/kiosk:left-[1250px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        {accentDiamondSrc ? (
          <div className="relative h-full w-full">
            <Image
              alt="Small orange accent diamond"
              className="object-contain"
              fill
              sizes="795px"
              src={accentDiamondSrc}
            />
          </div>
        ) : (
          <OrangeDiamondMain aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
    </div>
  );
};

export default SolutionFirstScreenTemplate;
