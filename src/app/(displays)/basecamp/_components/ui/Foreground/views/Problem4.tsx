'use client';

import Image from 'next/image';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem3'];
};

// Animation timing constants
const BLOCK_DURATION_MS = 2000 as const; // Time budget per block
const BLOCKS_START_DELAY_MS = 500 as const; // When first block starts
const MAIN_TITLE_WORD_STAGGER_MS = 100 as const;
const CARD_TITLE_DELAY_MS = 300 as const; // After block start
const CARD_TITLE_WORD_STAGGER_MS = 80 as const;
const CARD_ICON_DELAY_MS = 600 as const; // After block start
const CARD_BODY_DELAY_MS = 900 as const; // After block start
const CARD_BODY_WORD_STAGGER_MS = 60 as const;

const Problem4 = ({ data }: Props) => {
  const challenges = [data.challenge1, data.challenge2, data.challenge3, data.challenge4];
  const mainTitleWords = data.title.split(' ');

  return (
    <div className="flex h-full w-full flex-row items-center justify-between px-20 text-black">
      {/* Main title: word by word */}
      <div className="mt-60 h-full w-140 font-geometria text-[66px] leading-tight">
        {mainTitleWords.map((word, i) => (
          <span
            className="animate-char-in inline-block"
            key={i}
            style={{ animationDelay: `${i * MAIN_TITLE_WORD_STAGGER_MS}ms` }}
          >
            {word}
            {i < mainTitleWords.length - 1 && '\u00A0'}
          </span>
        ))}
      </div>

      <div className="flex flex-row gap-4">
        {challenges.map((challenge, index) => {
          // Each block starts after the previous one completes
          const blockStart = BLOCKS_START_DELAY_MS + index * BLOCK_DURATION_MS;
          const cardTitleWords = challenge.title.split(' ');
          const bodyWords = challenge.body.split(' ');

          return (
            <div className="flex w-150 flex-col items-center gap-6" key={`challenge-${index}`}>
              {/* Blue background grows horizontally - fits content width */}
              <div
                className="animate-grow-x bg-primary-im-dark-blue inline-flex items-center justify-center rounded-full px-4 py-2"
                style={{ animationDelay: `${blockStart}ms` }}
              >
                {/* Title text: show up word by word */}
                <p className="text-2xl font-semibold whitespace-nowrap text-white">
                  {cardTitleWords.map((word, i) => {
                    const titleWordDelay = blockStart + CARD_TITLE_DELAY_MS + i * CARD_TITLE_WORD_STAGGER_MS;
                    return (
                      <span
                        className="animate-char-in inline-block"
                        key={i}
                        style={{ animationDelay: `${titleWordDelay}ms` }}
                      >
                        {word}
                        {i < cardTitleWords.length - 1 && '\u00A0'}
                      </span>
                    );
                  })}
                </p>
              </div>

              {/* Icon scales up */}
              <div
                className="animate-scale-fade-in flex items-center justify-center"
                style={{ animationDelay: `${blockStart + CARD_ICON_DELAY_MS}ms` }}
              >
                <Image alt={challenge.title} height={300} src={challenge.icon} width={300} />
              </div>

              {/* Body: word by word */}
              <div className="w-68 text-center text-[20px] text-black">
                {bodyWords.map((word, i) => (
                  <span
                    className="animate-char-in inline-block"
                    key={i}
                    style={{ animationDelay: `${blockStart + CARD_BODY_DELAY_MS + i * CARD_BODY_WORD_STAGGER_MS}ms` }}
                  >
                    {word}
                    {i < bodyWords.length - 1 && '\u00A0'}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Problem4;
