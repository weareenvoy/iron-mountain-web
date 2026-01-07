'use client';

import { useWelcomeWall } from './_components/providers/welcome-wall';
import AmbientView from './_components/ui/AmbientView';
import TourView from './_components/ui/TourView';

const WelcomeWallPage = ({}: PageProps<'/welcome-wall'>) => {
  const { showTour } = useWelcomeWall();

  return (
    <div className="relative flex h-[2160px] w-[3840px] flex-col items-center overflow-hidden">
      {showTour ? <TourView /> : <AmbientView />}
    </div>
  );
};

export default WelcomeWallPage;
