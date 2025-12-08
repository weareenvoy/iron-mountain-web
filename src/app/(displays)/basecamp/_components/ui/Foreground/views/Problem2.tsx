'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-1'];
};

// Text appears in top-left corner, in Problem 2, it shrinks and moves up-left until disappears
const Problem2 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0">
      <div className="animate-problem2 absolute text-5xl font-bold" key={data.text}>
        {data.text}
      </div>
    </div>
  );
};

export default Problem2;
