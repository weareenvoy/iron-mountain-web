import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import BlueDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondSecond';
import GreenDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondSecond';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

export type SolutionSecondScreenTemplateProps = SolutionSecondScreenCoreProps & SolutionSecondScreenStepsProps;

type StepConfig = {
  readonly description?: string;
  readonly label?: string;
};

type SolutionSecondScreenCoreProps = {
  readonly heroImageAlt?: string;
  readonly heroImageSrc?: string;
  readonly kioskId?: KioskId;
  readonly labelText?: string;
  readonly onNavigateDown?: () => void;
  readonly onNavigateUp?: () => void;
  readonly stepFourDescription?: string;
  readonly stepFourLabel?: string;
  readonly stepOneDescription?: string;
  readonly stepOneLabel?: string;
  readonly stepThreeDescription?: string;
  readonly stepThreeLabel?: string;
  readonly stepTwoDescription?: string;
  readonly stepTwoLabel?: string;
  readonly subheadline?: string;
  readonly title?: string;
};

type SolutionSecondScreenStepsProps = {
  readonly steps?: StepConfig[];
  readonly stepsDividerHeights?: number[];
};

const SolutionSecondScreenTemplate = ({
  heroImageAlt,
  heroImageSrc,
  kioskId = DEFAULT_KIOSK_ID,
  labelText,
  stepFourDescription,
  stepFourLabel,
  stepOneDescription,
  stepOneLabel,
  steps,
  stepsDividerHeights,
  stepThreeDescription,
  stepThreeLabel,
  stepTwoDescription,
  stepTwoLabel,
  subheadline,
  title,
}: SolutionSecondScreenTemplateProps) => {
  const legacySteps: StepConfig[] = [
    { description: stepOneDescription, label: stepOneLabel },
    { description: stepTwoDescription, label: stepTwoLabel },
    { description: stepThreeDescription, label: stepThreeLabel },
  ];

  if (stepFourLabel || stepFourDescription) {
    legacySteps.push({ description: stepFourDescription, label: stepFourLabel });
  }

  const timelineSteps = (steps?.length ? steps : legacySteps).filter((entry): entry is Required<StepConfig> =>
    Boolean(entry.label && entry.description)
  );

  const dividerHeights =
    stepsDividerHeights && stepsDividerHeights.length >= timelineSteps.length - 1
      ? stepsDividerHeights
      : [668, 250, 250];

  const getOpacityClass = (index: number) => {
    if (index === 0) return 'opacity-100';
    if (index === 1) return 'opacity-50';
    return 'opacity-20';
  };

  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col overflow-visible bg-transparent"
      data-kiosk={kioskId}
      data-scroll-section="solution-second-group"
    >
      {/* Gradient backdrop */}
      <div className="absolute top-[-296px] left-0 h-[14575px] w-full rounded-t-[100px] bg-transparent" />

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute top-[1080px] left-[-100px] z-[1] h-[1790px] w-[1790px]">
        <BlueDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="pointer-events-none absolute top-[970px] left-[1270px] z-[1] h-[890px] w-[890px] group-data-[kiosk=kiosk-2]/kiosk:top-[1040px] group-data-[kiosk=kiosk-2]/kiosk:left-[1330px] group-data-[kiosk=kiosk-2]/kiosk:size-[800px] group-data-[kiosk=kiosk-3]/kiosk:top-[1050px] group-data-[kiosk=kiosk-3]/kiosk:left-[1330px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        <GreenDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      {/* Subheadline */}
      <h2 className="absolute top-[230px] left-[120px] z-[1] w-[500px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
        {renderRegisteredMark(subheadline)}
      </h2>

      {/* Solution label */}
      <div className="absolute top-[710px] left-[150px] z-1 flex group-data-[kiosk=kiosk-3]/kiosk:top-[720px] group-data-[kiosk=kiosk-3]/kiosk:left-[140px]">
        <div className="relative top-[25px] left-[-55px] flex h-[200px] w-[200px] items-center justify-center">
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1 className="relative top-[55px] left-[-50px] text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]">
          {renderRegisteredMark(labelText)}
        </h1>
      </div>

      {/* Title */}
      <p className="absolute top-[1600px] left-[240px] z-[1] text-[100px] leading-[1.3] font-normal tracking-[-5px] text-white group-data-[kiosk=kiosk-2]/kiosk:top-[1570px] group-data-[kiosk=kiosk-2]/kiosk:left-[250px]">
        {renderRegisteredMark(title)}
      </p>

      {/* Timeline with steps */}
      <div className="absolute top-[1890px] left-[240px] z-[2] flex w-[1010px] flex-col gap-[60px] text-[60px] leading-[1.3] tracking-[-3px] text-[#ededed] group-data-[kiosk=kiosk-2]/kiosk:top-[1860px] group-data-[kiosk=kiosk-2]/kiosk:left-[250px]">
        {timelineSteps.map((step, index) => (
          <div key={`${step.label}-${index}`}>
            <div className={`flex gap-[70px] ${getOpacityClass(index)}`}>
              <p className="w-[120px]">{renderRegisteredMark(step.label)}</p>
              <p className="w-[1620px]">{renderRegisteredMark(step.description)}</p>
            </div>
            {index < timelineSteps.length - 1 ? (
              <div className="mt-[30px] ml-[140px]">
                <div
                  className="border-l border-dashed border-[#ededed]/60"
                  style={
                    {
                      '--divider-height': `${dividerHeights[index] ?? 280}px`,
                      'height': 'var(--divider-height)',
                    } as React.CSSProperties
                  }
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Hero media diamond */}
      <div className="absolute top-[2210px] left-[1500px] z-[2]">
        <div className="relative top-[-140px] left-[-230px] h-[900px] w-[900px] rotate-[45deg] overflow-hidden rounded-[80px] group-data-[kiosk=kiosk-2]/kiosk:top-[-160px] group-data-[kiosk=kiosk-2]/kiosk:left-[-180px] group-data-[kiosk=kiosk-2]/kiosk:size-[810px] group-data-[kiosk=kiosk-3]/kiosk:top-[-130px] group-data-[kiosk=kiosk-3]/kiosk:left-[-160px] group-data-[kiosk=kiosk-3]/kiosk:size-[800px]">
          {heroImageSrc && (
            <Image
              alt={heroImageAlt || ''}
              className="-rotate-[45deg] object-cover"
              fill
              sizes="800px"
              src={heroImageSrc}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionSecondScreenTemplate;
