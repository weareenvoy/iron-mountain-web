import type { SolutionAccordionItem } from '@/app/(displays)/(kiosks)/_types/content-types';
import type { ParsedKioskData } from '@/app/(displays)/(kiosks)/_utils/parseKioskData';

const MAX_RECURSION_DEPTH = 10;

/**
 * Helper to check if an object has meaningful content.
 * Recursively checks for non-empty strings, non-empty arrays, or nested objects with content.
 *
 * @param obj - The object to check for content
 * @param depth - Current recursion depth (internal, prevents stack overflow)
 * @returns true if the object contains meaningful content
 */
export const hasContent = (obj: unknown, depth = 0): boolean => {
  if (!obj || typeof obj !== 'object') return false;
  if (depth > MAX_RECURSION_DEPTH) return false;

  if (Array.isArray(obj)) {
    return obj.some(item => hasContent(item, depth + 1) || (typeof item === 'string' && item.trim().length > 0));
  }

  return Object.values(obj).some(value => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number') return true;
    if (typeof value === 'boolean') return true;
    if (Array.isArray(value)) return value.length > 0 && hasContent(value, depth + 1);
    if (typeof value === 'object' && value !== null) return hasContent(value, depth + 1);
    return false;
  });
};

/**
 * Analyzes solution content and returns detailed state about what content exists.
 * Returns an object with multiple boolean flags for granular content checking.
 *
 * @returns Object with flags for accordion, grid, main, and overall content presence
 */
export const getSolutionContentState = (
  kioskContent: null | ParsedKioskData
): {
  hasAccordionContent: boolean;
  hasAnyContent: boolean;
  hasGridContent: boolean;
  hasMainContent: boolean;
} => {
  if (!kioskContent) {
    return {
      hasAccordionContent: false,
      hasAnyContent: false,
      hasGridContent: false,
      hasMainContent: false,
    };
  }

  const hasMainContent = !!(kioskContent.solutionMain && hasContent(kioskContent.solutionMain));
  const hasAccordionContent = !!(kioskContent.solutionAccordion && hasContent(kioskContent.solutionAccordion));
  const hasGridContent = !!(kioskContent.solutionGrid && hasContent(kioskContent.solutionGrid));

  return {
    hasAccordionContent,
    hasAnyContent: hasMainContent || hasAccordionContent || hasGridContent,
    hasGridContent,
    hasMainContent,
  };
};

/**
 * Checks if accordion data has actual items with content.
 */
export const hasAccordionData = (solutionAccordion: ParsedKioskData['solutionAccordion']): boolean => {
  return !!(
    solutionAccordion &&
    typeof solutionAccordion === 'object' &&
    Array.isArray(solutionAccordion.accordion) &&
    solutionAccordion.accordion.some(
      (item: SolutionAccordionItem) => item.title?.trim() || (item.bullets && item.bullets.length > 0)
    )
  );
};

/**
 * Checks if grid data has actual non-empty diamond list entries.
 */
export const hasGridData = (solutionGrid: ParsedKioskData['solutionGrid']): boolean => {
  return !!(
    solutionGrid &&
    typeof solutionGrid === 'object' &&
    Array.isArray(solutionGrid.diamondList) &&
    solutionGrid.diamondList.some((item: null | string | undefined) => item?.trim())
  );
};

/**
 * Checks if numbered list has actual content.
 */
export const hasNumberedListData = (numberedList?: readonly (string | undefined)[]): boolean => {
  return !!(numberedList && Array.isArray(numberedList) && numberedList.some(item => item && item.trim().length > 0));
};
