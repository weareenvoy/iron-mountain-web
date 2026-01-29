import { SquarePlay } from 'lucide-react';
import { memo } from 'react';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';

type CarouselCTAProps = {
  /** Label text for the button */
  readonly label?: string;
  /** Callback when button is clicked */
  readonly onClick: () => void;
};

/**
 * Call-to-action button for launching the demo overlay.
 *
 * Features:
 * - Gradient background (defined in globals.css)
 * - Play icon from lucide-react
 * - Active state with opacity transition
 * - Fixed positioning within carousel layout
 *
 * @param props - Component props
 */
const CarouselCTA = memo(({ label, onClick }: CarouselCTAProps) => {
  return (
    <button
      className="group bg-gradient-kiosk-solution absolute top-[2630px] left-[240px] z-11 flex h-[200px] items-center gap-[18px] rounded-[999px] px-[110px] text-[55px] leading-[1.1] font-semibold tracking-[2px] text-white active:opacity-70 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
      onClick={onClick}
      type="button"
    >
      {renderRegisteredMark(label)}
      <SquarePlay aria-hidden className="ml-[40px] h-[90px] w-[90px]" strokeWidth={2} />
    </button>
  );
});

export default CarouselCTA;
