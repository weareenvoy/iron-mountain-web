export type BasecampSection = 'ambient' | 'ascend' | 'possibilities' | 'problem' | 'welcome';
export type OverlookSection =
  | 'activate'
  | 'ambient'
  | 'case-study'
  | 'connect'
  | 'futurescape'
  | 'insight-dxp'
  | 'protect'
  | 'unlock';

export type Section = BasecampSection | OverlookSection;
export type TimedSection = Exclude<Section, 'ambient'>;

// Type guards for runtime validation
const BASECAMP_SECTIONS: readonly BasecampSection[] = ['ambient', 'ascend', 'possibilities', 'problem', 'welcome'];
const OVERLOOK_SECTIONS: readonly OverlookSection[] = [
  'activate',
  'ambient',
  'case-study',
  'connect',
  'futurescape',
  'insight-dxp',
  'protect',
  'unlock',
];

export const isBasecampSection = (value: string): value is BasecampSection => {
  return BASECAMP_SECTIONS.includes(value as BasecampSection);
};

export const isOverlookSection = (value: string): value is OverlookSection => {
  return OVERLOOK_SECTIONS.includes(value as OverlookSection);
};

export const isSection = (value: string): value is Section => {
  return isBasecampSection(value) || isOverlookSection(value);
};
// UI Navigation state for exhibits (local to UI, not MQTT)
export interface ExhibitNavigationState {
  beatIdx: number;
  momentId: Section; // e.g., "welcome", "ascend", "possibilities", "problem"
}

// Used in MomentsAndBeats component.
// A bullet point row is a moment, each moment has multiple beats.
export interface Moment {
  beatCount: number;
  id: Section; // e.g., "ambient", "welcome" for basecamp, "case-study" for overlook.
  title: string; // e.g., "Ambient", "Welcome"
}

// Mock data structure.
export interface Tour {
  // date and startTime are 1 field or 2 fields?
  readonly date: string;
  readonly endTime: string; // We might not have endTime.
  readonly guestLogo: null | string;
  readonly guestName: string;
  readonly id: string;
  readonly startTime: string;
  readonly title: string; // Is this needed?
}

export interface BasecampData {
  readonly 'possibilities': {
    readonly title: string;
  };
  readonly 'possibilities-a': {
    readonly 'body-1': string;
    readonly 'body-2': string;
    readonly 'body-3': string;
    readonly 'title': string;
  };
  readonly 'possibilities-b': {
    readonly 'body-1': string;
    readonly 'body-2': string;
    readonly 'body-3': string;
    readonly 'title': string;
  };
  readonly 'possibilities-c': {
    readonly 'body-1': string;
    readonly 'body-2': string;
    readonly 'body-3': string;
    readonly 'title': string;
  };
  readonly 'problem-1': {
    readonly text: string;
  };
  readonly 'problem-2': {
    readonly percent: string;
    readonly percentSubtitle: string;
  }[];
  readonly 'problem-3': {
    readonly 'challenge-1': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'challenge-2': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'challenge-3': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'challenge-4': {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly 'title': string;
  };
  readonly 'welcome': {
    readonly text: string;
  };
}

export interface SummitSlide {
  borderColor: null | string;
  id: number;
  title: string;
}

export interface DocentData {
  slides: SummitSlide[];
  tours: Tour[];
}

import en from '@/dictionaries/en.json';

export type Dictionary = typeof en;

export type Locale = 'en' | 'pt';

export interface BasecampApiResponse {
  data: BasecampData;
  dict: Dictionary;
  locale: Locale;
}

export interface DocentApiResponse {
  data: DocentData;
  dict: Dictionary;
  locale: Locale;
}
