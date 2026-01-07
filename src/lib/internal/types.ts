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
export const BEAT_ORDER = [
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

export type BeatId = (typeof BEAT_ORDER)[number];

export const isValidBeatId = (id: string): id is BeatId => {
  return BEAT_ORDER.includes(id as BeatId);
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
    readonly [key in BeatId]: {
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

export interface WelcomeWallData {
  readonly clientTourLogo: {
    readonly url: string;
  };
  readonly videos: {
    readonly ambientLoopEn: {
      readonly url: string;
    };
    readonly ambientLoopPt: {
      readonly url: string;
    };
    readonly tourLoopEn: {
      readonly url: string;
    };
    readonly tourLoopPt: {
      readonly url: string;
    };
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
export type WelcomeWallApiResponse = ApiResponse<WelcomeWallData>;

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

export interface WelcomeWallDataResponse {
  readonly data: WelcomeWallData;
  readonly locale: Locale;
}
