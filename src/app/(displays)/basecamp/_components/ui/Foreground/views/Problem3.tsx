'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-2'];
};

// 3 locks of text. First shows up in left, second in center, third in right

const Problem3 = ({ data }: Props) => {
  // Stagger delays: 2000ms, 3000ms, 4000ms
  const delays = [2000, 3000, 4000];

  return (
    <div className="absolute inset-0 flex">
      {data.map((item, index) => {
        const key = `${item.percent}-${item.percentSubtitle}`;
        const delay = delays[index] ?? 0;

        return (
          <div className="flex flex-1 flex-col items-center justify-center" key={key}>
            <div className="animate-scale-fade-in space-y-2 text-center" style={{ animationDelay: `${delay}ms` }}>
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
