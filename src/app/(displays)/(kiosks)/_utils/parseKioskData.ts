import { getOptionalProperty, validateObject } from '@/app/(displays)/(kiosks)/_utils/validators';
import type {
  Ambient,
  ChallengeContent,
  CustomInteractiveContent,
  DemoConfig,
  IdleContent,
  SolutionsAccordion,
  SolutionsGrid,
  SolutionsMain,
  ValueContent,
} from '@/app/(displays)/(kiosks)/_types/content-types';

/**
 * Type guard for Ambient - validates required properties exist and have correct types
 */
const isAmbient = (value: unknown): value is Ambient => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    // Required field: title is used as subheadline/eyebrow throughout
    typeof obj.title === 'string' &&
    obj.title.length > 0 &&
    // Optional fields
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
 * Type guard for ChallengeContent - validates critical properties
 */
const isChallengeContent = (value: unknown): value is ChallengeContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.featuredStat1 === undefined || typeof obj.featuredStat1 === 'string') &&
    (obj.featuredStat1Body === undefined || typeof obj.featuredStat1Body === 'string') &&
    (obj.featuredStat2 === undefined || typeof obj.featuredStat2 === 'string') &&
    (obj.featuredStat2Body === undefined || typeof obj.featuredStat2Body === 'string') &&
    (obj.item1Body === undefined || typeof obj.item1Body === 'string') &&
    (obj.item1Image === undefined || typeof obj.item1Image === 'string') &&
    (obj.item2Body === undefined || typeof obj.item2Body === 'string') &&
    (obj.item2Image === undefined || typeof obj.item2Image === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.mainVideo === undefined || typeof obj.mainVideo === 'string')
  );
};

/**
 * Type guard for CustomInteractiveContent - validates structure
 */
const isCustomInteractiveContent = (value: unknown): value is CustomInteractiveContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.mainCTA === undefined || typeof obj.mainCTA === 'string') &&
    (obj.secondaryCTA === undefined || typeof obj.secondaryCTA === 'string') &&
    (obj.diamondCarouselItems === undefined || Array.isArray(obj.diamondCarouselItems)) &&
    (obj.tapCarousel === undefined || Array.isArray(obj.tapCarousel))
  );
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
 * Type guard for SolutionsAccordion - validates structure
 */
const isSolutionsAccordion = (value: unknown): value is SolutionsAccordion => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.accordion === undefined || Array.isArray(obj.accordion)) &&
    (obj.headline === undefined || typeof obj.headline === 'string')
  );
};

/**
 * Type guard for SolutionsGrid - validates structure
 */
const isSolutionsGrid = (value: unknown): value is SolutionsGrid => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.diamondList === undefined || Array.isArray(obj.diamondList)) &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.images === undefined || Array.isArray(obj.images))
  );
};

/**
 * Type guard for SolutionsMain - validates structure
 */
const isSolutionsMain = (value: unknown): value is SolutionsMain => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.image === undefined || typeof obj.image === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.mainVideo === undefined || typeof obj.mainVideo === 'string') &&
    (obj.numberedList === undefined || Array.isArray(obj.numberedList)) &&
    (obj.numberedListHeadline === undefined || typeof obj.numberedListHeadline === 'string')
  );
};

/**
 * Type guard for ValueContent - validates structure
 */
const isValueContent = (value: unknown): value is ValueContent => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.body === undefined || typeof obj.body === 'string') &&
    (obj.diamondBenefits === undefined || Array.isArray(obj.diamondBenefits)) &&
    (obj.headline === undefined || typeof obj.headline === 'string') &&
    (obj.labelText === undefined || typeof obj.labelText === 'string') &&
    (obj.mainVideo === undefined || typeof obj.mainVideo === 'string')
  );
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
