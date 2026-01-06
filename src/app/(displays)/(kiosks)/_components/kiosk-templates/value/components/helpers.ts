import { LAYOUT, MAX_DIAMONDS, MAX_SLIDES } from './constants';
import type { DiamondIndex, SlideIndex, ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Validates if indices are within valid ranges for carousel operations.
 * @param slideIndex - The slide index to validate
 * @param diamondIndex - The diamond index to validate
 * @returns True if both indices are valid
 */
export function areIndicesValid(slideIndex: number, diamondIndex: number): boolean {
  return slideIndex >= 0 && slideIndex < MAX_SLIDES && diamondIndex >= 0 && diamondIndex < MAX_DIAMONDS;
}

/**
 * Gets the left position (in px) for a diamond on a specific slide.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond being positioned (0-2)
 * @returns The left position in pixels, or null if indices are invalid
 */
export function getDiamondPositionForSlide(slideIndex: number, diamondIndex: number): null | number {
  if (!areIndicesValid(slideIndex, diamondIndex)) {
    return null;
  }
  return LAYOUT.POSITIONS[slideIndex as SlideIndex]![diamondIndex as DiamondIndex]!;
}

/**
 * Gets the z-index class for a diamond on a specific slide.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond being styled (0-2)
 * @returns Tailwind z-index class string (e.g., 'z-2'), empty string, or null if indices are invalid
 */
export function getDiamondZIndex(slideIndex: number, diamondIndex: number): null | string {
  if (!areIndicesValid(slideIndex, diamondIndex)) {
    return null;
  }
  return LAYOUT.Z_INDICES[slideIndex as SlideIndex]![diamondIndex as DiamondIndex]!;
}

/**
 * Determines if a diamond's text should be visible on a specific slide.
 * The diamond at position 500px always shows its text.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond to check (0-2)
 * @returns True if text should be visible, false if not, or null if indices are invalid
 */
export function shouldShowDiamondText(slideIndex: number, diamondIndex: number): boolean | null {
  if (!areIndicesValid(slideIndex, diamondIndex)) {
    return null;
  }
  return LAYOUT.TEXT_VISIBILITY[slideIndex as SlideIndex]![diamondIndex as DiamondIndex]!;
}

/**
 * Filters and returns valid bullet point items from a carousel slide.
 * Removes empty or whitespace-only entries.
 * @param slide - The carousel slide containing bullet points
 * @returns Array of non-empty bullet point strings
 */
export function getBulletItems(slide: ValueCarouselSlide): string[] {
  return slide.bullets?.filter(entry => entry && entry.trim().length > 0) ?? [];
}
