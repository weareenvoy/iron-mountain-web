// This file defines the data types for the Kiosk setup before they get mapped to the Kiosk structure.

export type Ambient = {
  readonly backgroundImage?: string;
  readonly body?: string;
  readonly headline?: string;
  readonly mainCTA?: string;
  readonly quoteSource?: string;
  readonly title: string; // Required - used as subheadline/eyebrow throughout kiosks
};

export type IdleContent = {
  readonly videoSrc?: string;
};

export type ChallengeContent = {
  readonly body?: string;
  readonly featuredStat1?: string;
  readonly featuredStat1Body?: string;
  readonly featuredStat2?: string;
  readonly featuredStat2Body?: string;
  readonly item1Body?: string;
  readonly item1Image?: string;
  readonly item2Body?: string;
  readonly item2Image?: string;
  readonly labelText?: string;
  readonly mainVideo?: string;
};

export type SolutionsMain = {
  readonly body?: string;
  readonly headline?: string;
  readonly image?: string;
  readonly labelText?: string;
  readonly mainVideo?: string;
  readonly numberedList?: readonly string[];
  readonly numberedListHeadline?: string;
};

export type SolutionsGrid = {
  readonly diamondList?: readonly string[];
  readonly headline?: string;
  readonly images?: readonly string[];
};

export type SolutionsAccordion = {
  readonly accordion?: readonly {
    readonly bullets?: readonly string[];
    readonly title?: string;
  }[];
  readonly headline?: string;
  readonly image?: string;
};

export type ValueContent = {
  readonly body?: string;
  readonly diamondBenefits?: readonly {
    readonly bullets?: readonly string[];
    readonly label?: string;
    readonly title?: string;
  }[];
  readonly headline?: string;
  readonly labelText?: string;
  readonly mainVideo?: string;
};

export type CustomInteractiveContent = {
  readonly backCTA?: string;
  readonly body?: string;
  readonly body2?: string;
  readonly diamondCarouselItems?: readonly {
    readonly id?: string;
    readonly ModalBody?: string;
    readonly ModalHeadline?: string;
    readonly ModalImage?: string;
  }[];
  readonly headline?: string;
  readonly headline2?: string;
  readonly image?: string;
  readonly mainCTA?: string;
  readonly secondaryCTA?: string;
  readonly tapCarousel?: readonly {
    readonly bullets?: readonly string[];
    readonly id?: string;
    readonly image?: string;
    readonly title?: string;
    readonly video?: string;
  }[];
  readonly tapCTA?: string;
  readonly video?: string;
};

export type DemoConfig = {
  readonly demoText?: string;
  readonly headline?: string;
  readonly iframeLink?: string;
  readonly mainCTA?: string;
};
