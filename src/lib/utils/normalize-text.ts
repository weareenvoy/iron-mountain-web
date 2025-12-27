// This makes sure a value is always a string and never undefined or null.

/**
 * Normalizes a string value to ensure it's always a string.
 * Converts undefined/null to empty string.
 *
 * @param value - The value to normalize
 * @returns A string, or empty string if value is not a string
 */
export const normalizeText = (value?: string): string => {
  if (typeof value === 'string') return value;
  return '';
};
