'use client';

import { CirclePause, CirclePlay } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';

interface CaseStudyToggleProps {
  readonly isActive: boolean;
}

// Case-study play/pause toggle, resets when navigation changes via key on parent render
const CaseStudyToggle = ({ isActive }: CaseStudyToggleProps) => {
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    setIsPlaying(playing => !playing);
    // client.goToBeat(exhibit, beat, playPause)? Confirm with Lucas on command.
  };

  return (
    <button
      className={cn(
        'text-primary-bg-grey flex h-[42px] items-center justify-center gap-2 rounded-full border-[1.5px] px-5 transition-all',
        isActive ? 'opacity-100' : 'pointer-events-none border-white/0 bg-white/10 text-black/10'
      )}
      // TODO: Send mqtt message to play/pause video
      onClick={togglePlayPause}
    >
      {isPlaying ? (
        <>
          <span>Pause</span>
          <CirclePause className="size-6" />
        </>
      ) : (
        <>
          <span>Play</span>
          <CirclePlay className="size-6" />
        </>
      )}
    </button>
  );
};

export default CaseStudyToggle;
