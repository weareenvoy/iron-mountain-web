'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['welcome'];
};

// Text appears on the left side, then slowly moves left until it disappears

const WelcomeView = ({ data }: Props) => {
  return (
    <div className="absolute top-1/2 left-8 flex -translate-y-1/2 items-center">
      <div
        className="animate-welcome w-130 font-geometria text-[68px] leading-tight font-bold tracking-[-3.4px] text-white"
        key={data.text}
      >
        {data.text}
      </div>
    </div>
  );
};

export default WelcomeView;
