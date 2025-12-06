'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-1'];
};

// Text appears in top-left corner, in Problem 2, it shrinks and moves up-left until disappears
const Problem2 = ({ data }: Props) => {
  const [stage, setStage] = useState<'exit' | 'fadeIn' | 'hidden' | 'shrinking'>('hidden');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('fadeIn'), 0);
    const t2 = setTimeout(() => setStage('shrinking'), 500);
    const t3 = setTimeout(() => setStage('exit'), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [data]);

  return (
    <div className="absolute inset-0">
      <div
        className={cn('absolute text-5xl font-bold transition-all', {
          '-top-[5%] -left-[10%] scale-50 opacity-0 duration-2000': stage === 'exit',
          'top-[15%] left-[8%] scale-100 opacity-0': stage === 'hidden',
          'top-[15%] left-[8%] scale-100 opacity-100 duration-0': stage === 'shrinking',
          'top-[15%] left-[8%] scale-100 opacity-100 duration-300': stage === 'fadeIn',
        })}
      >
        {data.text}
      </div>
    </div>
  );
};

export default Problem2;
