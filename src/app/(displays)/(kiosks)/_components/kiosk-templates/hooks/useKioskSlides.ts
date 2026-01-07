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
  IdleContent,
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
 * Validates objects exist and are the correct type with runtime shape validation.
 */

/**
 * Type guard for Ambient - validates required properties exist and have correct types
 */
const isAmbient = (value: unknown): value is Ambient => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.title === undefined || typeof obj.title === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.mainCTA === undefined || typeof obj.mainCTA === 'string') &&
    (obj.backgroundImage === undefined || typeof obj.backgroundImage === 'string') &&
    (obj.quoteSource === undefined || typeof obj.quoteSource === 'string')
  );
};

/**
 * Type guard for IdleContent - validates shape matches expected type
 */
const isIdleContent = (value: unknown): value is IdleContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return obj.videoSrc === undefined || typeof obj.videoSrc === 'string';
};

/**
 * Type guard for ChallengeContent - validates shape matches expected type
 */
const isChallengeContent = (value: unknown): value is ChallengeContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.mainVideo === undefined || typeof obj.mainVideo === 'string') &&
    (obj.featuredStat1 === undefined || typeof obj.featuredStat1 === 'string') &&
    (obj.featuredStat1Body === undefined || typeof obj.featuredStat1Body === 'string') &&
    (obj.featuredStat2 === undefined || typeof obj.featuredStat2 === 'string') &&
    (obj.featuredStat2Body === undefined || typeof obj.featuredStat2Body === 'string') &&
    (obj.item1Body === undefined || typeof obj.item1Body === 'string') &&
    (obj.item1Image === undefined || typeof obj.item1Image === 'string') &&
    (obj.item2Body === undefined || typeof obj.item2Body === 'string') &&
    (obj.item2Image === undefined || typeof obj.item2Image === 'string')
  );
};

/**
 * Type guard for SolutionsMain - validates shape matches expected type
 */
const isSolutionsMain = (value: unknown): value is SolutionsMain => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.image === undefined || typeof obj.image === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.mainVideo === undefined || typeof obj.mainVideo === 'string') &&
    (obj.numberedListHeadline === undefined || typeof obj.numberedListHeadline === 'string') &&
    (obj.numberedList === undefined ||
      (Array.isArray(obj.numberedList) && obj.numberedList.every(item => typeof item === 'string')))
  );
};

/**
 * Type guard for ValueContent - validates shape matches expected type
 */
const isValueContent = (value: unknown): value is ValueContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.mainVideo === undefined || typeof obj.mainVideo === 'string') &&
    (obj.diamondBenefits === undefined || Array.isArray(obj.diamondBenefits))
  );
};

/**
 * Type guard for CustomInteractiveContent - validates shape matches expected type
 */
const isCustomInteractiveContent = (value: unknown): value is CustomInteractiveContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.headline2 === undefined || typeof obj.headline2 === 'string') &&
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.body2 === undefined || typeof obj.body2 === 'string') &&
    (obj.image === undefined || typeof obj.image === 'string') &&
    (obj.video === undefined || typeof obj.video === 'string') &&
    (obj.mainCTA === undefined || typeof obj.mainCTA === 'string') &&
    (obj.secondaryCTA === undefined || typeof obj.secondaryCTA === 'string') &&
    (obj.backCTA === undefined || typeof obj.backCTA === 'string') &&
    (obj.tapCTA === undefined || typeof obj.tapCTA === 'string') &&
    (obj.diamondCarouselItems === undefined ||
      (Array.isArray(obj.diamondCarouselItems) && obj.diamondCarouselItems.every(item => typeof item === 'string'))) &&
    (obj.tapCarousel === undefined || Array.isArray(obj.tapCarousel))
  );
};

/**
 * Type guard for DemoConfig - validates shape matches expected type
 */
