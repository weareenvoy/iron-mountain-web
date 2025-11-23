'use client';
import React, { useEffect, useState } from 'react';
import useKioskController from '@/components/kiosk-controller/useKioskController';
import KioskTouchZones from './KioskTouchZones';
import InnerEmbla from './InnerEmbla';
import InitialScreenTemplate from '@/components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import FirstScreenTemplate from '@/components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import SecondScreenTemplate from '@/components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate from '@/components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import styles from './kiosk-1.module.css';

type Slide = { id: string; title: string; hasCarousel?: boolean };

const slides: Slide[] = [
  { id: 's1', title: 'Welcome' },
  { id: 's2', title: 'Challenge', hasCarousel: true },
  { id: 's3', title: 'Stats' },
];

export default function Kiosk1View({ config }: { config?: { width: number; height: number } }) {
  const controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);

  // Register root handlers for parallax navigation
  useEffect(() => {
    controller.setRootHandlers({
      next: () => {
        setTopIndex((i) => Math.min(i + 1, slides.length - 1));
        return true;
      },
      prev: () => {
        setTopIndex((i) => Math.max(i - 1, 0));
        return true;
      },
      goTo: (i) => {
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
            {s.id === 's1' && (
              <InitialScreenTemplate
                videoSrc="/assets/sample-video.mp4"
                headline="The GRAMMY MuseumⓇ preserves the soundtrack of history."
                description="Initial screen description placeholder"
              />
            )}

            {s.id === 's2' && (
              <FirstScreenTemplate
                videoSrc="/assets/sample-video.mp4"
                headline="Challenge — First"
                description="First screen description placeholder"
              />
            )}

            {s.id === 's3' && (
              <SecondScreenTemplate
                mediaSrc="/assets/sample-image.jpg"
                headline="Challenge — Second"
                statValue="40 TB"
                description="Second screen description placeholder"
              />
            )}

            {s.id === 's4' && (
              <ThirdScreenTemplate
                mediaSrc="/assets/sample-image.jpg"
                headline="Challenge — Third"
                metric="75%"
              />
            )}
            {s.hasCarousel ? <InnerEmbla id={`inner-${s.id}`} /> : null}
          </section>
        ))}
      </div>

      <KioskTouchZones />
      <div className={styles.debugControls}>
        <button onClick={() => controller.prev()}>Prev</button>
        <button onClick={() => controller.next()}>Next</button>
      </div>
    </div>
  );
}
