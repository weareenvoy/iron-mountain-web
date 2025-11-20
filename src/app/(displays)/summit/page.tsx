import SummitWebLayout from '@/app/(displays)/summit/_components/layouts/summit-web-layout';

const SummitPage = ({}: PageProps<'/summit'>) => {
  return (
    <SummitWebLayout>
      <div className="flex flex-1 items-center justify-center text-lg">Summit web view</div>
    </SummitWebLayout>
  );
};

export default SummitPage;
