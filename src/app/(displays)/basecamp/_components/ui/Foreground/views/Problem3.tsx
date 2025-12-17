'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem2'];
};

// Animation timing constants
const BLOCK_DELAYS_MS = [4000, 5500, 7000] as const;
const CHAR_STAGGER_MS = 30 as const;
const LAST_BLOCK_OFFSET_PX = -50 as const;

// 3 locks of text. First shows up in left, second in center, third in right

const Problem3 = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex">
      {data.map((item, index) => {
        const baseDelay = BLOCK_DELAYS_MS[index] ?? 0;
        const subtitleChars = item.percentSubtitle.split('');
        const isLastBlock = index === data.length - 1;

        return (
          <div
            className="flex flex-1 flex-col items-center justify-center font-geometria text-white"
            key={`${item.percent}-${item.percentSubtitle}`}
          >
            {/* Add margin-left to last div to match design */}
            <div
              className="space-y-2 text-center"
              style={isLastBlock ? { marginLeft: `${LAST_BLOCK_OFFSET_PX}px` } : undefined}
            >
              {/* Percent fades in */}
              <div
                className="animate-fade-in text-8xl font-bold opacity-0"
                style={{ animationDelay: `${baseDelay}ms` }}
              >
                {item.percent}
              </div>
              {/* Subtitle: char by char with small jump */}
              <div className="text-2xl">
                {subtitleChars.map((char, i) => (
                  <span
                    className="animate-char-in inline-block"
                    key={i}
                    style={{ animationDelay: `${baseDelay + i * CHAR_STAGGER_MS}ms` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
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
