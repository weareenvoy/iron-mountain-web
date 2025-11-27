'use client';
import { useEffect, useState, type ReactElement } from 'react';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import InitialScreenTemplate, {
  type InitialScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import FirstScreenTemplate, {
  type FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import SecondScreenTemplate, {
  type SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate, {
  type ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import SolutionFirstScreenTemplate, {
  type SolutionFirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/firstScreen/firstScreenTemplate';
import SolutionSecondScreenTemplate, {
  type SolutionSecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/secondScreen/secondScreenTemplate';
import SolutionThirdScreenTemplate, {
  type SolutionThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/thirdScreen/thirdScreenTemplate';
import SolutionFourthScreenTemplate, {
  type SolutionFourthScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/fourthScreen/fourthScreenTemplate';
import challengeContent from '../challenges.json';
import solutionContent from '../solutions.json';
// import styles from './kiosk-1.module.css';

type Slide = { hasCarousel?: boolean; id: string; render: () => ReactElement; title: string };

type ChallengeSlidesConfig = {
  firstScreen: FirstScreenTemplateProps;
  initialScreen: InitialScreenTemplateProps;
  secondScreen: SecondScreenTemplateProps;
  thirdScreen: ThirdScreenTemplateProps;
};

type SolutionSlidesConfig = {
  firstScreen?: SolutionFirstScreenTemplateProps;
  secondScreen?: SolutionSecondScreenTemplateProps;
  secondScreens?: SolutionSecondScreenTemplateProps[];
  thirdScreen?: SolutionThirdScreenTemplateProps;
  fourthScreen?: SolutionFourthScreenTemplateProps;
};

export default function Kiosk1View() {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges = challengeContent as unknown as ChallengeSlidesConfig;
  const solutions = solutionContent as unknown as SolutionSlidesConfig;

  const challengeSlides: Slide[] = [
    {
      id: 'challenge-initial',
      title: 'Challenge Intro',
      render: () => <InitialScreenTemplate {...challenges.initialScreen} />,
    },
    {
      hasCarousel: true,
      id: 'challenge-first',
      title: 'Challenge Story',
      render: () => (
        <FirstScreenTemplate
          {...challenges.firstScreen}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    },
    {
      id: 'challenge-second',
      title: 'Challenge Stats',
      render: () => (
        <SecondScreenTemplate
          {...challenges.secondScreen}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    },
    {
      id: 'challenge-third',
      title: 'Challenge Impact',
      render: () => (
        <ThirdScreenTemplate
          {...challenges.thirdScreen}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    },
  ];

  const solutionSlides: Slide[] = [];

  if (solutions.firstScreen) {
    solutionSlides.push({
      id: 'solution-first',
      title: solutions.firstScreen.title ?? 'Solution Intro',
      render: () => <SolutionFirstScreenTemplate {...solutions.firstScreen!} />,
    });
  }

  const secondScreens =
    (solutions.secondScreens && solutions.secondScreens.length > 0
      ? solutions.secondScreens
      : solutions.secondScreen
        ? [solutions.secondScreen]
        : []) ?? [];

  secondScreens.forEach((config, idx) => {
    solutionSlides.push({
      id: `solution-second-${idx}`,
      title: config.title ?? `Solution Step ${idx + 1}`,
      render: () => (
        <SolutionSecondScreenTemplate
          {...config}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    });
  });

  if (solutions.thirdScreen) {
    solutionSlides.push({
      id: 'solution-third',
      title: solutions.thirdScreen.title ?? 'Solution Walkthrough',
      render: () => (
        <SolutionThirdScreenTemplate
          {...solutions.thirdScreen}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    });
  }

  if (solutions.fourthScreen) {
    solutionSlides.push({
      id: 'solution-fourth',
      title: solutions.fourthScreen.title ?? 'Solution Details',
      render: () => (
        <SolutionFourthScreenTemplate
          {...solutions.fourthScreen}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    });
  }

  const slides = [...challengeSlides, ...solutionSlides];

  // Register root handlers for parallax navigation
  useEffect(() => {
    controller.setRootHandlers({
      next: () => {
        setTopIndex((i: number) => Math.min(i + 1, slides.length - 1));
        return true;
      },
      prev: () => {
        setTopIndex((i: number) => Math.max(i - 1, 0));
        return true;
      },
      goTo: (i: number) => {
        setTopIndex(Math.max(0, Math.min(i, slides.length - 1)));
        return true;
      }
    });
    return () => controller.setRootHandlers(null);
  }, [controller]);

  return (
    <div
      // className={styles.root}
      className="relative h-full w-full"
    >
      <div
        // className={styles.parallaxContainer}
        className="h-full w-full"
        data-top-index={topIndex}
      >
        {slides.map((s, idx) => (
          <section
            key={s.id}
            // className={styles.slide}
            className="flex h-full w-full flex-col items-center justify-center"
            data-active={idx === topIndex}
          >
            {s.render()}
          </section>
        ))}
      </div>
      <div
        // className={styles.debugControls}
        className="absolute bottom-[12px] right-[12px] z-[1000] flex gap-2"
      >
        <button onClick={() => controller.prev()}>Prev</button>
        <button onClick={() => controller.next()}>Next</button>
      </div>
    </div>
  );
}
