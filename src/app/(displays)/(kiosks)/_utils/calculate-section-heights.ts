/**
 * Utilities for calculating dynamic gradient heights based on rendered templates.
 *
 * Gradients need to span the entire section height, which varies based on:
 * - Which templates are present in the data
 * - The kiosk variant (kiosk-1, kiosk-2, kiosk-3)
 * - Content-specific height variations (e.g., animated vs static carousels)
 *
 * Error Handling:
 * - Returns 0 for missing/invalid sections (graceful degradation)
 * - Logs warnings in development for debugging
 * - Production behavior: silent fallback to prevent display errors
 */

import {
  CHALLENGE_HEIGHTS,
  CUSTOM_INTERACTIVE_HEIGHTS,
  GRADIENT_START_POSITIONS,
  SOLUTION_HEIGHTS,
  type CustomInteractiveNumber,
  type GradientSection,
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
  const hasSecondScreen = solutionSlides.some(slide => slide.id.startsWith('solution-second'));
  const hasThirdScreen = solutionSlides.some(slide => slide.id === 'solution-third');
  const hasFourthScreen = solutionSlides.some(slide => slide.id === 'solution-fourth');

  let totalHeight = 0;

  // Add heights for each rendered solution screen
  solutionSlides.forEach(slide => {
    if (slide.id === 'solution-first') {
      // Conditional firstScreen height based on which other screens are present:
      // - When ONLY firstScreen (no other solution screens): use 4100 (kiosk-1, kiosk-3) or 4160 (kiosk-2)
      // - When only grid present (no numbered list, no accordion): use 2665
      // - When numbered list AND accordion present (no grid): use 5800
      // - Otherwise: use default height from config (4230)
      let firstScreenHeight = heights.firstScreen;
      
      if (!hasSecondScreen && !hasThirdScreen && !hasFourthScreen) {
        // Only firstScreen, nothing else - kiosk-specific height
        firstScreenHeight = kioskId === 'kiosk-2' ? 4100 : 4160;
      } else if (!hasSecondScreen && !hasFourthScreen && hasThirdScreen) {
        // Only grid present
        firstScreenHeight = 2665;
      } else if (hasSecondScreen && hasFourthScreen && !hasThirdScreen) {
        // Numbered list + accordion, no grid
        firstScreenHeight = 5800;
      }
      
      totalHeight += firstScreenHeight;
    } else if (slide.id.startsWith('solution-second')) {
      // Use different height based on whether grid (third screen) or accordion (fourth screen) is present
      // When grid OR accordion is present, use reduced height (3644)
      // When neither is present, use full height from config (5130)
      const secondScreenHeight = hasThirdScreen || hasFourthScreen ? 3644 : heights.secondScreen;
      totalHeight += secondScreenHeight;
    } else if (slide.id === 'solution-third') {
      totalHeight += heights.thirdScreen;
    } else if (slide.id === 'solution-fourth') {
      // IMPORTANT: When fourth screen (accordion) appears WITHOUT third screen (grid),
      // we use the thirdScreen height value instead of fourthScreen.
      // This allows per-kiosk customization of accordion height when it appears standalone.
      // Example: Kiosk-3 uses thirdScreen: 5130 for standalone accordion
      // When both grid and accordion are present, use the fourthScreen height
      totalHeight += !hasThirdScreen ? heights.thirdScreen : heights.fourthScreen;
    }
  });

  return totalHeight;
};

/**
 * Calculate the gradient height for Custom Interactive sections
 * Returns an array since there can be multiple custom interactives
 * Heights are based on the custom interactive number (1, 2, 3) not the kiosk ID
 */
export const calculateCustomInteractiveGradientHeights = (slides: Slide[]): number[] => {
  const gradientHeights: number[] = [];

  // Find all custom interactive instances by their index
  // Format: customInteractive-0-first-ci1, customInteractive-0-second-ci1
  //         customInteractive-0-first-ci2, customInteractive-0-second-ci2
  //         OR customInteractive-first, customInteractive-second (legacy single instance)
  const customInteractiveIndices = new Set<number>();

  slides.forEach(slide => {
    if (slide.id.startsWith('customInteractive-')) {
      // Try to extract index from format: customInteractive-{index}-{screen}-ci{number}
      const match = slide.id.match(/customInteractive-(\d+)-/);
      if (match?.[1]) {
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
      // Find slides for this instance to extract custom interactive number
      const instanceSlides = slides.filter(slide => {
        if (index === 0 && (slide.id === 'customInteractive-first' || slide.id === 'customInteractive-second')) {
          return true;
        }
        return slide.id.startsWith(`customInteractive-${index}-`);
      });

      // Extract custom interactive number from slide ID (e.g., -ci1, -ci2, -ci3)
      let customInteractiveNumber: CustomInteractiveNumber = '1'; // Default to 1
      for (const slide of instanceSlides) {
        const ciMatch = slide.id.match(/-ci(\d)/);
        if (ciMatch?.[1]) {
          const extractedNumber = ciMatch[1];
          // Validate extracted number is valid
          if (extractedNumber === '1' || extractedNumber === '2' || extractedNumber === '3') {
            customInteractiveNumber = extractedNumber;
            break;
          }
        }
      }

      // Get heights specific to this custom interactive number
      const heights = CUSTOM_INTERACTIVE_HEIGHTS[customInteractiveNumber];

      if (!heights) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[calculateCustomInteractiveGradientHeights] Missing height config for CI${customInteractiveNumber}`
          );
        }
        return; // Skip this instance
      }

      let totalHeight = 0;

      // Check which screens exist in the instanceSlides array
      const hasFirstScreen = instanceSlides.some(s => s.id.includes('-first') || s.id === 'customInteractive-first');
      const hasSecondScreen = instanceSlides.some(s => s.id.includes('-second') || s.id === 'customInteractive-second');

      if (hasFirstScreen) totalHeight += heights.firstScreen;
      if (hasSecondScreen) totalHeight += heights.secondScreen;

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
    customInteractive: calculateCustomInteractiveGradientHeights(slides),
    solution: calculateSolutionGradientHeight(slides, kioskId),
    value: 0, // Value section handles its own height dynamically
  };

  return heights;
};

/**
 * Get the gradient start position (top offset) for a section
 */
export const getGradientStartPosition = (section: GradientSection, kioskId: KioskId): number => {
  const sectionPositions = GRADIENT_START_POSITIONS[section];
  if (!sectionPositions) return 0;
  return sectionPositions[kioskId];
};
