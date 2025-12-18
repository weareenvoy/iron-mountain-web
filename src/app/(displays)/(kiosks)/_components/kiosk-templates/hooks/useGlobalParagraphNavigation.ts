'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseGlobalParagraphNavigationOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  duration?: number;
}

export interface UseGlobalParagraphNavigationReturn {
  handleNavigateDown: () => void;
  handleNavigateUp: () => void;
}

/**
 * Hook for global paragraph-to-paragraph navigation across all templates.
 * Detects ALL `[data-scroll-section]` elements in the entire container
 * and navigates through them sequentially, regardless of template boundaries.
 */
export function useGlobalParagraphNavigation({
  containerRef,
  duration = 800,
}: UseGlobalParagraphNavigationOptions): UseGlobalParagraphNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allParagraphs, setAllParagraphs] = useState<HTMLElement[]>([]);
  const isScrollingRef = useRef(false);

  // Detect ALL paragraph sections in the entire container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const detectAllParagraphs = () => {
      const paragraphElements = Array.from(container.querySelectorAll<HTMLElement>('[data-scroll-section]'));
      // Filter out paragraphs with no text content
      const nonEmptyParagraphs = paragraphElements.filter(el => {
        const textContent = el.textContent?.trim() || '';
        return textContent.length > 0;
      });
      setAllParagraphs(nonEmptyParagraphs);
    };

    // Initial detection
    detectAllParagraphs();

    // Re-detect on content changes
    const observer = new MutationObserver(detectAllParagraphs);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smooth scroll to a specific paragraph
  const scrollToParagraph = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || index < -1 || index >= allParagraphs.length) return;

      // If scrolling to -1, scroll to top
      if (index === -1) {
        isScrollingRef.current = true;
        const containerTop = container.scrollTop;
        const start = performance.now();

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          container.scrollTop = containerTop - containerTop * easeProgress;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            isScrollingRef.current = false;
            setCurrentIndex(-1);
          }
        };

        requestAnimationFrame(animateScroll);
        return;
      }

      isScrollingRef.current = true;
      const targetParagraph = allParagraphs[index];
      const containerTop = container.scrollTop;

      // Get the absolute position of the paragraph relative to the container
      const paragraphTop = targetParagraph.getBoundingClientRect().top;
      const containerRect = container.getBoundingClientRect().top;

      // Add offset to position paragraph near top of screen (e.g., 200px from top)
      const topOffset = 800;
      const targetScroll = containerTop + (paragraphTop - containerRect) - topOffset;

      const start = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        container.scrollTop = containerTop + (targetScroll - containerTop) * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          isScrollingRef.current = false;
          setCurrentIndex(index);
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [allParagraphs, containerRef, duration]
  );

  // Handle navigate down
  const handleNavigateDown = useCallback(() => {
    if (isScrollingRef.current) return;

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

  return {
    handleNavigateDown,
    handleNavigateUp,
  };
}
