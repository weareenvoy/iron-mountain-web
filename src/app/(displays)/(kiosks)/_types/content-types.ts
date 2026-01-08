// This file defines the data types for the Kiosk setup before they get mapped to the Kiosk structure.

export type Ambient = {
  readonly backgroundImage?: string;
  readonly body?: string;
  readonly headline?: string;
  readonly mainCTA?: string;
  readonly quoteSource?: string;
  readonly title?: string;
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
  readonly labelText?: string;
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
  readonly diamondCarouselItems?: readonly string[];
  readonly headline?: string;
  readonly headline2?: string;
  readonly image?: string;
  readonly mainCTA?: string;
  readonly ModalBody1?: string;
  readonly ModalBody2?: string;
  readonly ModalBody3?: string;
  readonly ModalBody4?: string;
  readonly ModalBody5?: string;
  readonly ModalHeadline1?: string;
  readonly ModalHeadline2?: string;
  readonly ModalHeadline3?: string;
  readonly ModalHeadline4?: string;
  readonly ModalHeadline5?: string;
  readonly ModalImage1?: string;
  readonly ModalImage2?: string;
  readonly ModalImage3?: string;
  readonly ModalImage4?: string;
  readonly ModalImage5?: string;
  readonly secondaryCTA?: string;
  readonly tapCarousel?: readonly {
    readonly bullets?: readonly string[];
    readonly image?: string;
    readonly title?: string;
    readonly video?: string;
  }[];
  readonly tapCTA?: string;
  readonly video?: string;
};
