import { type Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
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
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type SolutionScreens = Readonly<{
  firstScreen?: SolutionFirstScreenTemplateProps;
  fourthScreen?: SolutionFourthScreenTemplateProps;
  secondScreen?: SolutionSecondScreenTemplateProps;
  secondScreens?: SolutionSecondScreenTemplateProps[];
  thirdScreen?: SolutionThirdScreenTemplateProps;
}>;

export const buildSolutionSlides = (solutions: SolutionScreens, kioskId: KioskId, controller: Controller): Slide[] => {
  const slides: Slide[] = [];

  if (solutions.firstScreen) {
    slides.push({
      id: 'solution-first',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <SolutionFirstScreenTemplate
            {...solutions.firstScreen}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: solutions.firstScreen.title ?? 'Solution Intro',
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
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <SolutionSecondScreenTemplate
            {...config}
            kioskId={kioskId}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: config.title
        ? Array.isArray(config.title)
          ? config.title.join(' ')
          : config.title
        : `Solution Step ${idx + 1}`,
    });
  });

  if (solutions.thirdScreen && !solutions.fourthScreen) {
    slides.push({
      id: 'solution-third',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <SolutionThirdScreenTemplate
            {...solutions.thirdScreen}
            kioskId={kioskId}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: solutions.thirdScreen.title ?? 'Solution Walkthrough',
    });
  }

  if (solutions.fourthScreen) {
    slides.push({
      id: 'solution-fourth',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <SolutionFourthScreenTemplate
            {...solutions.fourthScreen}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        </SectionSlide>
      ),
      title: solutions.fourthScreen.title ?? 'Solution Details',
    });
  }

  return slides;
};
