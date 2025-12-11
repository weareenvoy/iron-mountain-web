import SummitSlideLayout from '@/app/(displays)/summit/_components/layouts/summit-slide-layout';
import SummitSlidesScreen from '@/app/(displays)/summit/_components/slides/summit-slides-screen';
import type { SummitSlideScreen } from '@/app/(displays)/summit/_types';

const SLIDE_SCREENS: readonly SummitSlideScreen[] = ['primary', 'secondary'];

export const generateStaticParams = () => {
  return SLIDE_SCREENS.map(screen => ({ screen }));
};

const SummitSlidesPage = async ({ params }: PageProps<'/summit/slides/[screen]'>) => {
  const { screen } = await params;
  const slideScreen = screen as SummitSlideScreen;

  return (
    <SummitSlideLayout>
      <SummitSlidesScreen screen={slideScreen} />
    </SummitSlideLayout>
  );
};

export default SummitSlidesPage;
