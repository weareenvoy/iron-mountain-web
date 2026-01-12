import {
  SLIDE_ID,
  type SlideId,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/constants';
import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent } from '../_types/content-types';

/**
 * Maps CMS content for Custom Interactive Kiosk 3 to the Kiosk Custom Interactive structure.
 * Contains transformation logic for carousel slides including ID generation and conditional image logic.
 */

// Known slide IDs for Kiosk 3 - ensures type safety without runtime assertions
const SLIDE_IDS: readonly SlideId[] = [
  SLIDE_ID.SLIDE_1,
  SLIDE_ID.SLIDE_2,
  SLIDE_ID.SLIDE_3,
  SLIDE_ID.SLIDE_4,
  SLIDE_ID.SLIDE_5,
  SLIDE_ID.SLIDE_6,
] as const;

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
      customInteractive.tapCarousel?.map((item, index) => {
        // When video exists, use image as secondary decorative element
        const secondaryImageSrc = item.video && item.image ? item.image : undefined;

        // Validate slide index against known slide IDs
        const id = SLIDE_IDS[index];
        if (!id) {
          throw new Error(
            `[mapCustomInteractiveKiosk3] Unexpected slide index: ${index}. ` +
              `Expected 0-${SLIDE_IDS.length - 1}. Fix CMS data or add more SLIDE_IDS.`
          );
        }

        return {
          bullets: item.bullets ?? [],
          eyebrow: ambient.title ?? '',
          headline: item.title ?? '',
          id,
          primaryImageAlt: '',
          primaryImageSrc: item.image ?? '',
          primaryVideoSrc: item.video ?? undefined,
          secondaryImageAlt: '',
          secondaryImageSrc,
          sectionTitle: item.title ?? '',
        };
      }) ?? [],
    tapToBeginLabel: customInteractive.tapCTA,
    videoAsset: customInteractive.video,
  },
});
