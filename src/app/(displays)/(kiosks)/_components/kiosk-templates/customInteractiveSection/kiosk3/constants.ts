/**
 * Animation constants for Kiosk 3 Custom Interactive screens
 */

// Z-index scale
export const Z_INDEX = {
  BACKGROUND: 0,
  CAROUSEL: 10,
  OVERLAY: 9999,
} as const;

// Slide IDs as const enum for type safety
export const SLIDE_ID = {
  SLIDE_1: 'slide-1',
  SLIDE_2: 'slide-2',
  SLIDE_3: 'slide-3',
  SLIDE_4: 'slide-4',
  SLIDE_5: 'slide-5',
  SLIDE_6: 'slide-6',
} as const;

export type SlideId = (typeof SLIDE_ID)[keyof typeof SLIDE_ID];

// Animation transitions
export const TRANSITIONS = {
  CAROUSEL: { duration: 0.6, ease: [0.3, 0, 0.4, 1] as const },
  FADE: { duration: 0.5, ease: [0.3, 0, 0.6, 1] as const },
  OVERLAY: { duration: 0.7 },
  SLIDE_CONTENT: { delay: 0.2, duration: 0.4, ease: [0.3, 0, 0.6, 1] as const },
  SVG_SCALE: { duration: 0.6, ease: [0.3, 0, 0.6, 1] as const },
} as const;

// Morphing diamond animation states
export const MORPHING_DIAMOND = {
  BACKGROUND: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  },
  CAROUSEL: {
    opacity: 1,
    scale: 0.332,
    x: -1095,
    y: -875,
  },
  EXIT: {
    opacity: 0,
    scale: 0.332,
    x: -1116,
    y: -896,
  },
  VIDEO_LEFT_BACKGROUND: 480,
  VIDEO_LEFT_CAROUSEL: 0,
  VIDEO_SCALE_BACKGROUND: 1.7,
  VIDEO_SCALE_CAROUSEL: 1.4,
} as const;

// Primary diamond positioning by slide
export const PRIMARY_DIAMOND_POSITIONS = {
  DEFAULT:
    'absolute left-[700px] bottom-[1120px] h-[830px] w-[830px] rotate-45 overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]',
  SLIDE_2_5:
    'absolute left-[510px] bottom-[670px] h-[1200px] w-[1200px] rotate-45 overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]',
  SLIDE_3_6:
    'absolute left-[340px] bottom-[340px] h-[1130px] w-[1130px] rotate-45 overflow-hidden rounded-[90px] shadow-[0_30px_90px_rgba(0,0,0,0.35)]',
} as const;

// Secondary diamond positioning by slide
export const SECONDARY_DIAMOND_POSITIONS = {
  DEFAULT:
    'absolute left-[1380px] bottom-[400px] h-[880px] w-[880px] rotate-45 overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]',
  SLIDE_3_6:
    'absolute left-[1390px] bottom-[1150px] h-[800px] w-[800px] rotate-45 overflow-hidden rounded-[80px] shadow-[0_24px_70px_rgba(0,0,0,0.32)]',
} as const;

// Diamond animations
export const DIAMOND_ANIMATIONS = {
  ENTRY: {
    animate: { opacity: 1, scale: 1, x: 0, y: 0 },
    exit: { opacity: 0, scale: 1, x: -21, y: -21 },
    initial: { opacity: 0, scale: 0, x: 0, y: 0 },
  },
  EXIT_OFFSET: {
    x: -21,
    y: -21,
  },
} as const;

// SVG decorative diamond animations
export const SVG_ANIMATIONS = {
  CONTAINER: {
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    initial: { opacity: 0, y: 0 },
  },
  SCALE: {
    animate: { scale: 1 },
    initial: { scale: 0 },
  },
} as const;

/**
 * Computes the animation state for the morphing diamond background
 */
export function getMorphingDiamondAnimation(showCarousel: boolean, carouselIndex: number, isCarouselExiting: boolean) {
  if (carouselIndex === 0 && isCarouselExiting) {
    return MORPHING_DIAMOND.EXIT;
  }
  if (showCarousel) {
    return MORPHING_DIAMOND.CAROUSEL;
  }
  return MORPHING_DIAMOND.BACKGROUND;
}

/**
 * Gets the CSS class for primary diamond based on current slide
 */
export function getPrimaryDiamondClass(slideId: string): string {
  if (slideId === SLIDE_ID.SLIDE_2 || slideId === SLIDE_ID.SLIDE_5) {
    return PRIMARY_DIAMOND_POSITIONS.SLIDE_2_5;
  }
  if (slideId === SLIDE_ID.SLIDE_3 || slideId === SLIDE_ID.SLIDE_6) {
    return PRIMARY_DIAMOND_POSITIONS.SLIDE_3_6;
  }
  return PRIMARY_DIAMOND_POSITIONS.DEFAULT;
}

/**
 * Gets the CSS class for secondary diamond based on current slide
 */
export function getSecondaryDiamondClass(slideId: string): string {
  if (slideId === SLIDE_ID.SLIDE_3 || slideId === SLIDE_ID.SLIDE_6) {
    return SECONDARY_DIAMOND_POSITIONS.SLIDE_3_6;
  }
  return SECONDARY_DIAMOND_POSITIONS.DEFAULT;
}

/**
 * Determines which decorative SVG variant to show based on slide ID
 */
export function getDecorativeSVGVariant(slideId: string): 'default' | 'slide-2-5' | 'slide-3-6' {
  if (slideId === SLIDE_ID.SLIDE_2 || slideId === SLIDE_ID.SLIDE_5) {
    return 'slide-2-5';
  }
  if (slideId === SLIDE_ID.SLIDE_3 || slideId === SLIDE_ID.SLIDE_6) {
    return 'slide-3-6';
  }
  return 'default';
}
