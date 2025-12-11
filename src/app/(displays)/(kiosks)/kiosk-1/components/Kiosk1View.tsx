'use client';

import challengeContent from '@public/api/kiosk-1-challenges.json';
import hardCodedContent from '@public/api/kiosk-1-hardcoded.json';
import solutionContent from '@public/api/kiosk-1-solutions.json';
import valueContent from '@public/api/kiosk-1-values.json';
import { useEffect, useState, type ReactElement } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import FirstScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import HardCodedFirstScreenTemplate, {
  type HardCodedKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/firstScreenTemplate';
import HardCodedSecondScreenTemplate, {
  type HardCodedKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/secondScreenTemplate';
import HardCodedThirdScreenTemplate, {
  type HardCodedKiosk1ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/thirdScreenTemplate';
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
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-1.module.css';

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
type HardCodedSlidesConfig = {
  firstScreen?: HardCodedKiosk1FirstScreenTemplateProps;
  secondScreen?: HardCodedKiosk1SecondScreenTemplateProps;
  thirdScreen?: HardCodedKiosk1ThirdScreenTemplateProps;
};

const formatTitle = (value: string | string[] | undefined, fallback: string) =>
  Array.isArray(value) ? value.join(' ') : (value ?? fallback);

const Kiosk1View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(challengeContent, 'kiosk-1');
  const solutions = solutionContent as SolutionSlidesConfig;
  const values = valueContent as ValueSlidesConfig;
  const hardCoded = hardCodedContent as HardCodedSlidesConfig;

  const challengeSlides: Slide[] = [
    {
      id: 'challenge-initial',
      render: () => <InitialScreenTemplate {...challenges.initialScreen} kioskId="kiosk-1" />,
      title: 'Challenge Intro',
    },
    {
      id: 'challenge-first',
      render: () => (
        <FirstScreenTemplate
          {...challenges.firstScreen}
          kioskId="kiosk-1"
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
          kioskId="kiosk-1"
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
          kioskId="kiosk-1"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: 'Challenge Impact',
    },
  ];

  const solutionSlides: Slide[] = [];

  if (solutions.firstScreen) {
    solutionSlides.push({
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
    solutionSlides.push({
      id: `solution-second-${idx}`,
      render: () => (
        <SolutionSecondScreenTemplate
          {...config}
          kioskId="kiosk-1"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: formatTitle(config.title, `Solution Step ${idx + 1}`),
    });
  });

  if (solutions.thirdScreen) {
    solutionSlides.push({
      id: 'solution-third',
      render: () => (
        <SolutionThirdScreenTemplate
          {...solutions.thirdScreen}
          kioskId="kiosk-1"
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: formatTitle(solutions.thirdScreen.title, 'Solution Walkthrough'),
    });
  }

  if (solutions.fourthScreen) {
    solutionSlides.push({
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

  const valueSlides =
    values.valueScreens?.map((config, idx) => ({
      id: `value-${idx}`,
      render: () => (
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `kiosk-1-value-${idx}`}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
      title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
    })) ?? [];

  const hardCodedSlides: Slide[] = [
    {
      id: 'hardcoded-first',
      render: () => <HardCodedFirstScreenTemplate {...(hardCoded.firstScreen ?? {})} />,
      title: 'Hardcoded First',
    },
    {
      id: 'hardcoded-second',
      render: () => <HardCodedSecondScreenTemplate {...(hardCoded.secondScreen ?? {})} />,
      title: 'Hardcoded Second',
    },
    {
      id: 'hardcoded-third',
      render: () => <HardCodedThirdScreenTemplate {...(hardCoded.thirdScreen ?? {})} />,
      title: 'Hardcoded Third',
    },
  ];

  const slides = [...challengeSlides, ...solutionSlides, ...valueSlides, ...hardCodedSlides];

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
        {slides.map((s, idx) => (
          <section
            // className={styles.slide}
            className="flex h-full w-full flex-col items-center justify-center"
            data-active={idx === topIndex}
            key={s.id}
          >
            {s.render()}
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

Kiosk1View.displayName = 'Kiosk1View';

export default Kiosk1View;
