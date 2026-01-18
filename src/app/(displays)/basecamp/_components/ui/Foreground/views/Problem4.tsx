'use client';

import Image from 'next/image';
import { useAppearSfx } from '@/app/(displays)/basecamp/_hooks/use-appear-sfx';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem3'];
};

// Animation timing constants (single source of truth for CSS + SFX)
const TIMING = {
  blocks: {
    duration: 2000,
    phases: {
      body: { delay: 900, wordStagger: 60 },
      icon: { delay: 600 },
      title: { delay: 300, wordStagger: 80 },
    },
    startDelay: 500,
  },
  mainTitle: { wordStagger: 100 },
} as const;

// Helper functions for calculating delays
const getBlockStartDelay = (blockIndex: number): number =>
  TIMING.blocks.startDelay + blockIndex * TIMING.blocks.duration;

const getCardBodyDelay = (blockStart: number, wordIndex: number): number =>
  blockStart + TIMING.blocks.phases.body.delay + wordIndex * TIMING.blocks.phases.body.wordStagger;

const getCardIconDelay = (blockStart: number): number => blockStart + TIMING.blocks.phases.icon.delay;

const getCardTitleDelay = (blockStart: number, wordIndex: number): number =>
  blockStart + TIMING.blocks.phases.title.delay + wordIndex * TIMING.blocks.phases.title.wordStagger;

// Generate block start delays for SFX (derived from TIMING constants)
const BLOCK_START_DELAYS: readonly number[] = [0, 1, 2, 3].map(getBlockStartDelay);

const Problem4 = ({ data }: Props) => {
  const challenges = [data.challenge1, data.challenge2, data.challenge3, data.challenge4];
  const mainTitleWords = data.title.split(' ');

  // Play appear SFX at same timing as CSS animations
  useAppearSfx(BLOCK_START_DELAYS);

  return (
    <div className="text-primary-im-grey flex h-full w-full flex-row items-center justify-between px-20">
      {/* Main title: word by word */}
      <div className="mt-60 h-full w-140 font-geometria text-[66px] leading-[1.3]">
        {mainTitleWords.map((word, i) => (
          <span
            className="animate-char-in inline-block"
            key={i}
            style={{ animationDelay: `${i * TIMING.mainTitle.wordStagger}ms` }}
          >
            {word}
            {i < mainTitleWords.length - 1 && '\u00A0'}
          </span>
        ))}
      </div>

      <div className="flex flex-row gap-4">
        {challenges.map((challenge, index) => {
          const blockStart = getBlockStartDelay(index);
          const cardTitleWords = challenge.title.split(' ');
          const bodyWords = challenge.body.split(' ');

          return (
            <div className="flex w-150 flex-col items-center gap-6.5" key={`challenge-${index}`}>
              {/* Blue background grows horizontally - fits content width */}
              <div
                className="animate-grow-x bg-primary-im-dark-blue inline-flex items-center justify-center rounded-full px-6.5 py-2"
                style={{ animationDelay: `${blockStart}ms` }}
              >
                {/* Title text: show up word by word */}
                <p className="text-[33px] tracking-[-1.6px] whitespace-nowrap text-white">
                  {cardTitleWords.map((word, i) => (
                    <span
                      className="animate-char-in inline-block"
                      key={i}
                      style={{ animationDelay: `${getCardTitleDelay(blockStart, i)}ms` }}
                    >
                      {word}
                      {i < cardTitleWords.length - 1 && '\u00A0'}
                    </span>
                  ))}
                </p>
              </div>

              {/* Icon scales up */}
              <div
                className="animate-scale-fade-in flex items-center justify-center"
                style={{ animationDelay: `${getCardIconDelay(blockStart)}ms` }}
              >
                <Image alt={challenge.title} height={267} src={challenge.icon} width={267} />
              </div>

              {/* Body: word by word */}
              <div className="text-primary-im-grey w-83 text-center text-[27px] leading-[1.3] tracking-[-1.3px]">
                {bodyWords.map((word, i) => (
                  <span
                    className="animate-char-in inline-block"
                    key={i}
                    style={{ animationDelay: `${getCardBodyDelay(blockStart, i)}ms` }}
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
