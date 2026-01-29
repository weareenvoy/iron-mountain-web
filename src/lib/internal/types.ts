import type { SummitData } from '@/app/(displays)/summit/_types';

export type BasecampSection = 'ambient' | 'ascend' | 'possibilities' | 'problem' | 'welcome';
export type OverlookSection =
  | 'activate'
  | 'ambient'
  | 'connect'
  | 'futurescaping'
  | 'impact'
  | 'insightdxp'
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
  'connect',
  'futurescaping',
  'impact',
  'insightdxp',
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
  'activate-3',
  'insightdxp-1',
  'insightdxp-2',
  'insightdxp-3',
  'insightdxp-4',
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
  'journey-6',
] as const;

export type SummitRoomBeatId = (typeof SUMMIT_ROOM_BEAT_IDS)[number];

export const isValidSummitRoomBeatId = (id: string): id is SummitRoomBeatId => {
  return SUMMIT_ROOM_BEAT_IDS.includes(id as SummitRoomBeatId);
};

// Union type for all exhibit beat IDs
export type ExhibitBeatId = BasecampBeatId | OverlookBeatId | SummitRoomBeatId;

// Convert carousel beatId (journey-1 through journey-N) to slide index (0-based).
// Note: journey-intro is NOT a slide - it's the pre-carousel state.
export const getSlideIndexFromBeatId = (beatId: SummitRoomBeatId): number => {
  if (beatId === 'journey-intro') {
    return 0; // Fallback
  }
  const match = beatId.match(/^journey-(\d+)$/);
  if (!match || !match[1]) return 0;
  return parseInt(match[1], 10) - 1;
};

// Convert slide index (0-based) to carousel beatId (journey-1 through journey-N).
// maxSlideIndex: Maximum slide index based on actual data length (0-based, so pass slideCount - 1)
export const getBeatIdFromSlideIndex = (slideIndex: number, maxSlideIndex: number): SummitRoomBeatId => {
  if (slideIndex < 0 || slideIndex > maxSlideIndex) {
    console.warn('Invalid slide index:', slideIndex, `(max: ${maxSlideIndex})`);
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
export interface Beat {
  readonly handle: string;
  readonly type?: 'video';
}

export interface Moment {
  readonly beats: readonly Beat[];
  readonly id: Section; // e.g., "ambient", "welcome" for basecamp, "impact" for overlook.
  readonly title: string; // e.g., "Ambient", "Welcome"
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
  readonly beats: {
    readonly [key in BasecampBeatId]: {
      readonly url: string;
    };
  };
  readonly locationDetails: {
    readonly elevation: string;
    readonly exhibit: string;
    readonly name: string;
  };
  // Note: ambient section intentionally has no music
  readonly music?: {
    readonly [key in BasecampSection]?: string;
  };
  readonly possibilities: {
    readonly title: string;
  };
  readonly possibilitiesA: {
    readonly body1: string;
    readonly body2: string;
    readonly body3: string;
    readonly title: string;
  };
  readonly possibilitiesB: {
    readonly body1: string;
    readonly body2: string;
    readonly body3: string;
    readonly title: string;
  };
  readonly possibilitiesC: {
    readonly body1: string;
    readonly body2: string;
    readonly body3: string;
    readonly title: string;
  };
  readonly problem1: {
    readonly text: string;
  };
  readonly problem2: {
    readonly percent: string;
    readonly percentSubtitle: string;
  }[];
  readonly problem3: {
    readonly challenge1: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly challenge2: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly challenge3: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly challenge4: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly title: string;
  };
  readonly sfx?: {
    readonly beat: string;
    readonly moment: string;
    readonly text: string;
  };
  readonly welcome: {
    readonly text: string;
  };
}

export interface SummitSlide {
  readonly handle: string;
  readonly title: string;
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
  readonly beats: readonly { readonly handle: string; readonly type?: 'video' }[];
  readonly handle: string;
  readonly title: string;
}

export interface DocentData {
  readonly basecampMoments: readonly MomentData[];
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
  readonly overlookMoments: readonly MomentData[];
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
  readonly summitSlides: readonly SummitSlide[];
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

/**
 * Raw kiosk data from API response
 * Uses Record<string, unknown> for flexibility since different kiosks have different schemas
 * Should be parsed with parseKioskData() for type-safe access
 *
 * @see ParsedKioskData in _utils/parseKioskData.ts for the typed version after parsing
 */
export type KioskData = Record<string, unknown>;

/**
 * ISO 8601 date string (YYYY-MM-DD)
 */
export interface SummitTourSummary {
  readonly date: string;
  readonly id: string;
  readonly name: string;
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
export type KioskApiResponse = ApiResponse<KioskData>;

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

export interface KioskDataResponse {
  readonly data: KioskData;
  readonly locale: Locale;
}
