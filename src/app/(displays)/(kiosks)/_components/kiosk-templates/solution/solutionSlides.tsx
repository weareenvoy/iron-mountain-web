import { createSlide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slideFactory';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import SolutionFirstScreenTemplate, {
  type SolutionFirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/firstScreen/firstScreenTemplate';
import SolutionFourthScreenTemplate, {
  type SolutionFourthScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/fourthScreen/fourthScreenTemplate';
import SolutionSecondScreenTemplate, {
  type SolutionSecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/secondScreen/secondScreenTemplate';
import SolutionThirdScreenTemplate, {
  type SolutionThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/thirdScreen/thirdScreenTemplate';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Builds the slides for the Solution section.
 * Simplified using the slide factory pattern for reduced boilerplate.
 */

export type SolutionScreens = {
  readonly firstScreen?: SolutionFirstScreenTemplateProps;
  readonly fourthScreen?: SolutionFourthScreenTemplateProps;
  readonly secondScreen?: SolutionSecondScreenTemplateProps;
  readonly secondScreens?: SolutionSecondScreenTemplateProps[];
  readonly thirdScreen?: SolutionThirdScreenTemplateProps;
};

export const buildSolutionSlides = (
  solutions: SolutionScreens,
  kioskId: KioskId,
  handlers: { onNavigateDown: () => void; onNavigateUp: () => void }
): Slide[] => {
  const slides: Slide[] = [];
  const options = { handlers, kioskId };

  // First screen
  if (solutions.firstScreen) {
    slides.push(
      createSlide(
        {
          component: SolutionFirstScreenTemplate,
          id: 'solution-first',
          props: solutions.firstScreen,
          title: solutions.firstScreen.headline ?? '',
        },
        options
      )
    );
  }

  // Second screen(s) - can be single or multiple
  const secondScreens =
    solutions.secondScreens && solutions.secondScreens.length > 0
      ? solutions.secondScreens
      : solutions.secondScreen
        ? [solutions.secondScreen]
        : [];

  secondScreens.forEach((config, idx) => {
    slides.push(
      createSlide(
        {
          component: SolutionSecondScreenTemplate,
          id: `solution-second-${idx}`,
          props: config,
          title: config.numberedListHeadline
            ? Array.isArray(config.numberedListHeadline)
              ? config.numberedListHeadline.join(' ')
              : config.numberedListHeadline
            : `Solution Step ${idx + 1}`,
        },
        options
      )
    );
  });

  // Third screen (only if no fourth screen)
  if (solutions.thirdScreen && !solutions.fourthScreen) {
    slides.push(
      createSlide(
        {
          component: SolutionThirdScreenTemplate,
          id: 'solution-third',
          props: solutions.thirdScreen,
          title: solutions.thirdScreen.headline ?? '',
        },
        options
      )
    );
  }

  // Fourth screen (replaces third if present)
  if (solutions.fourthScreen) {
    slides.push(
      createSlide(
        {
          component: SolutionFourthScreenTemplate,
          id: 'solution-fourth',
          props: solutions.fourthScreen,
          title: solutions.fourthScreen.headline ?? '',
        },
        options
      )
    );
  }

  return slides;
};
