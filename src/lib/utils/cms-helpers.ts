/**
 * Utility functions for transforming CMS data
 */

/**
 * Generates a kebab-case ID from a prefix and label
 * @example generateSlideId('value', 'Operational Benefits') => 'value-operational-benefits'
 */
export function generateSlideId(prefix: string, label: string): string {
  return `${prefix}-${label.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Maps array elements to named positions
 * @example mapArrayToPositions(['a', 'b', 'c'], { first: 0, last: 2 }) => { first: 'a', last: 'c' }
 */
export function mapArrayToPositions<T>(
  arr: readonly T[] | undefined,
  mapping: Record<string, number | undefined>
): Record<string, T | undefined> {
  if (!arr) return {};

  return Object.entries(mapping).reduce(
    (acc, [key, index]) => ({
      ...acc,
      [key]: index !== undefined ? arr[index] : undefined,
    }),
    {}
  );
}
