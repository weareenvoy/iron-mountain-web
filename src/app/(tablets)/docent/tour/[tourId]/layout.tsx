import tours from '@public/api/tours.json';
import type { ToursApiResponse } from '@/lib/internal/types';

export const generateStaticParams = async () => {
  const toursData = tours as ToursApiResponse;
  // Tour IDs are numbers in the API, convert to strings for URL params
  return toursData.tours.map(t => ({ tourId: String(t.id) }));
};

const DocentTourLayout = ({ children }: LayoutProps<'/docent/tour/[tourId]'>) => {
  return children;
};

export default DocentTourLayout;
