import SummitPrintLayout from '@/app/(displays)/summit/_components/layouts/summit-print-layout';
import { SummitProvider } from '@/app/(displays)/summit/_components/providers/summit-provider';

const SummitPrintPage = ({}: PageProps<'/summit/print'>) => {
  return (
    <SummitProvider>
      <SummitPrintLayout>
        <div className="flex flex-1 items-center justify-center text-center text-lg">Summit print view</div>
      </SummitPrintLayout>
    </SummitProvider>
  );
};

export default SummitPrintPage;
