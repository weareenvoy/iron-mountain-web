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
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Hook for transforming raw CMS data into kiosk slides.
 * Handles data mapping, slide building, and memoization.
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
  readonly handleRegisterCarouselHandlers?: (handlers: {
    canScrollNext: () => boolean;
    canScrollPrev: () => boolean;
    scrollNext: () => void;
    scrollPrev: () => void;
  }) => void;
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
  const { globalHandlers, handleInitialButtonClick, handleRegisterCarouselHandlers, scrollToSectionById } =
    slideBuilders;

  // Parse kiosk data
  const kioskContent = kioskData as null | Record<string, unknown> | undefined;

  // Map challenges
  const challenges = useMemo(() => {
    if (!kioskContent?.challengeMain || !kioskContent.ambient) return null;
    return parseKioskChallenges(mapChallenges(kioskContent.challengeMain as never, kioskContent.ambient as never));
  }, [kioskContent]);

  // Map solutions
  const solutions = useMemo(() => {
    if (!kioskContent?.solutionMain || !kioskContent.ambient) return null;

    if (usesAccordion && kioskContent.solutionAccordion) {
      return mapSolutionsWithAccordion(
        kioskContent.solutionMain as never,
        kioskContent.solutionAccordion as never,
        kioskContent.ambient as never
      );
    }

    if (!usesAccordion && kioskContent.solutionGrid && diamondMapping) {
      return mapSolutionsWithGrid(
        kioskContent.solutionMain as never,
        kioskContent.solutionGrid as never,
        kioskContent.ambient as never,
        diamondMapping
      );
    }

    return null;
  }, [kioskContent, usesAccordion, diamondMapping]);

  // Map values
  const values = useMemo(() => {
    if (!kioskContent?.valueMain || !kioskContent.ambient) return null;
    return mapValue(kioskContent.valueMain as never, kioskContent.ambient as never, kioskId);
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
      // Kiosk 2 uses direct object construction
      return {
        firstScreen: {
          demoIframeSrc: (kioskContent.demoMain as Record<string, unknown>).iframeLink as string | undefined,
          eyebrow: (kioskContent.ambient as Record<string, unknown>).title as string | undefined,
          headline: (customInteractiveData as Record<string, unknown>).headline as string | undefined,
          heroImageAlt: '',
          heroImageSrc: (customInteractiveData as Record<string, unknown>).image as string | undefined,
          overlayCardLabel: (kioskContent.demoMain as Record<string, unknown>).demoText as string | undefined,
          overlayEndTourLabel: (kioskContent.demoMain as Record<string, unknown>).mainCTA as string | undefined,
          overlayHeadline: (kioskContent.demoMain as Record<string, unknown>).headline as string | undefined,
          primaryCtaLabel: undefined,
          secondaryCtaLabel: (customInteractiveData as Record<string, unknown>).secondaryCTA as string | undefined,
        },
      };
    }

    return mapper(customInteractiveData as never, kioskContent.ambient as never, kioskContent.demoMain as never);
  }, [kioskContent, kioskId]);

  // Build slides
  const slides = useMemo(() => {
    if (!challenges || !solutions || !values || !customInteractive) return [];

    return [
      ...buildChallengeSlides(challenges, kioskId, globalHandlers, {
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
    solutions,
    values,
    customInteractive,
    kioskId,
    globalHandlers,
    handleInitialButtonClick,
    handleRegisterCarouselHandlers,
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
