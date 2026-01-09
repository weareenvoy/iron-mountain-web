import { generateSlideId } from '@/lib/utils/cms-helpers';
import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent } from '../_types/content-types';

/**
 * Maps CMS content for Custom Interactive Kiosk 3 to the Kiosk Custom Interactive structure.
 * Contains transformation logic for carousel slides including ID generation and conditional image logic.
 */

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
  kiosk3OverlayConfig: {
    cardLabel: demo?.demoText,
    demoIframeSrc: demo?.iframeLink,
    endTourLabel: demo?.mainCTA,
    headline: demo?.headline,
    heroImageAlt: '',
    heroImageSrc: customInteractive.image,
  },
  kiosk3SecondScreen: {
    backLabel: customInteractive.backCTA,
    demoIframeSrc: demo?.iframeLink,
    description: customInteractive.body,
    eyebrow: ambient.title,
    headline: customInteractive.headline2,
    overlay: {
      cardLabel: demo?.demoText,
      endTourLabel: demo?.mainCTA,
      headline: demo?.headline,
      heroImageAlt: '',
      heroImageSrc: customInteractive.image,
    },
    slides:
      customInteractive.tapCarousel?.map((item, index) => ({
        bullets: [...(item.bullets ?? [])],
        eyebrow: ambient.title,
        headline: item.title ?? '',
        id: generateSlideId('slide', String(index + 1)),
        primaryImageAlt: '',
        primaryImageSrc: item.image ?? '',
        primaryVideoSrc: item.video,
        secondaryImageAlt: '',
        secondaryImageSrc: item.video && item.image ? item.image : undefined,
        sectionTitle: item.title ?? '',
      })) ?? [],
    tapToBeginLabel: customInteractive.tapCTA,
    videoAsset: customInteractive.video,
  },
});
