'use client';

import kioskContent from '@public/api/kiosk-2.json';
import { useCallback, useEffect, useRef, useState } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
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
  const [topIndex, setTopIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const challenges: KioskChallenges = parseKioskChallenges(kioskContent.challenges, 'kiosk-2');
  const solutions = kioskContent.solutions as SolutionScreens;
  const values = kioskContent.value as ValueScreens;

  const slides: Slide[] = [
    ...buildChallengeSlides(challenges, 'kiosk-2', controller, {
      initialScreen: { ...challenges.initialScreen, contentBoxBgColor: '#8DC13F' },
    }),
    ...buildSolutionSlides(solutions, 'kiosk-2', controller),
    ...buildValueSlides(values, 'kiosk-2', controller),
  ];

  const scrollToSlide = useCallback((index: number) => {
    if (!containerRef.current) return;
    
    const slideHeight = containerRef.current.clientHeight;
    const targetScroll = slideHeight * index;
    
    containerRef.current.scrollTo({
      behavior: 'smooth',
      top: targetScroll,
    });
    
    setTopIndex(index);
  }, []);

  useEffect(() => {
    controller.setRootHandlers({
      goTo: (i: number) => {
        const targetIndex = Math.max(0, Math.min(i, slides.length - 1));
        scrollToSlide(targetIndex);
        return true;
      },
      next: () => {
        const nextIndex = Math.min(topIndex + 1, slides.length - 1);
        scrollToSlide(nextIndex);
        return true;
      },
      prev: () => {
        const prevIndex = Math.max(topIndex - 1, 0);
        scrollToSlide(prevIndex);
        return true;
      },
    });

    return () => controller.setRootHandlers(null);
  }, [controller, slides.length, topIndex, scrollToSlide]);

  return (
    <div
      ref={containerRef}
      // className={styles.root}
      className="relative h-screen w-full overflow-y-auto scroll-smooth"
    >
      <div className="flex w-full flex-col" data-top-index={topIndex}>
        {/* Render ALL slides, always visible, stacked vertically */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="h-screen w-full flex-shrink-0"
            data-slide-index={idx}
          >
            {slide.render(idx === topIndex)}
          </div>
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

Kiosk2View.displayName = 'Kiosk2View';

export default Kiosk2View;
