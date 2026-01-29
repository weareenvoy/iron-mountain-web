import {
  SLIDE_ID,
  type SlideId,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/constants';
import type { CustomInteractiveScreens } from '../_components/kiosk-templates/customInteractiveSection/customInteractiveSlides';
import type { Ambient, CustomInteractiveContent, DemoConfig } from '../_types/content-types';

/**
 * Maps CMS content for Custom Interactive Kiosk 3 to the Kiosk Custom Interactive structure.
 * Contains transformation logic for carousel slides including ID generation and conditional image logic.
 *
 * **Validation:**
 * - Requires exactly 6 carousel slides (hardcoded UI layout)
 * - Throws at mapper level to fail fast before component rendering
 */

/**
 * Known slide IDs for type-safe mapping
 * Enforces compile-time safety for slide-specific logic
 */
const SLIDE_IDS: readonly SlideId[] = [
  SLIDE_ID.SLIDE_1,
  SLIDE_ID.SLIDE_2,
  SLIDE_ID.SLIDE_3,
  SLIDE_ID.SLIDE_4,
  SLIDE_ID.SLIDE_5,
  SLIDE_ID.SLIDE_6,
] as const;

/**
 * Expected slide count for Kiosk 3 carousel
 * UI is hardcoded for 6 dots in circular layout
 */
const EXPECTED_SLIDE_COUNT = 6;

export const mapCustomInteractiveKiosk3 = (
  customInteractive: CustomInteractiveContent,
  ambient: Ambient,
  demo?: DemoConfig
): CustomInteractiveScreens => {
  // Validate slide count upfront (fail fast before rendering)
  const slideCount = customInteractive.tapCarousel?.length ?? 0;
  if (slideCount !== EXPECTED_SLIDE_COUNT) {
    const error = new Error(
      `[mapCustomInteractiveKiosk3] Invalid slide count: expected ${EXPECTED_SLIDE_COUNT}, got ${slideCount}. ` +
        `Kiosk 3 carousel UI requires exactly ${EXPECTED_SLIDE_COUNT} slides. ` +
        'Fix CMS data or update CircularCarousel component to support dynamic slide counts.'
    );
    if (process.env.NODE_ENV === 'development') {
      console.error(error.message, {
        ambient: ambient.title,
        expected: EXPECTED_SLIDE_COUNT,
        received: slideCount,
      });
    }
    throw error;
  }

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
      launchDemoLabel: customInteractive.secondaryCTA,
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

          // Map index to known slide ID (validated above, so safe to index)
          const id = SLIDE_IDS[index]!;

          return {
            bullets: item.bullets ?? [],
            eyebrow: ambient.title,
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
  };
};
