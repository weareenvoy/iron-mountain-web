'use client';
import { useEffect, useState } from 'react';
import FirstScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import InitialScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import SecondScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import challengeContent from '../challenges.json';
// import styles from './kiosk-1.module.css';

type Slide = { hasCarousel?: boolean; id: string; title: string };

const slides: Slide[] = [
  { id: 's1', title: 'Welcome' },
  { hasCarousel: true, id: 's2', title: 'Challenge' },
  { id: 's3', title: 'Stats' },
  { id: 's4', title: 'Impact' },
];

export default function Kiosk1View() {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(challengeContent, 'kiosk-1');

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
            {/* Render the actual challenge templates so you can preview them in dev */}
            {s.id === 's1' && <InitialScreenTemplate {...challenges.initialScreen} />}

            {s.id === 's2' && (
              <FirstScreenTemplate
                {...challenges.firstScreen}
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}

            {s.id === 's3' && (
              <SecondScreenTemplate
                {...challenges.secondScreen}
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}

            {s.id === 's4' && (
              <ThirdScreenTemplate
                {...challenges.thirdScreen}
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}
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
