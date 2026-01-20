import { getOptionalProperty, validateObject } from '@/app/(displays)/(kiosks)/_utils/validators';
import type {
  Ambient,
  ChallengeContent,
  CustomInteractiveContent,
  IdleContent,
  SolutionsAccordion,
  SolutionsGrid,
  SolutionsMain,
  ValueContent,
} from '@/app/(displays)/(kiosks)/_types/content-types';

/**
 * Demo configuration type
 */
type DemoConfig = {
  readonly demoText?: string;
  readonly headline?: string;
  readonly iframeLink?: string;
  readonly mainCTA?: string;
};

/**
 * Type guard for Ambient - validates required properties exist and have correct types
 */
const isAmbient = (value: unknown): value is Ambient => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.title === undefined || typeof obj.title === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.mainCTA === undefined || typeof obj.mainCTA === 'string') &&
    (obj.backgroundImage === undefined || typeof obj.backgroundImage === 'string') &&
    (obj.quoteSource === undefined || typeof obj.quoteSource === 'string')
  );
};

/**
 * Type guard for IdleContent - validates shape matches expected type
 */
const isIdleContent = (value: unknown): value is IdleContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return obj.videoSrc === undefined || typeof obj.videoSrc === 'string';
};

/**
 * Type guard for ChallengeContent
 */
const isChallengeContent = (value: unknown): value is ChallengeContent => {
  if (typeof value !== 'object' || value === null) return false;
  return true; // Basic check - add more specific validation if needed
};

/**
 * Type guard for CustomInteractiveContent
 */
const isCustomInteractiveContent = (value: unknown): value is CustomInteractiveContent => {
  if (typeof value !== 'object' || value === null) return false;
  return true; // Basic check - add more specific validation if needed
};

/**
 * Type guard for DemoConfig
 */
const isDemoConfig = (value: unknown): value is DemoConfig => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.demoText === undefined || typeof obj.demoText === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.iframeLink === undefined || typeof obj.iframeLink === 'string') &&
    (obj.mainCTA === undefined || typeof obj.mainCTA === 'string')
  );
};

/**
 * Type guard for SolutionsAccordion
 */
const isSolutionsAccordion = (value: unknown): value is SolutionsAccordion => {
  if (typeof value !== 'object' || value === null) return false;
  return true; // Basic check
};

/**
 * Type guard for SolutionsGrid
 */
const isSolutionsGrid = (value: unknown): value is SolutionsGrid => {
  if (typeof value !== 'object' || value === null) return false;
  return true; // Basic check
};

/**
 * Type guard for SolutionsMain
 */
const isSolutionsMain = (value: unknown): value is SolutionsMain => {
  if (typeof value !== 'object' || value === null) return false;
  return true; // Basic check
};

/**
 * Type guard for ValueContent
 */
const isValueContent = (value: unknown): value is ValueContent => {
  if (typeof value !== 'object' || value === null) return false;
  return true; // Basic check
};

/**
 * Parsed kiosk data structure
 */
export type ParsedKioskData = {
  readonly ambient?: Ambient;
  readonly challengeMain?: ChallengeContent;
  readonly customInteractive1?: CustomInteractiveContent;
  readonly customInteractive2?: CustomInteractiveContent;
  readonly customInteractive3?: CustomInteractiveContent;
  readonly demoMain?: DemoConfig;
  readonly idle?: IdleContent;
  readonly solutionAccordion?: SolutionsAccordion;
  readonly solutionGrid?: SolutionsGrid;
  readonly solutionMain?: SolutionsMain;
  readonly valueMain?: ValueContent;
};

/**
 * Parses and validates raw CMS kiosk data with runtime type checking
 *
 * @param kioskData - Raw CMS data from API
 * @returns Parsed and validated kiosk data or null if invalid
 */
export const parseKioskData = (kioskData: null | Record<string, unknown> | undefined): null | ParsedKioskData => {
  if (!kioskData) return null;

  return validateObject(kioskData, 'kioskData', obj => {
    // Validate each property is an object with runtime shape validation
    const ambient = getOptionalProperty(obj, 'ambient', val => {
      const validated = validateObject(val, 'ambient', a => a);
      if (!isAmbient(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] ambient object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const idle = getOptionalProperty(obj, 'idle', val => {
      const validated = validateObject(val, 'idle', i => i);
      if (!isIdleContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] idle object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const challengeMain = getOptionalProperty(obj, 'challengeMain', val => {
      const validated = validateObject(val, 'challengeMain', c => c);
      if (!isChallengeContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] challengeMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const customInteractive1 = getOptionalProperty(obj, 'customInteractive1', val => {
      const validated = validateObject(val, 'customInteractive1', c => c);
      if (!isCustomInteractiveContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] customInteractive1 object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const customInteractive2 = getOptionalProperty(obj, 'customInteractive2', val => {
      const validated = validateObject(val, 'customInteractive2', c => c);
      if (!isCustomInteractiveContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] customInteractive2 object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const customInteractive3 = getOptionalProperty(obj, 'customInteractive3', val => {
      const validated = validateObject(val, 'customInteractive3', c => c);
      if (!isCustomInteractiveContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] customInteractive3 object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const demoMain = getOptionalProperty(obj, 'demoMain', val => {
      const validated = validateObject(val, 'demoMain', d => d);
      if (!isDemoConfig(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] demoMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const solutionAccordion = getOptionalProperty(obj, 'solutionAccordion', val => {
      const validated = validateObject(val, 'solutionAccordion', s => s);
      if (!isSolutionsAccordion(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] solutionAccordion object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const solutionGrid = getOptionalProperty(obj, 'solutionGrid', val => {
      const validated = validateObject(val, 'solutionGrid', s => s);
      if (!isSolutionsGrid(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] solutionGrid object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const solutionMain = getOptionalProperty(obj, 'solutionMain', val => {
      const validated = validateObject(val, 'solutionMain', s => s);
      if (!isSolutionsMain(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] solutionMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    const valueMain = getOptionalProperty(obj, 'valueMain', val => {
      const validated = validateObject(val, 'valueMain', v => v);
      if (!isValueContent(validated)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[parseKioskData] valueMain object has invalid shape:', validated);
        }
        return undefined;
      }
      return validated;
    });

    return {
      ambient,
      challengeMain,
      customInteractive1,
      customInteractive2,
      customInteractive3,
      demoMain,
      idle,
      solutionAccordion,
      solutionGrid,
      solutionMain,
      valueMain,
    };
  });
};
