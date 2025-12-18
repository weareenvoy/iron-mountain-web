import { Suspense } from 'react';
import SummitSlideLayout from '@/app/(displays)/summit/_components/layouts/summit-slide-layout';
import SummitSlidesScreen from '@/app/(displays)/summit/_components/slides/summit-slides-screen';

const SummitSlidesSplitPage = async () => {
  return (
    <SummitSlideLayout>
      <div className="flex h-full w-full">
        <div className="flex h-full flex-1 items-center justify-center bg-background">
          <div className="flex aspect-video h-full w-full items-center justify-center">
            <Suspense fallback={null}>
              <SummitSlidesScreen screen="primary" />
            </Suspense>
          </div>
        </div>
        <div className="flex h-full flex-1 items-center justify-center bg-background">
          <div className="flex aspect-video h-full w-full items-center justify-center">
            <Suspense fallback={null}>
              <SummitSlidesScreen screen="secondary" />
            </Suspense>
          </div>
        </div>
      </div>
    </SummitSlideLayout>
  );
};

export default SummitSlidesSplitPage;
