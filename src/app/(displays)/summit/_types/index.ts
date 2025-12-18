export interface SummitData {
  readonly activateTitle: string;
  readonly basecamp: SummitBasecamp;
  readonly connectTitle: string;
  readonly kiosk1: SummitKiosk;
  readonly kiosk2: SummitKiosk;
  readonly kiosk3: SummitKiosk;
  readonly meta: SummitMeta;
  readonly overlook: SummitOverlook;
  readonly protectTitle: string;
  readonly summitSlides: readonly SummitJourneySlide[];
}

export interface SummitBasecamp {
  readonly possibilities: { readonly title: string };
  readonly possibilitiesA: SummitPossibility;
  readonly possibilitiesB: SummitPossibility;
  readonly possibilitiesC: SummitPossibility;
  readonly problem1: { readonly title: string };
  readonly problem2: readonly SummitProblem2Item[];
  readonly problem3: SummitProblem3;
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
  readonly handle: string;
  readonly title: string;
}

export interface SummitKiosk {
  readonly ambient: SummitKioskAmbient;
}

export interface SummitKioskAmbient {
  readonly attribution: string;
  readonly body: string;
  readonly headline: string;
  readonly solutionTitle: string;
  readonly subheader: string;
}

export interface SummitMapLocation {
  readonly body: string;
  readonly title: string;
}

export interface SummitMapLocations {
  readonly mapLocation1: SummitMapLocation;
  readonly mapLocation2: SummitMapLocation;
  readonly mapLocation3: SummitMapLocation;
}

export interface SummitMetaItem {
  readonly label: string;
  readonly value: string;
}

export type SummitMeta = readonly SummitMetaItem[];

export interface SummitOverlook {
  readonly activate: SummitMapLocations;
  readonly connect: SummitMapLocations;
  readonly futurescaping1: SummitFuturescaping;
  readonly futurescaping2: SummitFuturescaping;
  readonly futurescaping3: SummitFuturescaping;
  readonly protect: SummitMapLocations;
}

export interface SummitPossibility {
  readonly body1: string;
  readonly body2: string;
  readonly body3: string;
  readonly title: string;
}

export interface SummitProblem2Item {
  readonly subtitle: string;
  readonly title: string;
}

export interface SummitProblem3 {
  readonly challenges: readonly SummitChallenge[];
  readonly title: string;
}

export type SummitSlideScreen = 'primary' | 'secondary';
