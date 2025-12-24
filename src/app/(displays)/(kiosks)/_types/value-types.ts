import { type ComponentType, type SVGProps } from 'react';

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
