import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Typed section names for sticky headers
 * Provides compile-time safety for data attributes
 */
export const SECTION_NAMES = {
  CHALLENGE: 'challenge',
  CUSTOM_INTERACTIVE: 'customInteractive',
  INITIAL: 'initial',
  SOLUTION: 'solution',
} as const;

export type SectionName = (typeof SECTION_NAMES)[keyof typeof SECTION_NAMES];

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
 */
const STICKY_HEADER_OFFSET: Record<SectionName, number> = {
  [SECTION_NAMES.CHALLENGE]: 1000,
  [SECTION_NAMES.CUSTOM_INTERACTIVE]: 1000,
  [SECTION_NAMES.INITIAL]: 1000,
  [SECTION_NAMES.SOLUTION]: 1500,
} as const;

/**
 * Sticky header height fallbacks per section
 * Used when stickyHeaderRef.current is not yet available
 */
const STICKY_HEADER_HEIGHT_FALLBACK: Record<SectionName, number> = {
  [SECTION_NAMES.CHALLENGE]: 1369,
  [SECTION_NAMES.CUSTOM_INTERACTIVE]: 769,
  [SECTION_NAMES.INITIAL]: 200,
  [SECTION_NAMES.SOLUTION]: 1369,
} as const;

/**
 * Transition duration for fade effects (ms)
 */
export const TRANSITION_DURATION_MS = 300;

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
   */
  bottomGradientPosition: boolean;
  /**
   * Ref for the bottom gradient element (Challenge only)
   */
  bottomGradientRef: React.RefObject<HTMLDivElement | null>;
  /** Ref for the label/eyebrow element that triggers visibility */
  labelRef: React.RefObject<null | TLabel>;
  /** Ref for the section container */
  sectionRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Whether the bottom gradient should be visible (Challenge only)
   */
  showBottomGradient: boolean;
  /** Whether the top sticky header should be visible */
  showStickyHeader: boolean;
  /** Ref for the sticky header element */
  stickyHeaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Manages sticky header behavior for kiosk sections (Initial, Challenge, Solution, Custom Interactive).
 *
 * When a user scrolls past a section's title, a fixed header appears at the top of the screen
 * showing that section's label. The header remains visible until the user scrolls to the end
 * of that section. For Challenge sections, also manages a bottom gradient that appears/disappears
 * based on scroll position.
 *
 * Uses IntersectionObserver for efficient scroll detection without performance overhead.
 *
 * @template TLabel - The HTML element type for the label/eyebrow ref
 */
