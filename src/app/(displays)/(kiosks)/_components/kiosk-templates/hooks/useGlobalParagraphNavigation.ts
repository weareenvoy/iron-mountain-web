'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseGlobalParagraphNavigationOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  duration?: number;
}

export interface UseGlobalParagraphNavigationReturn {
  currentScrollTarget: string | null;
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
  duration = 200, // how long the scroll is in ms
}: UseGlobalParagraphNavigationOptions): UseGlobalParagraphNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [allParagraphs, setAllParagraphs] = useState<HTMLElement[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentScrollTarget, setCurrentScrollTarget] = useState<string | null>(null);
  const isScrollingRef = useRef(false);

  // Detect ALL paragraph sections in the entire container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const detectAllParagraphs = () => {
      const paragraphElements = Array.from(container.querySelectorAll<HTMLElement>('[data-scroll-section]'));
      // Filter out elements with no text content, BUT keep video/media elements
      const nonEmptyParagraphs = paragraphElements.filter(el => {
        // Always include video, audio, img, or other media elements
        if (el.tagName === 'VIDEO' || el.tagName === 'AUDIO' || el.tagName === 'IMG') {
          return true;
        }
        // For text elements, check if they have content
        const textContent = el.textContent?.trim() || '';
        return textContent.length > 0;
      });
      console.log('Detected scroll sections:', nonEmptyParagraphs.map(el => ({
        id: el.getAttribute('data-scroll-section'),
        tag: el.tagName,
        hasContent: el.textContent?.trim().length || 0,
        offsetTop: el.offsetTop
      })));
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

      // Log navigation context
      const currentSection = allParagraphs[currentIndex]?.getAttribute('data-scroll-section');
      const targetSection = index >= 0 ? allParagraphs[index]?.getAttribute('data-scroll-section') : 'INITIAL_SCREEN';
      const prevSection = index > 0 ? allParagraphs[index - 1]?.getAttribute('data-scroll-section') : 'INITIAL_SCREEN';
      const nextSection = index < allParagraphs.length - 1 ? allParagraphs[index + 1]?.getAttribute('data-scroll-section') : 'END';
      
      console.log('📍 NAVIGATION:', {
        from: currentSection || 'INITIAL_SCREEN',
        to: targetSection,
        prev: prevSection,
        next: nextSection,
        currentIndex,
        targetIndex: index,
        totalSections: allParagraphs.length
      });

      // If scrolling to -1, scroll to top
      if (index === -1) {
        isScrollingRef.current = true;
        setIsScrolling(true);
        setCurrentScrollTarget(null);
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
            setIsScrolling(false);
            setCurrentScrollTarget(null);
            setCurrentIndex(-1);
          }
        };

        requestAnimationFrame(animateScroll);
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

      const containerTop = container.scrollTop;

      // Set the target section ID
      const targetId = targetParagraph.getAttribute('data-scroll-section');
      setCurrentScrollTarget(targetId);

      // Get element's position in the scrollable content (not viewport)
      // We need to calculate the offset from the container's scrollable area
      let elementOffsetTop = 0;
      let currentElement: HTMLElement | null = targetParagraph;
      
      // Walk up the tree to calculate total offset relative to container
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

      console.log('🎯 SCROLL CALCULATION:', {
        section: targetId,
        tag: targetParagraph.tagName,
        isVideo,
        isRootDiv,
        '---POSITIONS---': '---',
        elementOffsetTop,
        topOffset,
        currentScrollTop: containerTop,
        '---RESULT---': '---',
        targetScroll,
        willScrollBy: targetScroll - containerTop
      });

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
          setIsScrolling(false);
          setCurrentIndex(index);
          console.log('✅ SCROLL COMPLETE:', {
            section: targetId,
            newIndex: index,
            finalScrollTop: container.scrollTop
          });
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [allParagraphs, containerRef, currentIndex, duration]
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
