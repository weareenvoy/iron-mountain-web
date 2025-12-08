'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['welcome'];
};

// Text appears on the left side, then slowly moves left until it disappears

const WelcomeView = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center">
      <div className="animate-welcome text-6xl font-bold whitespace-nowrap" key={data.text}>
        {data.text}
      </div>
    </div>
  );
};

export default WelcomeView;
