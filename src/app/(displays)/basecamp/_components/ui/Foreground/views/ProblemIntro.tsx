'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly beatId: 'problem-1' | 'problem-2';
  readonly data: BasecampData['problem1'];
};

// Animation timing constants
const CHAR_STAGGER_MS = 50 as const;

// Handles both problem-1 and problem-2 beats as one continuous animation.
// problem-1: Text appears in center, characters fade in one by one with a small jump.
// problem-2: Text shrinks and flies to top-left until it disappears.
const ProblemIntro = ({ beatId, data }: Props) => {
  const chars = data.text.split('');
  const isProblem2 = beatId === 'problem-2';

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`font-geometria text-7xl ${isProblem2 ? 'animate-problem-exit' : ''}`}>
        {chars.map((char, i) => (
          <span
            className={isProblem2 ? '' : 'animate-char-in inline-block'}
            key={i}
            style={isProblem2 ? undefined : { animationDelay: `${i * CHAR_STAGGER_MS}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProblemIntro;
