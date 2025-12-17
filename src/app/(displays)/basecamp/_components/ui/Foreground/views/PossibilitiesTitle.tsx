'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilities'];
};

// Animation timing constants
const INITIAL_DELAY_MS = 500 as const;
const CHAR_STAGGER_MS = 40 as const;

// Title shows up char by char with small jump, holds visible, then fades out

const PossibilitiesTitle = ({ data }: Props) => {
  const chars = data.title.split('');

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Wrapper handles the hold + fade-out sequence */}
      <div className="animate-possibilities-title text-center font-geometria text-[80px] text-black">
        {/* Each char animates in with jump */}
        {chars.map((char, i) => (
          <span
            className="animate-char-in inline-block"
            key={i}
            style={{ animationDelay: `${INITIAL_DELAY_MS + i * CHAR_STAGGER_MS}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PossibilitiesTitle;
