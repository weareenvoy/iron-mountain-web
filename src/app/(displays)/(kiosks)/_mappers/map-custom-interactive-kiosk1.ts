import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent } from '../_types/content-types';

// This maps CMS content for Custom Interactive Kiosk 1 to the Kiosk Custom Interactive structure.

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
    backLabel: customInteractive.backCTA,
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
      const modalBodyKey = `ModalBody${index + 1}` as keyof CustomInteractiveContent;
      const modalHeadlineKey = `ModalHeadline${index + 1}` as keyof CustomInteractiveContent;
      const modalBody = customInteractive[modalBodyKey] as string | undefined;
      const modalHeadline = customInteractive[modalHeadlineKey] as string | undefined;
      return {
        label: item,
        modal: {
          body: modalBody ?? '',
          heading: modalHeadline ?? '',
          imageAlt: '',
          imageSrc: `https://iron-mountain-assets-for-dev-testing.s3.us-east-1.amazonaws.com/Kiosks/Rich+Media+%26+Cultural+Heritage/04+-+Custom+Interactive/Illustrations/${item.replace(/\s+/g, '+')}.webp`,
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
