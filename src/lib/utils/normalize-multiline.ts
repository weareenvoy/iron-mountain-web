/**
 * Normalizes a multiline string value.
 * Returns undefined if value is null/undefined, or the string if it's valid.
 *
 * @param value - The value to normalize
 * @returns The string value or undefined
 */
export const normalizeMultiline = (value?: string): string | undefined => {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  return undefined;
};
