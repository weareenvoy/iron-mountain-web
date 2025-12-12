'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-3'];
};

// Title first, then show 4 blocks 1 by 1?
const Problem4 = ({ data }: Props) => {
  const challenges = [data['challenge-1'], data['challenge-2'], data['challenge-3'], data['challenge-4']];

  // Stagger delays for challenges: 900ms, 1300ms, 1700ms, 2100ms
  const challengeDelays = [900, 1300, 1700, 2100];

  return (
    <div className="flex h-full w-full flex-row items-center justify-between p-50 text-black">
      <div className="animate-scale-fade-in text-5xl font-bold" style={{ animationDelay: '300ms' }}>
        {data.title}
      </div>
      <div className="flex flex-row">
        {challenges.map((challenge, index) => {
          const challengeNum = index + 1;
          const delay = challengeDelays[index] ?? 0;

          return (
            <div
              className="animate-scale-fade-in w-100 space-y-2"
              key={`${challengeNum}-container`}
              style={{ animationDelay: `${delay}ms` }}
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
