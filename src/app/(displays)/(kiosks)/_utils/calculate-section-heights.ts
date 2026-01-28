/**
 * Utilities for calculating dynamic gradient heights based on rendered templates.
 * 
 * Gradients need to span the entire section height, which varies based on:
 * - Which templates are present in the data
 * - The kiosk variant (kiosk-1, kiosk-2, kiosk-3)
 * - Content-specific height variations (e.g., animated vs static carousels)
 */

import {
  CHALLENGE_HEIGHTS,
  CUSTOM_INTERACTIVE_HEIGHTS,
  GRADIENT_START_POSITIONS,
  SOLUTION_HEIGHTS,
} from '@/app/(displays)/(kiosks)/_constants/slide-heights';
import type { Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type SectionHeights = {
  challenge: number;
  customInteractive: number[];
  solution: number;
  value: number;
};

/**
 * Calculate the gradient height for the Challenge section
 */
export const calculateChallengeGradientHeight = (slides: Slide[], kioskId: KioskId): number => {
  const challengeSlides = slides.filter(slide => slide.id.startsWith('challenge-') && slide.id !== 'challenge-initial');
  
  if (challengeSlides.length === 0) return 0;

  const heights = CHALLENGE_HEIGHTS[kioskId];
  let totalHeight = 0;

  // Add heights for each rendered challenge screen (excluding initial)
  challengeSlides.forEach(slide => {
    if (slide.id === 'challenge-first') {
      totalHeight += heights.firstScreen;
    } else if (slide.id === 'challenge-second') {
      totalHeight += heights.secondScreen;
    } else if (slide.id === 'challenge-third') {
      totalHeight += heights.thirdScreen;
    }
  });

  return totalHeight;
};

/**
 * Calculate the gradient height for the Solution section
 */
export const calculateSolutionGradientHeight = (slides: Slide[], kioskId: KioskId): number => {
  const solutionSlides = slides.filter(slide => slide.id.startsWith('solution-'));
  
  if (solutionSlides.length === 0) return 0;

  const heights = SOLUTION_HEIGHTS[kioskId];
  let totalHeight = 0;

  // Add heights for each rendered solution screen
  solutionSlides.forEach(slide => {
    if (slide.id === 'solution-first') {
      totalHeight += heights.firstScreen;
    } else if (slide.id.startsWith('solution-second')) {
      totalHeight += heights.secondScreen;
    } else if (slide.id === 'solution-third') {
      totalHeight += heights.thirdScreen;
    } else if (slide.id === 'solution-fourth') {
      totalHeight += heights.fourthScreen;
    }
  });

  return totalHeight;
};

/**
 * Calculate the gradient height for Custom Interactive sections
 * Returns an array since there can be multiple custom interactives
 */
export const calculateCustomInteractiveGradientHeights = (slides: Slide[], kioskId: KioskId): number[] => {
  const heights = CUSTOM_INTERACTIVE_HEIGHTS[kioskId];
  const gradientHeights: number[] = [];

  // Find all custom interactive instances by their index
  // Format: customInteractive-0-first, customInteractive-0-second
  //         customInteractive-1-first, customInteractive-1-second
  //         OR customInteractive-first, customInteractive-second (legacy single instance)
  const customInteractiveIndices = new Set<number>();
  
  slides.forEach(slide => {
    if (slide.id.startsWith('customInteractive-')) {
      // Try to extract index from format: customInteractive-{index}-{screen}
      const match = slide.id.match(/customInteractive-(\d+)-/);
      if (match) {
        customInteractiveIndices.add(parseInt(match[1], 10));
      } else if (slide.id === 'customInteractive-first' || slide.id === 'customInteractive-second') {
        // Handle legacy single custom interactive format (no index)
        customInteractiveIndices.add(0);
      }
    }
  });

  // Calculate height for each custom interactive instance
  Array.from(customInteractiveIndices)
    .sort((a, b) => a - b)
    .forEach(index => {
      let totalHeight = 0;
      
      // Check for indexed format (customInteractive-0-first) or legacy format (customInteractive-first)
      const hasIndexedFirst = slides.some(s => s.id === `customInteractive-${index}-first`);
      const hasIndexedSecond = slides.some(s => s.id === `customInteractive-${index}-second`);
      const hasLegacyFirst = index === 0 && slides.some(s => s.id === 'customInteractive-first');
      const hasLegacySecond = index === 0 && slides.some(s => s.id === 'customInteractive-second');

      if (hasIndexedFirst || hasLegacyFirst) totalHeight += heights.firstScreen;
      if (hasIndexedSecond || hasLegacySecond) totalHeight += heights.secondScreen;

      if (totalHeight > 0) {
        gradientHeights.push(totalHeight);
      }
    });

  return gradientHeights;
};

/**
 * Calculate all section gradient heights from the rendered slides
 */
export const calculateSectionGradientHeights = (slides: Slide[], kioskId: KioskId): SectionHeights => {
  const heights = {
    challenge: calculateChallengeGradientHeight(slides, kioskId),
    customInteractive: calculateCustomInteractiveGradientHeights(slides, kioskId),
    solution: calculateSolutionGradientHeight(slides, kioskId),
    value: 0, // Value section handles its own height dynamically
  };

  // Log calculated heights in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Gradient Heights - ${kioskId}]`, {
      challenge: `${heights.challenge}px`,
      customInteractive: heights.customInteractive.map((h, i) => `[${i}]: ${h}px`),
      solution: `${heights.solution}px`,
      slideIds: slides.map(s => s.id),
    });
  }

  return heights;
};

/**
 * Get the gradient start position (top offset) for a section
 */
export const getGradientStartPosition = (section: 'challenge' | 'solution' | 'customInteractive' | 'value', kioskId: KioskId): number => {
  return GRADIENT_START_POSITIONS[section][kioskId];
};
