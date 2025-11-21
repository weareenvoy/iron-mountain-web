import SummitWebContent from '@/app/(displays)/summit/_components/summit-web-content';
import SummitWebLayout from '@/app/(displays)/summit/_components/layouts/summit-web-layout';

const SummitPage = ({}: PageProps<'/summit'>) => {
  return (
    <SummitWebLayout>
      <SummitWebContent />
    </SummitWebLayout>
  );
};

export default SummitPage;
