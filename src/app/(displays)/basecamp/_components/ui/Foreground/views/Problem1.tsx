'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-1'];
};

// Text appears in top-left corner (static, no animation). In Problem2, it shrinks and moves up-left until it disappears.
const Problem1 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0">
      <div className="animate-fade-in absolute top-[15%] left-[8%] text-5xl font-bold" key={data.text}>
        {data.text}
      </div>
    </div>
  );
};

export default Problem1;
