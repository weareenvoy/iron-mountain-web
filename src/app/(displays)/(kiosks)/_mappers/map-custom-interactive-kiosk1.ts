import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent } from '../_types/content-types';

/**
 * Maps CMS content for Custom Interactive Kiosk 1 to the Kiosk Custom Interactive structure.
 * Extracts carousel labels and modal content from diamondCarouselItems array.
 */

type DemoConfig = {
  readonly demoText?: string;
  readonly headline?: string;
  readonly iframeLink?: string;
  readonly mainCTA?: string;
};

export const mapCustomInteractiveKiosk1 = (
  customInteractive: CustomInteractiveContent,
  ambient: Ambient,
  demo?: DemoConfig
): CustomInteractiveScreens => {
  // Map steps - diamondCarouselItems is an array of objects containing label and modal data
  const mappedSteps = customInteractive.diamondCarouselItems?.map(item => {
    return {
      label: item.ModalHeadline || '',
      modal: {
        body: item.ModalBody || '',
        heading: item.ModalHeadline || '',
        imageAlt: '',
        imageSrc: item.ModalImage || '',
      },
    };
  });

  return {
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
      backLabel: customInteractive.backCTA,
      bodyText: customInteractive.body2,
      demoIframeSrc: demo?.iframeLink,
      eyebrow: ambient.title,
      headline: customInteractive.headline2,
      heroImageAlt: '',
      heroImageSrc: customInteractive.image,
      overlayCardLabel: demo?.demoText,
      overlayEndTourLabel: demo?.mainCTA,
      overlayHeadline: demo?.headline,
      secondaryCtaLabel: customInteractive.secondaryCTA,
      steps: mappedSteps,
    },
    thirdScreen: {
      cardLabel: demo?.demoText,
      demoIframeSrc: demo?.iframeLink,
      endTourLabel: demo?.mainCTA,
      headline: demo?.headline,
      heroImageAlt: '',
      heroImageSrc: customInteractive.image,
    },
  };
};
