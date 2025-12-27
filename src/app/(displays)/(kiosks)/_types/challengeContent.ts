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
  readonly labelText: string;
  readonly problemDescription: string;
  readonly savingsAmount: string;
  readonly savingsDescription: string;
  readonly subheadline: string;
  readonly videoSrc: string;
};

type SecondScreen = {
  readonly bottomDescription: string;
  readonly bottomVideoSrc?: string;
  readonly labelText?: string;
  readonly largeIconSrc: string;
  readonly mainDescription: string;
  readonly statAmount: string;
  readonly statDescription: string;
  readonly subheadline: string;
  readonly topImageSrc: string;
};

type ThirdScreen = {
  readonly description: string;
  readonly heroImageSrc: string;
  readonly labelText?: string;
  readonly largeIconCenterSrc: string;
  readonly largeIconTopSrc: string;
  readonly metricAmount: string;
  readonly metricDescription: string;
  readonly metricImageSrc: string;
  readonly subheadline: string;
  readonly videoSrc?: string;
};

export const parseKioskChallenges = (value: unknown): KioskChallenges => {
  return value as KioskChallenges;
};
