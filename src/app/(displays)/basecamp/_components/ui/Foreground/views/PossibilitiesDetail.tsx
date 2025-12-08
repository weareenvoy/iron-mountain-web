'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilities-a'];
};

// 3 blocks of text show up 1 by 1, starting from left bottom corner,

const PossibilitiesDetail = ({ data }: Props) => {
  const bodyItems = [data['body-1'], data['body-2'], data['body-3']];

  // Stagger delays: 500ms, 1200ms, 1900ms
  const delays = [500, 1200, 1900];

  return (
    <div className="absolute inset-0 text-black">
      {/* Title at top */}
      <div className="absolute top-[10%] right-0 left-0 text-left text-5xl font-bold">{data.title}</div>

      {/* 3 portions appear one by one, then disappear all at once */}
      <div className="absolute right-0 bottom-[15%] left-0 flex items-end justify-start gap-12 px-[8%]">
        {bodyItems.map((bodyText, index) => {
          const key = `${index}-${bodyText}`;
          const delay = delays[index] ?? 0;

          return (
            <div
              className="animate-scale-fade-in space-y-2 text-center"
              key={key}
              style={{ animationDelay: `${delay}ms` }}
            >
              <p>{bodyText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PossibilitiesDetail;
