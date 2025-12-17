import { type ScrollSection } from '../../hooks/useScrollNavigation';

export const firstScreenScrollSections: ScrollSection[] = [
  {
    id: 'problem-description',
    targetY: 1230,
    offset: -300, // Adjust to center better in viewport
  },
  {
    id: 'savings-metrics',
    targetY: 2465,
    offset: -400,
  },
];

