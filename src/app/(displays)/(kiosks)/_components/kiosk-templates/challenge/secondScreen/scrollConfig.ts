import { type ScrollSection } from '../../hooks/useScrollNavigation';

export const secondScreenScrollSections: ScrollSection[] = [
  {
    id: 'stat-section',
    targetY: 1058,
    offset: -200,
  },
  {
    id: 'main-description',
    targetY: 2340,
    offset: -600,
  },
  {
    id: 'bottom-description',
    targetY: 4065,
    offset: -800,
  },
];
