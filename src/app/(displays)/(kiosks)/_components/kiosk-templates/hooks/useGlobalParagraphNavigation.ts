'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

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
  duration = 150, // how long the scroll is in ms
}: UseGlobalParagraphNavigationOptions): UseGlobalParagraphNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allParagraphs, setAllParagraphs] = useState<HTMLElement[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentScrollTarget, setCurrentScrollTarget] = useState<null | string>(null);
  const isScrollingRef = useRef(false);

  // Detect ALL paragraph sections in the entire container
  useEffect(() => {
    let cleanupObserver: (() => void) | null = null;
    
    const setupObserver = () => {
      const container = containerRef.current;
      console.log('[useGlobalParagraphNavigation] Setting up observer, container:', container);
      
      if (!container) {
        console.log('[useGlobalParagraphNavigation] No container yet, retrying in 50ms...');
        setTimeout(setupObserver, 50);
        return;
      }

      const detectAllParagraphs = () => {
        console.log('[useGlobalParagraphNavigation] detectAllParagraphs called');
        const paragraphElements = Array.from(container.querySelectorAll<HTMLElement>('[data-scroll-section]'));
        console.log('[useGlobalParagraphNavigation] Found paragraphElements:', paragraphElements.length, paragraphElements);
        // Filter out elements with no text content, BUT keep video/media elements
        const nonEmptyParagraphs = paragraphElements.filter(el => {
          // Always include video, audio, img, or other media elements
          if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO' || el.tagName === 'IMG') {
            return true;
          }
          // For text elements, check if they have content
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          const textContent = el.textContent?.trim() || '';
          return textContent.length > 0;
        });
        console.log('[useGlobalParagraphNavigation] After filtering, nonEmptyParagraphs:', nonEmptyParagraphs.length);
        setAllParagraphs(nonEmptyParagraphs);
        
        // If no paragraphs found, retry after a short delay
        if (nonEmptyParagraphs.length === 0) {
          console.log('[useGlobalParagraphNavigation] No paragraphs found, retrying in 100ms');
          setTimeout(detectAllParagraphs, 100);
        }
      };

      // Initial detection
      detectAllParagraphs();

      // Re-detect on content changes
      const observer = new MutationObserver(() => {
        console.log('[useGlobalParagraphNavigation] MutationObserver triggered');
        detectAllParagraphs();
      });
      observer.observe(container, { childList: true, subtree: true });

      cleanupObserver = () => observer.disconnect();
    };
    
    // Start trying to set up the observer
    setupObserver();

    return () => {
      if (cleanupObserver) cleanupObserver();
    };
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

      // Guard against undefined element
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      while (currentElement && currentElement !== container) {
        elementOffsetTop += currentElement.offsetTop;
        currentElement = currentElement.offsetParent as HTMLElement;
      }

      // Use 0 offset for videos and root container divs (scroll to exact position)
      // Use 800px offset for text elements (paragraphs, headings, etc.) so they appear lower on screen
      const isVideo = targetParagraph.tagName === 'VIDEO';
      const isRootDiv = targetParagraph.tagName === 'DIV' && targetParagraph.classList.contains('h-screen');
      const topOffset = isVideo || isRootDiv ? 0 : 800;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allParagraphs, containerRef, currentIndex, duration]
  );

  // Handle navigate down
  const handleNavigateDown = useCallback(() => {
    console.log('[useGlobalParagraphNavigation] handleNavigateDown called');
    console.log('[useGlobalParagraphNavigation] isScrollingRef.current:', isScrollingRef.current);
    console.log('[useGlobalParagraphNavigation] currentIndex:', currentIndex);
    console.log('[useGlobalParagraphNavigation] allParagraphs.length:', allParagraphs.length);
    
    if (isScrollingRef.current) {
      console.log('[useGlobalParagraphNavigation] Already scrolling, ignoring');
      return;
    }

    const nextIndex = currentIndex + 1;
    console.log('[useGlobalParagraphNavigation] nextIndex:', nextIndex);
    
    if (nextIndex < allParagraphs.length) {
      console.log('[useGlobalParagraphNavigation] Scrolling to paragraph at index:', nextIndex);
      scrollToParagraph(nextIndex);
    } else {
      console.log('[useGlobalParagraphNavigation] At end, cannot scroll further');
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

  // Scroll to a specific section by its data-scroll-section ID
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
