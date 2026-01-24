'use client';

import { useRef } from 'react';
import { useAnimationStartSfx } from '@/app/(displays)/basecamp/_hooks/use-animation-start-sfx';

type Props = {
  readonly data: readonly string[];
};

// Animation timing constants (single source of truth for CSS)
const BLOCK_DELAYS_MS = [2000, 3400, 4800] as const;
const WORD_STAGGER_MS = 100 as const;

// 3 blocks of text. First shows up in left, second in center, third in right

const PossibilitiesDetailsTitles = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Play SFX when elements with data-sfx="appear" start animating
  useAnimationStartSfx({ containerRef, selector: '[data-sfx="appear"]' });

  return (
    <div className="absolute inset-0 flex" ref={containerRef}>
      {data.map((title, index) => {
        const baseDelay = BLOCK_DELAYS_MS[index] ?? 0;
        const titleWords = title.split(' ');

        return (
          <div
            className="flex flex-1 flex-col items-center justify-center font-geometria text-white"
            key={`${title}-${index}`}
          >
            <div className="text-center">
              {/* Title: word by word with small jump */}
              <div className="mt-10 w-150 text-center text-6xl tracking-[-5%]">
                {titleWords.map((word, i) => (
                  <span
                    className="animate-char-in inline-block"
                    // First word of each block triggers SFX
                    data-sfx={i === 0 ? 'appear' : undefined}
                    key={i}
                    style={{ animationDelay: `${baseDelay + i * WORD_STAGGER_MS}ms` }}
                  >
                    {word}
                    {i < titleWords.length - 1 && '\u00A0'}
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

export default PossibilitiesDetailsTitles;
