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
import { calculateSectionGradientHeights, type SectionHeights } from '@/app/(displays)/(kiosks)/_utils/calculate-section-heights';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';
import type { CustomInteractiveContent } from '@/app/(displays)/(kiosks)/_types/content-types';
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

/**
 * Helper to check if an object has meaningful content.
 * Recursively checks for non-empty strings, non-empty arrays, or nested objects with content.
 */
const hasContent = (obj: unknown): boolean => {
  if (!obj || typeof obj !== 'object') return false;

  if (Array.isArray(obj)) {
    return obj.some(item => hasContent(item) || (typeof item === 'string' && item.trim().length > 0));
  }

  return Object.values(obj).some(value => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0 && hasContent(value);
    if (typeof value === 'object' && value !== null) return hasContent(value);
    return false;
  });
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
  const kioskContent = useMemo(() => {
    try {
      return parseKioskData(kioskData);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to parse kiosk data:', error);
      }
      return null;
    }
  }, [kioskData]);

  // Map challenges - only if challengeMain has content
  const challenges = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.challengeMain || !hasContent(kioskContent.challengeMain)) return null;

    try {
      return parseKioskChallenges(mapChallenges(kioskContent.challengeMain, kioskContent.ambient));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map challenges:', error);
      }
      return null;
    }
  }, [kioskContent]);

  // Map solutions - show accordion, grid, or both based on data presence
  const solutionAccordion = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.solutionMain || !hasContent(kioskContent.solutionMain)) return null;

    try {
      // Check if solutionAccordion has actual data (items with content)
      const hasAccordionData =
        kioskContent.solutionAccordion &&
        typeof kioskContent.solutionAccordion === 'object' &&
        Array.isArray(kioskContent.solutionAccordion.accordion) &&
        kioskContent.solutionAccordion.accordion.some(
          item => item.title?.trim() || (item.bullets && item.bullets.length > 0)
        );

      if (!hasAccordionData) return null;

      return mapSolutionsWithAccordion(kioskContent.solutionMain, kioskContent.solutionAccordion, kioskContent.ambient);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map solution accordion:', error);
      }
      return null;
    }
  }, [kioskContent]);

  const solutionGrid = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.solutionMain || !hasContent(kioskContent.solutionMain)) return null;
    if (!diamondMapping) return null;

    try {
      // Check if solutionGrid has actual data (non-empty diamondList with content)
      const hasGridData =
        kioskContent.solutionGrid &&
        typeof kioskContent.solutionGrid === 'object' &&
        Array.isArray(kioskContent.solutionGrid.diamondList) &&
        kioskContent.solutionGrid.diamondList.some(item => item?.trim());

      if (!hasGridData) return null;

      return mapSolutionsWithGrid(
        kioskContent.solutionMain,
        kioskContent.solutionGrid,
        kioskContent.ambient,
        diamondMapping
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map solution grid:', error);
      }
      return null;
    }
  }, [kioskContent, diamondMapping]);

  // Map values - only if valueMain has content
  const values = useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.valueMain || !hasContent(kioskContent.valueMain)) return null;

    try {
      return mapValue(kioskContent.valueMain, kioskContent.ambient, kioskId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map values:', error);
      }
      return null;
    }
  }, [kioskContent, kioskId]);

  // Helper to get appropriate custom interactive mapper by number
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

  // Map custom interactives - check customInteractiveChoice to determine which to show
  // Only display the FIRST non-empty custom interactive
  const customInteractives = useMemo(() => {
    if (!kioskContent?.ambient) return [];

    // Check customInteractiveChoice to see which interactives should be shown
    const choice = kioskContent.customInteractiveChoice;
    
    // Find the first non-empty custom interactive and return only that one
    // CustomInteractive 1
    if (choice?.customInteractive1 && choice.customInteractive1.trim() !== '') {
      const data = kioskContent.customInteractive1;
      if (data && hasContent(data)) {
        const mapped = processCustomInteractive({ data: data as CustomInteractiveContent, number: 1 });
        return mapped ? [mapped] : [];
      }
    }

    // CustomInteractive 2
    if (choice?.customInteractive2 && choice.customInteractive2.trim() !== '') {
      const data = kioskContent.customInteractive2;
      if (data && hasContent(data)) {
        const mapped = processCustomInteractive({ data: data as CustomInteractiveContent, number: 2 });
        return mapped ? [mapped] : [];
      }
    }

    // CustomInteractive 3
    if (choice?.customInteractive3 && choice.customInteractive3.trim() !== '') {
      const data = kioskContent.customInteractive3;
      if (data && hasContent(data)) {
        const mapped = processCustomInteractive({ data: data as CustomInteractiveContent, number: 3 });
        return mapped ? [mapped] : [];
      }
    }

    return [];

    // Helper function to process a single custom interactive
    function processCustomInteractive(item: { data: CustomInteractiveContent; number: 1 | 2 | 3 }) {
      const mapper = getCustomInteractiveMapper(item.number);

      try {
        if (!mapper) {
          // Interactive 2 uses direct object construction
          const demo = kioskContent.demoMain;
          const ambient = kioskContent.ambient!; // Safe because we checked at the start

          return {
            firstScreen: {
              demoIframeSrc: demo?.iframeLink,
              eyebrow: ambient.title,
              headline: item.data.headline,
              heroImageAlt: '',
              heroImageSrc: item.data.image,
              overlayCardLabel: demo?.demoText,
              overlayEndTourLabel: demo?.mainCTA,
              overlayHeadline: demo?.headline,
              primaryCtaLabel: undefined,
              secondaryCtaLabel: item.data.secondaryCTA,
            },
          };
        }

        return mapper(item.data, kioskContent.ambient!, kioskContent.demoMain);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`[useKioskSlides] Failed to map custom interactive ${item.number}:`, error);
        }
        return null;
      }
    }
  }, [kioskContent]);

  // Track missing sections for better error reporting
  const missingSections = useMemo(() => {
    const missing: string[] = [];
    if (!challenges) missing.push('challenges');
    if (!solutionAccordion && !solutionGrid) missing.push('solutions');
    if (!values) missing.push('values');
    if (customInteractives.length === 0) missing.push('customInteractive');
    return missing;
  }, [challenges, customInteractives, solutionAccordion, solutionGrid, values]);

  // Build slides
  const slides = useMemo(() => {
    // Log missing sections for debugging
    if (!challenges || (!solutionAccordion && !solutionGrid) || !values || customInteractives.length === 0) {
      const missing: string[] = [];
      if (!challenges) missing.push('challenges');
      if (!solutionAccordion && !solutionGrid) missing.push('solutions');
      if (!values) missing.push('values');
      if (customInteractives.length === 0) missing.push('customInteractive');

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useKioskSlides] Kiosk ${kioskId} missing sections:`, missing.join(', '));
      }

      return [];
    }

    // Merge solution screens from both grid and accordion
    // Grid provides: firstScreen, secondScreen, thirdScreen
    // Accordion provides: firstScreen, secondScreen, fourthScreen
    // Result: firstScreen, secondScreen, thirdScreen (if grid exists), fourthScreen (if accordion exists)
    const mergedSolutionScreens = {
      ...(solutionGrid ?? {}),
      ...(solutionAccordion ?? {}),
    };

    return [
      ...buildChallengeSlides(challenges, kioskId, globalHandlers, {
        initialScreen: {
          idleVideoSrc: kioskContent?.idle?.videoSrc,
        },
        onInitialButtonClick: handleInitialButtonClick,
      }),
      // Build solution slides from merged data
      // Order: first, second, third (if from grid), fourth (if from accordion)
      ...buildSolutionSlides(mergedSolutionScreens, kioskId, {
        ...globalHandlers,
        onRegisterListHandlers: handleRegisterListHandlers,
      }),
      ...buildValueSlides(values, kioskId, globalHandlers, {
        registerCarouselHandlers: handleRegisterCarouselHandlers,
      }),
      // Build slides for all enabled custom interactives with unique IDs
      ...customInteractives.flatMap((customInteractive, index) =>
        buildCustomInteractiveSlides(customInteractive, kioskId, scrollToSectionById, index)
      ),
    ];
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
