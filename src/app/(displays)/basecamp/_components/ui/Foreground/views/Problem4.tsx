'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-3'];
};

// Title first, then show 4 blocks 1 by 1?
const Problem4 = ({ data }: Props) => {
  const [stage, setStage] = useState<'hidden' | 'show1' | 'show2' | 'show3' | 'show4' | 'showTitle'>('hidden');

  useEffect(() => {
    // Reset to hidden when data changes (async to avoid linter warning)
    const t0 = setTimeout(() => setStage('hidden'), 0);
    const t1 = setTimeout(() => setStage('showTitle'), 300);
    const t2 = setTimeout(() => setStage('show1'), 900);
    const t3 = setTimeout(() => setStage('show2'), 1300);
    const t4 = setTimeout(() => setStage('show3'), 1700);
    const t5 = setTimeout(() => setStage('show4'), 2100);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [data]);

  const getChallengeVisibility = (challengeNum: number): boolean => {
    if (stage === 'hidden' || stage === 'showTitle') return false;
    if (stage === 'show1') return challengeNum === 1;
    if (stage === 'show2') return challengeNum <= 2;
    if (stage === 'show3') return challengeNum <= 3;
    return true; // show4 shows all
  };

  const challenges = [data['challenge-1'], data['challenge-2'], data['challenge-3'], data['challenge-4']];

  return (
    <div className="flex h-full w-full flex-row items-center justify-between p-50 text-black">
      <div
        className={cn('text-5xl font-bold transition-all duration-700', {
          'scale-0 opacity-0': stage === 'hidden',
          'scale-100 opacity-100': stage !== 'hidden',
        })}
      >
        {data.title}
      </div>
      <div className="flex flex-row">
        {challenges.map((challenge, index) => {
          const challengeNum = index + 1;
          const isVisible = getChallengeVisibility(challengeNum);

          return (
            <div
              className={cn('w-100 space-y-2 transition-all duration-600', {
                'scale-0 opacity-0': !isVisible,
                'scale-100 opacity-100': isVisible,
              })}
              key={`${challengeNum}-container`}
            >
              <div className="text-2xl font-semibold">{challenge.title}</div>
              <div className="text-lg">{challenge.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Problem4;
