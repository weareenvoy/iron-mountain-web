'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilitiesA'] | BasecampData['possibilitiesB'] | BasecampData['possibilitiesC'];
};

// Animation timing constants
const BODY_BLOCK_DELAYS_MS = [2500, 4000, 5500] as const;
const WORD_STAGGER_MS = 80 as const;

const PossibilitiesDetail = ({ data }: Props) => {
  const bodyItems = [data.body1, data.body2, data.body3];

  // Use title as key to force remount when data changes (resets animations)
  return (
    <div className="absolute inset-0 text-black" key={data.title}>
      {/* Title: slide up from below */}
      <div className="animate-slide-up absolute top-24 right-0 left-56 font-geometria text-[55px] font-bold">
        {data.title}
      </div>

      {/* 3 body blocks: Each block shows up word by word */}
      <div className="absolute bottom-20 flex justify-start gap-12 px-20">
        {bodyItems.map((bodyText, index) => {
          const baseDelay = BODY_BLOCK_DELAYS_MS[index] ?? 0;
          const words = bodyText.split(' ');

          return (
            <div className="space-y-2 text-center" key={`${data.title}-body-${index}`}>
              <p className="w-120 text-left text-4xl">
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
