import type { KioskChallenges } from '../_types/challengeContent';
import type { Ambient, ChallengeContent } from '../_types/content-types';

export const mapChallenges = (challenge: ChallengeContent, ambient: Ambient): KioskChallenges => ({
  firstScreen: {
    labelText: challenge.labelText ?? '',
    problemDescription: challenge.body ?? '',
    savingsAmount: challenge.featuredStat1 ?? '',
    savingsDescription: challenge.featuredStat1Body ?? '',
    subheadline: ambient.title ?? '',
    videoSrc: challenge.mainVideo ?? '',
  },
  initialScreen: {
    attribution: ambient.quoteSource ?? '',
    backgroundImage: ambient.backgroundImage ?? '',
    buttonText: ambient.mainCTA ?? '',
    headline: ambient.headline ?? '',
    quote: ambient.body ?? '',
    subheadline: ambient.title ?? '',
  },
  secondScreen: {
    bottomDescription: '',
    bottomVideoSrc: '',
    labelText: challenge.labelText ?? '',
    largeIconSrc: challenge.item1Image ?? '',
    mainDescription: challenge.item1Body ?? '',
    statAmount: '',
    statDescription: '',
    subheadline: ambient.title ?? '',
    topImageSrc: challenge.item1Image ?? '',
  },
  thirdScreen: {
    description: challenge.item2Body ?? '',
    heroImageSrc: challenge.item2Image ?? '',
    labelText: challenge.labelText ?? '',
    largeIconCenterSrc: challenge.item2Image ?? '',
    largeIconTopSrc: challenge.item2Image ?? '',
    metricAmount: challenge.featuredStat2 ?? '',
    metricDescription: challenge.featuredStat2Body ?? '',
    metricImageSrc: challenge.item2Image ?? '',
    subheadline: ambient.title ?? '',
    videoSrc: '',
  },
});
