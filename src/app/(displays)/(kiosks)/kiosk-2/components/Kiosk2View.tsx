'use client';

import challengeContent from '@public/api/kiosk-2.json';
import { useEffect, useState, type ReactElement } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import FirstScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import SolutionFirstScreenTemplate, {
  type SolutionFirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/firstScreen/firstScreenTemplate';
import SolutionFourthScreenTemplate, {
  type SolutionFourthScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/fourthScreen/fourthScreenTemplate';
import SolutionSecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/secondScreen/secondScreenTemplate';
import SolutionThirdScreenTemplate, {
  type SolutionThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/thirdScreen/thirdScreenTemplate';
import ValueCarouselTemplate, {
  type ValueCarouselTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueCarouselTemplate';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import solutionContent from '../solutions.json';
import valueContent from '../values.json';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-2.module.css';

type Slide = { id: string; render: () => ReactElement; title: string };

type SolutionSlidesConfig = {
  firstScreen?: SolutionFirstScreenTemplateProps;
  fourthScreen?: SolutionFourthScreenTemplateProps;
  secondScreen?: Parameters<typeof SolutionSecondScreenTemplate>[0];
  secondScreens?: Parameters<typeof SolutionSecondScreenTemplate>[0][];
  thirdScreen?: SolutionThirdScreenTemplateProps;
};

type ValueSlidesConfig = {
  valueScreens?: Omit<ValueCarouselTemplateProps, 'onNavigateDown' | 'onNavigateUp'>[];
};

const formatTitle = (value: string | string[] | undefined, fallback: string) =>
  Array.isArray(value) ? value.join(' ') : (value ?? fallback);

const Kiosk2View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(challengeContent, 'kiosk-2');
  const solutions = solutionContent as SolutionSlidesConfig;
  const values = valueContent as ValueSlidesConfig;

  const challengeSlides: Slide[] = [
    {
      id: 'challenge-initial',
      render: () => (
        <InitialScreenTemplate {...challenges.initialScreen} contentBoxBgColor="#8DC13F" kioskId="kiosk-2" />
      ),
      title: 'Challenge Intro',
    },
    {
      id: 'challenge-first',
      render: () => (
        <FirstScreenTemplate
          {...challenges.firstScreen}
          kioskId="kiosk-2"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: 'Challenge Story',
    },
    {
      id: 'challenge-second',
      render: () => (
        <SecondScreenTemplate
          {...challenges.secondScreen}
          kioskId="kiosk-2"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: 'Challenge Stats',
    },
    {
      id: 'challenge-third',
      render: () => (
        <ThirdScreenTemplate
          {...challenges.thirdScreen}
          kioskId="kiosk-2"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: 'Challenge Impact',
    },
  ];

  const buildSolutionSlides = (): Slide[] => {
    const result: Slide[] = [];

    if (solutions.firstScreen) {
      result.push({
        id: 'solution-first',
        render: () => <SolutionFirstScreenTemplate {...solutions.firstScreen!} />,
        title: formatTitle(solutions.firstScreen.title, 'Solution Intro'),
      });
    }

    const secondScreens =
      solutions.secondScreens && solutions.secondScreens.length > 0
        ? solutions.secondScreens
        : solutions.secondScreen
          ? [solutions.secondScreen]
          : [];

    secondScreens.forEach((config, idx) => {
      result.push({
        id: `solution-second-${idx}`,
        render: () => (
          <SolutionSecondScreenTemplate
            {...config}
            kioskId="kiosk-2"
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        ),
        title: formatTitle(config.title, `Solution Step ${idx + 1}`),
      });
    });

    if (solutions.thirdScreen) {
      result.push({
        id: 'solution-third',
        render: () => (
          <SolutionThirdScreenTemplate
            {...solutions.thirdScreen}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        ),
        title: formatTitle(solutions.thirdScreen.title, 'Solution Walkthrough'),
      });
    }

    if (solutions.fourthScreen) {
      result.push({
        id: 'solution-fourth',
        render: () => (
          <SolutionFourthScreenTemplate
            {...solutions.fourthScreen}
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        ),
        title: formatTitle(solutions.fourthScreen.title, 'Solution Details'),
      });
    }

    return result;
  };

  const valueSlides =
    values.valueScreens?.map((config, idx) => ({
      id: `value-${idx}`,
      render: () => (
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `kiosk-2-value-${idx}`}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
    })) ?? [];

  const slides = [...challengeSlides, ...buildSolutionSlides(), ...valueSlides];

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
  }, [controller, slides.length]);

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

Kiosk2View.displayName = 'Kiosk2View';

export default Kiosk2View;
