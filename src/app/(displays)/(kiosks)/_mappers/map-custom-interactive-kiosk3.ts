import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent } from '../_types/content-types';

// This maps CMS content for Custom Interactive Kiosk 3 to the Kiosk Custom Interactive structure.

type DemoConfig = {
  readonly demoText?: string;
  readonly headline?: string;
  readonly iframeLink?: string;
  readonly mainCTA?: string;
};

export const mapCustomInteractiveKiosk3 = (
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
  fourthScreen: {
    cardLabel: demo?.demoText,
    demoIframeSrc: demo?.iframeLink,
    endTourLabel: demo?.mainCTA,
    headline: demo?.headline,
    heroImageAlt: '',
    heroImageSrc: customInteractive.image,
  },
  secondScreen: {
    backgroundImageSrc: customInteractive.image,
    backLabel: customInteractive.backCTA,
    description: customInteractive.body,
    eyebrow: ambient.title,
    headline: customInteractive.headline2,
    tapToBeginLabel: customInteractive.tapCTA,
    videoAsset: customInteractive.video,
  },
  thirdScreen: {
    demoIframeSrc: demo?.iframeLink,
    headline: customInteractive.headline,
    heroImageAlt: '',
    heroImageSrc: customInteractive.image,
    overlayCardLabel: demo?.demoText,
    overlayEndTourLabel: demo?.mainCTA,
    overlayHeadline: demo?.headline,
    slides:
      customInteractive.tapCarousel?.map((item, index) => ({
        bullets: item.bullets ? [...item.bullets] : [],
        eyebrow: ambient.title,
        headline: item.title ?? '',
        id: `slide-${index + 1}`,
        primaryImageAlt: '',
        primaryImageSrc: item.image ?? '',
        primaryVideoSrc: item.video,
        secondaryImageAlt: '',
        secondaryImageSrc: item.video && item.image ? item.image : undefined,
        sectionTitle: item.title ?? '',
      })) ?? [],
  },
});
