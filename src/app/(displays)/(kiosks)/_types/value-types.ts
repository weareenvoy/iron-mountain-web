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
