import type { ValueScreens } from '../_components/kiosk-templates/value/valueSlides';
import type { Ambient, ValueContent } from '../_types/content-types';
import type { KioskId } from '../_types/kiosk-id';

export const mapValue = (value: ValueContent, ambient: Ambient, kioskId: KioskId): ValueScreens => {
  const heroVideoSrc = value.mainVideo;
  const description = value.body;
  const headline = value.headline;

  const benefits = value.diamondBenefits ?? [];
  const overviewCards = [
    { color: '#8a0d71', label: 'Operational benefits' },
    { color: '#1b75bc', label: 'Economic benefits' },
    { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
  ];

  const buildDiamondCards = (label?: string) => {
    const normalized = (label ?? '').toLowerCase();
    if (normalized.includes('operational')) {
      return [
        { color: '#f26522', label: '', textColor: '#4a154b' },
        { color: '#1b75bc', label: '' },
        { color: '#8a0d71', label: 'Operational benefits' },
      ];
    }
    if (normalized.includes('economic') || normalized.includes('economical')) {
      return [
        { color: '#8a0d71', label: '' },
        { color: '#f26522', label: '', textColor: '#4a154b' },
        { color: '#1b75bc', label: 'Economic benefits' },
      ];
    }
    return [
      { color: '#1b75bc', label: '' },
      { color: '#8a0d71', label: '' },
      { color: '#f26522', label: 'Strategic benefits', textColor: '#4a154b' },
    ];
  };

  const carouselSlides = benefits.map(benefit => ({
    badgeLabel: benefit.label,
    bullets: benefit.bullets,
    diamondCards: buildDiamondCards(benefit.label),
    id: `value-${(benefit.label ?? '').toLowerCase().replace(/\s+/g, '-')}`,
  }));

  return {
    valueScreens: [
      {
        carouselId: `${kioskId}-value-overview`,
        description,
        eyebrow: ambient.title,
        headline,
        heroVideoSrc,
        labelText: value.labelText ?? 'Value',
        slides: [
          {
            badgeLabel: 'Operational · Economic · Strategic',
            diamondCards: overviewCards,
            id: 'value-trio-overview',
          },
        ],
      },
      {
        carouselId: `${kioskId}-value-carousel`,
        description,
        eyebrow: ambient.title,
        headline,
        labelText: value.labelText ?? 'Value',
        slides: carouselSlides,
      },
    ],
  };
};
