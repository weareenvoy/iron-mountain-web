// This file is used to define the structure of the Challenge section of the Kiosk setup. Every slide's data / types are defined here.

export type KioskChallenges = {
  readonly firstScreen: FirstScreen;
  readonly initialScreen: InitialScreen;
  readonly secondScreen: SecondScreen;
  readonly thirdScreen: ThirdScreen;
};

type InitialScreen = {
  readonly arrowIconSrc?: string;
  readonly attribution: string;
  readonly backgroundImage: string;
  readonly buttonText: string;
  readonly headline: string;
  readonly quote: string;
  readonly subheadline: string;
};

type FirstScreen = {
  readonly body: string;
  readonly featuredStat1: string;
  readonly featuredStat1Body: string;
  readonly labelText: string;
  readonly mainVideo: string;
  readonly subheadline: string;
};

type SecondScreen = {
  readonly item1Body: string;
  readonly item1Image: string;
  readonly labelText?: string;
  readonly subheadline: string;
};

type ThirdScreen = {
  readonly featuredStat2: string;
  readonly featuredStat2Body: string;
  readonly item2Body: string;
  readonly item2Image: string;
  readonly labelText?: string;
  readonly subheadline: string;
};

export const parseKioskChallenges = (value: unknown): KioskChallenges => {
  return value as KioskChallenges;
};
