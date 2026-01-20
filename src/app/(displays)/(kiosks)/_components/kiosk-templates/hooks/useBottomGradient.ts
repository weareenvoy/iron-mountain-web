import { useEffect, useRef, useState } from 'react';
import type { SectionName } from './useStickyHeader';

/**
 * Configuration for bottom gradient detection (Challenge section only)
 */
export interface UseBottomGradientConfig {
  /** Bottom gradient trigger offset (rootMargin) */
  bottomGradientTriggerOffset: number;
  /** Whether bottom gradient is enabled */
  enabled: boolean;
  /** Whether label has scrolled past top */
  labelPastTop: boolean;
  /** Ref to the last screen element */
  lastScreenElementRef: React.RefObject<Element | null>;
  /** Section name for logging */
  sectionName: SectionName;
  /** Transition duration for fade effects (ms) */
  transitionDuration: number;
}

export interface UseBottomGradientReturn {
  /** Ref for the bottom gradient element */
  bottomGradientRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the bottom gradient should be in its offset position */
  showBottomGradientPosition: boolean;
  /** Whether the bottom gradient should be visible */
  showBottomGradientVisibility: boolean;
}

/**
 * Manages bottom gradient visibility and positioning for Challenge section.
 * Separated from main hook for testability and single responsibility.
 *
 * Handles:
 * - Bottom gradient visibility based on last screen entry
 * - Delayed position change to prevent flicker during fade transitions
 */
export function useBottomGradient({
  bottomGradientTriggerOffset,
  enabled,
  labelPastTop,
  lastScreenElementRef,
  sectionName,
  transitionDuration,
}: UseBottomGradientConfig): UseBottomGradientReturn {
  // State
  const [lastScreenEntered, setLastScreenEntered] = useState(false);
  const [showBottomGradientPosition, setShowBottomGradientPosition] = useState(false);

  // Refs
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Derive visibility from props and state (no setState in effect needed)
  const showBottomGradientVisibility = enabled && labelPastTop && !lastScreenEntered;

  // Handle delayed position change for bottom gradient (prevents flicker)
  useEffect(() => {
    if (!enabled) return undefined;

    if (!showBottomGradientVisibility && showBottomGradientPosition) {
      // Delay removing offset until after fade-out
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setShowBottomGradientPosition(false);
        }
      }, transitionDuration);

      return () => clearTimeout(timer);
    }

    if (showBottomGradientVisibility && !showBottomGradientPosition) {
      // Show immediately with offset - use RAF to avoid cascading renders
      const rafId = requestAnimationFrame(() => {
        if (isMountedRef.current) {
          setShowBottomGradientPosition(true);
        }
      });

      return () => cancelAnimationFrame(rafId);
    }

    return undefined;
  }, [enabled, showBottomGradientPosition, showBottomGradientVisibility, transitionDuration]);

  // Main IntersectionObserver effect for last screen entry
  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) return undefined;

    const lastScreen = lastScreenElementRef.current;
    if (!lastScreen) {
      return undefined;
    }

    try {
      // Observer: Last screen entry (Challenge bottom gradient)
      // Detect when last screen's top edge reaches viewport top
      const lastScreenObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          // Check if top has scrolled to or past viewport top
          // top <= 0 means the element's top edge is at or above the viewport top
          const newEntered = entry.boundingClientRect.top <= 0;
          // Update state directly
          if (isMountedRef.current) {
            setLastScreenEntered(newEntered);
          }
        },
        // Use 3 thresholds for better detection while maintaining performance
        // Use negative top rootMargin to trigger earlier (before element actually reaches viewport top)
        {
          rootMargin: bottomGradientTriggerOffset > 0 ? `-${bottomGradientTriggerOffset}px 0px 0px 0px` : '0px',
          threshold: [0, 0.01, 0.5],
        } // Fires when entering, just after entering, and at midpoint
      );
      lastScreenObserver.observe(lastScreen);

      // Cleanup
      return () => {
        isMountedRef.current = false;
        lastScreenObserver.disconnect();
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`[useBottomGradient] Failed to setup observer for section "${sectionName}":`, error);
      }
      return undefined;
    }
  }, [bottomGradientTriggerOffset, enabled, lastScreenElementRef, sectionName]);

  return {
    bottomGradientRef,
    showBottomGradientPosition,
    showBottomGradientVisibility,
  };
}
