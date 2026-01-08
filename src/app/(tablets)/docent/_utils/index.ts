import type { DocentAppState } from '@/app/(tablets)/docent/_types';
import type { Route } from 'next';

export const getTourIdFromGecState = (state: DocentAppState): null | string => {
  return state['tour-id'] || null;
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
