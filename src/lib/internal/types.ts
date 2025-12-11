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

export type SummitSection = 'primary';

export type Section = BasecampSection | OverlookSection | SummitSection;
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
const SUMMIT_SECTIONS: readonly SummitSection[] = ['primary'];

export const isBasecampSection = (value: string): value is BasecampSection => {
  return BASECAMP_SECTIONS.includes(value as BasecampSection);
};

export const isOverlookSection = (value: string): value is OverlookSection => {
  return OVERLOOK_SECTIONS.includes(value as OverlookSection);
};

export const isSummitSection = (value: string): value is SummitSection => {
  return SUMMIT_SECTIONS.includes(value as SummitSection);
};

export const isSection = (value: string): value is Section => {
  return isBasecampSection(value) || isOverlookSection(value) || isSummitSection(value);
};

// Beat IDs in presentation order
export const BASECAMP_BEAT_ORDER = [
  'ambient-1',
  'welcome-1',
  'welcome-2',
  'welcome-3',
  'welcome-4',
  'problem-1',
  'problem-2',
  'problem-3',
  'problem-4',
  'possibilities-1',
  'possibilities-2',
  'possibilities-3',
  'possibilities-4',
  'possibilities-5',
  'ascend-1',
  'ascend-2',
  'ascend-3',
] as const;

export type BasecampBeatId = (typeof BASECAMP_BEAT_ORDER)[number];

export const isValidBasecampBeatId = (id: string): id is BasecampBeatId => {
  return BASECAMP_BEAT_ORDER.includes(id as BasecampBeatId);
};

export const OVERLOOK_BEAT_IDS = [
  'ambient-1',
  'unlock-1',
  'unlock-2',
  'protect-1',
  'protect-2',
  'connect-1',
  'connect-2',
  'activate-1',
  'activate-2',
  'insightdxp-1',
  'insightdxp-2',
  'insightdxp-3',
  'insightdxp-4',
  'insightdxp-5',
  'impact-1',
  'impact-2',
  'futurescaping-1',
  'futurescaping-2',
  'futurescaping-3',
  'futurescaping-4',
] as const;

export type OverlookBeatId = (typeof OVERLOOK_BEAT_IDS)[number];

export const isValidOverlookBeatId = (id: string): id is OverlookBeatId => {
  return OVERLOOK_BEAT_IDS.includes(id as OverlookBeatId);
};

// Summit Room beat IDs
export const SUMMIT_ROOM_BEAT_IDS = [
  'journey-intro',
  'journey-1',
  'journey-2',
  'journey-3',
  'journey-4',
  'journey-5',
] as const;

export type SummitRoomBeatId = (typeof SUMMIT_ROOM_BEAT_IDS)[number];

export const isValidSummitRoomBeatId = (id: string): id is SummitRoomBeatId => {
  return SUMMIT_ROOM_BEAT_IDS.includes(id as SummitRoomBeatId);
};

// Union type for all exhibit beat IDs
export type ExhibitBeatId = BasecampBeatId | OverlookBeatId | SummitRoomBeatId;

// Convert carousel beatId (journey-1 through journey-5) to slide index (0-4).
// Note: journey-intro is NOT a slide - it's the pre-carousel state.
export const getSlideIndexFromBeatId = (beatId: SummitRoomBeatId): number => {
  if (beatId === 'journey-intro') {
    return 0; // Fallback
  }
  const match = beatId.match(/^journey-(\d+)$/);
  if (!match || !match[1]) return 0;
  return parseInt(match[1], 10) - 1;
};

