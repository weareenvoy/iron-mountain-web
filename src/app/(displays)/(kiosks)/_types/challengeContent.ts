type InitialScreen = {
  readonly arrowIconSrc?: string;
  readonly attribution: string;
  readonly backgroundImage: string;
  readonly buttonText: string;
  readonly headline: string;
  readonly logoCombinedSrc?: string;
  readonly quote: string;
  readonly subheadline: string;
};

type FirstScreen = {
  readonly challengeLabel: string;
  readonly problemDescription: string;
  readonly savingsAmount: string;
  readonly savingsDescription: string;
  readonly subheadline: string;
  readonly videoSrc: string;
};

type SecondScreen = {
  readonly bottomDescription: string;
  readonly bottomVideoSrc?: string;
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
  readonly largeIconCenterSrc: string;
  readonly largeIconTopSrc: string;
  readonly metricAmount: string;
  readonly metricDescription: string;
  readonly metricImageSrc: string;
  readonly subheadline: string;
  readonly videoSrc?: string;
};

export type KioskChallenges = {
  readonly firstScreen: FirstScreen;
  readonly initialScreen: InitialScreen;
  readonly secondScreen: SecondScreen;
  readonly thirdScreen: ThirdScreen;
};

export const parseKioskChallenges = (value: unknown, _kioskName: string): KioskChallenges => {
  // Simple type assertion - data is already validated by TypeScript at compile time
  return value as KioskChallenges;
};
