'use client';

import { CirclePause, CirclePlay } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';

// Case-study play/pause toggle, resets when navigation changes via key on parent render
const CaseStudyToggle = ({ isActive }: { isActive: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <button
      className={cn(
        'text-primary-bg-grey transition-opacity',
        isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      // TODO: Send mqtt message to play/pause video
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? <CirclePause className="size-[40px]" /> : <CirclePlay className="size-[40px]" />}
    </button>
  );
};

export default CaseStudyToggle;
