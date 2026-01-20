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

export const mapCustomInteractiveKiosk1 = (
  customInteractive: CustomInteractiveContent,
  ambient: Ambient,
  demo?: DemoConfig
): CustomInteractiveScreens => {
  // Map steps - diamondCarouselItems is an array of strings (labels only)
  // Modal data is stored in root-level properties: ModalHeadline1, ModalBody1, etc.
  const mappedSteps = customInteractive.diamondCarouselItems?.map((label, index) => {
    const headlineKey = `ModalHeadline${index + 1}` as keyof CustomInteractiveContent;
    const bodyKey = `ModalBody${index + 1}` as keyof CustomInteractiveContent;
    const imageKey = `ModalImage${index + 1}` as keyof CustomInteractiveContent;

    return {
      label: typeof label === 'string' ? label : '',
      modal: {
        body: (customInteractive[bodyKey] as string) || '',
        heading: (customInteractive[headlineKey] as string) || '',
        imageAlt: '',
        imageSrc: (customInteractive[imageKey] as string) || '',
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
