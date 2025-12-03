'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilities-a'];
};

// 3 blocks of text show up 1 by 1, starting from left bottom corner,

const PossibilitiesDetail = ({ data }: Props) => {
  const [stage, setStage] = useState<'hidden' | 'show1' | 'show2' | 'show3'>('hidden');

  useEffect(() => {
    // Reset to hidden when data changes (async to avoid linter warning)
    const t0 = setTimeout(() => setStage('hidden'), 0);
    const t1 = setTimeout(() => setStage('show1'), 500);
    const t2 = setTimeout(() => setStage('show2'), 1200);
    const t3 = setTimeout(() => setStage('show3'), 1900);

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

  const bodyItems = [data['body-1'], data['body-2'], data['body-3']];

  return (
    <div className="absolute inset-0 text-black">
      {/* Title at top */}
      <div className="absolute top-[10%] right-0 left-0 text-left text-5xl font-bold">{data.title}</div>

      {/* 3 portions appear one by one, then disappear all at once */}
      <div className="absolute right-0 bottom-[15%] left-0 flex items-end justify-start gap-12 px-[8%]">
        {bodyItems.map((bodyText, index) => {
          const isVisible = getItemVisibility(index);
          const key = `${index}-${bodyText}`;

          return (
            <div
              className={cn('space-y-2 text-center transition-all duration-700', {
                'scale-0 opacity-0': !isVisible,
                'scale-100 opacity-100': isVisible,
              })}
              key={key}
            >
              <p> {bodyText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PossibilitiesDetail;
