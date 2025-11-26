'use client';
import { useEffect, useState } from 'react';
import type { Controller } from '@/components/kiosk-controller/KioskController';
import useKioskController from '@/components/kiosk-controller/useKioskController';
import InitialScreenTemplate from '@/components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import FirstScreenTemplate from '@/components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import SecondScreenTemplate from '@/components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import styles from './kiosk-1.module.css';

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
    <div className={styles.root}>
      <div className={styles.parallaxContainer} data-top-index={topIndex}>
        {slides.map((s, idx) => (
          <section key={s.id} className={styles.slide} data-active={idx === topIndex}>
            {/* Render the actual challenge templates so you can preview them in dev */}
            {s.id === 's1' && <InitialScreenTemplate />}

            {s.id === 's2' && (
              <FirstScreenTemplate
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}

            {s.id === 's3' && (
              <SecondScreenTemplate
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}

            {s.id === 's4' && (
              <ThirdScreenTemplate
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}
          </section>
        ))}
      </div>
      <div className={styles.debugControls}>
        <button onClick={() => controller.prev()}>Prev</button>
        <button onClick={() => controller.next()}>Next</button>
      </div>
    </div>
  );
}
