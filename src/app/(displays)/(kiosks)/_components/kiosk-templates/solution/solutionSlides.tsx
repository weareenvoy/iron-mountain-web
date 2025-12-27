import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
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

// This file builds the slides for the Solution section of the Kiosk setup and gives each one ids for use if needed.

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
  handlers: { currentScrollTarget: null | string; onNavigateDown: () => void; onNavigateUp: () => void }
): Slide[] => {
  const slides: Slide[] = [];

  if (solutions.firstScreen) {
    slides.push({
      id: 'solution-first',
      render: () => (
        <SectionSlide>
          <SolutionFirstScreenTemplate
            {...solutions.firstScreen}
            kioskId={kioskId}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: solutions.firstScreen.headline ?? '',
    });
  }

  const secondScreens =
    solutions.secondScreens && solutions.secondScreens.length > 0
      ? solutions.secondScreens
      : solutions.secondScreen
        ? [solutions.secondScreen]
        : [];

  secondScreens.forEach((config, idx) => {
    slides.push({
      id: `solution-second-${idx}`,
      render: () => (
        <SectionSlide>
          <SolutionSecondScreenTemplate
            {...config}
            currentScrollTarget={handlers.currentScrollTarget}
            kioskId={kioskId}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: config.numberedListHeadline
        ? Array.isArray(config.numberedListHeadline)
          ? config.numberedListHeadline.join(' ')
          : config.numberedListHeadline
        : `Solution Step ${idx + 1}`,
    });
  });

  if (solutions.thirdScreen && !solutions.fourthScreen) {
    slides.push({
      id: 'solution-third',
      render: () => (
        <SectionSlide>
          <SolutionThirdScreenTemplate
            {...solutions.thirdScreen}
            kioskId={kioskId}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: solutions.thirdScreen.headline ?? '',
    });
  }

  if (solutions.fourthScreen) {
    slides.push({
      id: 'solution-fourth',
      render: () => (
        <SectionSlide>
          <SolutionFourthScreenTemplate
            {...solutions.fourthScreen}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
          />
        </SectionSlide>
      ),
      title: solutions.fourthScreen.headline ?? '',
    });
  }

  return slides;
};