export function useStickyHeader<TLabel extends HTMLElement = HTMLElement>({
  enabled = true,
  hasBottomGradient = false,
  offset,
  sectionName,
}: UseStickyHeaderOptions): UseStickyHeaderReturn<TLabel> {
  // Auto-select offset based on section if not provided
  const finalOffset = offset ?? STICKY_HEADER_OFFSET[sectionName];

  // State
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const [bottomGradientPosition, setBottomGradientPosition] = useState(false);

  // Refs
  const labelRef = useRef<TLabel>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);

  // Cached values
  const lastScreenElementRef = useRef<Element | null>(null);
  const stickyHeaderHeightRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  // Track observer state
  const labelPastTopRef = useRef(false);
  const sectionEndReachedRef = useRef(false);
  const lastScreenEnteredRef = useRef(false);

  // Rate-limited warnings
  const warn = useRateLimitedWarning();

  // Cache DOM queries and handle resize
  useEffect(() => {
    if (!enabled) return undefined;

    // Cache last screen element
    lastScreenElementRef.current = document.querySelector(`[${STICKY_HEADER_DATA_ATTRS.SECTION_END}="${sectionName}"]`);

    if (!lastScreenElementRef.current) {
      warn(
        `last-screen-missing-${sectionName}`,
        `[useStickyHeader] Last screen marker not found for section "${sectionName}". Add data-section-end="${sectionName}" to final screen.`
      );
    }

    // Function to update cached height
    const updateHeight = () => {
      if (stickyHeaderRef.current) {
        stickyHeaderHeightRef.current = stickyHeaderRef.current.offsetHeight;
      }
    };

    // Initial height cache
    updateHeight();

    // Recalculate on window resize
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, [enabled, sectionName, warn]);

  // Handle delayed position change for bottom gradient (prevents flicker)
  useEffect(() => {
    if (!hasBottomGradient) return undefined;

    if (!showBottomGradient && bottomGradientPosition) {
      // Delay removing offset until after fade-out
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setBottomGradientPosition(false);
        }
      }, TRANSITION_DURATION_MS);

      return () => clearTimeout(timer);
    }

    if (showBottomGradient && !bottomGradientPosition) {
      // Show immediately with offset - use RAF to avoid cascading renders
      const rafId = requestAnimationFrame(() => {
        if (isMountedRef.current) {
          setBottomGradientPosition(true);
        }
      });

      return () => cancelAnimationFrame(rafId);
    }

    return undefined;
  }, [showBottomGradient, hasBottomGradient, bottomGradientPosition]);

  // Update visibility state with RAF batching
  const updateVisibility = useCallback(() => {
    if (!isMountedRef.current) return;

    const labelPastTop = labelPastTopRef.current;
    const sectionEndReached = sectionEndReachedRef.current;
    const lastScreenEntered = lastScreenEnteredRef.current;

    // Update top sticky header
    const shouldShowTop = labelPastTop && !sectionEndReached;
    setShowStickyHeader(shouldShowTop);

    // Update bottom gradient (Challenge only)
    if (hasBottomGradient) {
      const shouldShowBottom = labelPastTop && !lastScreenEntered;
      setShowBottomGradient(shouldShowBottom);
    }
  }, [hasBottomGradient]);

  // Main IntersectionObserver effect
  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) return undefined;

    if (!labelRef.current) {
      warn(
        `label-ref-missing-${sectionName}`,
        `[useStickyHeader] labelRef not attached for section "${sectionName}". Ensure ref is properly assigned.`
      );
      return undefined;
    }

    const lastScreen = lastScreenElementRef.current;
    if (!lastScreen) {
      // Fallback already warned in cache effect
      return undefined;
    }

    const observers: IntersectionObserver[] = [];
    let rafId: null | number = null;

    // Schedule update with RAF to batch state changes
    const scheduleUpdate = () => {
      if (rafId !== null) return; // Already scheduled
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateVisibility();
      });
    };

    try {
      // Observer 1: Label visibility (past top of viewport)
      const labelObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          const isPastTop = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
          if (labelPastTopRef.current !== isPastTop) {
            labelPastTopRef.current = isPastTop;
            scheduleUpdate();
          }
        },
        { threshold: 0 }
      );
      labelObserver.observe(labelRef.current);
      observers.push(labelObserver);

      // Observer 2: Section end detection (with rootMargin for offset)
      // rootMargin creates a smaller "viewport" from the top, so when the last screen
      // exits this adjusted viewport, we know the section has ended
      const height = stickyHeaderHeightRef.current || STICKY_HEADER_HEIGHT_FALLBACK[sectionName]; // Use cached or section-specific fallback
      const rootMargin = `-${height + finalOffset}px 0px 0px 0px`;

      const sectionEndObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          // When element is NOT intersecting with the adjusted viewport (with rootMargin),
          // it means the section has scrolled past the sticky header's intended disappearance point
          const endReached = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          if (sectionEndReachedRef.current !== endReached) {
            sectionEndReachedRef.current = endReached;
            scheduleUpdate();
          }
        },
        { rootMargin, threshold: 0 }
      );
      sectionEndObserver.observe(lastScreen);
      observers.push(sectionEndObserver);

      // Observer 3: Last screen entry (Challenge bottom gradient)
      if (hasBottomGradient) {
        // Detect when last screen's top edge reaches viewport top
        // Observer fires on intersection changes, and we check position each time
        const lastScreenObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;
            // Check if top has scrolled to or past viewport top
            // top <= 0 means the element's top edge is at or above the viewport top
            const newEntered = entry.boundingClientRect.top <= 0;
            // Only update if state changed to avoid unnecessary renders
            if (lastScreenEnteredRef.current !== newEntered) {
              lastScreenEnteredRef.current = newEntered;
              scheduleUpdate();
            }
          },
          // Use 3 thresholds for better detection while maintaining performance
          { threshold: [0, 0.01, 0.5] } // Fires when entering, just after entering, and at midpoint
        );
        lastScreenObserver.observe(lastScreen);
        observers.push(lastScreenObserver);
      }
    } catch (error) {
      console.error(`[useStickyHeader] Failed to setup observers for section "${sectionName}":`, error);
      return undefined;
    }

    // Cleanup
    return () => {
      isMountedRef.current = false;
      observers.forEach(observer => observer.disconnect());
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enabled, sectionName, finalOffset, hasBottomGradient, updateVisibility, warn]);
  // Note: bottomGradientPosition NOT in deps

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

/**
 * Rate-limited warning utility
 */
function useRateLimitedWarning() {
  const warnedKeys = useRef(new Set<string>());

  return useCallback((key: string, message: string) => {
    if (process.env.NODE_ENV !== 'development') return;
    if (warnedKeys.current.has(key)) return;

    console.warn(message);
    warnedKeys.current.add(key);
  }, []);
}
