import type { ValueDiamondCard } from '../_types/value-types';

// This file applies consistent color patterns to diamond cards in the Value section of the Kiosk setup. For example it will detect the carousel in Value and put the Diamonds in the right Color order (Orange, Blue, Purple - Purple, Orange, Blue, etc. Based on which slide is in use in the value Carousel.)

const paletteColors = ['#8a0d71', '#1b75bc', '#f26522'] as const;
const paletteTextColors = [undefined, undefined, undefined] as const;

/**
 * Normalizes diamond card configurations with appropriate colors based on patterns.
 * Applies special color logic for Kiosk 1's carousel pattern (3 cards with labeled last card).
 * Falls back to palette colors for other patterns.
 *
 * @param cards - The diamond cards to normalize
 * @returns Normalized diamond cards with colors applied
 */
export const normalizeDiamondCards = (cards?: readonly ValueDiamondCard[]): readonly ValueDiamondCard[] => {
  if (!cards || cards.length === 0) return [];

  // Check if this is a carousel slide (has a labeled card at the end with empty labels before it)
  const lastCard = cards[cards.length - 1];
  const hasCarouselPattern =
    cards.length === 3 && lastCard?.label && cards.slice(0, -1).every(card => !card.label || card.label === '');

  if (hasCarouselPattern) {
    // Apply Kiosk 1's carousel color logic based on the labeled benefit
    const labelNormalized = (lastCard.label ?? '').toLowerCase();

    if (labelNormalized.includes('operational')) {
      // Operational: [Orange, Blue, Purple (labeled)]
      return [
        { ...cards[0], color: '#f26522', textColor: '#4a154b' },
        { ...cards[1], color: '#1b75bc' },
        { ...cards[2], color: '#8a0d71', label: lastCard.label },
      ];
    }

    if (labelNormalized.includes('economic')) {
      // Economic: [Purple, Orange, Blue (labeled)]
      return [
        { ...cards[0], color: '#8a0d71' },
        { ...cards[1], color: '#f26522', textColor: '#4a154b' },
        { ...cards[2], color: '#1b75bc', label: lastCard.label },
      ];
    }

    // Strategic (default): [Blue, Purple, Orange (labeled)]
    return [
      { ...cards[0], color: '#1b75bc' },
      { ...cards[1], color: '#8a0d71' },
      { ...cards[2], color: '#f26522', label: lastCard.label, textColor: '#4a154b' },
    ];
  }

  // For overview slides or other patterns, use the palette
  return cards.map((card, idx) => ({
    ...card,
    color: card.color ?? paletteColors[idx % paletteColors.length],
    textColor: card.textColor ?? paletteTextColors[idx % paletteTextColors.length],
  }));
};
