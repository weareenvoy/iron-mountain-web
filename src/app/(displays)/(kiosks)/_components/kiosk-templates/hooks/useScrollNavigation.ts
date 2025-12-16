import { useCallback, useRef, useState } from 'react';

export interface ScrollSection {
  id: string;
  /** Y position in pixels */
  targetY: number;
  /** Optional: scroll offset adjustment */
  offset?: number;
}

export interface UseScrollNavigationProps {
  sections: ScrollSection[];
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  /** Scroll behavior - default 'smooth' */
  behavior?: ScrollBehavior;
  /** Custom scroll duration in ms - for manual control */
  duration?: number;
}

export function useScrollNavigation({
  sections,
  onNavigateUp,
  onNavigateDown,
  behavior = 'smooth',
  duration,
}: UseScrollNavigationProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const scrollToPosition = useCallback(
    (targetY: number) => {
      if (!containerRef.current || isScrolling.current) return;

      isScrolling.current = true;

      if (duration) {
        // Custom smooth scroll with controlled duration
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        const easeInOutQuad = (t: number): number => {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easing = easeInOutQuad(progress);
          
          window.scrollTo(0, startY + distance * easing);

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          } else {
            isScrolling.current = false;
          }
        };

        requestAnimationFrame(animateScroll);
      } else {
        // Use native smooth scroll
        window.scrollTo({
          behavior,
          top: targetY,
        });
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
          isScrolling.current = false;
        }, 1000);
      }
    },
    [behavior, duration]
  );

  const handleNavigateDown = useCallback(() => {
    if (currentSectionIndex < sections.length - 1) {
      // Scroll to next section within this template
      const nextIndex = currentSectionIndex + 1;
      const nextSection = sections[nextIndex];
      const targetY = nextSection.targetY + (nextSection.offset || 0);
      
      setCurrentSectionIndex(nextIndex);
      scrollToPosition(targetY);
    } else {
      // Move to next template
      onNavigateDown?.();
      setCurrentSectionIndex(0); // Reset for when user returns
    }
  }, [currentSectionIndex, sections, onNavigateDown, scrollToPosition]);

  const handleNavigateUp = useCallback(() => {
    if (currentSectionIndex > 0) {
      // Scroll to previous section within this template
      const prevIndex = currentSectionIndex - 1;
      const prevSection = sections[prevIndex];
      const targetY = prevSection.targetY + (prevSection.offset || 0);
      
      setCurrentSectionIndex(prevIndex);
      scrollToPosition(targetY);
    } else {
      // Move to previous template
      onNavigateUp?.();
    }
  }, [currentSectionIndex, sections, onNavigateUp, scrollToPosition]);

  return {
    containerRef,
    currentSectionIndex,
    handleNavigateDown,
    handleNavigateUp,
    scrollToSection: (index: number) => {
      if (index >= 0 && index < sections.length) {
        const section = sections[index];
        const targetY = section.targetY + (section.offset || 0);
        setCurrentSectionIndex(index);
        scrollToPosition(targetY);
      }
    },
  };
}
