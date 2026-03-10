'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly beatId: 'problem-1' | 'problem-2';
  readonly data: BasecampData['problem_1'];
};

// Animation timing constants
const CHAR_STAGGER_MS = 50 as const;

// Handles both problem-1 and problem-2 beats as one continuous animation.
// problem-1: Text appears in center, characters fade in one by one with a small jump.
// problem-2: Text shrinks and flies to top-left until it disappears.
const ProblemIntro = ({ beatId, data }: Props) => {
  const words = data.title.split(' ');
  const isProblem2 = beatId === 'problem-2';

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={`font-geometria text-8xl tracking-[-3.6px] text-white ${isProblem2 ? 'animate-problem-exit' : ''}`}
      >
        {words.map((word, i) => (
          <span
            className={isProblem2 ? '' : 'animate-slide-up inline-block'}
            key={i}
            style={isProblem2 ? undefined : { animationDelay: `${i * CHAR_STAGGER_MS}ms` }}
          >
            {word}
            {i < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProblemIntro;
