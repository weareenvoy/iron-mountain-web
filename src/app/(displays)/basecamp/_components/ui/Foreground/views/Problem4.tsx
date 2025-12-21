'use client';

import Image from 'next/image';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem3'];
};

// Animation timing constants
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
  mainTitle: {
    wordStagger: 100,
  },
} as const;

// Helper functions for calculating delays
const getBlockStartDelay = (blockIndex: number): number =>
  TIMING.blocks.startDelay + blockIndex * TIMING.blocks.duration;

const getCardTitleDelay = (blockStart: number, wordIndex: number): number =>
  blockStart + TIMING.blocks.phases.title.delay + wordIndex * TIMING.blocks.phases.title.wordStagger;

const getCardIconDelay = (blockStart: number): number => blockStart + TIMING.blocks.phases.icon.delay;

const getCardBodyDelay = (blockStart: number, wordIndex: number): number =>
  blockStart + TIMING.blocks.phases.body.delay + wordIndex * TIMING.blocks.phases.body.wordStagger;

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
            <div className="flex w-150 flex-col items-center gap-6" key={`challenge-${index}`}>
              {/* Blue background grows horizontally - fits content width */}
              <div
                className="animate-grow-x bg-primary-im-dark-blue inline-flex items-center justify-center rounded-full px-4 py-2"
                style={{ animationDelay: `${blockStart}ms` }}
              >
                {/* Title text: show up word by word */}
                <p className="text-2xl font-semibold whitespace-nowrap text-white">
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
                <Image alt={challenge.title} height={300} src={challenge.icon} width={300} />
              </div>

              {/* Body: word by word */}
              <div className="w-68 text-center text-[20px] text-black">
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
