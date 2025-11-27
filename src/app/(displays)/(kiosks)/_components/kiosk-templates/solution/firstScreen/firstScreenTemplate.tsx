'use client';

import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

const imgArrowNarrowDown = 'http://localhost:3845/assets/aebba31f433061ae9f78a10bbb26ded1ce700a34.svg';
const imgGuides = 'http://localhost:3845/assets/bbb0c30a6c52c72ecfe10371a7001daf550a68d1.svg';
const imgSolutionIcon = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';
const imgLargeDiamond = 'http://localhost:3845/assets/72578e2632135b58636046fd0b079849041e3e38.svg';
const imgSmallDiamond = 'http://localhost:3845/assets/1597e6de6450e7c04d382fe015a57afd18507548.svg';

export interface SolutionFirstScreenTemplateProps {
  arrowIconSrc?: string;
  backgroundVideoSrc?: string;
  description?: string;
  footnote?: string;
  footnoteIconSrc?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  guidesImageSrc?: string;
  largeDiamondSrc?: string;
  mediumDiamondSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionIconSrc?: string;
  solutionLabel?: string;
  subheadline?: string | string[];
  title?: string;
}

export default function SolutionFirstScreenTemplate({
  arrowIconSrc = imgArrowNarrowDown,
  backgroundVideoSrc = '/_videos/v1/872a6328a0acba2e645646ef71d669f72bbd05db',
  description = 'With a focus on physical storage and a secure digital archive, Iron Mountain provided climate-controlled, private vaults for physical artifacts and implemented Smart Vault for digital preservation.',
  footnote = "Securely stored the museum's invaluable and one-of-a-kind musical artifacts in a private, climate-controlled vault",
  footnoteIconSrc = imgSmallDiamond,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  guidesImageSrc = imgGuides,
  largeDiamondSrc = imgLargeDiamond,
  mediumDiamondSrc = imgSmallDiamond,
  onNavigateDown,
  onNavigateUp,
  solutionIconSrc = imgSolutionIcon,
  solutionLabel = 'Solution',
  subheadline = 'Rich media &\n cultural heritage',
  title = 'A partnership with Iron Mountain',
}: SolutionFirstScreenTemplateProps) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9669">
      {/* Background video */}
      <div className="absolute left-0 top-[-5px] h-[1545px] w-full">
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
      </div>

      {/* Gradient body */}
      <div
        className="absolute left-0 top-[1058px] h-[4085px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
        data-node-id="5168:9671"
      />

      {/* Guides overlay */}
      <div className="pointer-events-none absolute left-0 top-0 h-[5120px] w-[2160px] overflow-clip" data-node-id="4883:14929">
        <div className="absolute inset-0">
          <img alt="" className="block h-full w-full object-cover" src={guidesImageSrc} />
        </div>
      </div>

      {/* Subheadline */}
      <div className="absolute left-[120px] top-[368px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128.17px] top-[745.23px] flex items-center gap-[41px]" data-node-id="5168:9697">
        <div className="relative flex h-[100px] w-[100px] items-center justify-center">
          <div className="relative size-full rotate-[225deg] scale-y-[-1]">
            <img alt="" className="block h-full w-full object-contain" src={solutionIconSrc} />
          </div>
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
      <div className="pointer-events-none absolute left-[900px] top-[2000px] z-[3] w-[900px] opacity-60">
        <img alt="" className="h-full w-full object-contain" src={largeDiamondSrc} />
      </div>
      <div className="pointer-events-none absolute left-[1500px] top-[3200px] z-[3] w-[360px] opacity-70">
        <img alt="" className="h-full w-full object-contain" src={mediumDiamondSrc} />
      </div>

      {/* Footnote */}
      <div className="absolute left-[469px] top-[5398px] flex max-w-[1008px] items-start gap-6 text-[67.315px] leading-[1.4] tracking-[-3.3658px] text-white/80">
        <img alt="" className="h-[69px] w-[69px] object-contain" src={footnoteIconSrc} />
        <p>{renderRegisteredMark(footnote)}</p>
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute right-[120px] top-[1755px] flex h-[118px] w-[118px] -scale-y-100 items-center justify-center"
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
        <img alt="Up" className="h-full w-full object-contain" src={arrowIconSrc} />
      </div>
      <div
        aria-label="Next"
        className="absolute right-[120px] top-[1980px] flex h-[118px] w-[118px] items-center justify-center"
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
        <img alt="Down" className="h-full w-full object-contain" src={arrowIconSrc} />
      </div>
    </div>
  );
}

