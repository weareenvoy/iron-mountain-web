'use client';

import { Fragment, useEffect, useState } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeTemplate';
import {
  buildHardcodedSlides,
  type HardCodedScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/hardCodedTemplate';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import {
  buildSolutionSlides,
  type SolutionScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionTemplate';
import {
  buildValueSlides,
  type ValueScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueTemplate';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-3.module.css';

const Kiosk3View = () => {
  const controller: Controller = useKioskController();
  const { data: kioskData, error, loading } = useKiosk();
  const [topIndex, setTopIndex] = useState(0);

  // Prepare data (with safe defaults for loading state)
  const challenges: KioskChallenges | null = kioskData ? parseKioskChallenges(kioskData.challenges, 'kiosk-3') : null;
  const solutions = (kioskData?.solutions as SolutionScreens | undefined) || null;
  const values = (kioskData?.value as undefined | ValueScreens) || null;
  const hardCoded = (kioskData?.hardcoded as HardCodedScreens | undefined) || null;

  const slides: Slide[] =
    challenges && solutions && values && hardCoded
      ? [
          ...buildChallengeSlides(challenges, 'kiosk-3', controller, {
            initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#00A88E' },
          }),
          ...buildSolutionSlides(solutions, 'kiosk-3', controller),
          ...buildValueSlides(values, 'kiosk-3', controller),
          ...buildHardcodedSlides(hardCoded, 'kiosk-3'),
        ]
      : [];

  const challengeCount = challenges
    ? buildChallengeSlides(challenges, 'kiosk-3', controller, {
        initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#00A88E' },
      }).length
    : 0;
  const solutionCount = solutions ? buildSolutionSlides(solutions, 'kiosk-3', controller).length : 0;
  const valueCount = values ? buildValueSlides(values, 'kiosk-3', controller).length : 0;

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (slides.length === 0) return;

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

  // Now safe to do conditional rendering after all hooks are called
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Loading kiosk data...</div>
      </div>
    );
  }

  if (error || !kioskData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-red-500">Error loading kiosk data: {error}</div>
      </div>
    );
  }

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
