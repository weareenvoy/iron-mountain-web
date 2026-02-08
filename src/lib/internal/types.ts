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

// New API tour structure
export interface ApiTour {
  readonly date: string; // ISO datetime e.g., "2026-01-15T00:00:00+00:00"
  readonly day_formatted_EN: string; // e.g., "1-15-2026"
  readonly day_formatted_plain_language_EN: string; // e.g., "January 15, 2026"
  readonly day_formatted_plain_language_PT: string; // e.g., "15 de Janeiro de 2026"
  readonly day_formatted_PT: string; // e.g., "15-1-2026"
  readonly id: number;
  readonly name: string;
  readonly time: string; // e.g., "22:32:17.37318"
}

// Tours API response structure (from /api/docent/tours endpoint)
export interface ToursApiResponse {
  readonly tours: readonly ApiTour[];
}

export interface BasecampData {
  readonly beats: {
    readonly [key in BasecampBeatId]: {
      readonly url: string;
    };
  };
  readonly location_details: {
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
  readonly possibilities_a: {
    readonly body_1: string;
    readonly body_2: string;
    readonly body_3: string;
    readonly title: string;
  };
  readonly possibilities_b: {
    readonly body_1: string;
    readonly body_2: string;
    readonly body_3: string;
    readonly title: string;
  };
  readonly possibilities_c: {
    readonly body_1: string;
    readonly body_2: string;
    readonly body_3: string;
    readonly title: string;
  };
  readonly problem_1: {
    readonly title: string;
  };
  readonly problem_2: {
    readonly subtitle: string;
    readonly title: string;
  }[];
  readonly problem_3: {
    readonly challenge_1: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly challenge_2: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly challenge_3: {
      readonly body: string;
      readonly icon: string;
      readonly title: string;
    };
    readonly challenge_4: {
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
    readonly title: string;
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
  // tours are now fetched from separate /api/tours endpoint - see ApiTour and ToursApiResponse
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

export interface KioskAudio {
  readonly ambient?: string;
  readonly back?: string;
  readonly challenge?: string;
  readonly close?: string;
  readonly customInteractive?: string;
  readonly next?: string;
  readonly open?: string;
  readonly solution?: string;
  readonly value?: string;
}

export interface KioskChallengeMain {
  readonly body: string;
  readonly featuredStat1: string;
  readonly featuredStat1Body: string;
  readonly featuredStat2: string;
  readonly featuredStat2Body: string;
  readonly item1Body: string;
  readonly item1Image: string;
  readonly item2Body: string;
  readonly item2Image: string;
  readonly labelText: string;
  readonly mainVideo: string;
}

export interface KioskSolutionMain {
  readonly body: string;
  readonly headline: string;
  readonly image: string;
  readonly labelText: string;
  readonly mainVideo: string;
  readonly numberedList: readonly string[];
  readonly numberedListHeadline: string;
}

export interface KioskSolutionGrid {
  readonly diamondList: readonly string[];
  readonly headline: string;
  readonly images: readonly string[];
}

export interface KioskSolutionAccordionItem {
  readonly bullets: readonly string[];
  readonly title: string;
}

export interface KioskSolutionAccordion {
  readonly headline: string;
  readonly image: string;
  readonly items: readonly KioskSolutionAccordionItem[];
}

export interface KioskDiamondBenefit {
  readonly bullets: readonly string[];
  readonly label: string;
}

export interface KioskValueMain {
  readonly body: string;
  readonly diamondBenefits: readonly KioskDiamondBenefit[];
  readonly headline: string;
  readonly labelText: string;
  readonly mainVideo: string;
}

export interface KioskCustomInteractiveChoice {
  readonly customInteractive1: string;
  readonly customInteractive2: string;
  readonly customInteractive3: string;
}

export interface KioskAmbient {
  readonly backgroundImage: string;
  readonly body: string;
  readonly headline: string;
  readonly mainCTA: string;
  readonly quoteSource: string;
  readonly subheader: string;
  readonly title: string;
}

export interface KioskDemoMain {
  readonly headline: string;
  readonly iframeLink: string;
  readonly mainCTA: string;
}

export interface KioskCTA {
  readonly ambient: string;
  readonly demo: string;
}

export interface KioskDiamondCarouselItem {
  readonly id: string;
  readonly ModalBody: string;
  readonly ModalHeadline: string;
  readonly ModalImage: string;
}

export interface KioskCustomInteractive1 {
  readonly backCTA: string;
  readonly body2: string;
  readonly diamondCarouselItems: readonly KioskDiamondCarouselItem[];
  readonly headline: string;
  readonly headline2: string;
  readonly image: string;
  readonly mainCTA: string;
  readonly secondaryCTA: string;
}

export interface KioskCustomInteractive2 {
  readonly headline: string;
  readonly image: string;
  readonly secondaryCTA: string;
}

export interface KioskTapCarouselItem {
  readonly bullets: readonly string[];
  readonly id: string;
  readonly image: string;
  readonly title: string;
  readonly video: string;
}

export interface KioskCustomInteractive3 {
  readonly backCTA: string;
  readonly body: string;
  readonly headline: string;
  readonly headline2: string;
  readonly image: string;
  readonly mainCTA: string;
  readonly secondaryCTA: string;
  readonly tapCarousel: readonly KioskTapCarouselItem[];
  readonly tapCTA: string;
  readonly video: string;
}

export interface KioskIdle {
  readonly videoSrc: string;
}

export interface KioskData {
  readonly ambient: KioskAmbient;
  readonly audio: KioskAudio;
  readonly challengeMain: KioskChallengeMain;
  readonly CTA: KioskCTA;
  readonly customInteractive1: KioskCustomInteractive1;
  readonly customInteractive2: KioskCustomInteractive2;
  readonly customInteractive3: KioskCustomInteractive3;
  readonly customInteractiveChoice: KioskCustomInteractiveChoice;
  readonly demoMain: KioskDemoMain;
  readonly idle: KioskIdle;
  readonly solutionAccordion: KioskSolutionAccordion;
  readonly solutionGrid: KioskSolutionGrid;
  readonly solutionMain: KioskSolutionMain;
  readonly valueMain: KioskValueMain;
}

/**
 * ISO 8601 datetime string (e.g., "2026-01-15T00:00:00+00:00")
 */
export interface SummitTourSummary {
  readonly date: string;
  readonly id: string;
  readonly name: string;
}

export interface WelcomeWallData {
  readonly clientTourLogo: {
    readonly url: null | string;
  };
  readonly location_details: {
    readonly elevation: string;
    readonly exhibit: string;
    readonly name: string;
  };
  readonly videos: {
    readonly ambientLoop: {
      readonly url: string;
    };
    readonly tourLoop: {
      readonly url: string;
    };
    readonly tourLoopNoLogo: {
      readonly url: string;
    };
  };
  readonly welcome: {
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
// BasecampApiResponse is a single locale response (not an array)
// Format: { locale: "en", data: {...} }
export interface BasecampApiResponse {
  readonly data: BasecampData;
  readonly locale: Locale;
}
// DocentInitialApiResponse is the data-wrapped locale response from /api/docent_initial
// Format: { data: [{ locale: "en", data: {...} }, { locale: "pt", data: {...} }] }
export interface DocentInitialApiResponse {
  readonly data: ApiResponse<DocentData>;
}
// SummitApiResponse is a single locale response
// Format: { locale: "en", data: {...} }
export interface SummitApiResponse {
  readonly data: SummitData;
  readonly locale: Locale;
}
export type WelcomeWallApiResponse = ApiResponseItem<WelcomeWallData>;
// KioskApiResponse is a single locale response (not an array)
// Format: { locale: "en", data: {...} }
export interface KioskApiResponse {
  readonly data: KioskData;
  readonly locale: Locale;
}

// Function return types (transformed from API responses)
export interface DocentInitialDataResponse {
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
