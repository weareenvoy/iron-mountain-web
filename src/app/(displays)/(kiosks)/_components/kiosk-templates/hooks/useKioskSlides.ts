import { useMemo } from 'react';
import { buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeSlides';
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
import { parseKioskData } from '@/app/(displays)/(kiosks)/_utils/parseKioskData';
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
  readonly usesAccordion?: boolean;
};

export const useKioskSlides = ({
  diamondMapping,
  kioskData,
  kioskId,
  slideBuilders,
  usesAccordion = false,
}: UseKioskSlidesConfig) => {
  const {
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
    scrollToSectionById,
  } = slideBuilders;

  // Parse kiosk data with type safety using extracted utility
  const kioskContent = useMemo(() => parseKioskData(kioskData), [kioskData]);

  // Map challenges
  const challenges = useMemo(() => {
    if (!kioskContent?.challengeMain || !kioskContent.ambient) return null;
    return parseKioskChallenges(mapChallenges(kioskContent.challengeMain, kioskContent.ambient));
  }, [kioskContent]);

  // Map solutions
  const solutions = useMemo(() => {
    if (!kioskContent?.solutionMain || !kioskContent.ambient) return null;

    if (usesAccordion && kioskContent.solutionAccordion) {
      return mapSolutionsWithAccordion(kioskContent.solutionMain, kioskContent.solutionAccordion, kioskContent.ambient);
    }

    if (!usesAccordion && kioskContent.solutionGrid && diamondMapping) {
      return mapSolutionsWithGrid(
        kioskContent.solutionMain,
        kioskContent.solutionGrid,
        kioskContent.ambient,
        diamondMapping
      );
    }

    return null;
  }, [kioskContent, usesAccordion, diamondMapping]);

  // Map values
  const values = useMemo(() => {
    if (!kioskContent?.valueMain || !kioskContent.ambient) return null;
    return mapValue(kioskContent.valueMain, kioskContent.ambient, kioskId);
  }, [kioskContent, kioskId]);

  // Helper to get appropriate custom interactive mapper by kiosk ID
  const getCustomInteractiveMapper = (id: KioskId) => {
    switch (id) {
      case 'kiosk-1':
        return mapCustomInteractiveKiosk1;
      case 'kiosk-2':
        return null; // Kiosk 2 uses direct object construction
      case 'kiosk-3':
        return mapCustomInteractiveKiosk3;
      default:
        throw new Error(`Invalid KioskId for custom interactive mapper: ${id}`);
    }
  };

  // Map custom interactive
  const customInteractive = useMemo(() => {
    if (!kioskContent?.ambient) return null;

    const customInteractiveKey =
      kioskId === 'kiosk-1'
        ? 'customInteractive1'
        : kioskId === 'kiosk-2'
          ? 'customInteractive2'
          : 'customInteractive3';

    const customInteractiveData = kioskContent[customInteractiveKey];
    if (!customInteractiveData) return null;

    const mapper = getCustomInteractiveMapper(kioskId);

    if (!mapper) {
      // Kiosk 2 uses direct object construction with proper type extraction
      const demo = kioskContent.demoMain;
      const ambient = kioskContent.ambient;

      return {
        firstScreen: {
          demoIframeSrc: demo?.iframeLink,
          eyebrow: ambient.title,
          headline: customInteractiveData.headline,
          heroImageAlt: '',
          heroImageSrc: customInteractiveData.image,
          overlayCardLabel: demo?.demoText,
          overlayEndTourLabel: demo?.mainCTA,
          overlayHeadline: demo?.headline,
          primaryCtaLabel: undefined,
          secondaryCtaLabel: customInteractiveData.secondaryCTA,
        },
      };
    }

    return mapper(customInteractiveData, kioskContent.ambient, kioskContent.demoMain);
  }, [kioskContent, kioskId]);

  // Track missing sections for better error reporting
  const missingSections = useMemo(() => {
    const missing: string[] = [];
    if (!challenges) missing.push('challenges');
    if (!solutions) missing.push('solutions');
    if (!values) missing.push('values');
    if (!customInteractive) missing.push('customInteractive');
    return missing;
  }, [challenges, customInteractive, solutions, values]);

  // Build slides
  const slides = useMemo(() => {
    // Log missing sections for debugging
    if (!challenges || !solutions || !values || !customInteractive) {
      const missing: string[] = [];
      if (!challenges) missing.push('challenges');
      if (!solutions) missing.push('solutions');
      if (!values) missing.push('values');
      if (!customInteractive) missing.push('customInteractive');

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useKioskSlides] Kiosk ${kioskId} missing sections:`, missing.join(', '));
      }

      return [];
    }

    return [
      ...buildChallengeSlides(challenges, kioskId, globalHandlers, {
        initialScreen: {
          idleVideoSrc: kioskContent?.idle?.videoSrc,
        },
        onInitialButtonClick: handleInitialButtonClick,
      }),
      ...buildSolutionSlides(solutions, kioskId, {
        ...globalHandlers,
        onRegisterListHandlers: handleRegisterListHandlers,
      }),
      ...buildValueSlides(values, kioskId, globalHandlers, {
        registerCarouselHandlers: handleRegisterCarouselHandlers,
      }),
      ...buildCustomInteractiveSlides(customInteractive, kioskId, scrollToSectionById),
    ];
  }, [
    challenges,
    customInteractive,
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
    kioskContent,
    kioskId,
    scrollToSectionById,
    solutions,
    values,
  ]);

  return {
    challenges,
    customInteractive,
    missingSections: missingSections.length > 0 ? missingSections : null,
    slides,
    solutions,
    values,
  };
};
