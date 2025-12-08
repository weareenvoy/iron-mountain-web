import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import BlueDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondSecond';
import GreenDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondSecond';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';

import { ArrowDown, ArrowUp } from 'lucide-react';
import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

type StepConfig = {
  description?: string;
  label?: string;
};

const imgHeroDiamond = '/images/kiosks/kiosk2/02-solution/Solution-Image2-Diamond.png';

export interface SolutionSecondScreenTemplateProps {
  gradientEndColor?: string;
  gradientStartColor?: string;
  heroImageAlt?: string;
  heroImageSrc?: string;
  kioskId?: KioskId;
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
  gradientEndColor = '#8a0d71',
  gradientStartColor = '#a2115e',
  heroImageAlt = 'Solution highlight',
  heroImageSrc = imgHeroDiamond,
  kioskId = DEFAULT_KIOSK_ID,
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
      : [768, 250, 250];

  const getOpacityClass = (index: number) => {
    if (index === 0) return 'opacity-100';
    if (index === 1) return 'opacity-50';
    return 'opacity-20';
  };

  return (
    <div
      className="bg-black flex flex-col group/kiosk h-screen overflow-hidden relative w-full"
      data-kiosk={kioskId}
      data-node-id="5168:9473"
    >
      {/* Gradient backdrop */}
      <div
        className="absolute h-[5416px] left-0 rounded-t-[100px] top-[-296px] w-full"
        style={{ background: `linear-gradient(to bottom, ${gradientStartColor} 0%, ${gradientEndColor} 99%)` }}
      />

      {/* Decorative diamonds */}
      <div className="absolute h-[1790px] left-[-120px] pointer-events-none top-[1100px] w-[1790px] z-[1]">
        <BlueDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="absolute h-[800px] left-[1325px] pointer-events-none top-[1065px] w-[800px] z-[1]">
        <GreenDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      {/* Subheadline */}
      <div className="absolute font-normal leading-[1.4] left-[120px] text-[#ededed] text-[60px] top-[245px] tracking-[-3px] w-[500px] whitespace-pre-line">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </div>

      {/* Solution label */}
      <div className="absolute flex gap-[41px] items-center left-[128px] top-[745px]">
        <div className="flex h-[200px] items-center justify-center relative w-[200px]" style={{ left: -55, top: 25 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1
          className="font-normal leading-[1.3] text-[#ededed] text-[126px] tracking-[-6.3px] whitespace-nowrap"
          style={{ left: -90, position: 'relative', top: 30 }}
        >
          {renderRegisteredMark(solutionLabel)}
        </h1>
      </div>

      {/* Title */}
      <p className="absolute font-normal leading-[1.3] left-[240px] text-[100px] text-white top-[1600px] tracking-[-5px] z-[1]">
        {renderRegisteredMark(title)}
      </p>

      {/* Timeline with steps */}
      <div className="absolute flex flex-col gap-[60px] leading-[1.4] left-[240px] text-[#ededed] text-[60px] top-[1890px] tracking-[-3px] w-[960px] z-[2]">
        {timelineSteps.map((step, index) => (
          <div key={`${step.label}-${index}`}>
            <div className={`flex gap-[10px] ${getOpacityClass(index)}`}>
              <p className="w-[120px]">{renderRegisteredMark(step.label)}</p>
              <p className="w-[760px]">{renderRegisteredMark(step.description)}</p>
            </div>
            {index < timelineSteps.length - 1 ? (
              <div className="ml-[140px] mt-[30px]">
                <div
                  className="border-[#ededed]/60 border-dashed border-l"
                  style={{ height: `${dividerHeights[index] ?? 280}px` }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Hero media diamond */}
      <div className="absolute left-[1500px] top-[2180px] z-[2]">
        <div
          className="h-[800px] left-[-180px] overflow-hidden relative rotate-[45deg] rounded-[80px] top-[-90px] w-[800px]"
        >
          <img alt={heroImageAlt} className="-rotate-[45deg] h-full object-cover w-full" src={heroImageSrc} />
        </div>
      </div>

      {/* Timeline arrows */}
      <div
          aria-label="Previous"
        className="absolute flex h-[118px] items-center justify-center right-[120px] top-[1755px] w-[118px] z-[10]"
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

