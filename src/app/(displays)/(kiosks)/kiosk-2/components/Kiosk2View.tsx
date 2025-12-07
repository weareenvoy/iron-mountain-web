'use client';

import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import FirstScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import challengeContent from '@public/api/kiosk-2.json';
import { useEffect, useState } from 'react';

type Slide = { id: string; title: string };

const slides: Slide[] = [
  { id: 's1', title: 'Welcome' },
  { id: 's2', title: 'Challenge' },
  { id: 's3', title: 'Stats' },
  { id: 's4', title: 'Impact' },
];

const Kiosk2View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(challengeContent, 'kiosk-2');

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
      className="h-full relative w-full"
    >
      <div
        // className={styles.parallaxContainer}
        className="h-full w-full"
        data-top-index={topIndex}
      >
        {slides.map((slide, idx) => (
          <section
            // className={styles.slide}
            className="flex flex-col h-full items-center justify-center w-full"
            data-active={idx === topIndex}
            key={slide.id}
          >
            {slide.id === 's1' && (
              <InitialScreenTemplate
                {...challenges.initialScreen}
                contentBoxBgColor="#8DC13F"
                kioskId="kiosk-2"
              />
            )}
            {slide.id === 's2' && (
              <FirstScreenTemplate
                {...challenges.firstScreen}
                kioskId="kiosk-2"
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}
            {slide.id === 's3' && (
              <SecondScreenTemplate
                {...challenges.secondScreen}
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}
            {slide.id === 's4' && (
              <ThirdScreenTemplate
                {...challenges.thirdScreen}
              kioskId="kiosk-2"
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}
          </section>
        ))}
      </div>
      <div
        // className={styles.debugControls}
        className="absolute bottom-[12px] flex gap-2 right-[12px] z-[1000]"
      >
        <button onClick={() => controller.prev()}>Prev</button>
        <button onClick={() => controller.next()}>Next</button>
      </div>
    </div>
  );
};

Kiosk2View.displayName = 'Kiosk2View';

export default Kiosk2View;
