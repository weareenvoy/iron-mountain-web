import type { KioskId } from '../_types/kiosk-id';

// Utility functions for scroll navigation. Extracts the section names from scroll ids

/**
 * Utilities for working with kiosk scroll sections.
 * Centralizes section detection logic to avoid duplication.
 */

export type Section = 'challenge' | 'customInteractive' | 'initial' | 'solution' | 'unknown' | 'value';

/**
 * Extracts the section name from a scroll target ID.
 */
export const getSectionFromScrollTarget = (target: null | string): Section => {
  if (!target) return 'initial';

  // Initial screens (various naming patterns)
  if (target === 'challenge-initial' || target === 'cover-ambient-initial' || target.endsWith('-initial')) {
    return 'initial';
  }

  if (target.startsWith('challenge-')) return 'challenge';
  if (target.startsWith('solution-')) return 'solution';
  if (target.startsWith('value-')) return 'value';
  if (target.includes('customInteractive-')) return 'customInteractive';

  // Challenge section scroll targets without prefix (legacy)
  const challengeTargets = ['description', 'main-description', 'bottom-description', 'metrics-description'];
  if (challengeTargets.includes(target)) return 'challenge';

  return 'unknown';
};

/**
 * Determines if navigation is crossing a major section boundary.
 */
export const isCrossingSectionBoundary = (currentTarget: null | string, previousTarget: null | string): boolean => {
  const currentSection = getSectionFromScrollTarget(currentTarget);
  const previousSection = getSectionFromScrollTarget(previousTarget);
  return currentSection !== previousSection;
};

/**
 * Maps KioskId to store key with runtime validation.
 * Uses explicit switch statement instead of string parsing to prevent errors.
 */
export const getStoreKey = (kioskId: KioskId): 'kiosk1' | 'kiosk2' | 'kiosk3' => {
  switch (kioskId) {
    case 'kiosk_1':
      return 'kiosk1';
    case 'kiosk_2':
      return 'kiosk2';
    case 'kiosk_3':
      return 'kiosk3';
    default:
      // Unreachable if kioskId is correctly typed, but kept as a runtime guard
      throw new Error(`Invalid kioskId: ${kioskId}. Expected 'kiosk_1', 'kiosk_2', or 'kiosk_3'.`);
  }
};
