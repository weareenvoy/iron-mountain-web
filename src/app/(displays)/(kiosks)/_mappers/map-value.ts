import { generateSlideId } from '@/lib/utils/cms-helpers';
import { buildDiamondCards, createOverviewDiamondCards } from '../_utils/value-diamond-logic';
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
      // Overview screen showing all benefit types
      {
        body: value.body,
        carouselId: `${kioskId}-value-overview`,
        eyebrow: ambient.title,
        headline: value.headline,
        labelText: value.labelText ?? '',
        mainVideo: value.mainVideo,
        slides: [
          {
            badgeLabel: 'Operational · Economic · Strategic',
            diamondCards: createOverviewDiamondCards(),
            id: 'value-trio-overview',
          },
        ],
      },
      // Carousel screen with individual benefit slides
      {
        body: value.body,
        carouselId: `${kioskId}-value-carousel`,
        eyebrow: ambient.title,
        headline: value.headline,
        labelText: value.labelText ?? '',
        slides: carouselSlides,
      },
    ],
  };
};
