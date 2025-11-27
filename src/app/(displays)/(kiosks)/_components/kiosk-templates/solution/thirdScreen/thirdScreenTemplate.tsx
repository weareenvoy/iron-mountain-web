'use client';

import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

const imgArrowNarrowDown = 'http://localhost:3845/assets/a6edb731c633feb0583f227ea6146050aabea4d5.svg';
const imgSolutionIcon = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';
const imgBackgroundVideo = '/_videos/v1/a532f40a2a6848e2a80788002b6cb925a1f4c3c2';
const imgDiamondTextPrimary = 'http://localhost:3845/assets/c305073939f859c26f8ffc28f2589085f5374ce0.svg';
const imgDiamondTextSecondary = 'http://localhost:3845/assets/e19ca6e666e2963daa98439a05f797e8b5fb6109.svg';
const imgDiamondTextTertiary = 'http://localhost:3845/assets/fc8aaa8a1e0e36bb1b05680977193c3c60870516.svg';
const imgDiamondTextQuaternary = 'http://localhost:3845/assets/55794205006219e11958e82002621a26c9a75a78.svg';
const imgDiamondMediaLeft = 'http://localhost:3845/assets/bb9d9dd13fdcc4e78ef8886b4114de7fb75d7586.png';
const imgDiamondMediaRight = 'http://localhost:3845/assets/2f62e81abe58763bf6bdbf710843b3c886f19583.png';
const imgAccentDiamond = 'http://localhost:3845/assets/04c5d53f375e593c269131982829bc5be36f8abf.svg';

export interface SolutionThirdScreenTemplateProps {
  arrowIconSrc?: string;
  backgroundVideoSrc?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  mediaDiamondLeftSrc?: string;
  mediaDiamondRightSrc?: string;
  solutionIconSrc?: string;
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
  arrowIconSrc = imgArrowNarrowDown,
  backgroundVideoSrc = imgBackgroundVideo,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  mediaDiamondLeftSrc = imgDiamondMediaLeft,
  mediaDiamondRightSrc = imgDiamondMediaRight,
  solutionIconSrc = imgSolutionIcon,
  solutionLabel = 'Solution',
  subheadline = 'Rich media &\n cultural heritage',
  title = 'How Iron Mountain\nSmart Vault works:',
  topLeftLabel = 'Secure physical\nstorage',
  topRightLabel = 'Digital\ntransformation',
  bottomLeftLabel = 'Smart Vault\narchiving',
  bottomRightLabel = 'AI-powered\nsearch',
  accentDiamondSrc = imgAccentDiamond,
  onNavigateDown,
  onNavigateUp,
}: SolutionThirdScreenTemplateProps) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9626">
      {/* Background video */}
      <div className="absolute left-0 top-0 h-[1291px] w-full">
        <div className="absolute inset-0 overflow-hidden">
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
          <div className="relative size-full rotate-[225deg] scale-y-[-1]">
            <img alt="" className="block h-full w-full object-contain" src={solutionIconSrc} />
          </div>
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
        <Diamond
          className="left-[0px] top-[0px]"
          label={topLeftLabel}
          outlineSrc={imgDiamondTextPrimary}
          textColor="#ededed"
        />
        {/* Top-right text diamond */}
        <Diamond
          className="left-[900px] top-[450px]"
          label={topRightLabel}
          outlineSrc={imgDiamondTextSecondary}
          textColor="#ededed"
        />
        {/* Bottom-left text diamond */}
        <Diamond
          className="left-[450px] top-[900px]"
          label={bottomLeftLabel}
          outlineSrc={imgDiamondTextTertiary}
          textColor="#ededed"
        />
        {/* Bottom-right text diamond */}
        <Diamond
          className="left-[1050px] top-[1400px]"
          label={bottomRightLabel}
          outlineSrc={imgDiamondTextQuaternary}
          textColor="#ededed"
        />

        {/* Media diamonds */}
        <MediaDiamond className="left-[620px] top-[1230px]" imageSrc={mediaDiamondLeftSrc} />
        <MediaDiamond className="left-[1220px] top-[1730px]" imageSrc={mediaDiamondRightSrc} />
        <MediaDiamond className="left-[1180px] top-[2360px]" imageSrc={accentDiamondSrc} />
      </div>

      {/* Navigation arrows */}
      <div
        aria-label="Previous"
        className="absolute right-[120px] top-[1755px] flex h-[118px] w-[118px] -scale-y-100 items-center justify-center"
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

type DiamondProps = {
  className: string;
  label?: string;
  outlineSrc: string;
  textColor?: string;
};

function Diamond({ className, label, outlineSrc, textColor = '#ededed' }: DiamondProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[666px]">
        <img alt="" className="block h-full w-full object-contain" src={outlineSrc} />
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
  imageSrc: string;
};

function MediaDiamond({ className, imageSrc }: MediaDiamondProps) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative size-[666px] rotate-[45deg] overflow-hidden rounded-[120px]">
        <img alt="" className="h-full w-full -rotate-[45deg] object-cover" src={imageSrc} />
      </div>
    </div>
  );
}

