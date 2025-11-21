import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import Header from '@/app/(tablets)/docent/_components/ui/Header';
import MountainIllustration from '@/components/ui/icons/MountainIllustration';

const DocentHomePage = ({}: PageProps<'/docent'>) => {
  // const { isTourDataLoading, isGecStateLoading } = useDocent();

  return (
    <div className="bg-primary-bg-grey relative flex h-full w-full flex-col items-center overflow-hidden">
      {/* Background Illustration */}
      <div className="absolute right-0 bottom-0 left-0 h-[511px] w-full">
        <MountainIllustration
          className="absolute inset-0 h-full w-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        />
      </div>

      {/* Navigation */}
      <Header useDarkLogo />

      {/* Content */}
      <div className="mt-80 flex flex-col items-center gap-[235px] px-10">
        <div className="text-primary-im-dark-blue flex flex-col items-center gap-15 text-center">
          <h1 className="font-geometria text-5xl leading-relaxed tracking-[-2.4px]">
            Iron Mountain
            <br />
            EBC Controls
          </h1>

          <p className="max-w-[572px] text-2xl leading-loose tracking-[-0.05em]">
            Manage and direct the Iron Mountain EBC experience.
          </p>
        </div>

        {/* Go to schedule */}
        <Link className="text-primary-im-dark-blue z-1 h-22 w-60" href="/docent/schedule">
          <Button
            className="h-full w-full"
            size="sm"
            variant="primary"
            // TODO instead of using a loading spinner, we could disable the button when data is loading.
            // disabled={isTourDataLoading || isGecStateLoading}
          >
            <span className="text-2xl tracking-[-1.2px]">Tap to begin</span>
            <ArrowRight className="size-[24px]" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DocentHomePage;
