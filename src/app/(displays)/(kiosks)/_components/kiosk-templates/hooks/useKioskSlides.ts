import { useMemo } from 'react';
import {
  buildAmbientCoverScreen,
  buildChallengeSlides,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeSlides';
import { buildCustomInteractiveSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import {
  useMappedChallenges,
  useMappedCustomInteractives,
  useMappedSolutionAccordion,
  useMappedSolutionGrid,
  useMappedValues,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useMappedContent';
import { buildSolutionSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/solution/solutionSlides';
import { buildValueSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueSlides';
import { parseKioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import { calculateSectionGradientHeights } from '@/app/(displays)/(kiosks)/_utils/calculate-section-heights';
import { hasContent } from '@/app/(displays)/(kiosks)/_utils/content-validation';
import { parseKioskData } from '@/app/(displays)/(kiosks)/_utils/parseKioskData';
import type { DiamondMapping } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-grid';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// Transforms the raw CMS data into renderable Kiosk slides. Maps the data through the mapper functions for challenges, solutions, value, and customInteractive, builds the slides and returns them in a slide array ready to render.

/**
 * Hook for transforming raw CMS data into kiosk slides.
 * Handles data mapping, slide building, and memoization with strict type checking.
 *
 * This encapsulates the complex data transformation logic that was previously
 * scattered throughout the Kiosk view components.
 */

type KioskData = null | Record<string, unknown> | undefined;

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
  readonly kioskData: KioskData;
  readonly kioskId: KioskId;
  readonly slideBuilders: SlideBuilders;
};

type ParsedKioskContent = ReturnType<typeof parseKioskData>;

/**
 * Builds challenge slides based on whether challenge content exists.
 * Returns ambient cover screen if no challenge content, full challenge slides otherwise.
 */
const buildChallengeSection = (
  challenges: null | ReturnType<typeof parseKioskChallenges>,
  kioskContent: ParsedKioskContent,
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

/**
 * Builds solution slides by merging grid and accordion data.
 */
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

/**
 * Builds value slides if value content exists.
 */
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

/**
 * Builds custom interactive slides for all enabled interactives.
 */
const buildCustomInteractiveSection = (
  customInteractives: Array<{ number: 1 | 2 | 3 }>,
  kioskId: KioskId,
  scrollToSectionById: (id: string) => void
) => {
  if (customInteractives.length === 0) return [];

  return customInteractives.flatMap((customInteractive, index) =>
    buildCustomInteractiveSlides(customInteractive, kioskId, scrollToSectionById, index, customInteractive.number)
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

  // Parse kiosk data with type safety using extracted utility
  const kioskContent: ParsedKioskContent = useMemo(() => {
    try {
      // Early return when data hasn't loaded yet - avoid error spam during initial render
      if (!kioskData) {
        return null;
      }
      return parseKioskData(kioskData);
    } catch {
      return null;
    }
  }, [kioskData]);

  // Map content using extracted hooks
  const challenges = useMappedChallenges(kioskContent);
  const solutionAccordion = useMappedSolutionAccordion(kioskContent);
  const solutionGrid = useMappedSolutionGrid(kioskContent, diamondMapping);
  const values = useMappedValues(kioskContent, kioskId);
  const customInteractives = useMappedCustomInteractives(kioskContent);

  // Track missing sections for better error reporting
  const missingSections = useMemo(() => {
    const missing: string[] = [];
    if (!challenges) missing.push('challenges');
    if (!solutionAccordion && !solutionGrid) missing.push('solutions');
    if (!values) missing.push('values');
    if (customInteractives.length === 0) missing.push('customInteractive');
    return missing;
  }, [challenges, customInteractives, solutionAccordion, solutionGrid, values]);

  const slides = useMemo(() => {
    // Early return if kioskContent hasn't loaded yet - avoid error spam during initial render
    if (!kioskContent) {
      return [];
    }

    // Check if we have at least the ambient data (required for initial screen)
    if (!kioskContent.ambient) {
      return [];
    }

    // Build challenge slides (required - returns empty array if no challenges)
    const challengeSlides = buildChallengeSection(
      challenges,
      kioskContent,
      kioskId,
      globalHandlers,
      handleInitialButtonClick
    );

    // Early return if no challenge slides (ambient data is missing)
    if (challengeSlides.length === 0) {
      return [];
    }

    // Build remaining sections
    const solutionSlides = buildSolutionSection(
      solutionAccordion,
      solutionGrid,
      kioskId,
      globalHandlers,
      handleRegisterListHandlers
    );

    const valueSlides = buildValueSection(values, kioskId, globalHandlers, handleRegisterCarouselHandlers);

    const customInteractiveSlides = buildCustomInteractiveSection(customInteractives, kioskId, scrollToSectionById);

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

  // Calculate gradient heights based on rendered slides
  const gradientHeights = useMemo(() => {
    if (slides.length === 0) {
      return {
        challenge: 0,
        customInteractive: [],
        solution: 0,
        value: 0,
      };
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
