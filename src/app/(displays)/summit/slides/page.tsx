import SummitSlideLayout from '@/app/(displays)/summit/_components/layouts/summit-slide-layout';
import SummitSlidesScreen from '@/app/(displays)/summit/_components/slides/summit-slides-screen';

const SummitSlidesSplitPage = async () => {
  return (
    <SummitSlideLayout>
      <div className="flex h-full w-full">
        <div className="flex h-full flex-1 items-center justify-center bg-background">
          <div className="flex h-full w-full items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
            <SummitSlidesScreen screen="primary" />
          </div>
        </div>
        <div className="flex h-full flex-1 items-center justify-center bg-background">
          <div className="flex h-full w-full items-center justify-center" style={{ aspectRatio: '16 / 9' }}>
            <SummitSlidesScreen screen="secondary" />
          </div>
        </div>
      </div>
    </SummitSlideLayout>
  );
};

export default SummitSlidesSplitPage;
