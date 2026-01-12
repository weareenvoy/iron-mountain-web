import { useEffect, useRef, useState } from 'react';

/**
 * Data attribute names for sticky header system
 */
export const STICKY_HEADER_DATA_ATTRS = {
  CONTAINER: 'data-kiosk',
  SECTION: 'data-section',
  SECTION_END: 'data-section-end',
} as const;

/**
 * Sticky header offset configuration (distance before disappearance)
 * Used internally by the hook for auto-selecting appropriate offset per section.
 */
const STICKY_HEADER_OFFSET = {
  CHALLENGE: 1000,
  CUSTOM_INTERACTIVE: 1000,
  SOLUTION: 1500,
} as const;

/**
 * Throttle scroll events to this interval (ms)
 */
const SCROLL_THROTTLE_MS = 16; // ~60fps

/**
 * Transition duration for fade effects (ms)
 * Used for coordinating opacity transitions with position changes
 */
export const TRANSITION_DURATION_MS = 300;

/**
 * Section names for sticky headers
 */
export type SectionName = 'challenge' | 'customInteractive' | 'solution';

export interface UseStickyHeaderOptions {
  /** Enable/disable sticky header functionality */
  enabled?: boolean;
  /** Enable bottom gradient (Challenge only) */
  hasBottomGradient?: boolean;
  /** Distance before last screen where header should disappear */
  offset?: number;
  /** Section name for identifying the last screen */
  sectionName: SectionName;
}

export interface UseStickyHeaderReturn<TLabel extends HTMLElement = HTMLElement> {
  /**
   * Whether the bottom gradient should be in its offset position (Challenge only)
   * Unused by Solution & Custom Interactive - kept for consistent return type
   */
  bottomGradientPosition: boolean;
  /**
   * Ref for the bottom gradient element (Challenge only)
   * Unused by Solution & Custom Interactive - kept for consistent return type
   */
  bottomGradientRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the label/eyebrow element that triggers visibility */
  labelRef: React.RefObject<null | TLabel>;
  /** Ref for the section container */
  sectionRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Whether the bottom gradient should be visible (Challenge only)
   * Unused by Solution & Custom Interactive - kept for consistent return type
   */
  showBottomGradient: boolean;
  /** Whether the top sticky header should be visible */
  showStickyHeader: boolean;
  /** Ref for the sticky header element */
  stickyHeaderRef: React.RefObject<HTMLDivElement | null>;
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
 * - Generic label ref type for proper type inference
 *
 * @template TLabel - The HTML element type for the label/eyebrow ref
 * @param options - Configuration for sticky header behavior
 * @returns Refs and state for sticky header implementation
 */
export function useStickyHeader<TLabel extends HTMLElement = HTMLElement>({
  enabled = true,
  hasBottomGradient = false,
  offset,
  sectionName,
}: UseStickyHeaderOptions): UseStickyHeaderReturn<TLabel> {
  // Auto-select offset based on section if not provided
  const OFFSET_MAP: Record<SectionName, number> = {
    challenge: STICKY_HEADER_OFFSET.CHALLENGE,
    customInteractive: STICKY_HEADER_OFFSET.CUSTOM_INTERACTIVE,
    solution: STICKY_HEADER_OFFSET.SOLUTION,
  };
  const finalOffset = offset ?? OFFSET_MAP[sectionName];

  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const [bottomGradientPosition, setBottomGradientPosition] = useState(false);

  const labelRef = useRef<TLabel>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Throttle state
  const lastScrollTimeRef = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle delayed position change for bottom gradient (prevents flicker)
  useEffect(() => {
    if (!hasBottomGradient) return undefined;

    if (!showBottomGradient) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setBottomGradientPosition(false);
        }
      }, TRANSITION_DURATION_MS);

      return () => clearTimeout(timer);
    }

    return undefined;
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

      // Throttle scroll events for performance (~60fps)
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

      /**
       * PERFORMANCE NOTE: getBoundingClientRect() forces layout recalculation
       *
       * Current approach uses getBoundingClientRect() for precise positioning.
       * This is acceptable for kiosk displays with predictable hardware, but
       * could be optimized using IntersectionObserver for better performance
       * on lower-end devices.
       *
       * Future optimization: Replace scroll + getBoundingClientRect with
       * IntersectionObserver for more efficient visibility detection without
       * forcing synchronous layout calculations.
       */
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
      const sectionEndReached = lastScreenRect.bottom <= stickyHeaderBottom + finalOffset;

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
  }, [sectionName, finalOffset, enabled, hasBottomGradient, bottomGradientPosition]);

  return {
    bottomGradientPosition,
    bottomGradientRef,
    labelRef,
    sectionRef,
    showBottomGradient,
    showStickyHeader,
    stickyHeaderRef,
  };
}
