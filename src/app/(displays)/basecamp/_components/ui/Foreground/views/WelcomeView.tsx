'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['welcome'];
};

// Text appears on the left side, then slowly moves left until it disappears

const WelcomeView = ({ data }: Props) => {
  const [stage, setStage] = useState<'exit' | 'fadeIn' | 'hidden' | 'moving'>('hidden');

  // All the animation timing is hardcoded.
  useEffect(() => {
    const t1 = setTimeout(() => setStage('fadeIn'), 100);
    const t2 = setTimeout(() => setStage('moving'), 4000);
    const t3 = setTimeout(() => setStage('exit'), 6000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [data]);

  return (
    <div className="absolute inset-0 flex items-center">
      <div
        className={cn('text-6xl font-bold whitespace-nowrap transition-all', {
          '-translate-x-full opacity-0 duration-[3000ms]': stage === 'exit',
          'translate-x-[10%] opacity-0': stage === 'hidden',
          'translate-x-[10%] opacity-100 duration-0': stage === 'moving',
          'translate-x-[10%] opacity-100 duration-1000': stage === 'fadeIn',
        })}
      >
        {data.text}
      </div>
    </div>
  );
};

export default WelcomeView;
