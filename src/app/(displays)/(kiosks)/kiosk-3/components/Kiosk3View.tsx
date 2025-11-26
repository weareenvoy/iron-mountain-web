'use client';
import { useEffect, useState } from 'react';
import type { Controller } from '@/components/kiosk-controller/KioskController';
import useKioskController from '@/components/kiosk-controller/useKioskController';
import InitialScreenTemplate, {
  type InitialScreenTemplateProps,
} from '@/components/kiosk-templates/challenge/initialScreen/initialScreenTemplate';
import FirstScreenTemplate, {
  type FirstScreenTemplateProps,
} from '@/components/kiosk-templates/challenge/firstScreen/firstScreenTemplate';
import SecondScreenTemplate, {
  type SecondScreenTemplateProps,
} from '@/components/kiosk-templates/challenge/secondScreen/secondScreenTemplate';
import ThirdScreenTemplate, {
  type ThirdScreenTemplateProps,
} from '@/components/kiosk-templates/challenge/thirdScreen/thirdScreenTemplate';
import InnerEmbla from '../../kiosk-1/components/InnerEmbla';
import challengeContent from '../challenges.json';
// import styles from './kiosk-3.module.css';

type Slide = { hasCarousel?: boolean; id: string; title: string };

type ChallengeSlidesConfig = {
  firstScreen: FirstScreenTemplateProps;
  initialScreen: InitialScreenTemplateProps;
  secondScreen: SecondScreenTemplateProps;
  thirdScreen: ThirdScreenTemplateProps;
};

const slides: Slide[] = [
  { id: 's1', title: 'Welcome' },
  { hasCarousel: true, id: 's2', title: 'Challenge' },
  { id: 's3', title: 'Stats' },
  { id: 's4', title: 'Impact' },
];

const Kiosk3View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges = challengeContent as unknown as ChallengeSlidesConfig;

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
        {slides.map((slide, idx) => (
          <section
            // className={styles.slide}
            className="flex h-full w-full flex-col items-center justify-center"
            data-active={idx === topIndex}
            key={slide.id}
          >
            {slide.id === 's1' && <InitialScreenTemplate {...challenges.initialScreen} />}
            {slide.id === 's2' && (
              <FirstScreenTemplate
                {...challenges.firstScreen}
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
                onNavigateDown={() => controller.next()}
                onNavigateUp={() => controller.prev()}
              />
            )}
            {slide.hasCarousel ? <InnerEmbla id={`inner-${slide.id}`} /> : null}
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
};

export default Kiosk3View;

