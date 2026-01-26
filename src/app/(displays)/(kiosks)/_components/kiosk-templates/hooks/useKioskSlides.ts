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

  // Map solutions - dynamically choose between accordion and grid based on data presence
  const solutions = useMemo(() => {
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

      // Check if solutionGrid has actual data (non-empty diamondList with content)
      const hasGridData =
        kioskContent.solutionGrid &&
        typeof kioskContent.solutionGrid === 'object' &&
        Array.isArray(kioskContent.solutionGrid.diamondList) &&
        kioskContent.solutionGrid.diamondList.some(item => item?.trim());

      // Prefer accordion if it has data, otherwise use grid if it has data
      if (hasAccordionData) {
        return mapSolutionsWithAccordion(
          kioskContent.solutionMain,
          kioskContent.solutionAccordion,
          kioskContent.ambient
        );
      }

      if (hasGridData && diamondMapping) {
        return mapSolutionsWithGrid(
          kioskContent.solutionMain,
          kioskContent.solutionGrid,
          kioskContent.ambient,
          diamondMapping
        );
      }

      return null;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map solutions:', error);
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

  // Map custom interactive - only if customInteractive data has content
  const customInteractive = useMemo(() => {
    if (!kioskContent?.ambient) return null;

    const customInteractiveKey =
      kioskId === 'kiosk-1'
        ? 'customInteractive1'
        : kioskId === 'kiosk-2'
          ? 'customInteractive2'
          : 'customInteractive3';

    const customInteractiveData = kioskContent[customInteractiveKey];
    if (!customInteractiveData || !hasContent(customInteractiveData)) return null;

    const mapper = getCustomInteractiveMapper(kioskId);

    try {
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
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map custom interactive:', error);
      }
      return null;
    }
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
