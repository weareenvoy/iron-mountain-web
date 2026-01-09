import { generateSlideId } from '@/lib/utils/cms-helpers';
import { buildDiamondCards } from '../_utils/value-diamond-logic';
import type { ValueScreens } from '../_components/kiosk-templates/value/valueSlides';
import type { Ambient, ValueContent } from '../_types/content-types';
import type { KioskId } from '../_types/kiosk-id';

/**
 * Maps CMS content for Value to the Kiosk Value structure.
 * Transforms CMS benefits array into structured carousel slides with diamond card configurations.
 */
export const mapValue = (value: ValueContent, ambient: Ambient, kioskId: KioskId): ValueScreens => {
  const benefits = value.diamondBenefits ?? [];

  // Build carousel slides with diamond card configurations
  const carouselSlides = benefits.map(benefit => ({
    badgeLabel: benefit.label,
    bullets: benefit.bullets,
    diamondCards: buildDiamondCards(benefit.label),
    id: generateSlideId('value', benefit.label ?? ''),
  }));

  return {
    valueScreens: [
      // Single animated carousel screen with diamonds animating into position on slide 1
      {
        body: value.body,
        carouselId: `${kioskId}-value-carousel`,
        eyebrow: ambient.title,
        headline: value.headline,
        labelText: value.labelText ?? '',
        mainVideo: value.mainVideo,
        slides: carouselSlides,
      },
    ],
  };
};
