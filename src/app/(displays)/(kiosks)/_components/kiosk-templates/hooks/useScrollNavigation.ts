/* eslint-disable no-console */
import { useCallback, useRef, useState } from 'react';

export interface ScrollSection {
  id: string;
  /** Optional: scroll offset adjustment */
  offset?: number;
  /** Y position in pixels */
  targetY: number;
}

export interface UseScrollNavigationProps {
  /** Scroll behavior - default 'smooth' */
  behavior?: ScrollBehavior;
  /** Custom scroll duration in ms - for manual control */
  duration?: number;
  onNavigateDown?: () => void;
  onNavigateUp?: () => void;
  sections: ScrollSection[];
}

export function useScrollNavigation({
  behavior = 'smooth',
  duration,
  onNavigateDown,
  onNavigateUp,
  sections,
}: UseScrollNavigationProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Helper to find closest section based on current scroll position
  const getCurrentSectionIndex = useCallback(() => {
    if (!containerRef.current) return 0;

    const scrollTop = containerRef.current.scrollTop;
    const threshold = 100; // pixels of tolerance

    // Find the section that we're closest to
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (!section) continue;
      const sectionPosition = section.targetY + (section.offset || 0);

      if (scrollTop >= sectionPosition - threshold) {
        return i;
      }
    }

    return 0;
  }, [sections]);

  const scrollToPosition = useCallback(
    (targetY: number) => {
      if (!containerRef.current || isScrolling.current) {
        console.log('Scroll blocked:', { hasContainer: !!containerRef.current, isScrolling: isScrolling.current });
        return;
      }

      isScrolling.current = true;
      const container = containerRef.current;
      console.log(
        'Scrolling to:',
        targetY,
        'Current scrollTop:',
        container.scrollTop,
        'ScrollHeight:',
        container.scrollHeight
      );

      if (duration) {
        // Custom smooth scroll with controlled duration
        const startY = container.scrollTop;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutQuad = (t: number): number => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easing = easeInOutQuad(progress);

          container.scrollTop = startY + distance * easing;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            isScrolling.current = false;
            console.log('Scroll complete. Final scrollTop:', container.scrollTop);
          }
        };

        requestAnimationFrame(animateScroll);
      } else {
        // Use native smooth scroll
        container.scrollTo({
          behavior,
          top: targetY,
        });

        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling.current = false;
          console.log('Scroll complete. Final scrollTop:', container.scrollTop);
        }, 1000);
      }
    },
    [behavior, duration]
  );

  const handleNavigateDown = useCallback(() => {
    // Get current position dynamically
    const actualCurrentIndex = getCurrentSectionIndex();
    console.log(
      'handleNavigateDown - actualIndex:',
      actualCurrentIndex,
      'stateIndex:',
      currentSectionIndex,
      'totalSections:',
      sections.length
    );

    if (actualCurrentIndex < sections.length - 1) {
      // Scroll to next section within this template
      const nextIndex = actualCurrentIndex + 1;
      const nextSection = sections[nextIndex];
      if (!nextSection) return;
      const targetY = nextSection.targetY + (nextSection.offset || 0);

      console.log('Scrolling DOWN to section', nextIndex, ':', nextSection.id, 'targetY:', targetY);
      setCurrentSectionIndex(nextIndex);
      scrollToPosition(targetY);
    } else {
      // Move to next template
      console.log('At end of sections, moving to next template');
      onNavigateDown?.();
      setCurrentSectionIndex(0); // Reset for when user returns
    }
  }, [currentSectionIndex, sections, onNavigateDown, scrollToPosition, getCurrentSectionIndex]);

  const handleNavigateUp = useCallback(() => {
    // Get current position dynamically
    const actualCurrentIndex = getCurrentSectionIndex();
    console.log(
      'handleNavigateUp - actualIndex:',
      actualCurrentIndex,
      'stateIndex:',
      currentSectionIndex,
      'totalSections:',
      sections.length
    );

    if (actualCurrentIndex > 0) {
      // Scroll to previous section within this template
      const prevIndex = actualCurrentIndex - 1;
      const prevSection = sections[prevIndex];
      if (!prevSection) return;
      const targetY = prevSection.targetY + (prevSection.offset || 0);

      console.log('Scrolling UP to section', prevIndex, ':', prevSection.id, 'targetY:', targetY);
      setCurrentSectionIndex(prevIndex);
      scrollToPosition(targetY);
    } else {
      // Move to previous template
      console.log('At start of sections, moving to previous template');
      onNavigateUp?.();
    }
  }, [currentSectionIndex, sections, onNavigateUp, scrollToPosition, getCurrentSectionIndex]);

  return {
    containerRef,
    currentSectionIndex,
    handleNavigateDown,
    handleNavigateUp,
    scrollToSection: (index: number) => {
      if (index >= 0 && index < sections.length) {
        const section = sections[index];
        if (!section) return;
        const targetY = section.targetY + (section.offset || 0);
        setCurrentSectionIndex(index);
        scrollToPosition(targetY);
      }
    },
  };
}
