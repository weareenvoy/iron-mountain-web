import { useMemo } from 'react';
import { mapChallenges } from '@/app/(displays)/(kiosks)/_mappers/map-challenges';
import { mapCustomInteractiveKiosk1 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk1';
import { mapCustomInteractiveKiosk3 } from '@/app/(displays)/(kiosks)/_mappers/map-custom-interactive-kiosk3';
import { mapSolutionsWithAccordion } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-accordion';
import { mapSolutionsWithGrid, type DiamondMapping } from '@/app/(displays)/(kiosks)/_mappers/map-solutions-with-grid';
import { mapValue } from '@/app/(displays)/(kiosks)/_mappers/map-value';
import { parseKioskChallenges } from '@/app/(displays)/(kiosks)/_types/challengeContent';
import {
  getSolutionContentState,
  hasAccordionData,
  hasContent,
  hasGridData,
} from '@/app/(displays)/(kiosks)/_utils/content-validation';
import type { CustomInteractiveContent } from '@/app/(displays)/(kiosks)/_types/content-types';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';
import type { ParsedKioskData } from '@/app/(displays)/(kiosks)/_utils/parseKioskData';

/**
 * Type guard to check if data is valid CustomInteractiveContent
 */
const isCustomInteractiveContent = (data: unknown): data is CustomInteractiveContent => {
  return (
    typeof data === 'object' &&
    data !== null &&
    (('headline' in data && typeof data.headline === 'string') ||
      ('image' in data && typeof data.image === 'string') ||
      ('mainCTA' in data && typeof data.mainCTA === 'string'))
  );
};

/**
 * Maps parsed kiosk content to challenge slides format.
 */
export const useMappedChallenges = (kioskContent: null | ParsedKioskData) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return null;

    try {
      return parseKioskChallenges(mapChallenges(kioskContent.challengeMain ?? {}, kioskContent.ambient));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useMappedChallenges] Failed to map challenge content:', error);
      }
      return null;
    }
  }, [kioskContent]);
};

/**
 * Maps parsed kiosk content to solution accordion slides format.
 */
export const useMappedSolutionAccordion = (kioskContent: null | ParsedKioskData) => {
  return useMemo(() => {
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

      return mapSolutionsWithAccordion(
        kioskContent.solutionMain,
        kioskContent.solutionAccordion!,
        kioskContent.ambient
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useMappedSolutionAccordion] Failed to map solution accordion content:', error);
      }
      return null;
    }
  }, [kioskContent]);
};

/**
 * Maps parsed kiosk content to solution grid slides format.
 */
export const useMappedSolutionGrid = (kioskContent: null | ParsedKioskData, diamondMapping?: DiamondMapping) => {
  return useMemo(() => {
    if (!kioskContent?.ambient || !diamondMapping) return null;

    const { hasAnyContent, hasMainContent } = getSolutionContentState(kioskContent);
    if (!hasAnyContent || !hasMainContent || !kioskContent.solutionMain) return null;

    try {
      const hasData = hasGridData(kioskContent.solutionGrid);

      if (!hasData) return null;

      return mapSolutionsWithGrid(
        kioskContent.solutionMain,
        kioskContent.solutionGrid!,
        kioskContent.ambient,
        diamondMapping
      );
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useMappedSolutionGrid] Failed to map solution grid content:', error);
      }
      return null;
    }
  }, [kioskContent, diamondMapping]);
};

/**
 * Maps parsed kiosk content to value slides format.
 */
export const useMappedValues = (kioskContent: null | ParsedKioskData, kioskId: KioskId) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return null;
    if (!kioskContent.valueMain || !hasContent(kioskContent.valueMain)) return null;

    try {
      return mapValue(kioskContent.valueMain, kioskContent.ambient, kioskId);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[useMappedValues] Failed to map value content:', error);
      }
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
export const useMappedCustomInteractives = (kioskContent: null | ParsedKioskData) => {
  return useMemo(() => {
    if (!kioskContent?.ambient) return [];

    const choice = kioskContent.customInteractiveChoice;

    // Find the first non-empty custom interactive and return only that one
    const interactiveChoices: Array<{ data: unknown; key: string; number: 1 | 2 | 3 }> = [
      { data: kioskContent.customInteractive1, key: choice?.customInteractive1 ?? '', number: 1 },
      { data: kioskContent.customInteractive2, key: choice?.customInteractive2 ?? '', number: 2 },
      { data: kioskContent.customInteractive3, key: choice?.customInteractive3 ?? '', number: 3 },
    ];

    for (const interactive of interactiveChoices) {
      if (interactive.key && interactive.key.trim() !== '' && interactive.data && hasContent(interactive.data)) {
        if (!isCustomInteractiveContent(interactive.data)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(
              `[useMappedCustomInteractives] Invalid custom interactive ${interactive.number} data structure`
            );
          }
          continue;
        }

        try {
          const mapper = getCustomInteractiveMapper(interactive.number);

          if (!mapper) {
            // Interactive 2 uses direct object construction
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
                  overlayCardLabel: demo?.demoText,
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
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error(
              `[useMappedCustomInteractives] Failed to process custom interactive ${interactive.number}:`,
              error
            );
          }
          // Continue to next interactive on error
          continue;
        }
      }
    }

    return [];
  }, [kioskContent]);
};
