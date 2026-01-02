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
import {
  createSlide,
  createSlideWithoutHandlers,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slideFactory';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import { type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Builds the slides for the Challenge section.
 * Simplified using the slide factory pattern for reduced boilerplate.
 */

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
    createSlideWithoutHandlers(
      {
        component: InitialScreenTemplate,
        id: 'challenge-initial',
        props: { ...initialScreen, onButtonClick: handleInitialButtonClick },
        title: 'Challenge Intro',
      },
      kioskId
    ),
    createSlide(
      {
        component: FirstScreenTemplate,
        id: 'challenge-first',
        props: challenges.firstScreen,
        title: 'Challenge Story',
      },
      { handlers, kioskId }
    ),
    createSlide(
      {
        component: SecondScreenTemplate,
        id: 'challenge-second',
        props: challenges.secondScreen,
        title: 'Challenge Stats',
      },
      { handlers, kioskId }
    ),
    createSlide(
      {
        component: ThirdScreenTemplate,
        id: 'challenge-third',
        props: challenges.thirdScreen,
        title: 'Challenge Impact',
      },
      { handlers, kioskId }
    ),
  ];
};