// Convert slide index (0-4) to carousel beatId (journey-1 through journey-5).
export const getBeatIdFromSlideIndex = (slideIndex: number): SummitRoomBeatId => {
  if (slideIndex < 0 || slideIndex > 4) {
    console.warn('Invalid slide index:', slideIndex);
    return 'journey-1';
  }
  return `journey-${slideIndex + 1}` as SummitRoomBeatId;
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
  readonly 'beats': {
    readonly [key in BasecampBeatId]: {
      readonly url: string;
    };
  };
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

export interface ExhibitControl {
  readonly errorMessage?: string;
  readonly hasError?: boolean;
  readonly id: string;
  readonly isMuted: boolean;
  readonly isOn: boolean;
  readonly name: string;
}

export interface MomentData {
  beatCount: number;
  id: Section;
  title: string;
}

export interface DocentData {
  readonly connection: {
    readonly connecting: string;
  };
  readonly docent: {
    readonly actions: {
      readonly back: string;
      readonly close: string;
      readonly launchJourneyMap: string;
      readonly load: string;
      readonly settings: string;
      readonly startPresenting: string;
      readonly startTour: string;
      readonly stopPresenting: string;
      readonly today: string;
    };
    readonly home: {
      readonly description: string;
      readonly subtitle: string;
      readonly title: string;
    };
    readonly moments: {
      readonly ambientState: string;
      readonly ascend: string;
      readonly possibilities: string;
      readonly problem: string;
      readonly welcome: string;
    };
    readonly navigation: {
      readonly backToHome: string;
      readonly backToMenu: string;
      readonly backToSchedule: string;
      readonly endTour: string;
    };
    readonly notFound: {
      readonly description: string;
      readonly title: string;
    };
    readonly schedule: {
      readonly loading: string;
      readonly noTours: string;
      readonly title: string;
    };
  };
  readonly loading: {
    readonly basecamp: string;
    readonly default: string;
    readonly overlook: string;
    readonly schedule: string;
    readonly summit: string;
    readonly summitRoom: string;
    readonly tour: string;
  };
  readonly moments: {
    readonly basecamp: readonly MomentData[];
    readonly overlook: readonly MomentData[];
  };
  readonly settings: {
    readonly ebcLights: string;
    readonly endTourButton: string;
    readonly endTourDescription: string;
    readonly exhibits: {
      readonly basecamp: string;
      readonly entryWay: string;
      readonly overlook: string;
      readonly solutionPathways: string;
      readonly summitRoom: string;
    };
    readonly openManual: string;
    readonly status: {
      readonly offline: string;
    };
    readonly title: string;
  };
  readonly slides: readonly SummitSlide[];
  readonly summit: {
    readonly errors: {
      readonly loadFailed: string;
    };
    readonly footerStats: readonly string[];
    readonly hero: {
      readonly labels: {
        readonly company: string;
        readonly dateOfEngagement: string;
        readonly location: string;
      };
      readonly title: string;
    };
    readonly recap: {
      readonly placeholder: string;
    };
    readonly sections: {
      readonly consideringPossibilities: string;
      readonly relevantSolutions: string;
      readonly storiesOfImpact: string;
      readonly unlockYourFuture: string;
    };
  };
  readonly tours: readonly Tour[];
  readonly ui: {
    readonly display: string;
    readonly off: string;
    readonly on: string;
    readonly onOff: string;
    readonly pause: string;
    readonly play: string;
    readonly tablet: string;
  };
}

export interface SummitData {
  readonly hero: {
    readonly advisorName: string;
    readonly clientName: string;
    readonly date: string;
    readonly location: string;
    readonly logoAlt: string;
    readonly subtitle: string;
  };
  readonly metrics: {
    readonly description: string;
    readonly items: readonly {
      readonly description: string;
      readonly label: string;
      readonly value: string;
    }[];
    readonly title: string;
  };
  readonly obstacles: {
    readonly description: string;
    readonly items: readonly {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    }[];
    readonly title: string;
  };
  readonly recaps: readonly {
    readonly body: string;
    readonly cta: string;
    readonly title: string;
  }[];
  readonly stories: {
    readonly description: string;
    readonly items: readonly {
      readonly category: string;
      readonly description: string;
      readonly title: string;
    }[];
    readonly title: string;
  };
  readonly strategies: readonly {
    readonly eyebrow: string;
    readonly items: readonly {
      readonly body: readonly string[];
      readonly title: string;
    }[];
    readonly summary: string;
  }[];
  readonly summary: {
    readonly body: string;
    readonly cta: string;
    readonly title: string;
  };
}

export type Locale = 'en' | 'pt';

// Generic API response structure
export interface ApiResponseItem<T> {
  readonly data: T;
  readonly locale: Locale;
}

export type ApiResponse<T> = readonly ApiResponseItem<T>[];

// Specific API response types
export type BasecampApiResponse = ApiResponse<BasecampData>;
export type DocentApiResponse = ApiResponse<DocentData>;
export type SummitApiResponse = ApiResponse<SummitData>;

// Function return types (transformed from API responses)
export interface DocentDataResponse {
  readonly data: {
    readonly en: DocentData;
    readonly pt: DocentData;
  };
}

export interface BasecampDataResponse {
  readonly data: BasecampData;
  readonly locale: Locale;
}

export interface SummitDataResponse {
  readonly data: SummitData;
  readonly locale: Locale;
}
