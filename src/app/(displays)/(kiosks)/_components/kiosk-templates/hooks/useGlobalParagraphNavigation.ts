'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  OBSERVER_SETUP_RETRY_MS,
  PARAGRAPH_DETECTION_RETRY_MS,
  PARAGRAPH_SCROLL_DURATION_MS,
  TEXT_ELEMENT_SCROLL_OFFSET_PX,
} from '@/app/(displays)/(kiosks)/_constants/timing';

// This controls the arrow navigation to paragraph tags and video elements as shown in the motion comp. (In some cases it scrolls to root divs as well which is intended and can be adjusted with data-scroll-)

export interface UseGlobalParagraphNavigationOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  duration?: number;
}

export interface UseGlobalParagraphNavigationReturn {
  currentScrollTarget: null | string;
  handleNavigateDown: () => void;
  handleNavigateUp: () => void;
  isScrolling: boolean;
  scrollToSectionById: (sectionId: string) => void;
}

/**
 * Hook for global paragraph-to-paragraph navigation across all templates.
 * Detects ALL `[data-scroll-section]` elements in the entire container
 * and navigates through them sequentially, regardless of template boundaries.
 */
export function useGlobalParagraphNavigation({
  containerRef,
  duration = PARAGRAPH_SCROLL_DURATION_MS,
}: UseGlobalParagraphNavigationOptions): UseGlobalParagraphNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allParagraphs, setAllParagraphs] = useState<HTMLElement[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentScrollTarget, setCurrentScrollTarget] = useState<null | string>(null);
  const isScrollingRef = useRef(false);

  // Detect ALL paragraph sections in the entire container
  useEffect(() => {
    let cleanupObserver: (() => void) | null = null;
    let setupTimeoutId: NodeJS.Timeout | null = null;
    let detectionTimeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;

    const setupObserver = () => {
      const container = containerRef.current;

      if (!container) {
        setupTimeoutId = setTimeout(() => {
          if (isMounted) setupObserver();
        }, OBSERVER_SETUP_RETRY_MS);
        return;
      }

      const detectAllParagraphs = () => {
        if (!isMounted) return;

        const paragraphElements = Array.from(container.querySelectorAll<HTMLElement>('[data-scroll-section]'));
        // Filter out elements with no text content, BUT keep video/media elements
        const nonEmptyParagraphs = paragraphElements.filter(el => {
          // Always include video, audio, img, or other media elements
          if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO' || el.tagName === 'IMG') {
            return true;
          }
          // For text elements, check if they have content
          const textContent = (el.textContent || '').trim();
          return textContent.length > 0;
        });
        setAllParagraphs(nonEmptyParagraphs);

        // If no paragraphs found, retry after a short delay
        if (nonEmptyParagraphs.length === 0) {
          detectionTimeoutId = setTimeout(() => {
            if (isMounted) detectAllParagraphs();
          }, PARAGRAPH_DETECTION_RETRY_MS);
        }
      };

      // Initial detection
      detectAllParagraphs();

      // Re-detect on content changes
      const observer = new MutationObserver(() => {
        if (isMounted) detectAllParagraphs();
      });
      observer.observe(container, { childList: true, subtree: true });

      cleanupObserver = () => observer.disconnect();
    };

    // Start trying to set up the observer
    setupObserver();

    return () => {
      isMounted = false;
      if (setupTimeoutId) clearTimeout(setupTimeoutId);
      if (detectionTimeoutId) clearTimeout(detectionTimeoutId);
      if (cleanupObserver) cleanupObserver();
    };
  }, [containerRef]);

  const scrollToParagraph = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || index < -1 || index >= allParagraphs.length) return;

      // If scrolling to -1, scroll to top
      if (index === -1) {
        isScrollingRef.current = true;
        setIsScrolling(true);
        setCurrentScrollTarget(null);

        container.scrollTo({
          behavior: 'smooth',
          top: 0,
        });

        // Wait for scroll to complete
        setTimeout(() => {
          isScrollingRef.current = false;
          setIsScrolling(false);
          setCurrentScrollTarget(null);
          setCurrentIndex(-1);
        }, duration);
        return;
      }

      isScrollingRef.current = true;
      setIsScrolling(true);
      const targetParagraph = allParagraphs[index];

      if (!targetParagraph) {
        isScrollingRef.current = false;
        setIsScrolling(false);
        return;
      }

      // Set the target section ID
      const targetId = targetParagraph.getAttribute('data-scroll-section');
      setCurrentScrollTarget(targetId);

      // Get element's position in the scrollable content (not viewport)
      let elementOffsetTop = 0;
      let currentElement: HTMLElement | null = targetParagraph;

      // Walk up the tree to calculate total offset relative to container
      while (currentElement !== null && currentElement !== container) {
        elementOffsetTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement | null;
      }

      // Use 0 offset for videos and root container divs (scroll to exact position)
      // Use configured offset for text elements (paragraphs, headings, etc.) so they appear lower on screen
      const isVideo = targetParagraph.tagName === 'VIDEO';
      const isRootDiv = targetParagraph.tagName === 'DIV' && targetParagraph.classList.contains('h-screen');
      const topOffset = isVideo || isRootDiv ? 0 : TEXT_ELEMENT_SCROLL_OFFSET_PX;

      // Target scroll position = element's position in content - desired offset from top
      const targetScroll = elementOffsetTop - topOffset;

      // Use native smooth scrolling
      container.scrollTo({
        behavior: 'smooth',
        top: targetScroll,
      });

      // Wait for scroll to complete
      setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
        setCurrentIndex(index);
      }, duration);
    },
    [allParagraphs, containerRef, duration]
  );

  // Handle navigate down
  const handleNavigateDown = useCallback(() => {
    if (isScrollingRef.current) {
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex < allParagraphs.length) {
      scrollToParagraph(nextIndex);
    }
    // If we're at the end, do nothing (or could loop back to start)
  }, [allParagraphs.length, currentIndex, scrollToParagraph]);

  // Handle navigate up
  const handleNavigateUp = useCallback(() => {
    if (isScrollingRef.current) return;

    const prevIndex = currentIndex - 1;
    if (prevIndex >= -1) {
      scrollToParagraph(prevIndex);
    }
    // If we're at the beginning, do nothing (or could loop to end)
  }, [currentIndex, scrollToParagraph]);

  const scrollToSectionById = useCallback(
    (sectionId: string) => {
      const index = allParagraphs.findIndex(el => el.getAttribute('data-scroll-section') === sectionId);
      if (index !== -1) {
        scrollToParagraph(index);
      }
    },
    [allParagraphs, scrollToParagraph]
  );

  return {
    currentScrollTarget,
    handleNavigateDown,
    handleNavigateUp,
    isScrolling,
    scrollToSectionById,
  };
}
