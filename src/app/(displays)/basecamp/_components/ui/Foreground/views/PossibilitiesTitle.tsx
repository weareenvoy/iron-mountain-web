'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilities'];
};

// Start hidden. fade in. visible. fade out.

const PossibilitiesTitle = ({ data }: Props) => {
  const [stage, setStage] = useState<'fadeIn' | 'fadeOut' | 'hidden' | 'visible'>('hidden');

  useEffect(() => {
    // Reset to hidden when data changes (async to avoid linter warning)
    const t0 = setTimeout(() => setStage('hidden'), 0);
    const t1 = setTimeout(() => setStage('fadeIn'), 500);
    const t2 = setTimeout(() => setStage('visible'), 2000);
    const t3 = setTimeout(() => setStage('fadeOut'), 6000);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [data]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={cn('text-center text-5xl font-bold transition-opacity duration-1000', {
          'opacity-0': stage === 'hidden' || stage === 'fadeOut',
          'opacity-100': stage === 'fadeIn' || stage === 'visible',
        })}
      >
        {data.title}
      </div>
    </div>
  );
};

export default PossibilitiesTitle;
