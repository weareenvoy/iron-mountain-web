export interface SummitLocationDetails {
  readonly elevation: string;
  readonly exhibit: string;
  readonly name: string;
}

export interface SummitData {
  readonly activate_title: string;
  readonly basecamp: SummitBasecamp;
  readonly connect_title: string;
  readonly kiosk_1: SummitKiosk;
  readonly kiosk_2: SummitKiosk;
  readonly kiosk_3: SummitKiosk;
  readonly location_details: SummitLocationDetails;
  readonly meta: SummitMeta;
  readonly overlook: SummitOverlook;
  readonly protect_title: string;
  readonly summit_slides: readonly SummitJourneySlide[];
}

export interface SummitBasecamp {
  readonly possibilities: { readonly title: string };
  readonly possibilities_a: SummitPossibility;
  readonly possibilities_b: SummitPossibility;
  readonly possibilities_c: SummitPossibility;
  readonly problem_1: { readonly title: string };
  readonly problem_2: readonly SummitProblem2Item[];
  readonly problem_3: SummitProblem3;
}

export interface SummitChallenge {
  readonly body: string;
  readonly icon: string;
  readonly title: string;
}

export interface SummitFuturescaping {
  readonly body: string;
  readonly image: string;
  readonly title: string;
}

export interface SummitJourneySlide {
  readonly background_video_url: string;
  readonly handle: string;
  readonly title: string;
  readonly video_url?: string;
}

export interface SummitKiosk {
  readonly ambient: SummitKioskAmbient;
}

export interface SummitKioskAmbient {
  readonly attribution: string;
  readonly body: string;
  readonly headline: string;
  readonly solution_title: string;
  readonly subheader: string;
}

export interface SummitMapLocation {
  readonly body: string;
  readonly title: string;
}

export interface SummitMapLocations {
  readonly mapLocation_1: SummitMapLocation;
  readonly mapLocation_2: SummitMapLocation;
  readonly mapLocation_3: SummitMapLocation;
}

export interface SummitMetaItem {
  readonly label: string;
  readonly value: string;
}

export type SummitMeta = readonly SummitMetaItem[];

export interface SummitOverlook {
  readonly activate: SummitMapLocations;
  readonly connect: SummitMapLocations;
  readonly futurescaping_1: SummitFuturescaping;
  readonly futurescaping_2: SummitFuturescaping;
  readonly futurescaping_3: SummitFuturescaping;
  readonly protect: SummitMapLocations;
}

export interface SummitPossibility {
  readonly body_1: string;
  readonly body_2: string;
  readonly body_3: string;
  readonly title: string;
}

export interface SummitProblem2Item {
  readonly subtitle: string;
  readonly title: string;
}

export interface SummitProblem3 {
  readonly challenge_1: SummitChallenge;
  readonly challenge_2: SummitChallenge;
  readonly challenge_3: SummitChallenge;
  readonly challenge_4: SummitChallenge;
  readonly title: string;
}

export type SummitSlideScreen = 'primary' | 'secondary';
