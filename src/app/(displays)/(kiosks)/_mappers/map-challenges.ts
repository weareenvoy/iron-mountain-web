import type { KioskChallenges } from '../_types/challengeContent';
import type { Ambient, ChallengeContent } from '../_types/content-types';

export const mapChallenges = (
  challenge: ChallengeContent,
  ambient: Ambient,
  defaultSubheadline: string
): KioskChallenges => ({
  firstScreen: {
    labelText: challenge.labelText ?? 'Challenge',
    problemDescription: challenge.body ?? '',
    savingsAmount: challenge.featuredStat1 ?? '',
    savingsDescription: challenge.featuredStat1Body ?? '',
    subheadline: ambient.title ?? defaultSubheadline,
    videoSrc: challenge.mainVideo ?? '',
  },
  initialScreen: {
    attribution: ambient.quoteSource ?? '',
    backgroundImage: ambient.backgroundImage ?? '',
    buttonText: ambient.mainCTA ?? 'Touch to explore',
    headline: ambient.headline ?? '',
    quote: ambient.body ?? '',
    subheadline: ambient.title ?? defaultSubheadline,
  },
  secondScreen: {
    bottomDescription: '',
    bottomVideoSrc: '',
    labelText: challenge.labelText ?? 'Challenge',
    largeIconSrc: challenge.item1Image ?? '',
    mainDescription: challenge.item1Body ?? '',
    statAmount: '',
    statDescription: '',
    subheadline: ambient.title ?? defaultSubheadline,
    topImageSrc: challenge.item1Image ?? '',
  },
  thirdScreen: {
    description: challenge.item2Body ?? '',
    heroImageSrc: challenge.item2Image ?? '',
    labelText: challenge.labelText ?? 'Challenge',
    largeIconCenterSrc: challenge.item2Image ?? '',
    largeIconTopSrc: challenge.item2Image ?? '',
    metricAmount: challenge.featuredStat2 ?? '',
    metricDescription: challenge.featuredStat2Body ?? '',
    metricImageSrc: challenge.item2Image ?? '',
    subheadline: ambient.title ?? defaultSubheadline,
    videoSrc: '',
  },
});
