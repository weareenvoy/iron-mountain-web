import type { DocentAppState } from '@/app/(tablets)/docent/_types';
import type { DocentData } from '@/lib/internal/types';
import type { Route } from 'next';

export const getTourIdFromGecState = (state: DocentAppState): null | string => {
  return state['tour-id'] || null;
};

// Validates that all required CMS fields for DocentData are present.
// Takes unknown input and validates at runtime before casting to DocentData.
export const requireDocentData = (value: unknown): DocentData => {
  const prefix = '[docent]';

  // Validate root object
  if (!value || typeof value !== 'object') {
    throw new Error(`${prefix} Missing data object. Populate CMS data.`);
  }
  const data = value as Record<string, unknown>;

  // Validate docent object
  const docent = data['docent'];
  if (!docent || typeof docent !== 'object') {
    throw new Error(`${prefix} Missing docent object. Populate CMS data.`);
  }
  const docentObj = docent as Record<string, unknown>;

  // Validate docent.actions (used by SettingsDrawer header)
  const actions = docentObj['actions'];
  if (!actions || typeof actions !== 'object') {
    throw new Error(`${prefix} Missing docent.actions object (CMS required).`);
  }
  const actionsObj = actions as Record<string, unknown>;
  if (typeof actionsObj['back'] !== 'string') {
    throw new Error(`${prefix} Missing docent.actions.back (CMS required).`);
  }

  // Validate settings object
  const settings = data['settings'];
  if (!settings || typeof settings !== 'object') {
    throw new Error(`${prefix} Missing settings object. Populate CMS data.`);
  }
  const settingsObj = settings as Record<string, unknown>;

  // Validate settings.title
  if (typeof settingsObj['title'] !== 'string') {
    throw new Error(`${prefix} Missing settings.title (CMS required).`);
  }

  // Validate settings.status
  const status = settingsObj['status'];
  if (!status || typeof status !== 'object') {
    throw new Error(`${prefix} Missing settings.status object (CMS required).`);
  }
  const statusObj = status as Record<string, unknown>;
  if (typeof statusObj['offline'] !== 'string') {
    throw new Error(`${prefix} Missing settings.status.offline (CMS required).`);
  }

  // Validate settings.exhibits
  const exhibits = settingsObj['exhibits'];
  if (!exhibits || typeof exhibits !== 'object') {
    throw new Error(`${prefix} Missing settings.exhibits object (CMS required).`);
  }
  const exhibitsObj = exhibits as Record<string, unknown>;
  const requiredExhibits = ['basecamp', 'entryWay', 'overlook', 'solutionPathways', 'summitRoom'] as const;
  for (const exhibit of requiredExhibits) {
    if (typeof exhibitsObj[exhibit] !== 'string') {
      throw new Error(`${prefix} Missing settings.exhibits.${exhibit} (CMS required).`);
    }
  }

  // Validate other settings fields used by SettingsDrawer
  if (typeof settingsObj['ebcLights'] !== 'string') {
    throw new Error(`${prefix} Missing settings.ebcLights (CMS required).`);
  }
  if (typeof settingsObj['endTourButton'] !== 'string') {
    throw new Error(`${prefix} Missing settings.endTourButton (CMS required).`);
  }
  if (typeof settingsObj['endTourDescription'] !== 'string') {
    throw new Error(`${prefix} Missing settings.endTourDescription (CMS required).`);
  }
  if (typeof settingsObj['openManual'] !== 'string') {
    throw new Error(`${prefix} Missing settings.openManual (CMS required).`);
  }

  // All validations passed - safe to cast
  return value as DocentData;
};

// Check if a path is a valid docent route
export const isDocentRoute = (path: string): path is Route => {
  return /^\/docent\/tour\/[^/]+(?:\/(?:basecamp|overlook|summit-room))?$/.test(path);
};

// Update tour ID in a docent route path
export const updateTourIdInPath = (pathname: string, tourId: string): null | string => {
  if (!pathname.includes('/tour/')) return null;

  const tourPathRegex = /\/tour\/[^\/]+/;
  const newPathname = pathname.replace(tourPathRegex, `/tour/${tourId}`);

  return isDocentRoute(newPathname) ? newPathname : null;
};

// Confirmed with design that the colors will be hardcoded.
export const getSlideBorderColor = (handle: string): null | string => {
  switch (handle) {
    case 'journey-1':
      return null; // First slide has no border
    case 'journey-2':
      return 'border-primary-im-light-blue';
    case 'journey-3':
      return 'border-secondary-im-purple';
    case 'journey-4':
      return 'border-secondary-im-teal';
    case 'journey-5':
      return 'border-secondary-im-orange';
    case 'journey-6':
      return 'border-primary-im-mid-blue';
    default:
      return null;
  }
};
