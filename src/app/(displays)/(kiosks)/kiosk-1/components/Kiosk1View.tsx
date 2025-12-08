'use client';

import challengeContent from '@public/api/kiosk-1-challenges.json';
import solutionContent from '@public/api/kiosk-1-solutions.json';
import valueContent from '@public/api/kiosk-1-values.json';
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
import HardCodedKiosk1FirstScreenTemplate, {
  type HardCodedKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/firstScreenTemplate';
import HardCodedKiosk1InitialScreenTemplate, {
  type HardCodedKiosk1InitialScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/initialScreenTemplate';
import HardCodedKiosk1SecondScreenTemplate, {
  type HardCodedKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/secondScreenTemplate';
import HardCodedKiosk1ThirdScreenTemplate, {
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
import hardCodedContent from '../hardCoded.json';
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

type ChallengeSlidesConfig = {
  firstScreen: FirstScreenTemplateProps;
  initialScreen: InitialScreenTemplateProps;
  secondScreen: SecondScreenTemplateProps;
  thirdScreen: ThirdScreenTemplateProps;
};

type HardCodedSlidesConfig = {
  firstScreen?: HardCodedKiosk1FirstScreenTemplateProps;
  initialScreen?: HardCodedKiosk1InitialScreenTemplateProps;
  secondScreen?: HardCodedKiosk1SecondScreenTemplateProps;
  secondScreens?: HardCodedKiosk1SecondScreenTemplateProps[];
  thirdScreen?: HardCodedKiosk1ThirdScreenTemplateProps;
};

const formatTitle = (value: string | string[] | undefined, fallback: string) =>
  Array.isArray(value) ? value.join(' ') : (value ?? fallback);

export default function Kiosk1View() {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges = challengeContent as unknown as ChallengeSlidesConfig;
  const hardCoded = hardCodedContent as unknown as HardCodedSlidesConfig;
  const solutions = solutionContent as unknown as SolutionSlidesConfig;
  const values = valueContent as unknown as ValueSlidesConfig;

  const hardCodedSlides: Slide[] = [];

  if (hardCoded.initialScreen) {
    hardCodedSlides.push({
      id: 'hardcoded-initial',
      title: Array.isArray(hardCoded.initialScreen.headline)
        ? hardCoded.initialScreen.headline[0] ?? 'Hard-coded Initial'
        : hardCoded.initialScreen.headline ?? 'Hard-coded Initial',
      render: () => <HardCodedKiosk1InitialScreenTemplate {...hardCoded.initialScreen!} />,
    });
  }

  if (hardCoded.firstScreen) {
    hardCodedSlides.push({
      id: 'hardcoded-first',
      title: Array.isArray(hardCoded.firstScreen.headline)
        ? hardCoded.firstScreen.headline[0] ?? 'Hard-coded First'
        : hardCoded.firstScreen.headline ?? 'Hard-coded First',
      render: () => (
        <HardCodedKiosk1FirstScreenTemplate
          {...hardCoded.firstScreen!}
          onBackToMenu={() => controller.goTo(0)}
        />
      ),
    });
  }

  const hardCodedSecondScreens =
    (hardCoded.secondScreens && hardCoded.secondScreens.length > 0
      ? hardCoded.secondScreens
      : hardCoded.secondScreen
        ? [hardCoded.secondScreen]
        : []) ?? [];

  hardCodedSecondScreens.forEach((config, idx) => {
    hardCodedSlides.push({
      id: `hardcoded-second-${idx}`,
      title: Array.isArray(config.headline) ? config.headline[0] ?? `Hard-coded Second ${idx + 1}` : config.headline ?? `Hard-coded Second ${idx + 1}`,
      render: () => (
        <HardCodedKiosk1SecondScreenTemplate
          {...config}
          onBack={() => controller.prev()}
        />
      ),
    });
  });

  if (hardCoded.thirdScreen) {
    hardCodedSlides.push({
      id: 'hardcoded-third',
      title: Array.isArray(hardCoded.thirdScreen.headline)
        ? hardCoded.thirdScreen.headline[0] ?? 'Hard-coded Third'
        : hardCoded.thirdScreen.headline ?? 'Hard-coded Third',
      render: () => (
        <HardCodedKiosk1ThirdScreenTemplate
          {...hardCoded.thirdScreen!}
          onCta={() => controller.goTo(0)}
        />
      ),
    });
  }

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

  const valueSlides =
    values.valueScreens?.map((config, idx) => ({
      id: `value-${idx}`,
      title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
      render: () => (
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `kiosk-1-value-${idx}`}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      ),
    })) ?? [];

  const slides = [...challengeSlides, ...solutionSlides, ...valueSlides, ...hardCodedSlides];

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
