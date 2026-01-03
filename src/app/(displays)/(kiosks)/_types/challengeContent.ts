import { getOptionalProperty, validateObject, validateOptionalString, validateString } from '../_utils/validators';

/**
 * Type definitions for the Challenge section of the Kiosk setup.
 * Every slide's data and types are defined here.
 */

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

/**
 * Validates and parses challenge content from CMS data.
 * Throws ValidationException if data is malformed.
 */
export const parseKioskChallenges = (value: unknown): KioskChallenges => {
  return validateObject(value, 'KioskChallenges', obj => {
    const initialScreen = getOptionalProperty(obj, 'initialScreen', val =>
      validateObject(val, 'initialScreen', screen => ({
        arrowIconSrc: validateOptionalString(screen.arrowIconSrc, 'arrowIconSrc'),
        attribution: validateString(screen.attribution, 'attribution'),
        backgroundImage: validateString(screen.backgroundImage, 'backgroundImage'),
        buttonText: validateString(screen.buttonText, 'buttonText'),
        headline: validateString(screen.headline, 'headline'),
        quote: validateString(screen.quote, 'quote'),
        subheadline: validateString(screen.subheadline, 'subheadline'),
      }))
    );

    const firstScreen = getOptionalProperty(obj, 'firstScreen', val =>
      validateObject(val, 'firstScreen', screen => ({
        body: validateString(screen.body, 'body'),
        featuredStat1: validateString(screen.featuredStat1, 'featuredStat1'),
        featuredStat1Body: validateString(screen.featuredStat1Body, 'featuredStat1Body'),
        labelText: validateString(screen.labelText, 'labelText'),
        mainVideo: validateString(screen.mainVideo, 'mainVideo'),
        subheadline: validateString(screen.subheadline, 'subheadline'),
      }))
    );

    const secondScreen = getOptionalProperty(obj, 'secondScreen', val =>
      validateObject(val, 'secondScreen', screen => ({
        item1Body: validateString(screen.item1Body, 'item1Body'),
        item1Image: validateString(screen.item1Image, 'item1Image'),
        labelText: validateOptionalString(screen.labelText, 'labelText'),
        subheadline: validateString(screen.subheadline, 'subheadline'),
      }))
    );

    const thirdScreen = getOptionalProperty(obj, 'thirdScreen', val =>
      validateObject(val, 'thirdScreen', screen => ({
        featuredStat2: validateString(screen.featuredStat2, 'featuredStat2'),
        featuredStat2Body: validateString(screen.featuredStat2Body, 'featuredStat2Body'),
        item2Body: validateString(screen.item2Body, 'item2Body'),
        item2Image: validateString(screen.item2Image, 'item2Image'),
        labelText: validateOptionalString(screen.labelText, 'labelText'),
        subheadline: validateString(screen.subheadline, 'subheadline'),
      }))
    );

    // Fallback if any required screen is missing
    if (!initialScreen || !firstScreen || !secondScreen || !thirdScreen) {
      throw new Error('Missing required challenge screens');
    }

    return {
      firstScreen,
      initialScreen,
      secondScreen,
      thirdScreen,
    };
  });
};
