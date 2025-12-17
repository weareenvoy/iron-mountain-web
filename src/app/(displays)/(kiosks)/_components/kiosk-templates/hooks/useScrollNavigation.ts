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
      if (!containerRef.current || isScrolling.current) {
        console.log('Scroll blocked:', { hasContainer: !!containerRef.current, isScrolling: isScrolling.current });
        return;
      }

      isScrolling.current = true;
      const container = containerRef.current;
      console.log('Scrolling to:', targetY, 'Current scrollTop:', container.scrollTop, 'ScrollHeight:', container.scrollHeight);

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
    console.log('handleNavigateDown - currentIndex:', currentSectionIndex, 'totalSections:', sections.length);
    
    if (currentSectionIndex < sections.length - 1) {
      // Scroll to next section within this template
      const nextIndex = currentSectionIndex + 1;
      const nextSection = sections[nextIndex];
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
  }, [currentSectionIndex, sections, onNavigateDown, scrollToPosition]);

  const handleNavigateUp = useCallback(() => {
    console.log('handleNavigateUp - currentIndex:', currentSectionIndex, 'totalSections:', sections.length);
    
    if (currentSectionIndex > 0) {
      // Scroll to previous section within this template
      const prevIndex = currentSectionIndex - 1;
      const prevSection = sections[prevIndex];
      const targetY = prevSection.targetY + (prevSection.offset || 0);
      
      console.log('Scrolling UP to section', prevIndex, ':', prevSection.id, 'targetY:', targetY);
      setCurrentSectionIndex(prevIndex);
      scrollToPosition(targetY);
    } else {
      // Move to previous template
      console.log('At start of sections, moving to previous template');
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

