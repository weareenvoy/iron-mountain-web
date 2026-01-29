'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly beatId: 'welcome-1' | 'welcome-2';
  readonly locationDetails: BasecampData['location_details'];
  readonly welcome: BasecampData['welcome'];
};

// welcome-1: Text appears and stays static
// welcome-2: Text moves left and fades out

const WelcomeView = ({ beatId, locationDetails, welcome }: Props) => {
  const isExiting = beatId === 'welcome-2';

  return (
    <>
      {/* Welcome text - vertically centered */}
      <div className="absolute top-1/2 left-20 flex -translate-y-1/2 items-center">
        <div
          className={`w-130 font-geometria text-[68px] leading-tight font-bold tracking-[-3.4px] text-white ${isExiting ? 'animate-welcome-exit' : ''}`}
          key={welcome.title}
        >
          {welcome.title}
        </div>
      </div>

      {/* Location details at the bottom */}
      <div
        className={`absolute bottom-17 flex w-full items-center justify-between pr-170 pl-35 font-interstate text-[34px] text-white ${isExiting ? 'animate-location-details-exit' : ''}`}
      >
        <span>{locationDetails.exhibit}</span>
        <span className="mr-50 tracking-[-1.7px]">{locationDetails.name}</span>
        <span>{locationDetails.elevation}</span>
      </div>
    </>
  );
};

export default WelcomeView;
