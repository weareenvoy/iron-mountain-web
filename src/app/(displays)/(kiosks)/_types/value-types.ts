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
