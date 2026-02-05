'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilities_a'] | BasecampData['possibilities_b'] | BasecampData['possibilities_c'];
};

// Animation timing constants
const BODY_BLOCK_DELAYS_MS = [2500, 4000, 5500] as const;
const WORD_STAGGER_MS = 80 as const;

const PossibilitiesDetail = ({ data }: Props) => {
  const bodyItems = [data.body_1, data.body_2, data.body_3];

  return (
    // Use key to force remount when data changes
    <div className="text-primary-im-grey absolute inset-0" key={data.title}>
      {/* Title: slide up from below */}
      <div className="animate-slide-up absolute top-26 right-0 left-56 font-geometria text-6xl tracking-[-3px]">
        {data.title}
      </div>

      {/* 3 body blocks: Each block shows up word by word */}
      <div className="absolute bottom-20 flex justify-start gap-38.5 px-20">
        {bodyItems.map((bodyText, index) => {
          const baseDelay = BODY_BLOCK_DELAYS_MS[index] ?? 0;
          const words = bodyText.split(' ');

          return (
            <div className="space-y-2 text-center" key={`${data.title}-body-${index}`}>
              <p className="w-120 text-left text-[40px] leading-[1.3] tracking-[-2px]">
                {words.map((word, i) => (
                  <span
                    className="animate-char-in inline-block"
                    key={i}
                    style={{ animationDelay: `${baseDelay + i * WORD_STAGGER_MS}ms` }}
                  >
                    {word}
                    {i < words.length - 1 && '\u00A0'}
                  </span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PossibilitiesDetail;
