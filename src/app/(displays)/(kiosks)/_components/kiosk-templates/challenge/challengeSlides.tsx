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

// This file builds the slides for the Challenge section of the Kiosk setup and gives each one ids for use if needed.

export type ChallengeScreens = {
  readonly firstScreen?: FirstScreenTemplateProps;
  readonly initialScreen?: InitialScreenTemplateProps;
  readonly secondScreen?: SecondScreenTemplateProps;
  readonly thirdScreen?: ThirdScreenTemplateProps;
};

export const buildChallengeSlides = (
  challenges: KioskChallenges,
  kioskId: KioskId,
  handlers: { onNavigateDown: () => void; onNavigateUp: () => void },
  overrides?: Partial<ChallengeScreens> & { onInitialButtonClick?: () => void }
): Slide[] => {
  const initialScreen = { ...challenges.initialScreen, ...overrides?.initialScreen };

  const handleInitialButtonClick = () => {
    overrides?.onInitialButtonClick?.();
    handlers.onNavigateDown();
  };

  return [
    {
      id: 'challenge-initial',
      render: () => (
        <SectionSlide>
          <InitialScreenTemplate {...initialScreen} kioskId={kioskId} onButtonClick={handleInitialButtonClick} />
        </SectionSlide>
      ),
      title: 'Challenge Intro',
    },
    {
      id: 'challenge-first',
      render: () => (
        <SectionSlide>
          <FirstScreenTemplate
            {...challenges.firstScreen}
            kioskId={kioskId}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: 'Challenge Story',
    },
    {
      id: 'challenge-second',
      render: () => (
        <SectionSlide>
          <SecondScreenTemplate
            {...challenges.secondScreen}
            kioskId={kioskId}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: 'Challenge Stats',
    },
    {
      id: 'challenge-third',
      render: () => (
        <SectionSlide>
          <ThirdScreenTemplate
            {...challenges.thirdScreen}
            kioskId={kioskId}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: 'Challenge Impact',
    },
  ];
};
