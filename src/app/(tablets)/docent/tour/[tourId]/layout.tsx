import docent from '@public/api/docent.json';
import type { DocentApiResponse } from '@/lib/internal/types';

export const generateStaticParams = async () => {
  const docentData = docent as DocentApiResponse;
  // Get tours from the first locale (en) - tours should be the same across locales
  const allTours = docentData[0]?.data.tours ?? [];
  return allTours.map(t => ({ tourId: t.id }));
};

const DocentTourLayout = ({ children }: LayoutProps<'/docent/tour/[tourId]'>) => {
  return children;
};

export default DocentTourLayout;
