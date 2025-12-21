import { type ScrollSection } from '../../hooks/useScrollNavigation';

export const firstScreenScrollSections: ScrollSection[] = [
  {
    id: 'top',
    offset: 0,
    targetY: 0,
  },
  {
    id: 'problem-description',
    offset: -300,
    targetY: 1230,
  },
  {
    id: 'savings-metrics',
    offset: -400,
    targetY: 2465,
  },
];
