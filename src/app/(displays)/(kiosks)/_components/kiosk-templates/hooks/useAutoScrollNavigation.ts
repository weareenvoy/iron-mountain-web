'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAutoScrollNavigationOptions {
  duration?: number;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
}

export interface UseAutoScrollNavigationReturn {
  containerRef: React.RefObject<HTMLDivElement>;
  handleNavigateDown: () => void;
  handleNavigateUp: () => void;
}

/**
 * Hook for automatic scroll navigation based on `data-scroll-section` attributes.
 * Detects scrollable sections in the DOM and navigates to them sequentially.
 * When no more sections are available, delegates to parent navigation handlers.
 */
export function useAutoScrollNavigation({
  duration = 600,
  onNavigateDown,
  onNavigateUp,
}: UseAutoScrollNavigationOptions): UseAutoScrollNavigationReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
  const [sections, setSections] = useState<HTMLElement[]>([]);
  const isScrollingRef = useRef(false);

  // Detect all scroll sections in the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const detectSections = () => {
      const sectionElements = Array.from(container.querySelectorAll<HTMLElement>('[data-scroll-section]'));
      setSections(sectionElements);
    };

    // Initial detection
    detectSections();

    // Re-detect on content changes
    const observer = new MutationObserver(detectSections);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to a specific section
  const scrollToSection = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container || index < -1 || index >= sections.length) return;

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
            setCurrentSectionIndex(-1);
          }
        };

        requestAnimationFrame(animateScroll);
        return;
      }

      isScrollingRef.current = true;
      const targetSection = sections[index];
      const containerTop = container.scrollTop;
      const sectionTop = targetSection.offsetTop;
      const start = performance.now();

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        container.scrollTop = containerTop + (sectionTop - containerTop) * easeProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          isScrollingRef.current = false;
          setCurrentSectionIndex(index);
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [duration, sections]
  );

  // Handle navigate down
  const handleNavigateDown = useCallback(() => {
    if (isScrollingRef.current) return;

    const nextIndex = currentSectionIndex + 1;
    if (nextIndex < sections.length) {
      scrollToSection(nextIndex);
    } else {
      // No more sections, delegate to parent
      onNavigateDown?.();
    }
  }, [currentSectionIndex, onNavigateDown, scrollToSection, sections.length]);

  // Handle navigate up
  const handleNavigateUp = useCallback(() => {
    if (isScrollingRef.current) return;

    const prevIndex = currentSectionIndex - 1;
    if (prevIndex >= -1) {
      scrollToSection(prevIndex);
    } else {
      // No more sections, delegate to parent
      onNavigateUp?.();
    }
  }, [currentSectionIndex, onNavigateUp, scrollToSection]);

  return {
    containerRef,
    handleNavigateDown,
    handleNavigateUp,
  };
}
