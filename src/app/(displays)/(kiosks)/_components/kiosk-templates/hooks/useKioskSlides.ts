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
import { getOptionalProperty, validateObject } from '@/app/(displays)/(kiosks)/_utils/validators';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';
import type {
  Ambient,
  ChallengeContent,
  CustomInteractiveContent,
  SolutionsAccordion,
  SolutionsGrid,
  SolutionsMain,
  ValueContent,
} from '@/app/(displays)/(kiosks)/_types/content-types';
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
  readonly handleRegisterListHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
  readonly scrollToSectionById: (id: string) => void;
};

type DemoConfig = {
  readonly demoText?: string;
  readonly headline?: string;
  readonly iframeLink?: string;
  readonly mainCTA?: string;
};

type UseKioskSlidesConfig = {
  readonly diamondMapping?: DiamondMapping;
  readonly kioskData: KioskData;
  readonly kioskId: KioskId;
  readonly slideBuilders: SlideBuilders;
  readonly usesAccordion?: boolean;
};

/**
 * Safely extracts typed data from unknown kiosk data.
 * Validates objects exist and are the correct type, but doesn't enforce
 * specific properties since CMS types have all-optional fields.
 */
const parseKioskData = (kioskData: KioskData) => {
  if (!kioskData) return null;

  return validateObject(kioskData, 'kioskData', obj => {
    // Validate each property is an object (if present), but trust TypeScript for the shape
    // This is safer than 'as' casts because validateObject checks typeof === 'object'
    const ambient = getOptionalProperty(obj, 'ambient', val => validateObject(val, 'ambient', a => a)) as
      | Ambient
      | undefined;

    const challengeMain = getOptionalProperty(obj, 'challengeMain', val =>
      validateObject(val, 'challengeMain', c => c)
    ) as ChallengeContent | undefined;

    const customInteractive1Main = getOptionalProperty(obj, 'customInteractive1Main', val =>
      validateObject(val, 'customInteractive1Main', c => c)
    ) as CustomInteractiveContent | undefined;

    const customInteractive2 = getOptionalProperty(obj, 'customInteractive2', val =>
      validateObject(val, 'customInteractive2', c => c)
    ) as CustomInteractiveContent | undefined;

    const customInteractive3 = getOptionalProperty(obj, 'customInteractive3', val =>
      validateObject(val, 'customInteractive3', c => c)
    ) as CustomInteractiveContent | undefined;

    const demoMain = getOptionalProperty(obj, 'demoMain', val => validateObject(val, 'demoMain', d => d)) as
      | DemoConfig
      | undefined;

    const solutionAccordion = getOptionalProperty(obj, 'solutionAccordion', val =>
      validateObject(val, 'solutionAccordion', s => s)
    ) as SolutionsAccordion | undefined;

    const solutionGrid = getOptionalProperty(obj, 'solutionGrid', val =>
      validateObject(val, 'solutionGrid', s => s)
    ) as SolutionsGrid | undefined;

    const solutionMain = getOptionalProperty(obj, 'solutionMain', val =>
      validateObject(val, 'solutionMain', s => s)
    ) as SolutionsMain | undefined;

    const valueMain = getOptionalProperty(obj, 'valueMain', val => validateObject(val, 'valueMain', v => v)) as
      | undefined
      | ValueContent;

    return {
      ambient,
      challengeMain,
      customInteractive1Main,
      customInteractive2,
      customInteractive3,
      demoMain,
      solutionAccordion,
      solutionGrid,
      solutionMain,
      valueMain,
    };
  });
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

  // Parse kiosk data with type safety
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

  // Map custom interactive
  const customInteractive = useMemo(() => {
    if (!kioskContent?.ambient) return null;

    const customInteractiveKey =
      kioskId === 'kiosk-1'
        ? 'customInteractive1Main'
        : kioskId === 'kiosk-2'
          ? 'customInteractive2'
          : 'customInteractive3';

    const customInteractiveData = kioskContent[customInteractiveKey];
    if (!customInteractiveData) return null;

    const mapper =
      kioskId === 'kiosk-1' ? mapCustomInteractiveKiosk1 : kioskId === 'kiosk-3' ? mapCustomInteractiveKiosk3 : null;

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

  // Build slides
  const slides = useMemo(() => {
    if (!challenges || !solutions || !values || !customInteractive) return [];

    return [
      ...buildChallengeSlides(challenges, kioskId, globalHandlers, {
        onInitialButtonClick: handleInitialButtonClick,
      }),
      ...buildSolutionSlides(solutions, kioskId, {
        ...globalHandlers,
        onRegisterListHandlers: handleRegisterListHandlers,
      }),
      ...buildValueSlides(values, kioskId, globalHandlers, {
        onRegisterCarouselHandlers: handleRegisterCarouselHandlers,
      }),
      ...buildCustomInteractiveSlides(customInteractive, kioskId, scrollToSectionById),
    ];
  }, [
    challenges,
    solutions,
    values,
    customInteractive,
    kioskId,
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
    handleRegisterListHandlers,
    scrollToSectionById,
  ]);

  return {
    challenges,
    customInteractive,
    slides,
    solutions,
    values,
  };
};
