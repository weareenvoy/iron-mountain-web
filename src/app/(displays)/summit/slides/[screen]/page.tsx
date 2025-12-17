import SummitSlideLayout from '@/app/(displays)/summit/_components/layouts/summit-slide-layout';
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
      <div className="flex flex-1 items-center justify-center text-4xl capitalize">Slide: {slideScreen}</div>
    </SummitSlideLayout>
  );
};

export default SummitSlidesPage;
