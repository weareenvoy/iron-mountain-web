import React, { useCallback, useEffect, useRef } from 'react';
import { useBottomGradient } from './useBottomGradient';
import { useIntersectionDetection } from './useIntersectionDetection';

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
 * Bottom gradient trigger offset (rootMargin) per section
 * Negative values trigger earlier (before element reaches viewport top)
 * Used to account for large top offsets in layout (e.g., Challenge third screen)
 */
const BOTTOM_GRADIENT_TRIGGER_OFFSET: Record<SectionName, number> = {
  [SECTION_NAMES.CHALLENGE]: 800, // Accounts for Challenge third screen's large top offsets
  [SECTION_NAMES.CUSTOM_INTERACTIVE]: 0,
  [SECTION_NAMES.INITIAL]: 0,
  [SECTION_NAMES.SOLUTION]: 0,
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

  // Refs
  const labelRef = useRef<TLabel>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);

  // Internal refs for child hooks (they will access .current in their own effects)
  const lastScreenElementRef = useRef<Element | null>(null);
  const stickyHeaderHeightRef = useRef<number>(0);

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
      // Clear cached refs to prevent memory leaks
      lastScreenElementRef.current = null;
      stickyHeaderHeightRef.current = 0;
    };
  }, [enabled, sectionName, warn]);

  // Use intersection detection hook for label and section end tracking
  // Pass refs themselves, not ref.current values
  const { labelPastTop, sectionEndReached } = useIntersectionDetection({
    enabled,
    labelRef,
    lastScreenElementRef,
    offset: finalOffset,
    sectionName,
    stickyHeaderHeightFallback: STICKY_HEADER_HEIGHT_FALLBACK[sectionName],
    stickyHeaderHeightRef,
    warn,
  });

  // Compute top sticky header visibility
  const showStickyHeader = labelPastTop && !sectionEndReached;

  // Use bottom gradient hook (Challenge only)
  const { bottomGradientRef, showBottomGradientPosition, showBottomGradientVisibility } = useBottomGradient({
    bottomGradientTriggerOffset: BOTTOM_GRADIENT_TRIGGER_OFFSET[sectionName],
    enabled: hasBottomGradient,
    labelPastTop,
    lastScreenElementRef,
    sectionName,
    transitionDuration: TRANSITION_DURATION_MS,
  });

  return {
    bottomGradientPosition: showBottomGradientPosition,
    bottomGradientRef,
    labelRef,
    sectionRef,
    showBottomGradient: showBottomGradientVisibility,
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
