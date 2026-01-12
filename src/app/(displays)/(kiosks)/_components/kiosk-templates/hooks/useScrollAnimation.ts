'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Animation configuration matching motion comp specifications.
 * These exact values are specified in the design motion comps and should not be changed
 * without design approval.
 */
export const SCROLL_ANIMATION_CONFIG = {
  /** Standard animation duration in seconds - matches motion comp timing */
  DURATION: 0.6,
  /** Smooth easing curve - cubic-bezier(0.3, 0, 0.6, 1) */
  EASING: [0.3, 0, 0.6, 1] as const,
  /** Delay before second element animates (creates stagger effect) */
  SECONDARY_DELAY: 0.2,
  /** IntersectionObserver threshold - element must be 100% visible to trigger */
  TRIGGER_THRESHOLD: 1,
} as const;

/**
 * Hook for scroll-triggered animations on kiosk templates.
 *
 * Manages animation state with proper accessibility support, type safety,
 * and cleanup. Uses IntersectionObserver to detect when elements scroll into view.
 *
 * @example
 * ```tsx
 * const { shouldAnimate, triggerRef } = useScrollAnimation();
 *
 * <div ref={triggerRef}>
 *   <motion.h2
 *     animate={shouldAnimate ? { y: 0 } : undefined}
 *     initial={{ y: -1100 }}
 *   />
 * </div>
 * ```
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>() {
  const triggerRef = useRef<T>(null);

  // Initialize state with media query check (lazy initializer avoids cascading renders)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Listen for changes to prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Use Framer Motion's useInView with explicit cleanup behavior
  const isInView = useInView(triggerRef, {
    amount: SCROLL_ANIMATION_CONFIG.TRIGGER_THRESHOLD,
    once: true,
  });

  // Only animate if in view AND user hasn't requested reduced motion
  const shouldAnimate = isInView && !prefersReducedMotion;

  return {
    /** Whether animations should play (respects prefers-reduced-motion) */
    shouldAnimate,
    /** Ref to attach to the trigger element for scroll detection */
    triggerRef,
  };
}
