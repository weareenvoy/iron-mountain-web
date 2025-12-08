'use client';

import challengeContent from '@public/api/kiosk-3.json';
import { useEffect, useState, type ReactElement } from 'react';

import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import FirstScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import SolutionFirstScreenTemplate, {
  type SolutionFirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/firstScreen/firstScreenTemplate';
import SolutionSecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/secondScreen/secondScreenTemplate';
import SolutionThirdScreenTemplate, {
  type SolutionThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/thirdScreen/thirdScreenTemplate';
import SolutionFourthScreenTemplate, {
  type SolutionFourthScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/fourthScreen/fourthScreenTemplate';
import ThirdScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import solutionContent from '../solutions.json';
// import styles from './kiosk-3.module.css';

type Slide = { id: string; render: () => ReactElement; title: string };

type SolutionSlidesConfig = {
  firstScreen?: SolutionFirstScreenTemplateProps;
  secondScreen?: Parameters<typeof SolutionSecondScreenTemplate>[0];
  thirdScreen?: SolutionThirdScreenTemplateProps;
  fourthScreen?: SolutionFourthScreenTemplateProps;
};

const formatTitle = (value: string | string[] | undefined, fallback: string) =>
  Array.isArray(value) ? value.join(' ') : value ?? fallback;

const Kiosk3View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(challengeContent, 'kiosk-3');
  const solutions = solutionContent as SolutionSlidesConfig;

  const challengeSlides: Slide[] = [
    {
      id: 'challenge-initial',
      title: 'Challenge Intro',
      render: () => (
        <InitialScreenTemplate
          {...challenges.initialScreen}
          contentBoxBgColor="#00A88E"
          kioskId="kiosk-3"
        />
      ),
    },
    {
      id: 'challenge-first',
      title: 'Challenge Story',
      render: () => (
        <FirstScreenTemplate
          {...challenges.firstScreen}
          kioskId="kiosk-3"
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
          kioskId="kiosk-3"
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
          kioskId="kiosk-3"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    },
  ];

  const buildSolutionSlides = (): Slide[] => {
    const result: Slide[] = [];
    if (solutions.firstScreen) {
      result.push({
        id: 'solution-first',
      title: formatTitle(solutions.firstScreen.title, 'Solution Intro'),
        render: () => <SolutionFirstScreenTemplate {...solutions.firstScreen!} />,
      });
    }
    if (solutions.secondScreen) {
      result.push({
        id: 'solution-second',
        title: formatTitle(solutions.secondScreen.title ?? solutions.thirdScreen?.title, 'Solution Step 1'),
        render: () => (
          <SolutionSecondScreenTemplate
            {...solutions.secondScreen}
            kioskId="kiosk-3"
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        ),
      });
    }
    const kioskThreeDetailScreen = solutions.fourthScreen ?? solutions.thirdScreen;
    if (kioskThreeDetailScreen) {
      const useFourthTemplate = Boolean(solutions.fourthScreen);
      result.push({
        id: useFourthTemplate ? 'solution-fourth' : 'solution-third',
        title: formatTitle(
          kioskThreeDetailScreen.title,
          useFourthTemplate ? 'Solution Details' : 'Solution Walkthrough',
        ),
        render: () =>
          useFourthTemplate ? (
            <SolutionFourthScreenTemplate
              {...(kioskThreeDetailScreen as SolutionFourthScreenTemplateProps)}
              onNavigateDown={() => controller.next()}
              onNavigateUp={() => controller.prev()}
            />
          ) : (
            <SolutionThirdScreenTemplate
              {...(kioskThreeDetailScreen as SolutionThirdScreenTemplateProps)}
              onNavigateDown={() => controller.next()}
              onNavigateUp={() => controller.prev()}
            />
          ),
      });
    }
    return result;
  };

  const slides = [...challengeSlides, ...buildSolutionSlides()];

  useEffect(() => {
    controller.setRootHandlers({
      goTo: (i: number) => {
        setTopIndex(Math.max(0, Math.min(i, slides.length - 1)));
        return true;
      },
      next: () => {
        setTopIndex((i: number) => Math.min(i + 1, slides.length - 1));
        return true;
      },
      prev: () => {
        setTopIndex((i: number) => Math.max(i - 1, 0));
        return true;
      },
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
        {slides.map((slide, idx) => (
          <section
            // className={styles.slide}
            className="flex h-full w-full flex-col items-center justify-center"
            data-active={idx === topIndex}
            key={slide.id}
          >
            {slide.render()}
          </section>
        ))}
      </div>
      <div
        // className={styles.debugControls}
        className="absolute right-[12px] bottom-[12px] z-[1000] flex gap-2"
      >
        <button onClick={() => controller.prev()}>Prev</button>
        <button onClick={() => controller.next()}>Next</button>
      </div>
    </div>
  );
};

Kiosk3View.displayName = 'Kiosk3View';

export default Kiosk3View;
