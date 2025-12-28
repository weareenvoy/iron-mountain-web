import type { KioskChallenges } from '../_types/challengeContent';
import type { Ambient, ChallengeContent } from '../_types/content-types';

/**
 * Combines CMS Challenge and Ambient content into the Kiosk Challenges structure.
 * This mapper exists to merge two separate CMS data sources into a unified structure.
 */
export const mapChallenges = (challenge: ChallengeContent, ambient: Ambient): KioskChallenges => ({
  firstScreen: {
    body: challenge.body ?? '',
    featuredStat1: challenge.featuredStat1 ?? '',
    featuredStat1Body: challenge.featuredStat1Body ?? '',
    labelText: challenge.labelText ?? '',
    mainVideo: challenge.mainVideo ?? '',
    subheadline: ambient.title ?? '',
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
    item1Body: challenge.item1Body ?? '',
    item1Image: challenge.item1Image ?? '',
    labelText: challenge.labelText,
    subheadline: ambient.title ?? '',
  },
  thirdScreen: {
    featuredStat2: challenge.featuredStat2 ?? '',
    featuredStat2Body: challenge.featuredStat2Body ?? '',
    item2Body: challenge.item2Body ?? '',
    item2Image: challenge.item2Image ?? '',
    labelText: challenge.labelText,
    subheadline: ambient.title ?? '',
  },
});
