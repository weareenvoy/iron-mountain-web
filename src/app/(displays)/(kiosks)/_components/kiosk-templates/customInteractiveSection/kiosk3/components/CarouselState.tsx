import { motion } from 'framer-motion';
import { memo } from 'react';
import { cn } from '@/lib/tailwind/utils/cn';
import renderRegisteredMark from '@/lib/utils/render-registered-mark';
import CarouselContentSection from './CarouselContentSection';
import CarouselCTA from './CarouselCTA';
import CarouselDiamond from './CarouselDiamond';
import CircularCarousel, { type CarouselSlide } from './CircularCarousel';
import DecorativeSVGGroup from './DecorativeSVGGroup';
import {
  getDecorativeSVGVariant,
  getPrimaryDiamondClass,
  getSecondaryDiamondClass,
  SLIDE_ID,
  TRANSITIONS,
} from '../constants';

type CarouselStateProps = {
  /** Main headline displayed across all carousel slides */
  readonly headline?: string;
  /** Callback when carousel index changes */
  readonly onIndexChange: (index: number) => void;
  /** Callback when slide exit animation state changes */
  readonly onIsExitingChange: (isExiting: boolean) => void;
  /** Callback to show demo overlay */
  readonly onShowOverlay: () => void;
  /** Whether carousel is visible (controls fade-in animation) */
  readonly showCarousel: boolean;
  /** Array of slides to display in carousel */
  readonly slides: readonly CarouselSlide[];
};

/**
 * Carousel state component for Kiosk 3 Custom Interactive.
 *
 * Displays after "Tap to begin" is clicked. Contains:
 * - Circular carousel navigation with slide counter
 * - Primary diamond (video/image) for each slide
 * - Secondary diamond (decorative image) for select slides
 * - Decorative SVG backgrounds (varies by slide)
 * - Bullet points with content
 * - "Launch demo" CTA button
 *
 * ## Animation Behavior
 * - Fades in when `showCarousel` becomes true
 * - Class computations happen in pure functions to avoid hooks violations
 * - Coordinates with parent via `onIndexChange` and `onIsExitingChange`
 *
 * ## Performance
 * - Helper functions are pure and don't require memoization
 * - Component is wrapped in React.memo
 * - Uses AnimatePresence for smooth transitions
 *
 * @param props - Component props
 */
const CarouselState = memo(
  ({ headline, onIndexChange, onIsExitingChange, onShowOverlay, showCarousel, slides }: CarouselStateProps) => {
    return (
      <motion.div
        animate={{ opacity: showCarousel ? 1 : 0 }}
        className={cn('absolute inset-0 z-10', showCarousel ? 'pointer-events-auto' : 'pointer-events-none')}
        initial={{ opacity: 0 }}
        transition={TRANSITIONS.CAROUSEL}
      >
        <CircularCarousel onIndexChange={onIndexChange} onIsExitingChange={onIsExitingChange} slides={slides}>
          {({ current, index, isExiting }) => {
            // Pure function calls - no hooks needed since these are simple string returns
            const primaryDiamondClass = getPrimaryDiamondClass(current.id);
            const secondaryDiamondClass = getSecondaryDiamondClass(current.id);
            const svgVariant = getDecorativeSVGVariant(current.id);

            return (
              <>
                {/* Eyebrow */}
                <h2 className="absolute top-[240px] left-[120px] text-[57px] leading-normal font-normal tracking-[-1.8px] whitespace-pre-line text-[#ededed]">
                  {renderRegisteredMark(current.eyebrow)}
                </h2>

                {/* Main headline */}
                <h1 className="absolute top-[830px] left-[240px] max-w-[1200px] text-[100px] leading-[1.3] tracking-[-5px] whitespace-pre-line text-white">
                  {renderRegisteredMark(headline)}
                </h1>

                {/* Data configuration + bullets */}
                <CarouselContentSection current={current} />

                {/* Primary diamond (video or image) - Hidden for slide 1 since background morphs into it */}
                {current.id !== SLIDE_ID.SLIDE_1 && (
                  <CarouselDiamond
                    className={primaryDiamondClass}
                    index={index}
                    isExiting={isExiting}
                    variant="primary"
                    videoSrc={current.primaryVideoSrc}
                  />
                )}

                {/* Secondary diamond (decorative SVG or image) */}
                {current.secondaryImageSrc && (
                  <CarouselDiamond
                    className={secondaryDiamondClass}
                    imageAlt={current.secondaryImageAlt}
                    imageSrc={current.secondaryImageSrc}
                    index={index}
                    isExiting={isExiting}
                    transitionDelay={0.1}
                    variant="secondary"
                  />
                )}

                {/* Decorative SVG Diamonds - Different groups for different slides */}
                <DecorativeSVGGroup index={index} isExiting={isExiting} variant={svgVariant} />
              </>
            );
          }}
        </CircularCarousel>

        {/* CTA - Only visible when carousel is shown - gradient defined in globals.css for readability and ease of future updates */}
        <CarouselCTA onClick={onShowOverlay} />
      </motion.div>
    );
  }
);

CarouselState.displayName = 'CarouselState';

export default CarouselState;
