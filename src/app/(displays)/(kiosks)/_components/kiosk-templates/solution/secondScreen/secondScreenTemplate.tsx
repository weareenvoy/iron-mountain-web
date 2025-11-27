import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

const imgArrowNarrowDown = 'http://localhost:3845/assets/061965d7553b9df62d6e060bf38716245b7694d6.svg';
const imgSolutionIcon = 'http://localhost:3845/assets/bd84ed1c8b13a5ec5d89dedbe4a98c69925933c3.svg';
const imgDiamondOutlineLg = 'http://localhost:3845/assets/a9778f04639430558266e9867e209a1fd4e23b6f.svg';
const imgDiamondOutlineSm = 'http://localhost:3845/assets/8b08f30de40cbe05fa92227a40f251d17baf8ca0.svg';
const imgBackgroundGlyph = 'http://localhost:3845/assets/ddf66888ec3ed0effd90aa225fd2b21df98d8ac2.png';
const imgDividerLong = 'http://localhost:3845/assets/5bc7b95e04260f65c87de6fec49a9757bb922ade.svg';
const imgDividerShort = 'http://localhost:3845/assets/b1378310edec1175d21ae03e6b4e22a54bfe8386.svg';

export interface SolutionSecondScreenTemplateProps {
  arrowIconSrc?: string;
  backgroundGlyphSrc?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  largeDiamondOutlineSrc?: string;
  mediumDiamondOutlineSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionIconSrc?: string;
  solutionLabel?: string;
  stepOneDescription?: string;
  stepOneLabel?: string;
  stepThreeDescription?: string;
  stepThreeLabel?: string;
  stepTwoDescription?: string;
  stepTwoLabel?: string;
  subheadline?: string | string[];
  timelineDividerLongSrc?: string;
  timelineDividerShortSrc?: string;
  title?: string;
}

export default function SolutionSecondScreenTemplate({
  arrowIconSrc = imgArrowNarrowDown,
  backgroundGlyphSrc = imgBackgroundGlyph,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  largeDiamondOutlineSrc = imgDiamondOutlineLg,
  mediumDiamondOutlineSrc = imgDiamondOutlineSm,
  onNavigateDown,
  onNavigateUp,
  solutionIconSrc = imgSolutionIcon,
  solutionLabel = 'Solution',
  stepOneDescription = 'Converted all document formats (including handwritten papers, microfilm, CD/DVD) into digital form, then identified and extracted key data to enrich the records with searchable metadata',
  stepOneLabel = '01.',
  stepThreeDescription = 'Migrated legacy systems to InSight DXP to house all pension information',
  stepThreeLabel = '03.',
  stepTwoDescription = 'Created a complete repository of digitized and searchable pension information',
  stepTwoLabel = '02.',
  subheadline = 'Information & data lifecycle',
  timelineDividerLongSrc = imgDividerLong,
  timelineDividerShortSrc = imgDividerShort,
  title = 'Together, we:',
}: SolutionSecondScreenTemplateProps) {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9982">
      {/* Gradient backdrop */}
      <div
        className="absolute left-0 top-[-296px] h-[5416px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
        data-node-id="5168:9983"
      />

      {/* Decorative glyphs */}
      <div className="pointer-events-none absolute left-[1250px] top-[1500px] w-[600px]">
        <img alt="" className="h-full w-full object-contain" src={backgroundGlyphSrc} />
      </div>
      <div className="pointer-events-none absolute left-[-120px] top-[980px] z-[2] w-[1328px]">
        <img alt="" className="h-full w-full object-contain" src={largeDiamondOutlineSrc} />
      </div>
      <div className="pointer-events-none absolute left-[1240px] top-[2130px] z-[2] w-[660px]">
        <img alt="" className="h-full w-full object-contain" src={mediumDiamondOutlineSrc} />
      </div>

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
      <p className="absolute left-[240px] top-[1568px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-white">
        {renderRegisteredMark(title)}
      </p>

      {/* Timeline with steps */}
      <div className="absolute left-[240px] top-[1850px] w-[1100px] text-[60px] leading-[1.4] tracking-[-3px] text-[#ededed]">
        <div className="flex gap-10">
          <p className="text-[#ededed]">{stepOneLabel}</p>
          <p>{renderRegisteredMark(stepOneDescription)}</p>
        </div>
        <div className="relative ml-[23px] mt-[40px] h-[513px] w-[513px]">
          <img alt="" className="h-full w-full object-contain" src={timelineDividerLongSrc} />
        </div>
        <div className="mt-[60px] flex gap-10 opacity-50">
          <p>{stepTwoLabel}</p>
          <p>{renderRegisteredMark(stepTwoDescription)}</p>
        </div>
        <div className="relative ml-[23px] mt-[40px] h-[262px] w-[262px]">
          <img alt="" className="h-full w-full object-contain" src={timelineDividerShortSrc} />
        </div>
        <div className="mt-[60px] flex gap-10 opacity-20">
          <p>{stepThreeLabel}</p>
          <p>{renderRegisteredMark(stepThreeDescription)}</p>
        </div>
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

