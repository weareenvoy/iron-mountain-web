import { useCallback, useEffect, useRef, useState } from 'react';
import type { SectionName } from './useStickyHeader';

/**
 * Configuration for intersection detection
 */
export interface UseIntersectionDetectionConfig {
  /** Whether detection is enabled */
  enabled: boolean;
  /** Ref to the label/eyebrow element */
  labelRef: React.RefObject<Element | null>;
  /** Ref to the last screen element */
  lastScreenElementRef: React.RefObject<Element | null>;
  /** Section-specific offset before disappearance */
  offset: number;
  /** Section name for logging */
  sectionName: SectionName;
  /** Fallback height when ref not yet available */
  stickyHeaderHeightFallback: number;
  /** Ref to sticky header height */
  stickyHeaderHeightRef: React.RefObject<number>;
  /** Warning function */
  warn: (key: string, message: string) => void;
}

export interface UseIntersectionDetectionReturn {
  /** Whether the label has scrolled past the top of viewport */
  labelPastTop: boolean;
  /** Whether the section end has been reached */
  sectionEndReached: boolean;
}

/**
 * Manages IntersectionObserver setup for sticky header detection.
 * Separated from main hook for testability and single responsibility.
 *
 * Observes:
 * 1. Label visibility (past top of viewport)
 * 2. Section end detection (with rootMargin for offset)
 */
export function useIntersectionDetection({
  enabled,
  labelRef,
  lastScreenElementRef,
  offset,
  sectionName,
  stickyHeaderHeightFallback,
  stickyHeaderHeightRef,
  warn,
}: UseIntersectionDetectionConfig): UseIntersectionDetectionReturn {
  // State
  const [labelPastTop, setLabelPastTop] = useState(false);
  const [sectionEndReached, setSectionEndReached] = useState(false);

  // Refs for observer state
  const labelPastTopRef = useRef(false);
  const sectionEndReachedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Update visibility state with RAF batching
  const updateVisibility = useCallback(() => {
    if (!isMountedRef.current) return;

    const labelPastTopValue = labelPastTopRef.current;
    const sectionEndReachedValue = sectionEndReachedRef.current;

    setLabelPastTop(labelPastTopValue);
    setSectionEndReached(sectionEndReachedValue);
  }, []);

  // Main IntersectionObserver effect
  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) return undefined;

    if (!labelRef.current) {
      warn(
        `label-ref-missing-${sectionName}`,
        `[useIntersectionDetection] labelRef not attached for section "${sectionName}". Ensure ref is properly assigned.`
      );
      return undefined;
    }

    const lastScreen = lastScreenElementRef.current;
    if (!lastScreen) {
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
      const height = stickyHeaderHeightRef.current || stickyHeaderHeightFallback;
      const rootMargin = `-${height + offset}px 0px 0px 0px`;

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
    } catch (error) {
      console.error(`[useIntersectionDetection] Failed to setup observers for section "${sectionName}":`, error);
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
  }, [
    enabled,
    labelRef,
    lastScreenElementRef,
    offset,
    sectionName,
    stickyHeaderHeightFallback,
    stickyHeaderHeightRef,
    updateVisibility,
    warn,
  ]);

  return {
    labelPastTop,
    sectionEndReached,
  };
}
