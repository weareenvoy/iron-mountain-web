import docent from '@public/api/docent.json';
import type { Tour } from '@/lib/internal/types';

export const generateStaticParams = async () => {
  const allTours = docent.data.tours as Tour[];
  return allTours.map(t => ({ tourId: t.id }));
};

const DocentTourLayout = ({ children }: LayoutProps<'/docent/tour/[tourId]'>) => {
  return children;
};

export default DocentTourLayout;
