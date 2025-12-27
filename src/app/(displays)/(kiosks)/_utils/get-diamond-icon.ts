import { type ComponentType, type SVGProps } from 'react';
import BlueFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/BlueFilledDiamond';
import OrangeFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/OrangeFilledDiamond';
import PurpleFilledDiamond from '@/components/ui/icons/Kiosks/Solutions/PurpleFilledDiamond';
import type { ValueDiamondCard } from '../_types/value-types';

// This file gets the appropriate diamond icon component based on the card's color. For example it matches color hex codes to the blueFilledDiamond, the orangeFilledDiamond, or the purpleFilledDiamond SVG Components.

const diamondIconMap: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  '#1b75bc': BlueFilledDiamond,
  '#6dcff6': BlueFilledDiamond,
  '#8a0d71': PurpleFilledDiamond,
  '#a2115e': PurpleFilledDiamond,
  '#f99d1c': OrangeFilledDiamond,
  '#f7931e': OrangeFilledDiamond,
  '#f26522': OrangeFilledDiamond,
};

/**
 * Gets the appropriate diamond icon component based on the card's color.
 * Falls back to color-based mapping if no icon is explicitly provided.
 *
 * @param card - The diamond card configuration
 * @returns The icon component or undefined
 */
export const getDiamondIcon = (card: ValueDiamondCard): ComponentType<SVGProps<SVGSVGElement>> | undefined => {
  if (card.icon) return card.icon;

  const normalizedColor = card.color?.toLowerCase();
  return normalizedColor ? diamondIconMap[normalizedColor] : undefined;
};
