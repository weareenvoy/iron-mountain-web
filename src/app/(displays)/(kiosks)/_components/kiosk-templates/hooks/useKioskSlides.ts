import { useMemo } from 'react';
import { buildAmbientCoverScreen, buildChallengeSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/challenge/challengeSlides';
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
import { parseKioskData } from '@/app/(displays)/(kiosks)/_utils/parseKioskData';
import type { CarouselHandlers } from '@/app/(displays)/(kiosks)/_types/carousel-types';
import type { CustomInteractiveContent, SolutionAccordionItem } from '@/app/(displays)/(kiosks)/_types/content-types';
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

type ParsedKioskContent = ReturnType<typeof parseKioskData>;

/**
 * Checks if any solution object (solutionMain, solutionAccordion, or solutionGrid) has content.
 * Returns true if at least one solution section contains data.
 */
const hasSolutionContent = (kioskContent: ParsedKioskContent): {
  hasAccordionContent: boolean;
  hasAnyContent: boolean;
  hasGridContent: boolean;
  hasMainContent: boolean;
} => {
  if (!kioskContent) {
    return {
      hasAccordionContent: false,
      hasAnyContent: false,
      hasGridContent: false,
      hasMainContent: false,
    };
  }

  const hasMainContent = !!(kioskContent.solutionMain && hasContent(kioskContent.solutionMain));
  const hasAccordionContent = !!(kioskContent.solutionAccordion && hasContent(kioskContent.solutionAccordion));
  const hasGridContent = !!(kioskContent.solutionGrid && hasContent(kioskContent.solutionGrid));

  return {
    hasAccordionContent,
    hasAnyContent: hasMainContent || hasAccordionContent || hasGridContent,
    hasGridContent,
    hasMainContent,
  };
};

/**
 * Builds challenge slides based on whether challenge content exists.
 * Returns ambient cover screen if no challenge content, full challenge slides otherwise.
 */
const buildChallengeSection = (
  challenges: ReturnType<typeof parseKioskChallenges> | null,
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
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to parse kiosk data:', error);
      }
      return null;
    }
  }, [kioskData]);

  // Map challenges - Build initial screen from ambient even if challenge content is empty
  const challenges = useMemo(() => {
    if (!kioskContent?.ambient) return null;

    try {
      return parseKioskChallenges(mapChallenges(kioskContent.challengeMain ?? {}, kioskContent.ambient));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map challenges:', error);
      }
      return null;
    }
  }, [kioskContent]);

  // Map solutions - only show if at least one solution object has content
  const solutionAccordion = useMemo(() => {
    if (!kioskContent?.ambient) return null;

    const { hasAnyContent, hasMainContent } = hasSolutionContent(kioskContent);
    if (!hasAnyContent || !hasMainContent || !kioskContent.solutionMain) return null;

    try {
      // Check if solutionAccordion has actual data (items with content)
      const hasAccordionData =
        kioskContent.solutionAccordion &&
        typeof kioskContent.solutionAccordion === 'object' &&
        Array.isArray(kioskContent.solutionAccordion.accordion) &&
        kioskContent.solutionAccordion.accordion.some((item: SolutionAccordionItem) =>
          item.title?.trim() || (item.bullets && item.bullets.length > 0)
        );

      // If no accordion data, still generate first and second screens from solutionMain alone
      if (!hasAccordionData) {
        // Return only firstScreen and secondScreen (no fourthScreen without accordion data)
        return mapSolutionsWithAccordion(
          kioskContent.solutionMain,
          { accordion: [], headline: '', image: '' },
          kioskContent.ambient
        );
      }

      return mapSolutionsWithAccordion(kioskContent.solutionMain, kioskContent.solutionAccordion, kioskContent.ambient);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useKioskSlides] Failed to map solution accordion:', error);
      }
      return null;
    }
  }, [kioskContent]);

  const solutionGrid = useMemo(() => {
    if (!kioskContent?.ambient || !diamondMapping) return null;

    const { hasAnyContent, hasMainContent } = hasSolutionContent(kioskContent);
    if (!hasAnyContent || !hasMainContent || !kioskContent.solutionMain) return null;

    try {
      // Check if solutionGrid has actual data (non-empty diamondList with content)
      const hasGridData =
        kioskContent.solutionGrid &&
        typeof kioskContent.solutionGrid === 'object' &&
        Array.isArray(kioskContent.solutionGrid.diamondList) &&
        kioskContent.solutionGrid.diamondList.some((item: string | null | undefined) => item?.trim());

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
      if (!kioskContent?.ambient) return null;

      const mapper = getCustomInteractiveMapper(item.number);

      try {
        if (!mapper) {
          // Interactive 2 uses direct object construction
          const demo = kioskContent.demoMain;
          const ambient = kioskContent.ambient;

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
            number: item.number,
          };
        }

        const mapped = mapper(item.data, kioskContent.ambient, kioskContent.demoMain);
        return { ...mapped, number: item.number };
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

  const slides = useMemo(() => {
    // Early return if kioskContent hasn't loaded yet - avoid error spam during initial render
    if (!kioskContent) {
      return [];
    }

    // Check if we have at least the ambient data (required for initial screen)
    if (!kioskContent.ambient) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[useKioskSlides] Kiosk ${kioskId} missing required ambient data`);
      }
      return [];
    }

    // Only log missing sections as info if ALL sections are missing (indicates a data problem)
    // Don't warn for intentionally optional sections (it's normal for some kiosks to skip sections)
    if (missingSections.length === 4 && process.env.NODE_ENV === 'development') {
      console.warn(`[useKioskSlides] Kiosk ${kioskId} has no content sections:`, missingSections.join(', '));
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
      if (process.env.NODE_ENV === 'development') {
        console.error(`[useKioskSlides] Kiosk ${kioskId} has no ambient data - cannot build initial screen`);
      }
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
    missingSections,
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