const isDemoConfig = (value: unknown): value is DemoConfig => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.demoText === undefined || typeof obj.demoText === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.iframeLink === undefined || typeof obj.iframeLink === 'string') &&
    (obj.mainCTA === undefined || typeof obj.mainCTA === 'string')
  );
};

/**
 * Type guard for SolutionsAccordion - validates shape matches expected type
 */
const isSolutionsAccordion = (value: unknown): value is SolutionsAccordion => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.steps === undefined || Array.isArray(obj.steps))
  );
};

/**
 * Type guard for SolutionsGrid - validates shape matches expected type
 */
const isSolutionsGrid = (value: unknown): value is SolutionsGrid => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.diamondList === undefined ||
      (Array.isArray(obj.diamondList) && obj.diamondList.every(item => typeof item === 'string'))) &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.images === undefined || Array.isArray(obj.images))
  );
};

const parseKioskData = (kioskData: KioskData) => {
  if (!kioskData) return null;

  return validateObject(kioskData, 'kioskData', obj => {
    // Validate each property is an object with runtime shape validation
    const ambient = getOptionalProperty(obj, 'ambient', val => {
      const validated = validateObject(val, 'ambient', a => a);
      if (!isAmbient(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] ambient object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const idle = getOptionalProperty(obj, 'idle', val => {
      const validated = validateObject(val, 'idle', i => i);
      if (!isIdleContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] idle object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const challengeMain = getOptionalProperty(obj, 'challengeMain', val => {
      const validated = validateObject(val, 'challengeMain', c => c);
      if (!isChallengeContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] challengeMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const customInteractive1Main = getOptionalProperty(obj, 'customInteractive1Main', val => {
      const validated = validateObject(val, 'customInteractive1Main', c => c);
      if (!isCustomInteractiveContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] customInteractive1Main object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const customInteractive2 = getOptionalProperty(obj, 'customInteractive2', val => {
      const validated = validateObject(val, 'customInteractive2', c => c);
      if (!isCustomInteractiveContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] customInteractive2 object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const customInteractive3 = getOptionalProperty(obj, 'customInteractive3', val => {
      const validated = validateObject(val, 'customInteractive3', c => c);
      if (!isCustomInteractiveContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] customInteractive3 object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const demoMain = getOptionalProperty(obj, 'demoMain', val => {
      const validated = validateObject(val, 'demoMain', d => d);
      if (!isDemoConfig(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] demoMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const solutionAccordion = getOptionalProperty(obj, 'solutionAccordion', val => {
      const validated = validateObject(val, 'solutionAccordion', s => s);
      if (!isSolutionsAccordion(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] solutionAccordion object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const solutionGrid = getOptionalProperty(obj, 'solutionGrid', val => {
      const validated = validateObject(val, 'solutionGrid', s => s);
      if (!isSolutionsGrid(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] solutionGrid object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const solutionMain = getOptionalProperty(obj, 'solutionMain', val => {
      const validated = validateObject(val, 'solutionMain', s => s);
      if (!isSolutionsMain(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] solutionMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const valueMain = getOptionalProperty(obj, 'valueMain', val => {
      const validated = validateObject(val, 'valueMain', v => v);
      if (!isValueContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[useKioskSlides] valueMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    return {
      ambient,
      challengeMain,
      customInteractive1Main,
      customInteractive2,
      customInteractive3,
      demoMain,
      idle,
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
  const { globalHandlers, handleInitialButtonClick, handleRegisterCarouselHandlers, scrollToSectionById } =
    slideBuilders;

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
        ? 'customInteractive1Main'
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
      ...buildSolutionSlides(solutions, kioskId, globalHandlers),
      ...buildValueSlides(values, kioskId, globalHandlers, {
        onRegisterCarouselHandlers: handleRegisterCarouselHandlers,
      }),
      ...buildCustomInteractiveSlides(customInteractive, kioskId, scrollToSectionById),
    ];
  }, [
    challenges,
    customInteractive,
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
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
