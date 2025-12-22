import SummitWebLayout from '@/app/(displays)/summit/_components/layouts/summit-web-layout';
import SummitWebContent from '@/app/(displays)/summit/_components/_ui/summit-web-content';

const SummitPage = ({}: PageProps<'/summit'>) => {
  return (
    <SummitWebLayout>
      <SummitWebContent />
    </SummitWebLayout>
  );
};

export default SummitPage;
