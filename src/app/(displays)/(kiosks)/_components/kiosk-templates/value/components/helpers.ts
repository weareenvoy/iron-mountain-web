import { LAYOUT } from './constants';
import type { DiamondIndex, SlideIndex, ValueCarouselSlide } from '@/app/(displays)/(kiosks)/_types/value-types';

/**
 * Gets the left position (in px) for a diamond on a specific slide.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond being positioned (0-2)
 * @returns The left position in pixels
 */
export function getDiamondPositionForSlide(slideIndex: SlideIndex, diamondIndex: DiamondIndex): number {
  // Safe to assert: SlideIndex and DiamondIndex types guarantee valid indices
  return LAYOUT.POSITIONS[slideIndex]![diamondIndex]!;
}

/**
 * Gets the z-index class for a diamond on a specific slide.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond being styled (0-2)
 * @returns Tailwind z-index class string (e.g., 'z-2') or empty string
 */
export function getDiamondZIndex(slideIndex: SlideIndex, diamondIndex: DiamondIndex): string {
  // Safe to assert: SlideIndex and DiamondIndex types guarantee valid indices
  return LAYOUT.Z_INDICES[slideIndex]![diamondIndex]!;
}

/**
 * Determines if a diamond's text should be visible on a specific slide.
 * The diamond at position 500px always shows its text.
 * @param slideIndex - The current slide (0-2)
 * @param diamondIndex - The diamond to check (0-2)
 * @returns True if text should be visible
 */
export function shouldShowDiamondText(slideIndex: SlideIndex, diamondIndex: DiamondIndex): boolean {
  // Safe to assert: SlideIndex and DiamondIndex types guarantee valid indices
  return LAYOUT.TEXT_VISIBILITY[slideIndex]![diamondIndex]!;
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
