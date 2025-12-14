'use client';

import kioskContent from '@public/api/kiosk-1.json';
import { Fragment, useEffect, useState } from 'react';
import useKioskController from '@/app/(displays)/(kiosks)/_components/kiosk-controller/useKioskController';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeTemplate';
import { buildHardcodedSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/hardCodedTemplate';
import { type HardCodedScreens } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/hardCodedTemplate';
import { buildSolutionSlides, type SolutionScreens } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionTemplate';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import { buildValueSlides, type ValueScreens } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueTemplate';
import { parseKioskChallenges, type KioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import type { Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
// import styles from './kiosk-1.module.css';

const Kiosk1View = () => {
  const controller: Controller = useKioskController();
  const [topIndex, setTopIndex] = useState(0);
  const challenges: KioskChallenges = parseKioskChallenges(
    mapChallenges(kioskContent.data.challenge, kioskContent.data.ambient),
    'kiosk-1'
  );
  const solutions = mapSolutions(kioskContent.data.solutions) as SolutionScreens;
  const values = mapValue(kioskContent.data.value) as ValueScreens;
  const hardCoded = (kioskContent.data.hardcoded ?? {}) as HardCodedScreens;

  const slides: Slide[] = [
    ...buildChallengeSlides(challenges, 'kiosk-1', controller),
    ...buildSolutionSlides(solutions, 'kiosk-1', controller),
    ...buildValueSlides(values, 'kiosk-1', controller),
    ...buildHardcodedSlides(hardCoded, 'kiosk-1', controller),
  ];
  const challengeCount = buildChallengeSlides(challenges, 'kiosk-1', controller).length;
  const solutionCount = buildSolutionSlides(solutions, 'kiosk-1', controller).length;
  const valueCount = buildValueSlides(values, 'kiosk-1', controller).length;

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
          {slides.slice(0, challengeCount).map((s, idx) => (
            <Fragment key={s.id}>{s.render(idx === topIndex)}</Fragment>
          ))}
        </section>
        <section className="h-full w-full" data-section="solutions">
          {slides.slice(challengeCount, challengeCount + solutionCount).map((s, idx) => (
            <Fragment key={s.id}>{s.render(challengeCount + idx === topIndex)}</Fragment>
          ))}
        </section>
        <section className="h-full w-full" data-section="value">
          {slides.slice(challengeCount + solutionCount, challengeCount + solutionCount + valueCount).map((s, idx) => (
            <Fragment key={s.id}>
              {s.render(challengeCount + solutionCount + idx === topIndex)}
            </Fragment>
          ))}
        </section>
        <section className="h-full w-full" data-section="hardcoded">
          {slides.slice(challengeCount + solutionCount + valueCount).map((s, idx) => (
            <Fragment key={s.id}>
              {s.render(challengeCount + solutionCount + valueCount + idx === topIndex)}
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

Kiosk1View.displayName = 'Kiosk1View';

export default Kiosk1View;

type Ambient = {
  backgroundImage?: string;
  body?: string;
  headline?: string;
  quoteSource?: string;
  title?: string;
};

type ChallengeScreen = {
  body?: string;
  slideTitle?: string;
  statBody?: string;
  statTitle?: string;
  staticAsset?: string;
  videoAsset?: string;
};

type ChallengeContent = {
  firstScreen?: ChallengeScreen;
  secondScreen?: ChallengeScreen;
  thirdScreen?: ChallengeScreen;
};

type SolutionsContent = {
  firstScreen?: {
    body?: string;
    headline?: string;
    slideTitle?: string;
    videoAsset?: string;
  };
  secondScreen?: {
    headline?: string;
    numberedList?: string[];
    slideTitle?: string;
    staticAsset?: string;
  };
  thirdScreen?: {
    diamondText?: string[];
    groupedAssets?: string[];
    headline?: string;
    slideTitle?: string;
  };
};

type ValueContent = {
  main?: {
    body?: string;
    diamondBenefits?: { bullets?: string[]; label?: string }[];
    headline?: string;
    slideTitle?: string;
    videoAsset?: string;
  };
};

const splitLines = (value?: string) => (value ? value.split('\n') : undefined);

const mapChallenges = (challenge: ChallengeContent, ambient: Ambient): KioskChallenges => ({
  initialScreen: {
    attribution: ambient.quoteSource ?? '- Michael Rohrabacher, Technical Director at the GRAMMY Museum',
    backgroundImage: ambient.backgroundImage ?? '',
    buttonText: 'Touch to explore',
    headline: ambient.headline ?? '',
    quote: ambient.body ?? '',
    subheadline: splitLines(ambient.title) ?? 'Rich media & cultural heritage',
  },
  firstScreen: {
    challengeLabel: 'Challenge',
    problemDescription: challenge.firstScreen?.body ?? '',
    savingsAmount: challenge.firstScreen?.statTitle ?? '',
    savingsDescription: challenge.firstScreen?.statBody ?? '',
    subheadline: splitLines(challenge.firstScreen?.slideTitle) ?? 'Rich media & cultural heritage',
    videoSrc: challenge.firstScreen?.videoAsset ?? '',
  },
  secondScreen: {
    bottomDescription: '',
    bottomVideoSrc: challenge.secondScreen?.videoAsset ?? '',
    largeIconSrc: challenge.secondScreen?.staticAsset ?? '',
    mainDescription: challenge.secondScreen?.body ?? '',
    statAmount: challenge.secondScreen?.statTitle ?? '',
    statDescription: challenge.secondScreen?.statBody ?? '',
    subheadline: splitLines(challenge.secondScreen?.slideTitle) ?? 'Rich media & cultural heritage',
    topImageSrc: challenge.secondScreen?.staticAsset ?? '',
  },
  thirdScreen: {
    description: challenge.thirdScreen?.body ?? '',
    heroImageSrc: challenge.thirdScreen?.staticAsset ?? '',
    largeIconCenterSrc: challenge.thirdScreen?.staticAsset ?? '',
    largeIconTopSrc: challenge.thirdScreen?.staticAsset ?? '',
    metricAmount: challenge.thirdScreen?.statTitle ?? '',
    metricDescription: challenge.thirdScreen?.statBody ?? '',
    metricImageSrc: challenge.thirdScreen?.staticAsset ?? '',
    subheadline: splitLines(challenge.thirdScreen?.slideTitle) ?? 'Rich media & cultural heritage',
    videoSrc: challenge.thirdScreen?.videoAsset ?? '',
  },
});

const mapSolutions = (solutions: SolutionsContent): SolutionScreens => ({
  firstScreen: solutions.firstScreen
    ? {
        backgroundVideoSrc: solutions.firstScreen.videoAsset,
        description: solutions.firstScreen.body,
        subheadline: splitLines(solutions.firstScreen.slideTitle),
        title: solutions.firstScreen.headline,
      }
    : undefined,
  secondScreen: solutions.secondScreen
    ? {
        heroImageSrc: solutions.secondScreen.staticAsset,
        solutionLabel: 'Solution',
        stepFourDescription: solutions.secondScreen.numberedList?.[3],
        stepFourLabel: '04.',
        stepOneDescription: solutions.secondScreen.numberedList?.[0],
        stepOneLabel: '01.',
        stepThreeDescription: solutions.secondScreen.numberedList?.[2],
        stepThreeLabel: '03.',
        stepTwoDescription: solutions.secondScreen.numberedList?.[1],
        stepTwoLabel: '02.',
        subheadline: splitLines(solutions.secondScreen.slideTitle),
        title: solutions.secondScreen.headline,
      }
    : undefined,
  thirdScreen: solutions.thirdScreen
    ? {
        bottomLeftLabel: solutions.thirdScreen.diamondText?.[2],
        bottomRightLabel: solutions.thirdScreen.diamondText?.[3],
        centerLabel: solutions.thirdScreen.diamondText?.[0],
        mediaDiamondLeftSrc: solutions.thirdScreen.groupedAssets?.[0],
        mediaDiamondRightSrc: solutions.thirdScreen.groupedAssets?.[1],
        solutionLabel: 'Solution',
        subheadline: splitLines(solutions.thirdScreen.slideTitle),
        title: solutions.thirdScreen.headline,
        topLeftLabel: undefined,
        topRightLabel: solutions.thirdScreen.diamondText?.[1],
      }
    : undefined,
});

const mapValue = (value: ValueContent): ValueScreens => {
  const main = value.main;
  if (!main) return { valueScreens: [] };

  const eyebrow = splitLines(main.slideTitle);
  const heroVideoSrc = main.videoAsset;
  const description = main.body;
  const headline = main.headline;

  const benefits = main.diamondBenefits ?? [];
  const overviewCards = [
    { color: '#8a0d71', label: 'Operational benefits' },
    { color: '#1b75bc', label: 'Economic benefits' },
    { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
  ];

  const buildDiamondCards = (label?: string) => {
    const normalized = (label ?? '').toLowerCase();
    if (normalized.includes('operational')) {
      return [
        { color: '#f26522', label: '', textColor: '#4a154b' },
        { color: '#1b75bc', label: '' },
        { color: '#8a0d71', label: 'Operational benefits' },
      ];
    }
    if (normalized.includes('economic') || normalized.includes('economical')) {
      return [
        { color: '#8a0d71', label: '' },
        { color: '#f26522', label: '', textColor: '#4a154b' },
        { color: '#1b75bc', label: 'Economic benefits' },
      ];
    }
    // Strategic fallback
    return [
      { color: '#1b75bc', label: '' },
      { color: '#8a0d71', label: '' },
      { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
    ];
  };

  const carouselSlides =
    benefits.map(benefit => ({
      badgeLabel: benefit.label,
      bullets: benefit.bullets,
      diamondCards: buildDiamondCards(benefit.label),
      id: `value-${(benefit.label ?? '').toLowerCase().replace(/\s+/g, '-')}`,
    })) ?? [];

  return {
    valueScreens: [
      {
        carouselId: 'kiosk-1-value-overview',
        description,
        eyebrow,
        headline,
        heroVideoSrc,
        labelText: 'Value',
        slides: [
          {
            badgeLabel: 'Operational · Economic · Strategic',
            diamondCards: overviewCards,
            id: 'value-trio-overview',
          },
        ],
      },
      {
        carouselId: 'kiosk-1-value-carousel',
        description,
        eyebrow,
        headline,
        labelText: 'Value',
        slides: carouselSlides,
      },
    ],
  };
};
