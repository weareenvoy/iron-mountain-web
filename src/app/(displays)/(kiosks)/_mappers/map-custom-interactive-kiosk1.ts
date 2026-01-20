import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent, DemoConfig } from '../_types/content-types';

/**
 * Maps CMS content for Custom Interactive Kiosk 1 to the Kiosk Custom Interactive structure.
 * Extracts carousel labels and modal content from diamondCarouselItems array.
 */

/**
 * Expected carousel item count for Kiosk 1
 * UI diamond carousel is designed for exactly 5 steps
 */
const EXPECTED_CAROUSEL_ITEM_COUNT = 5;

export const mapCustomInteractiveKiosk1 = (
  customInteractive: CustomInteractiveContent,
  ambient: Ambient,
  demo?: DemoConfig
): CustomInteractiveScreens => {
  // Validate carousel item count upfront (fail fast before rendering)
  const itemCount = customInteractive.diamondCarouselItems?.length ?? 0;
  if (itemCount !== EXPECTED_CAROUSEL_ITEM_COUNT) {
    const error = new Error(
      `[mapCustomInteractiveKiosk1] Invalid carousel item count: expected ${EXPECTED_CAROUSEL_ITEM_COUNT}, got ${itemCount}. ` +
        `Kiosk 1 diamond carousel UI requires exactly ${EXPECTED_CAROUSEL_ITEM_COUNT} items. ` +
        'Fix CMS data or update StepCarousel component to support dynamic item counts.'
    );
    console.error(error.message, {
      ambient: ambient.title,
      expected: EXPECTED_CAROUSEL_ITEM_COUNT,
      received: itemCount,
    });
    throw error;
  }

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
