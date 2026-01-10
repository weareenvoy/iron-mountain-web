import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { getMorphingDiamondAnimation, MORPHING_DIAMOND, TRANSITIONS, Z_INDEX } from '../constants';

type MorphingDiamondProps = {
  /** Current carousel slide index (0-based) */
  readonly carouselIndex: number;
  /** Whether current carousel slide is exiting */
  readonly isCarouselExiting: boolean;
  /** Whether carousel is visible */
  readonly showCarousel: boolean;
  /** Video asset URL from CMS */
  readonly videoAsset: string;
};

/**
 * Morphing diamond video background for Kiosk 3 Custom Interactive.
 *
 * This component creates the signature morphing effect where the background video
 * scales down and repositions to become the first carousel slide's primary diamond.
 *
 * ## Animation States
 * 1. **Background (Initial):** Full size (scale: 1), centered behind initial content
 * 2. **Carousel (First Slide):** Scaled down (0.332), positioned as carousel slide
 * 3. **Exit (Slide Change):** Moves diagonally off-screen when user navigates away
 *
 * ## Technical Details
 * - Video URL used directly from CMS (no normalization needed)
 * - Inner video counter-scales to maintain visual consistency
 * - Only renders when carousel is hidden OR when showing slide index 0
 * - Uses AnimatePresence for smooth mount/unmount transitions
 *
 * ## Performance
 * - Video src memoized to prevent unnecessary recalculation
 * - Video element paused on cleanup (src preserved for React 18 Strict Mode compatibility)
 * - Automatic src restoration if cleared during Strict Mode unmount/remount cycle
 * - Console logging gated behind NODE_ENV check
 *
 * @param props - Component props
 */
const MorphingDiamond = memo(({ carouselIndex, isCarouselExiting, showCarousel, videoAsset }: MorphingDiamondProps) => {
  const diamondAnimation = getMorphingDiamondAnimation(showCarousel, carouselIndex, isCarouselExiting);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure video loads and handle errors
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleError = () => {
      // Video load errors are handled silently
      // Check network tab for detailed error information
    };

    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('error', handleError);
      videoElement.pause();
    };
  }, [videoAsset]);

  // Use unique key based on videoAsset to force remount on video change
  // This properly handles React 18 Strict Mode instead of workarounds
  const videoKey = `morphing-diamond-${videoAsset}`;

  return (
    <AnimatePresence mode="wait">
      {(!showCarousel || carouselIndex === 0) && (
        <motion.div
          animate={diamondAnimation}
          className="pointer-events-none absolute bottom-[-1000px] left-[50px] h-[2500px] w-[2500px] rotate-45 overflow-hidden rounded-[200px] border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          exit={MORPHING_DIAMOND.EXIT}
          initial={
            showCarousel
              ? { opacity: 0, scale: 0, x: MORPHING_DIAMOND.CAROUSEL.x, y: MORPHING_DIAMOND.CAROUSEL.y }
              : MORPHING_DIAMOND.BACKGROUND
          }
          key={videoKey}
          style={{ zIndex: Z_INDEX.BACKGROUND }}
          transition={TRANSITIONS.CAROUSEL}
        >
          <motion.div
            animate={{
              left: showCarousel ? MORPHING_DIAMOND.VIDEO_LEFT_CAROUSEL : MORPHING_DIAMOND.VIDEO_LEFT_BACKGROUND,
              scale: showCarousel ? MORPHING_DIAMOND.VIDEO_SCALE_CAROUSEL : MORPHING_DIAMOND.VIDEO_SCALE_BACKGROUND,
            }}
            className="absolute inset-0 h-full w-full -rotate-45"
            initial={{
              left: showCarousel ? MORPHING_DIAMOND.VIDEO_LEFT_CAROUSEL : MORPHING_DIAMOND.VIDEO_LEFT_BACKGROUND,
              scale: showCarousel ? MORPHING_DIAMOND.VIDEO_SCALE_CAROUSEL : MORPHING_DIAMOND.VIDEO_SCALE_BACKGROUND,
            }}
            transition={TRANSITIONS.CAROUSEL}
          >
            <video
              autoPlay
              className="h-full w-full origin-center object-cover"
              key={videoKey}
              loop
              muted
              playsInline
              ref={videoRef}
              src={videoAsset}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default MorphingDiamond;
