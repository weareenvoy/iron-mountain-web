import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent } from '../_types/content-types';

/**
 * Maps CMS content for Custom Interactive Kiosk 1 to the Kiosk Custom Interactive structure.
 * Handles dynamic modal content access using index-based keys (ModalHeadline1, ModalBody1, ModalImage1, etc.)
 */

type DemoConfig = {
  readonly demoText?: string;
  readonly headline?: string;
  readonly iframeLink?: string;
  readonly mainCTA?: string;
};

/**
 * Type-safe accessor for modal properties with runtime validation
 */
const getModalProperty = (
  customInteractive: CustomInteractiveContent,
  property: 'Body' | 'Headline' | 'Image',
  index: number
): string | undefined => {
  const key = `Modal${property}${index + 1}` as keyof CustomInteractiveContent;

  // Check if key exists
  if (!(key in customInteractive)) {
    return undefined;
  }

  const value = customInteractive[key];

  // Validate value is string or undefined
  if (value !== undefined && typeof value !== 'string') {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Modal${property}${index + 1} is not a string:`, value);
    }
    return undefined;
  }

  return value;
};

export const mapCustomInteractiveKiosk1 = (
  customInteractive: CustomInteractiveContent,
  ambient: Ambient,
  demo?: DemoConfig
): CustomInteractiveScreens => ({
  firstScreen: {
    demoIframeSrc: demo?.iframeLink,
    eyebrow: ambient.title,
    headline: customInteractive.headline,
    heroImageAlt: '',
    heroImageSrc: customInteractive.image,
    overlayCardLabel: demo?.demoText,
    overlayEndTourLabel: demo?.mainCTA,
    overlayHeadline: demo?.headline,
    primaryCtaLabel: customInteractive.mainCTA,
    secondaryCtaLabel: customInteractive.secondaryCTA,
  },
  secondScreen: {
    demoIframeSrc: demo?.iframeLink,
    eyebrow: ambient.title,
    headline: customInteractive.headline2,
    heroImageAlt: '',
    heroImageSrc: customInteractive.image,
    overlayCardLabel: demo?.demoText,
    overlayEndTourLabel: demo?.mainCTA,
    overlayHeadline: demo?.headline,
    secondaryCtaLabel: customInteractive.secondaryCTA,
    steps: customInteractive.diamondCarouselItems?.map((item, index) => {
      // Use type-safe accessor with validation
      const modalBody = getModalProperty(customInteractive, 'Body', index);
      const modalHeadline = getModalProperty(customInteractive, 'Headline', index);
      const modalImage = getModalProperty(customInteractive, 'Image', index);

      return {
        label: item,
        modal: {
          body: modalBody ?? '',
          heading: modalHeadline ?? '',
          imageAlt: '',
          imageSrc: modalImage,
        },
      };
    }),
  },
  thirdScreen: {
    cardLabel: demo?.demoText,
    demoIframeSrc: demo?.iframeLink,
    endTourLabel: demo?.mainCTA,
    headline: demo?.headline,
    heroImageAlt: '',
    heroImageSrc: customInteractive.image,
  },
});
