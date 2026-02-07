import { useMemo } from 'react';
import {
  buildAmbientCoverScreen,
  buildChallengeSlides,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeSlides';
import { buildCustomInteractiveSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import { buildSolutionSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionSlides';
import { buildValueSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueSlides';
import { mapChallenges } from '@/app/(displays)/(kiosks)/_mappers/map-challenges';
import { mapCustomInteractiveKiosk1 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk1';
import { mapCustomInteractiveKiosk3 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk3';
import { mapSolutionsWithAccordion } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-accordion';
import { mapSolutionsWithGrid, type DiamondMapping } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-grid';
import { mapValue } from '@/app/(displays)/(kiosks)/_mappers/map-value';
import { parseKioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import { calculateSectionGradientHeights } from '@/app/(displays)/(kiosks)/_utils/calculate-section-heights';
import {
  getSolutionContentState,
  hasAccordionData,
  hasContent,
  hasGridData,
} from '@/app/(displays)/(kiosks)/_utils/content-validation';
import type { CustomInteractiveContent } from '@/app/(displays)/(kiosks)/_types/content-types';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { KioskData } from '@/lib/internal/types';

type SlideBuilders = {
  readonly globalHandlers: {
    readonly onNavigateDown: () => void;
    readonly onNavigateUp: () => void;
  };
  readonly handleInitialButtonClick: () => void;
  readonly handleRegisterCarouselHandlers?: (handlers: CarouselHandlers) => void;
  readonly handleRegisterListHandlers?: (
    scrollSectionId: string,
    handlers: {
      canScrollNext: () => boolean;
      canScrollPrev: () => boolean;
      scrollNext: () => void;
      scrollPrev: () => void;
    }
  ) => void;
  readonly scrollToSectionById: (id: string) => void;
};

type UseKioskSlidesConfig = {
  readonly diamondMapping?: DiamondMapping;
  readonly kioskData: KioskData | null;
  readonly kioskId: KioskId;
  readonly slideBuilders: SlideBuilders;
};

const isCustomInteractiveContent = (data: unknown): data is CustomInteractiveContent => {
  return (
    typeof data === 'object' &&
    data !== null &&
    (('headline' in data && typeof data.headline === 'string') ||
      ('image' in data && typeof data.image === 'string') ||
      ('mainCTA' in data && typeof data.mainCTA === 'string'))
  );
};

const getCustomInteractiveMapper = (interactiveNumber: 1 | 2 | 3) => {
  switch (interactiveNumber) {
    case 1:
      return mapCustomInteractiveKiosk1;
    case 2:
      return null; // Interactive 2 uses direct object construction
    case 3:
      return mapCustomInteractiveKiosk3;
    default:
      throw new Error(`Invalid custom interactive number: ${interactiveNumber}`);
  }
};

const buildChallengeSection = (
  challenges: null | ReturnType<typeof parseKioskChallenges>,
  kioskContent: KioskData | null,
  kioskId: KioskId,
  globalHandlers: SlideBuilders['globalHandlers'],
  handleInitialButtonClick: () => void
) => {
  if (!challenges) return [];

  const hasChallengeContent = kioskContent?.challengeMain && hasContent(kioskContent.challengeMain);
  const slideOptions = {
    initialScreen: {
      idleVideoSrc: kioskContent?.idle?.videoSrc,
    },
    onInitialButtonClick: handleInitialButtonClick,
  };

  if (hasChallengeContent) {
    return buildChallengeSlides(challenges, kioskId, globalHandlers, slideOptions);
  }

  return buildAmbientCoverScreen(challenges, kioskId, globalHandlers, slideOptions);
};

const buildSolutionSection = (
  solutionAccordion: unknown,
  solutionGrid: unknown,
  kioskId: KioskId,
  globalHandlers: SlideBuilders['globalHandlers'],
  handleRegisterListHandlers?: SlideBuilders['handleRegisterListHandlers']
) => {
  if (!solutionAccordion && !solutionGrid) return [];

  const mergedSolutionScreens = {
    ...(solutionGrid ?? {}),
    ...(solutionAccordion ?? {}),
  };

  return buildSolutionSlides(mergedSolutionScreens, kioskId, {
    ...globalHandlers,
    onRegisterListHandlers: handleRegisterListHandlers,
  });
};

const buildValueSection = (
  values: unknown,
  kioskId: KioskId,
  globalHandlers: SlideBuilders['globalHandlers'],
  handleRegisterCarouselHandlers?: SlideBuilders['handleRegisterCarouselHandlers']
) => {
  if (!values) return [];

  return buildValueSlides(values, kioskId, globalHandlers, {
    registerCarouselHandlers: handleRegisterCarouselHandlers,
  });
};

const buildCustomInteractiveSection = (
  customInteractives: Array<{ number: 1 | 2 | 3 }>,
  kioskId: KioskId,
  scrollToSectionById: (id: string) => void,
  globalHandlers: { onNavigateDown: () => void; onNavigateUp: () => void }
) => {
  if (customInteractives.length === 0) return [];

  return customInteractives.flatMap((customInteractive, index) =>
    buildCustomInteractiveSlides(
      customInteractive,
      kioskId,
      scrollToSectionById,
      index,
      customInteractive.number,
      globalHandlers
    )
  );
};

export const useKioskSlides = ({ diamondMapping, kioskData, kioskId, slideBuilders }: UseKioskSlidesConfig) => {
  const {
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
    scrollToSectionById,
  } = slideBuilders;

  const kioskContent = kioskData;

  // Map challenges
  const challenges = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    try {
      return parseKioskChallenges(mapChallenges(kioskContent.challengeMain, kioskContent.ambient));
    } catch {
      return null;
    }
  }, [kioskContent]);

  // Map solution accordion
  const solutionAccordion = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    const { hasAnyContent, hasMainContent } = getSolutionContentState(kioskContent);
    if (!hasAnyContent || !hasMainContent || !kioskContent.solutionMain) return null;

    try {
      const hasData = hasAccordionData(kioskContent.solutionAccordion);
      if (!hasData) {
        return mapSolutionsWithAccordion(
          kioskContent.solutionMain,
          { accordion: [], headline: '', image: '' },
          kioskContent.ambient
        );
      }
      return mapSolutionsWithAccordion(kioskContent.solutionMain, kioskContent.solutionAccordion, kioskContent.ambient);
    } catch {
      return null;
    }
  }, [kioskContent]);

  // Map solution grid
  const solutionGrid = useMemo(() => {
    if (!kioskContent?.ambient || !diamondMapping) return null;
    const { hasAnyContent, hasMainContent } = getSolutionContentState(kioskContent);
    if (!hasAnyContent || !hasMainContent || !kioskContent.solutionMain) return null;

    try {
      const hasData = hasGridData(kioskContent.solutionGrid);
      if (!hasData) return null;
      return mapSolutionsWithGrid(kioskContent.solutionMain, kioskContent.solutionGrid, kioskContent.ambient, diamondMapping);
    } catch {
      return null;
    }
  }, [kioskContent, diamondMapping]);

  // Map values
  const values = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.valueMain || !hasContent(kioskContent.valueMain)) return null;
    try {
      return mapValue(kioskContent.valueMain, kioskContent.ambient, kioskId);
    } catch {
      return null;
    }
  }, [kioskContent, kioskId]);

  // Map custom interactives
  const customInteractives = useMemo(() => {
    if (!kioskContent?.ambient) return [];

    const choice = kioskContent.customInteractiveChoice;
    const interactiveChoices: Array<{ data: unknown; key: string; number: 1 | 2 | 3 }> = [
      { data: kioskContent.customInteractive1, key: choice?.customInteractive1 ?? '', number: 1 },
      { data: kioskContent.customInteractive2, key: choice?.customInteractive2 ?? '', number: 2 },
      { data: kioskContent.customInteractive3, key: choice?.customInteractive3 ?? '', number: 3 },
    ];

    for (const interactive of interactiveChoices) {
      if (interactive.key && interactive.key.trim() !== '' && interactive.data && hasContent(interactive.data)) {
        if (!isCustomInteractiveContent(interactive.data)) continue;

        try {
          const mapper = getCustomInteractiveMapper(interactive.number);

          if (!mapper) {
            const demo = kioskContent.demoMain;
            const ambient = kioskContent.ambient;
            return [
              {
                firstScreen: {
                  demoIframeSrc: demo?.iframeLink,
                  eyebrow: ambient.title,
                  headline: interactive.data.headline,
                  heroImageAlt: '',
                  heroImageSrc: interactive.data.image,
                  overlayCardLabel: undefined,
                  overlayEndTourLabel: demo?.mainCTA,
                  overlayHeadline: demo?.headline,
                  primaryCtaLabel: undefined,
                  secondaryCtaLabel: interactive.data.secondaryCTA,
                },
                number: interactive.number,
              },
            ];
          }

          const mapped = mapper(interactive.data, kioskContent.ambient, kioskContent.demoMain);
          return [{ ...mapped, number: interactive.number }];
        } catch {
          continue;
        }
      }
    }

    return [];
  }, [kioskContent]);

  const missingSections = useMemo(() => {
    const missing: string[] = [];
    if (!challenges) missing.push('challenges');
    if (!solutionAccordion && !solutionGrid) missing.push('solutions');
    if (!values) missing.push('values');
    if (customInteractives.length === 0) missing.push('customInteractive');
    return missing;
  }, [challenges, customInteractives, solutionAccordion, solutionGrid, values]);

  const slides = useMemo(() => {
    if (!kioskContent?.ambient) return [];

    const challengeSlides = buildChallengeSection(
      challenges,
      kioskContent,
      kioskId,
      globalHandlers,
      handleInitialButtonClick
    );

    if (challengeSlides.length === 0) return [];

    const solutionSlides = buildSolutionSection(
      solutionAccordion,
      solutionGrid,
      kioskId,
      globalHandlers,
      handleRegisterListHandlers
    );

    const valueSlides = buildValueSection(values, kioskId, globalHandlers, handleRegisterCarouselHandlers);

    const customInteractiveSlides = buildCustomInteractiveSection(
      customInteractives,
      kioskId,
      scrollToSectionById,
      globalHandlers
    );

    return [...challengeSlides, ...solutionSlides, ...valueSlides, ...customInteractiveSlides];
  }, [
    challenges,
    customInteractives,
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
    kioskContent,
    kioskId,
    scrollToSectionById,
    solutionAccordion,
    solutionGrid,
    values,
  ]);

  const gradientHeights = useMemo(() => {
    if (slides.length === 0) {
      return { challenge: 0, customInteractive: [], solution: 0, value: 0 };
    }
    return calculateSectionGradientHeights(slides, kioskId);
  }, [slides, kioskId]);

  return {
    challenges,
    customInteractives,
    gradientHeights,
    missingSections: missingSections.length > 0 ? missingSections : null,
    slides,
    solutionAccordion,
    solutionGrid,
    values,
  };
};
