'use client';

import kioskContent from '@public/api/kiosk-3.json';
import { Fragment, useEffect, useState } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeTemplate';
import {
  buildHardcodedSlides,
  type HardCodedScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/hardCodedTemplate';
import {
  buildSolutionSlides,
  type SolutionScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionTemplate';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import {
  buildValueSlides,
  type ValueScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueTemplate';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-3.module.css';

const Kiosk3View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(kioskContent.challenges, 'kiosk-3');
  const solutions = kioskContent.solutions as SolutionScreens;
  const values = kioskContent.value as ValueScreens;
  const hardCoded = kioskContent.hardcoded as HardCodedScreens;

  const slides: Slide[] = [
    ...buildChallengeSlides(challenges, 'kiosk-3', controller, {
      initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#00A88E' },
    }),
    ...buildSolutionSlides(solutions, 'kiosk-3', controller),
    ...buildValueSlides(values, 'kiosk-3', controller),
    ...buildHardcodedSlides(hardCoded, 'kiosk-3', controller),
  ];
  const challengeCount = buildChallengeSlides(challenges, 'kiosk-3', controller, {
    initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#00A88E' },
  }).length;
  const solutionCount = buildSolutionSlides(solutions, 'kiosk-3', controller).length;
  const valueCount = buildValueSlides(values, 'kiosk-3', controller).length;

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
      <div className="h-full w-full" data-top-index={topIndex}>
        <section className="h-full w-full" data-section="challenges">
          {slides.slice(0, challengeCount).map((slide, idx) => (
            <Fragment key={slide.id}>{slide.render(idx === topIndex)}</Fragment>
          ))}
        </section>
        <section className="h-full w-full" data-section="solutions">
          {slides.slice(challengeCount, challengeCount + solutionCount).map((slide, idx) => (
            <Fragment key={slide.id}>{slide.render(challengeCount + idx === topIndex)}</Fragment>
          ))}
        </section>
        <section className="h-full w-full" data-section="value">
          {slides
            .slice(challengeCount + solutionCount, challengeCount + solutionCount + valueCount)
            .map((slide, idx) => (
              <Fragment key={slide.id}>{slide.render(challengeCount + solutionCount + idx === topIndex)}</Fragment>
            ))}
        </section>
        <section className="h-full w-full" data-section="hardcoded">
          {slides.slice(challengeCount + solutionCount + valueCount).map((slide, idx) => (
            <Fragment key={slide.id}>
              {slide.render(challengeCount + solutionCount + valueCount + idx === topIndex)}
            </Fragment>
          ))}
        </section>
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
