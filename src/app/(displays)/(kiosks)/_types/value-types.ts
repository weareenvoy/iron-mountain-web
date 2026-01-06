import { type ComponentType, type SVGProps } from 'react';

// This file contains the types for the Value Carousel and its initial slide data.

export type ValueDiamondCard = {
  readonly color?: string;
  readonly icon?: ComponentType<SVGProps<SVGSVGElement>>;
  readonly label?: string;
  readonly textColor?: string;
};

export type ValueCarouselSlide = {
  readonly badgeLabel?: string;
  readonly bullets?: readonly string[];
  readonly diamondCards?: readonly ValueDiamondCard[];
  readonly id?: string;
};

/**
 * Valid slide indices for the value carousel (0-2).
 * Used for type-safe array access to position, z-index, and visibility maps.
 */
export type SlideIndex = 0 | 1 | 2;

/**
 * Valid diamond indices within each slide (0-2).
 * Used for type-safe array access to position, z-index, and visibility maps.
 */
export type DiamondIndex = 0 | 1 | 2;

/**
 * Branded type for pixel positions in the value carousel.
 * Provides type safety for position values throughout the carousel system.
 * The brand prevents accidental mixing of raw numbers with position values.
 */
export type Position = number & { readonly __brand: 'Position' };

/**
 * Helper to create a Position branded type from a number.
 * Used to safely convert pixel values to Position types.
 * @param value - The pixel value to brand as a Position
 * @returns A Position branded type
 */
export const createPosition = (value: number): Position => value as Position;
