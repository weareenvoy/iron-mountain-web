import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { getMorphingDiamondAnimation, MORPHING_DIAMOND, TRANSITIONS, Z_INDEX } from '../constants';

type MorphingDiamondProps = {
  readonly carouselIndex: number;
  readonly isCarouselExiting: boolean;
  readonly showCarousel: boolean;
  readonly videoAsset: string;
};

/**
 * The morphing diamond video background that transitions from full-screen
 * to becoming the first carousel slide's primary diamond.
 *
 * Animation States:
 * 1. Initial: Full size (scale: 1) centered as background
 * 2. Carousel shown: Scales down (0.332) and moves to first slide position
 * 3. First slide exits: Moves diagonally off-screen with carousel animation
 *
 * The video inside counter-scales to maintain consistent visual size.
 */
const MorphingDiamond = memo(({ carouselIndex, isCarouselExiting, showCarousel, videoAsset }: MorphingDiamondProps) => {
  const diamondAnimation = getMorphingDiamondAnimation(showCarousel, carouselIndex, isCarouselExiting);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      console.error('[MorphingDiamond] Video failed to load:', {
        error: e,
        networkState: videoElement.networkState,
        networkStateDescription:
          videoElement.networkState === 3
            ? 'NETWORK_NO_SOURCE - No suitable source found'
            : `State ${videoElement.networkState}`,
        readyState: videoElement.readyState,
        src: videoAsset,
      });
    };

    const handleLoadedData = () => {
      console.info('[MorphingDiamond] Video loaded successfully:', videoAsset);
    };

    videoElement.addEventListener('error', handleError);
    videoElement.addEventListener('loadeddata', handleLoadedData);

    return () => {
      videoElement.removeEventListener('error', handleError);
      videoElement.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [videoAsset]);

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
