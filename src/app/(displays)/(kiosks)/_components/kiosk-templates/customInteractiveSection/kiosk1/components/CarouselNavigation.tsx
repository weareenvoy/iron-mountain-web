import { ChevronLeft, ChevronRight } from 'lucide-react';
import { memo } from 'react';
import { KIOSK_SFX } from '@/app/(displays)/(kiosks)/_utils/audio-constants';
import { useSfx } from '@/components/providers/audio-provider';

type CarouselNavigationProps = {
  readonly onNext: () => void;
  readonly onPrev: () => void;
};

/**
 * Navigation arrows for StepCarousel
 * Features prev/next buttons with hover/active states
 */
const CarouselNavigation = ({ onNext, onPrev }: CarouselNavigationProps) => {
  const { playSfx } = useSfx();

  const handlePrev = () => {
    playSfx(KIOSK_SFX.back);
    onPrev();
  };

  const handleNext = () => {
    playSfx(KIOSK_SFX.next);
    onNext();
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[-290px] flex items-center justify-center gap-[48px]">
      <button
        aria-label="Previous"
        className="group pointer-events-auto mr-[25px] flex h-[102px] w-[102px] items-center justify-center text-white transition-transform duration-150 hover:scale-110 active:opacity-40 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]"
        onClick={handlePrev}
        type="button"
      >
        <ChevronLeft className="h-[102px] w-[102px]" />
      </button>
      <button
        aria-label="Next"
        className="group pointer-events-auto ml-[25px] flex h-[102px] w-[102px] items-center justify-center text-white transition-transform duration-150 hover:scale-110 active:opacity-40 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]"
        onClick={handleNext}
        type="button"
      >
        <ChevronRight className="h-[102px] w-[102px]" />
      </button>
    </div>
  );
};

export default memo(CarouselNavigation);
