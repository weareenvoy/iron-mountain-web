'use client';

import hardCodedContent from '@public/api/kiosk-3-hardcoded.json';
import challengeContent from '@public/api/kiosk-3-challenges.json';
import solutionContent from '@public/api/kiosk-3-solutions.json';
import valueContent from '@public/api/kiosk-3-values.json';
import { useEffect, useState, type ReactElement } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import FirstScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import HardCodedFirstScreenTemplate, {
  type HardCodedKiosk3FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/firstScreenTemplate';
import HardCodedFourthScreenTemplate, {
  type HardCodedKiosk3FourthScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/fourthScreenTemplate';
import HardCodedSecondScreenTemplate, {
  type HardCodedKiosk3SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/secondScreenTemplate';
import HardCodedThirdScreenTemplate, {
  type HardCodedKiosk3ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/thirdScreenTemplate';
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
// import styles from './kiosk-3.module.css';



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
  firstScreen?: HardCodedKiosk3FirstScreenTemplateProps;
  fourthScreen?: HardCodedKiosk3FourthScreenTemplateProps;
  secondScreen?: HardCodedKiosk3SecondScreenTemplateProps;
  thirdScreen?: HardCodedKiosk3ThirdScreenTemplateProps;
};


const formatTitle = (value: string | string[] | undefined, fallback: string) =>
  Array.isArray(value) ? value.join(' ') : (value ?? fallback);

const Kiosk3View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(challengeContent, 'kiosk-3');
  const solutions = solutionContent as SolutionSlidesConfig;
  const values = valueContent as ValueSlidesConfig;
  const hardCoded = hardCodedContent as HardCodedSlidesConfig;

  const challengeSlides: Slide[] = [
    {
      id: 'challenge-initial',
      render: () => (
        <InitialScreenTemplate {...challenges.initialScreen} contentBoxBgColor="#00A88E" kioskId="kiosk-3" />
      ),
      title: 'Challenge Intro',
    },
    {
      id: 'challenge-first',
      render: () => (
        <FirstScreenTemplate
          {...challenges.firstScreen}
          kioskId="kiosk-3"
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
          kioskId="kiosk-3"
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
          kioskId="kiosk-3"
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
            kioskId="kiosk-3"
            onNavigateDown={() => controller.next()}
            onNavigateUp={() => controller.prev()}
          />
        ),
        title: formatTitle(config.title, `Solution Step ${idx + 1}`),
      });
    });

    const kioskThreeDetailScreen = solutions.fourthScreen ?? solutions.thirdScreen;
    if (kioskThreeDetailScreen) {
      const useFourthTemplate = Boolean(solutions.fourthScreen);
      result.push({
        id: useFourthTemplate ? 'solution-fourth' : 'solution-third',
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
              kioskId="kiosk-3"
              onNavigateDown={() => controller.next()}
              onNavigateUp={() => controller.prev()}
            />
          ),
        title: formatTitle(
          kioskThreeDetailScreen.title,
          useFourthTemplate ? 'Solution Details' : 'Solution Walkthrough'
        ),
      });
    }

    return result;
  };
  const solutionSlides = buildSolutionSlides();

  const valueSlides =
    values.valueScreens?.map((config, idx) => ({
      id: `value-${idx}`,
      render: () => (
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `kiosk-3-value-${idx}`}
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
    {
      id: 'hardcoded-fourth',
      render: () => <HardCodedFourthScreenTemplate {...(hardCoded.fourthScreen ?? {})} />,
      title: 'Hardcoded Fourth',
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
