'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import type { BasecampData } from '@/lib/internal/types';

type Props = {
  readonly data: BasecampData['problem-1'];
};

// Text appears in top-left corner (static, no animation). In Problem2, it shrinks and moves up-left until it disappears.
const Problem1 = ({ data }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple fade-in on mount
    const timer = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="absolute inset-0">
      <div
        className={cn(
          'absolute top-[15%] left-[8%] text-5xl font-bold transition-opacity duration-300',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {data.text}
      </div>
    </div>
  );
};

export default Problem1;
