'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem2'];
};

// Animation timing constants
const BLOCK_DELAYS_MS = [3900, 5400, 6900] as const;
const WORD_STAGGER_MS = 100 as const;
const LAST_BLOCK_OFFSET_PX = -50 as const;

// 3 locks of text. First shows up in left, second in center, third in right

const Problem3 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex">
      {data.map((item, index) => {
        const baseDelay = BLOCK_DELAYS_MS[index] ?? 0;
        const isLastBlock = index === data.length - 1;

        return (
          <div
            className="flex flex-1 flex-col items-center justify-center font-geometria text-white"
            key={`${item.percent}-${item.percentSubtitle}`}
          >
            {/* Add margin-left to last div to match design */}
            <div
              className="mt-10 space-y-1 text-center"
              style={isLastBlock ? { marginLeft: `${LAST_BLOCK_OFFSET_PX}px` } : undefined}
            >
              {/* Percent fades in */}
              <div
                className="animate-fade-in h-28 text-[86px] tracking-[-4.3px] opacity-0"
                style={{ animationDelay: `${baseDelay}ms` }}
              >
                {item.percent}
              </div>
              {/* Subtitle: word by word with small jump */}
              <div className="min-h-22 w-80 text-center font-interstate text-[33px] leading-[1.3] tracking-[-1.6px]">
                {item.percentSubtitle.split(' ').map((word, i, arr) => (
                  <span
                    className="animate-char-in inline-block"
                    key={i}
                    style={{ animationDelay: `${baseDelay + i * WORD_STAGGER_MS}ms` }}
                  >
                    {word}
                    {i < arr.length - 1 && '\u00A0'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Problem3;
