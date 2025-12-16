import { type ScrollSection } from '../../hooks/useScrollNavigation';

export const firstScreenScrollSections: ScrollSection[] = [
  {
    id: 'problem-description',
    targetY: 230,
    offset: -900, // Adjust to center better in viewport
  },
  {
    id: 'savings-metrics',
    targetY: 2465,
    offset: -400,
  },
];
