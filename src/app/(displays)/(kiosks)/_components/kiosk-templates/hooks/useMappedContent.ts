import { useMemo } from 'react';
import { mapChallenges } from '@/app/(displays)/(kiosks)/_mappers/map-challenges';
import { mapCustomInteractiveKiosk1 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk1';
import { mapCustomInteractiveKiosk3 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk3';
import { mapSolutionsWithAccordion } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-accordion';
import { mapSolutionsWithGrid, type DiamondMapping } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-grid';
import { mapValue } from '@/app/(displays)/(kiosks)/_mappers/map-value';
import { parseKioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import { hasAccordionData, hasContent, hasGridData, hasSolutionContent } from '@/app/(displays)/(kiosks)/_utils/content-validation';
import type { CustomInteractiveContent } from '@/app/(displays)/(kiosks)/_types/content-types';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { ParsedKioskData } from '@/app/(displays)/(kiosks)/_utils/parseKioskData';

/**
 * Maps parsed kiosk content to challenge slides format.
 */
export const useMappedChallenges = (kioskContent: ParsedKioskData | null) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return null;

    try {
      return parseKioskChallenges(mapChallenges(kioskContent.challengeMain ?? {}, kioskContent.ambient));
    } catch (error) {
      return null;
    }
  }, [kioskContent]);
};

/**
 * Maps parsed kiosk content to solution accordion slides format.
 */
export const useMappedSolutionAccordion = (kioskContent: ParsedKioskData | null) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return null;

    const { hasAnyContent, hasMainContent } = hasSolutionContent(kioskContent);
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
    } catch (error) {
      return null;
    }
  }, [kioskContent]);
};

/**
 * Maps parsed kiosk content to solution grid slides format.
 */
export const useMappedSolutionGrid = (kioskContent: ParsedKioskData | null, diamondMapping?: DiamondMapping) => {
  return useMemo(() => {
    if (!kioskContent?.ambient || !diamondMapping) return null;

    const { hasAnyContent, hasMainContent } = hasSolutionContent(kioskContent);
    if (!hasAnyContent || !hasMainContent || !kioskContent.solutionMain) return null;

    try {
      const hasData = hasGridData(kioskContent.solutionGrid);

      if (!hasData) return null;

      return mapSolutionsWithGrid(
        kioskContent.solutionMain,
        kioskContent.solutionGrid,
        kioskContent.ambient,
        diamondMapping
      );
    } catch (error) {
      return null;
    }
  }, [kioskContent, diamondMapping]);
};

/**
 * Maps parsed kiosk content to value slides format.
 */
export const useMappedValues = (kioskContent: ParsedKioskData | null, kioskId: KioskId) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.valueMain || !hasContent(kioskContent.valueMain)) return null;

    try {
      return mapValue(kioskContent.valueMain, kioskContent.ambient, kioskId);
    } catch (error) {
      return null;
    }
  }, [kioskContent, kioskId]);
};

/**
 * Helper to get appropriate custom interactive mapper by number
 */
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

/**
 * Maps parsed kiosk content to custom interactive slides format.
 * Only displays the FIRST non-empty custom interactive.
 */
export const useMappedCustomInteractives = (kioskContent: ParsedKioskData | null) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return [];

    const choice = kioskContent.customInteractiveChoice;

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
        return null;
      }
    }

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
  }, [kioskContent]);
};
