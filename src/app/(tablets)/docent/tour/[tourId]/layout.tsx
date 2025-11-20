import tours from '../../../../../../public/api/tours.json';
import type { Tour } from '@/app/(tablets)/docent/_types';

export const generateStaticParams = async () => {
  const allTours = tours as Tour[];
  return allTours.map(t => ({ tourId: t.id }));
};

const DocentTourLayout = ({ children }: LayoutProps<'/docent/tour/[tourId]'>) => {
  return children;
};

export default DocentTourLayout;
