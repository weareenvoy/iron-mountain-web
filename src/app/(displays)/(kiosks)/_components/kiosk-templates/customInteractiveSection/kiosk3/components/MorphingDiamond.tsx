import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useMemo, useRef } from 'react';
import { getMorphingDiamondAnimation, MORPHING_DIAMOND, TRANSITIONS, Z_INDEX } from '../constants';

type MorphingDiamondProps = {
  /** Current carousel slide index (0-based) */
  readonly carouselIndex: number;
  /** Whether current carousel slide is exiting */
  readonly isCarouselExiting: boolean;
  /** Whether carousel is visible */
  readonly showCarousel: boolean;
  /** Video asset URL (S3 URL with + encoding converted to %20) */
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
 * - Video URL is normalized (+ → %20) for browser compatibility
 * - Inner video counter-scales to maintain visual consistency
 * - Only renders when carousel is hidden OR when showing slide index 0
 * - Uses AnimatePresence for smooth mount/unmount transitions
 *
 * ## Performance
 * - Video src normalized and memoized
 * - Video element paused and src cleared on unmount (prevents memory leaks)
 * - Console logging gated behind NODE_ENV check
 *
 * @param props - Component props
 */
const MorphingDiamond = memo(({ carouselIndex, isCarouselExiting, showCarousel, videoAsset }: MorphingDiamondProps) => {
  const diamondAnimation = getMorphingDiamondAnimation(showCarousel, carouselIndex, isCarouselExiting);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Normalize URL: S3 URLs sometimes have + instead of %20 for spaces
  // Memoized to avoid recalculating on every render
  const normalizedVideoSrc = useMemo(() => {
    if (process.env.NODE_ENV === 'development') {
      console.info('[MorphingDiamond] Raw videoAsset:', videoAsset);
      console.info('[MorphingDiamond] Normalized:', videoAsset.replace(/\+/g, '%20'));
    }
    return videoAsset.replace(/\+/g, '%20');
  }, [videoAsset]);

  // Cleanup: pause video on unmount to prevent memory leaks
  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.src = '';
      }
    };
  }, []);

  // Handle video load errors
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleError = (e: Event) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[MorphingDiamond] Video failed to load:', {
          error: e,
          networkState: videoElement.networkState,
          networkStateDescription:
            videoElement.networkState === 3
              ? 'NETWORK_NO_SOURCE - No suitable source found'
              : `State ${videoElement.networkState}`,
          readyState: videoElement.readyState,
          src: normalizedVideoSrc,
        });
      }
    };

    const handleLoadedData = () => {
      if (process.env.NODE_ENV === 'development') {
        console.info('[MorphingDiamond] Video loaded successfully:', normalizedVideoSrc);
      }
    };

    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [normalizedVideoSrc]);

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
          key="morphing-diamond"
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
              loop
              muted
              playsInline
              ref={videoRef}
              src={normalizedVideoSrc}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default MorphingDiamond;
