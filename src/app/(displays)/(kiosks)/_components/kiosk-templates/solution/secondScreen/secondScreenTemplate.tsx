import Image from 'next/image';
import { DEFAULT_KIOSK_ID, type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import BlueDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/BlueDiamondSecond';
import GreenDiamondSecond from '@/components/ui/icons/Kiosks/Solutions/GreenDiamondSecond';
import OutlinedDiamond from '@/components/ui/icons/Kiosks/Solutions/OutlinedDiamond';
import renderRegisteredMark from '../../challenge/utils/renderRegisteredMark';

type StepConfig = {
  description?: string;
  label?: string;
};

const imgHeroDiamond = '/images/kiosks/kiosk2/02-solution/Solution-Image2-Diamond.png';

export type SolutionSecondScreenTemplateProps = Readonly<
  SolutionSecondScreenCoreProps & SolutionSecondScreenStepsProps
>;

type SolutionSecondScreenCoreProps = {
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
  subheadline?: string | string[];
  title?: string | string[];
};

type SolutionSecondScreenStepsProps = {
  steps?: StepConfig[];
  stepsDividerHeights?: number[];
};

const SolutionSecondScreenTemplate = ({
  heroImageAlt = 'Solution highlight',
  heroImageSrc = imgHeroDiamond,
  kioskId = DEFAULT_KIOSK_ID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateDown: _onNavigateDown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onNavigateUp: _onNavigateUp,
  solutionLabel = 'Solution',
  stepFourDescription,
  stepFourLabel,
  stepOneDescription = 'Improved logistical costs due to extensive global footprint and in-house logistics',
  stepOneLabel = '01.',
  steps,
  stepsDividerHeights,
  stepThreeDescription = 'Helped maintain consistency and compliance across locations in North America, Europe, and APAC',
  stepThreeLabel = '03.',
  stepTwoDescription = 'Optimized delivery and transparency with end-to-end chain of custody, visibility through technology integration, and comprehensive reporting',
  stepTwoLabel = '02.',
  subheadline = ['IT assets &', 'data centers'],
  title = 'Together, we:',
}: SolutionSecondScreenTemplateProps) => {
  const legacySteps: StepConfig[] = [
    { description: stepOneDescription, label: stepOneLabel },
    { description: stepTwoDescription, label: stepTwoLabel },
    { description: stepThreeDescription, label: stepThreeLabel },
  ];

  if (stepFourLabel || stepFourDescription) {
    legacySteps.push({ description: stepFourDescription, label: stepFourLabel ?? '04.' });
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
      className="group/kiosk relative flex h-screen w-full flex-col overflow-hidden bg-black"
      data-kiosk={kioskId}
      data-node-id="5168:9473"
      data-scroll-section="solution-second-group"
      style={{ background: 'transparent', overflow: 'visible' }}
    >
      {/* Gradient backdrop */}
      <div
        className="absolute top-[-296px] left-0 h-[5416px] w-full rounded-t-[100px]"
        style={{
          background: 'transparent',
          height: '14575px',
        }}
      />

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute top-[1080px] left-[-100px] z-[1] h-[1790px] w-[1790px]">
        <BlueDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="pointer-events-none absolute top-[970px] left-[1270px] z-[1] h-[890px] w-[890px] group-data-[kiosk=kiosk-3]/kiosk:top-[1050px] group-data-[kiosk=kiosk-3]/kiosk:left-[1330px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        <GreenDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      {/* Subheadline */}
      <h2 className="absolute top-[230px] left-[120px] w-[500px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
        {renderRegisteredMark(Array.isArray(subheadline) ? subheadline.join('\n') : subheadline)}
      </h2>

      {/* Solution label */}
      <div className="absolute relative top-[180px] top-[710px] left-[150px] flex group-data-[kiosk=kiosk-3]/kiosk:top-[720px] group-data-[kiosk=kiosk-3]/kiosk:left-[140px]">
        <div className="relative flex h-[200px] w-[200px] items-center justify-center" style={{ left: -55, top: 25 }}>
          <OutlinedDiamond aria-hidden="true" className="text-[#ededed]" focusable="false" />
        </div>
        <h1
          className="text-[126px] leading-[1.3] font-normal tracking-[-6.3px] whitespace-nowrap text-[#ededed]"
          style={{ left: -50, position: 'relative', top: 55 }}
        >
          {renderRegisteredMark(solutionLabel)}
        </h1>
      </div>

      {/* Title */}
      <p className="absolute top-[1600px] left-[240px] z-[1] text-[100px] leading-[1.3] font-normal tracking-[-5px] text-white">
        {renderRegisteredMark(title)}
      </p>

      {/* Timeline with steps */}
      <div className="absolute top-[1890px] left-[240px] z-[2] flex w-[1010px] flex-col gap-[60px] text-[60px] leading-[1.3] tracking-[-3px] text-[#ededed]">
        {timelineSteps.map((step, index) => (
          <div key={`${step.label}-${index}`}>
            <div className={`flex gap-[120px] ${getOpacityClass(index)} group-data-[kiosk=kiosk-3]/kiosk:gap-[70px]`}>
              <p className="w-[120px]">{renderRegisteredMark(step.label)}</p>
              <p className="w-[1620px]">{renderRegisteredMark(step.description)}</p>
            </div>
            {index < timelineSteps.length - 1 ? (
              <div className="mt-[30px] ml-[140px]">
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
      <div className="absolute top-[2210px] left-[1500px] z-[2]">
        <div className="relative top-[-140px] left-[-230px] h-[900px] w-[900px] rotate-[45deg] overflow-hidden rounded-[80px] group-data-[kiosk=kiosk-3]/kiosk:top-[-130px] group-data-[kiosk=kiosk-3]/kiosk:left-[-160px] group-data-[kiosk=kiosk-3]/kiosk:size-[800px]">
          <Image alt={heroImageAlt} className="-rotate-[45deg] object-cover" fill sizes="800px" src={heroImageSrc} />
        </div>
      </div>
    </div>
  );
};

export default SolutionSecondScreenTemplate;
