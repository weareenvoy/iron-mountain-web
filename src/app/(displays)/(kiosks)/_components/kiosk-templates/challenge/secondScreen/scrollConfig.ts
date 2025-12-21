import { type ScrollSection } from '../../hooks/useScrollNavigation';

export const secondScreenScrollSections: ScrollSection[] = [
  {
    id: 'top',
    offset: 0,
    targetY: 0,
  },
  {
    id: 'stat-section',
    offset: -200,
    targetY: 1058,
  },
  {
    id: 'main-description',
    offset: -600,
    targetY: 2340,
  },
  {
    id: 'bottom-description',
    offset: -800,
    targetY: 4065,
  },
];
