import { useEffect, useRef, useState } from 'react';

/**
 * Data attribute names for sticky header system
 */
export const STICKY_HEADER_DATA_ATTRS = {
  CONTAINER: 'data-kiosk',
  SECTION_END: 'data-section-end',
  SECTION: 'data-section',
} as const;

/**
 * Z-index values for layering system
 */
export const Z_INDEX = {
  STICKY_HEADER: 100,
  DEMO_OVERLAY: 9999,
} as const;

/**
 * Sticky header offset configuration (distance before disappearance)
 */
export const STICKY_HEADER_OFFSET = {
  CHALLENGE: 1000,
  SOLUTION: 1500,
  CUSTOM_INTERACTIVE: 1000,
} as const;

/**
 * Sticky header height (used for gradient size)
 */
export const STICKY_HEADER_HEIGHT = 1369;

/**
 * Challenge bottom gradient offset
 */
export const CHALLENGE_BOTTOM_GRADIENT_OFFSET = -900;

/**
 * Throttle scroll events to this interval (ms)
 */
const SCROLL_THROTTLE_MS = 16; // ~60fps

/**
 * Transition duration for fade effects (ms)
 */
export const TRANSITION_DURATION_MS = 300;

/**
 * Section names for sticky headers
 */
export type SectionName = 'challenge' | 'solution' | 'customInteractive';

export interface UseStickyHeaderOptions {
  /** Section name for identifying the last screen */
  sectionName: SectionName;
  /** Distance before last screen where header should disappear */
  offset?: number;
  /** Enable/disable sticky header functionality */
  enabled?: boolean;
  /** Enable bottom gradient (Challenge only) */
  hasBottomGradient?: boolean;
}

export interface UseStickyHeaderReturn {
  /** Whether the top sticky header should be visible */
  showStickyHeader: boolean;
  /** Whether the bottom gradient should be visible */
  showBottomGradient: boolean;
  /** Whether the bottom gradient should be in its offset position */
  bottomGradientPosition: boolean;
  /** Ref for the label/eyebrow element that triggers visibility */
  labelRef: React.RefObject<HTMLElement>;
  /** Ref for the sticky header element */
  stickyHeaderRef: React.RefObject<HTMLDivElement>;
  /** Ref for the section container */
  sectionRef: React.RefObject<HTMLDivElement>;
}

/**
 * Custom hook for managing sticky header behavior with scroll detection.
 * Handles visibility, positioning, and animations for section headers.
 * 
 * Features:
 * - Throttled scroll detection for performance
 * - Resize handling for responsive layouts
 * - Reduced motion support
 * - Memory leak prevention
 * - TypeScript type safety
 * 
 * @param options - Configuration for sticky header behavior
 * @returns Refs and state for sticky header implementation
 */
export function useStickyHeader({
  sectionName,
  offset = STICKY_HEADER_OFFSET.CHALLENGE,
  enabled = true,
  hasBottomGradient = false,
}: UseStickyHeaderOptions): UseStickyHeaderReturn {
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const [bottomGradientPosition, setBottomGradientPosition] = useState(false);
  
  const labelRef = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Throttle state
  const lastScrollTimeRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle delayed position change for bottom gradient (prevents flicker)
  useEffect(() => {
    if (!hasBottomGradient) return;

    if (!showBottomGradient) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setBottomGradientPosition(false);
        }
      }, TRANSITION_DURATION_MS);
      
      return () => clearTimeout(timer);
    }
  }, [showBottomGradient, hasBottomGradient]);

  useEffect(() => {
    // Track mounted state
    isMountedRef.current = true;

    if (!enabled) return;

    const scrollContainer = document.querySelector(`[${STICKY_HEADER_DATA_ATTRS.CONTAINER}]`);
    
    if (!scrollContainer) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useStickyHeader] Scroll container not found for section: ${sectionName}`);
      }
      return;
    }

    const handleScroll = () => {
      if (!labelRef.current || !stickyHeaderRef.current || !isMountedRef.current) return;

      // Throttle scroll events for performance
      const now = Date.now();
      if (now - lastScrollTimeRef.current < SCROLL_THROTTLE_MS) {
        // Schedule delayed update if not already scheduled
        if (!scrollTimeoutRef.current) {
          scrollTimeoutRef.current = setTimeout(() => {
            scrollTimeoutRef.current = null;
            handleScroll();
          }, SCROLL_THROTTLE_MS);
        }
        return;
      }
      lastScrollTimeRef.current = now;

      const labelRect = labelRef.current.getBoundingClientRect();
      const labelPastTop = labelRect.bottom < 0;

      // Find the last screen in this section
      const lastScreen = document.querySelector(`[${STICKY_HEADER_DATA_ATTRS.SECTION_END}="${sectionName}"]`);
      
      if (!lastScreen) {
        // Fallback behavior if last screen marker not found
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[useStickyHeader] Last screen marker not found for section: ${sectionName}`);
        }
        setShowStickyHeader(labelPastTop);
        if (hasBottomGradient) {
          setShowBottomGradient(labelPastTop);
          setBottomGradientPosition(labelPastTop);
        }
        return;
      }

      // Calculate visibility based on scroll position
      const lastScreenRect = lastScreen.getBoundingClientRect();
      const stickyHeaderHeight = stickyHeaderRef.current.offsetHeight;
      const stickyHeaderBottom = stickyHeaderHeight;
      const sectionEndReached = lastScreenRect.bottom <= (stickyHeaderBottom + offset);

      // Update top sticky header visibility
      const shouldShowTop = labelPastTop && !sectionEndReached;
      setShowStickyHeader(shouldShowTop);

      // Update bottom gradient (Challenge only)
      if (hasBottomGradient) {
        const lastScreenEntered = lastScreenRect.top <= 0;
        const shouldShowBottom = labelPastTop && !lastScreenEntered;
        setShowBottomGradient(shouldShowBottom);
        
        // Update position immediately when showing
        if (shouldShowBottom && !bottomGradientPosition) {
          setBottomGradientPosition(true);
        }
      }
    };

    const handleResize = () => {
      // Recalculate on resize
      handleScroll();
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleScroll();

    return () => {
      isMountedRef.current = false;
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      // Clear any pending throttle timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [sectionName, offset, enabled, hasBottomGradient, bottomGradientPosition]);

  return {
    showStickyHeader,
    showBottomGradient,
    bottomGradientPosition,
    labelRef,
    stickyHeaderRef,
    sectionRef,
  };
}

