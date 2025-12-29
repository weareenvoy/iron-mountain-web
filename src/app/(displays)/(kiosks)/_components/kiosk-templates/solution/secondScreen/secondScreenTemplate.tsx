import Image from 'next/image';
import AnimatedNumberedList from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/secondScreen/AnimatedNumberedList';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
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
  readonly image?: string;
  readonly kioskId?: KioskId;
  readonly labelText?: string;
  readonly numberedListHeadline?: string;
  readonly onRegisterListHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly stepFourDescription?: string;
  readonly stepFourLabel?: string;
  readonly stepOneDescription?: string;
  readonly stepOneLabel?: string;
  readonly stepThreeDescription?: string;
  readonly stepThreeLabel?: string;
  readonly stepTwoDescription?: string;
  readonly stepTwoLabel?: string;
  readonly subheadline?: string;
};

type SolutionSecondScreenStepsProps = {
  readonly steps?: StepConfig[];
  readonly stepsDividerHeights?: number[];
};

const SolutionSecondScreenTemplate = ({
  heroImageAlt,
  heroImageSrc,
  kioskId,
  labelText,
  numberedListHeadline,
  onRegisterListHandlers,
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

  return (
    <div
      className="group/kiosk relative flex h-screen w-full flex-col overflow-visible bg-transparent"
      data-kiosk={kioskId}
      data-scroll-section="solution-second-group"
    >
      {/* Gradient backdrop */}
      <div className="absolute top-[-296px] left-0 h-[14575px] w-full rounded-t-[100px] bg-transparent" />

      {/* Decorative diamonds */}
      <div className="pointer-events-none absolute top-[1080px] left-[-100px] z-1 h-[1790px] w-[1790px]">
        <BlueDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="pointer-events-none absolute top-[970px] left-[1270px] z-1 h-[890px] w-[890px] group-data-[kiosk=kiosk-2]/kiosk:top-[1040px] group-data-[kiosk=kiosk-2]/kiosk:left-[1330px] group-data-[kiosk=kiosk-2]/kiosk:size-[800px] group-data-[kiosk=kiosk-3]/kiosk:top-[1050px] group-data-[kiosk=kiosk-3]/kiosk:left-[1330px] group-data-[kiosk=kiosk-3]/kiosk:size-[810px]">
        <GreenDiamondSecond aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      {/* Subheadline */}
      <h2 className="absolute top-[230px] left-[120px] z-1 w-[500px] text-[60px] leading-[1.4] font-normal tracking-[-3px] whitespace-pre-line text-[#ededed]">
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
      <p className="absolute top-[1600px] left-[240px] z-1 text-[100px] leading-[1.3] font-normal tracking-[-5px] text-white group-data-[kiosk=kiosk-2]/kiosk:top-[1570px] group-data-[kiosk=kiosk-2]/kiosk:left-[250px]">
        {renderRegisteredMark(numberedListHeadline)}
      </p>

      {/* Animated Timeline with steps */}
      <AnimatedNumberedList
        dividerHeights={dividerHeights}
        onRegisterHandlers={onRegisterListHandlers}
        steps={timelineSteps}
      />

      {/* Hero media diamond */}
      <div className="absolute top-[2210px] left-[1500px] z-2">
        <div className="relative top-[-140px] left-[-230px] h-[900px] w-[900px] rotate-45 overflow-hidden rounded-[80px] group-data-[kiosk=kiosk-2]/kiosk:top-[-160px] group-data-[kiosk=kiosk-2]/kiosk:left-[-180px] group-data-[kiosk=kiosk-2]/kiosk:size-[810px] group-data-[kiosk=kiosk-3]/kiosk:top-[-130px] group-data-[kiosk=kiosk-3]/kiosk:left-[-160px] group-data-[kiosk=kiosk-3]/kiosk:size-[800px]">
          {heroImageSrc && (
            <Image
              alt={heroImageAlt || ''}
              className="-rotate-45 object-cover"
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
