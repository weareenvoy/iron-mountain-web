import { ArrowDown, ArrowUp, Diamond } from 'lucide-react';

import BlueDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondSecond';
import GreenDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondSecond';

import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

type StepConfig = {
  description?: string;
  label?: string;
};

const imgDiamondOutlineAccent = 'http://localhost:3845/assets/8b08f30de40cbe05fa92227a40f251d17baf8ca0.svg';
const imgHeroDiamond = 'http://localhost:3845/assets/bb9d9dd13fdcc4e78ef8886b4114de7fb75d7586.png';

export interface SolutionSecondScreenTemplateProps {
  accentDiamondOutlineSrc?: string;
  filledDiamondSrc?: string;
  gradientEndColor?: string;
  gradientStartColor?: string;
  heroImageAlt?: string;
  heroImageSrc?: string;
  largeDiamondOutlineSrc?: string;
  mediumDiamondOutlineSrc?: string;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  solutionLabel?: string;
  stepFourDescription?: string;
  stepFourLabel?: string;
  stepOneDescription?: string;
  stepOneLabel?: string;
  stepThreeDescription?: string;
  stepThreeLabel?: string;
  stepTwoDescription?: string;
  stepTwoLabel?: string;
  steps?: StepConfig[];
  stepsDividerHeights?: number[];
  subheadline?: string | string[];
  title?: string | string[];
}

export default function SolutionSecondScreenTemplate({
  accentDiamondOutlineSrc = imgDiamondOutlineAccent,
  filledDiamondSrc,
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  heroImageAlt = 'Solution highlight',
  heroImageSrc = imgHeroDiamond,
  largeDiamondOutlineSrc,
  mediumDiamondOutlineSrc,
  onNavigateDown,
  onNavigateUp,
  solutionLabel = 'Solution',
  stepFourDescription,
  stepFourLabel,
  stepOneDescription = 'Improved logistical costs due to extensive global footprint and in-house logistics',
  stepOneLabel = '01.',
  stepThreeDescription = 'Helped maintain consistency and compliance across locations in North America, Europe, and APAC',
  stepThreeLabel = '03.',
  stepTwoDescription = 'Optimized delivery and transparency with end-to-end chain of custody, visibility through technology integration, and comprehensive reporting',
  stepTwoLabel = '02.',
  steps,
  stepsDividerHeights,
  subheadline = ['IT assets &', 'data centers'],
  title = 'Together, we:',
}: SolutionSecondScreenTemplateProps) {
  const legacySteps: StepConfig[] = [
    { label: stepOneLabel, description: stepOneDescription },
    { label: stepTwoLabel, description: stepTwoDescription },
    { label: stepThreeLabel, description: stepThreeDescription },
  ];

  if (stepFourLabel || stepFourDescription) {
    legacySteps.push({ label: stepFourLabel ?? '04.', description: stepFourDescription });
  }

  const timelineSteps = (steps?.length ? steps : legacySteps).filter(
    (entry): entry is Required<StepConfig> => Boolean(entry.label && entry.description),
  );

  const dividerHeights =
    stepsDividerHeights && stepsDividerHeights.length >= timelineSteps.length - 1
      ? stepsDividerHeights
      : [560, 320, 320];

  const getOpacityClass = (index: number) => {
    if (index === 0) return 'opacity-100';
    if (index === 1) return 'opacity-60';
    return 'opacity-20';
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black" data-node-id="5168:9473">
      {/* Gradient backdrop */}
      <div
        className="absolute left-0 top-[-296px] h-[5416px] w-full rounded-t-[100px]"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
      />

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute left-[1210px] top-[1180px] h-[1330px] w-[1330px] rotate-[225deg]">
        {largeDiamondOutlineSrc ? (
          <img alt="" className="h-full w-full object-contain" src={largeDiamondOutlineSrc} />
        ) : (
          <GreenDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1220px] top-[2100px] h-[660px] w-[660px] rotate-[225deg]">
        {mediumDiamondOutlineSrc ? (
          <img alt="" className="h-full w-full object-contain" src={mediumDiamondOutlineSrc} />
        ) : (
          <BlueDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[520px] top-[1500px] h-[660px] w-[660px] rotate-[225deg]">
        {filledDiamondSrc ? (
          <img alt="" className="h-full w-full object-contain" src={filledDiamondSrc} />
        ) : (
          <BlueDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>
      <div className="pointer-events-none absolute left-[1590px] top-[1420px] h-[660px] w-[660px] rotate-[225deg]">
        {accentDiamondOutlineSrc ? (
          <img alt="" className="h-full w-full object-contain" src={accentDiamondOutlineSrc} />
        ) : (
          <GreenDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
        )}
      </div>

      {/* Subheadline */}
      <div className="absolute left-[120px] top-[368px] -translate-y-full text-[60px] font-normal leading-[1.4] tracking-[-3px] text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute left-[128px] top-[745px] flex items-center gap-[41px]">
        <div className="relative flex h-[100px] w-[100px] items-center justify-center">
          <Diamond aria-hidden="true" className="h-[90px] w-[90px] text-[#ededed]" focusable="false" strokeWidth={1.25} />
        </div>
        <h1 className="whitespace-nowrap text-[126px] font-normal leading-[1.3] tracking-[-6.3px] text-[#ededed]">
          {renderRegisteredMark(solutionLabel)}
        </h1>
      </div>

      {/* Title */}
      <p className="absolute left-[240px] top-[1568px] text-[100px] font-normal leading-[1.3] tracking-[-5px] text-white">
        {renderRegisteredMark(title)}
      </p>

      {/* Timeline with steps */}
      <div className="absolute left-[240px] top-[1855px] flex w-[1200px] flex-col gap-[80px] text-[60px] leading-[1.4] tracking-[-3px] text-[#ededed]">
        {timelineSteps.map((step, index) => (
          <div key={`${step.label}-${index}`}>
            <div className={`flex gap-10 ${getOpacityClass(index)}`}>
              <p className="w-[120px]">{renderRegisteredMark(step.label)}</p>
              <p className="w-[840px]">{renderRegisteredMark(step.description)}</p>
            </div>
            {index < timelineSteps.length - 1 ? (
              <div className="ml-[80px] mt-[30px]">
                <div
                  className="border-l border-dashed border-[#ededed]/60"
                  style={{ height: `${dividerHeights[index] ?? 280}px` }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Hero media diamond */}
      <div className="absolute left-[1250px] top-[1950px]">
        <div className="h-[360px] w-[360px] rotate-[45deg] overflow-hidden rounded-[80px] shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          <img alt={heroImageAlt} className="h-full w-full -rotate-[45deg] object-cover" src={heroImageSrc} />
        </div>
      </div>

      {/* Timeline arrows */}
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

