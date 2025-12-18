import Link from 'next/link';
import SummitSlideLayout from '@/app/(displays)/summit/_components/layouts/summit-slide-layout';

const SummitSlidesIndexPage = ({}: PageProps<'/summit/slides'>) => {
  return (
    <SummitSlideLayout>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="text-4xl">Summit slides</div>
        <div className="flex items-center gap-6 text-2xl">
          <Link className="underline" href="/summit/slides/primary">
            Primary
          </Link>
          <Link className="underline" href="/summit/slides/secondary">
            Secondary
          </Link>
        </div>
      </div>
    </SummitSlideLayout>
  );
};

export default SummitSlidesIndexPage;
