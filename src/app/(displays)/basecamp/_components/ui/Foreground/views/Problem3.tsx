'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-2'];
};

// 3 locks of text. First shows up in left, second in center, third in right

const Problem3 = ({ data }: Props) => {
  const [stage, setStage] = useState<'hidden' | 'show1' | 'show2' | 'show3'>('hidden');

  useEffect(() => {
    // Reset to hidden when data changes (async to avoid linter warning)
    const t0 = setTimeout(() => setStage('hidden'), 0);
    const t1 = setTimeout(() => setStage('show1'), 1500);
    const t2 = setTimeout(() => setStage('show2'), 2000);
    const t3 = setTimeout(() => setStage('show3'), 2500);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [data]);

  const getItemVisibility = (index: number): boolean => {
    if (stage === 'hidden') return false;
    if (stage === 'show1') return index === 0;
    if (stage === 'show2') return index <= 1;
    return true; // show3 shows all
  };

  return (
    <div className="absolute inset-0 flex">
      {data.map((item, index) => {
        const key = `${item.percent}-${item.percentSubtitle}`;
        const isVisible = getItemVisibility(index);

        return (
          <div className={cn('flex flex-1 flex-col items-center justify-center')} key={key}>
            <div
              className={cn('space-y-2 text-center transition-all duration-700', {
                'scale-0 opacity-0': !isVisible,
                'scale-100 opacity-100': isVisible,
              })}
            >
              <div className="text-8xl font-bold">{item.percent}</div>
              <div className="text-2xl">{item.percentSubtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Problem3;
