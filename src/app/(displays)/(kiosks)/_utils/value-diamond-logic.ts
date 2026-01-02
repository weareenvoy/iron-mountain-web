import type { ValueDiamondCard } from '../_types/value-types';

// this controls how the Value diamonds in the value carousel will always show three diamonds and the last one will show its label. This way the build matches Figma.

/**
 * Business logic for mapping value proposition labels to diamond card configurations
 * Each configuration determines the color and positioning of diamonds in the stack
 */

/**
 * Builds diamond card configuration based on benefit label
 * Used to visually represent different types of benefits with color-coded diamonds
 */
export function buildDiamondCards(label?: string): readonly ValueDiamondCard[] {
  const normalized = (label ?? '').toLowerCase();

  if (normalized.includes('operational')) {
    return [
      { color: '#f26522', label: '', textColor: '#4a154b' },
      { color: '#1b75bc', label: '' },
      { color: '#8a0d71', label: 'Operational benefits' },
    ];
  }

  if (normalized.includes('economic') || normalized.includes('economical')) {
    return [
      { color: '#8a0d71', label: '' },
      { color: '#f26522', label: '', textColor: '#4a154b' },
      { color: '#1b75bc', label: 'Economic benefits' },
    ];
  }

  // Strategic benefits (default)
  return [
    { color: '#1b75bc', label: '' },
    { color: '#8a0d71', label: '' },
    { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
  ];
}

/**
 * Creates the overview diamond cards shown on the first value screen
 * These represent all three benefit categories together
 */
export function createOverviewDiamondCards(): readonly ValueDiamondCard[] {
  return [
    { color: '#8a0d71', label: 'Operational benefits' },
    { color: '#1b75bc', label: 'Economic benefits' },
    { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
  ];
}
