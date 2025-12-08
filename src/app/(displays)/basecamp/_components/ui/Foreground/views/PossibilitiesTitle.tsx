'use client';

import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['possibilities'];
};

// Start hidden. fade in. visible. fade out.

const PossibilitiesTitle = ({ data }: Props) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-possibilities-title text-center text-5xl font-bold" key={data.title}>
        {data.title}
      </div>
    </div>
  );
};

export default PossibilitiesTitle;
