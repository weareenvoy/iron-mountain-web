import { type Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import FirstScreenTemplate, {
  type FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate, {
  type InitialScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate, {
  type SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate, {
  type ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import { type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type ChallengeScreens = Readonly<{
  firstScreen?: FirstScreenTemplateProps;
  initialScreen?: InitialScreenTemplateProps;
  secondScreen?: SecondScreenTemplateProps;
  thirdScreen?: ThirdScreenTemplateProps;
}>;

export const buildChallengeSlides = (
  challenges: KioskChallenges,
  kioskId: KioskId,
  controller: Controller,
  overrides?: Partial<ChallengeScreens>
): Slide[] => {
  const initialScreen = { ...challenges.initialScreen, ...overrides?.initialScreen };

  return [
    {
      id: 'challenge-initial',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <InitialScreenTemplate {...initialScreen} kioskId={kioskId} onButtonClick={() => controller.next()} />
        </SectionSlide>
      ),
      title: 'Challenge Intro',
    },
    {
      id: 'challenge-first',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <FirstScreenTemplate
            {...challenges.firstScreen}
            kioskId={kioskId}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: 'Challenge Story',
    },
    {
      id: 'challenge-second',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <SecondScreenTemplate
            {...challenges.secondScreen}
            kioskId={kioskId}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: 'Challenge Stats',
    },
    {
      id: 'challenge-third',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <ThirdScreenTemplate
            {...challenges.thirdScreen}
            kioskId={kioskId}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: 'Challenge Impact',
    },
  ];
};
