'use client';

import { Fragment, useEffect, useState } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeTemplate';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import {
  buildSolutionSlides,
  type SolutionScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionTemplate';
import {
  buildValueSlides,
  type ValueScreens,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueTemplate';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-2.module.css';

const Kiosk2View = () => {
  const controller: Controller = useKioskController();
  const { data: kioskData, loading, error } = useKiosk();
  const [topIndex, setTopIndex] = useState(0);

  // Prepare data (with safe defaults for loading state)
  const challenges: KioskChallenges | null = kioskData ? parseKioskChallenges(kioskData.challenges, 'kiosk-2') : null;
  const solutions = (kioskData?.solutions as SolutionScreens) ?? null;
  const values = (kioskData?.value as ValueScreens) ?? null;

  const slides: Slide[] =
    challenges && solutions && values
      ? [
          ...buildChallengeSlides(challenges, 'kiosk-2', controller, {
            initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#8DC13F' },
          }),
          ...buildSolutionSlides(solutions, 'kiosk-2', controller),
          ...buildValueSlides(values, 'kiosk-2', controller),
        ]
      : [];

  const challengeCount = challenges
    ? buildChallengeSlides(challenges, 'kiosk-2', controller, {
        initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#8DC13F' },
      }).length
    : 0;
  const solutionCount = solutions ? buildSolutionSlides(solutions, 'kiosk-2', controller).length : 0;

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
          {slides.slice(challengeCount + solutionCount).map((slide, idx) => (
            <Fragment key={slide.id}>{slide.render(challengeCount + solutionCount + idx === topIndex)}</Fragment>
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

Kiosk2View.displayName = 'Kiosk2View';

export default Kiosk2View;
