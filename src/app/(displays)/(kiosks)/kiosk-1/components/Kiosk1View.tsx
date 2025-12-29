'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import { useCarouselDelegation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useCarouselDelegation';
import { useGlobalParagraphNavigation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useGlobalParagraphNavigation';
import { useKioskArrowState } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskArrowState';
import { useKioskSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskSlides';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { ARROW_FADE_DURATION_KIOSK1_SEC, SCROLL_DURATION_MS } from '@/app/(displays)/(kiosks)/_constants/timing';

/**
 * Main component for displaying Kiosk 1 content.
 * Orchestrates data fetching, slide building, navigation, and arrow state.
 */

const Kiosk1View = () => {
  const { data: kioskData } = useKiosk();
  const containerRef = useRef<HTMLDivElement>(null);

  // Global paragraph navigation
  const {
    currentScrollTarget,
    handleNavigateDown: baseHandleNavigateDown,
    handleNavigateUp: baseHandleNavigateUp,
    isScrolling,
    scrollToSectionById,
  } = useGlobalParagraphNavigation({
    containerRef,
    duration: SCROLL_DURATION_MS,
  });

  // Carousel delegation (wraps navigation handlers)
  const { handleNavigateDown, handleNavigateUp, handleRegisterCarouselHandlers } = useCarouselDelegation({
    baseHandleNavigateDown,
    baseHandleNavigateUp,
    currentScrollTarget,
  });

  // Arrow state management (Zustand integration) - initial pass to get handleButtonClick
  const { handleButtonClick } = useKioskArrowState({
    currentScrollTarget,
    isCustomInteractiveSection: false,
    isInitialScreen: false,
    isScrolling,
    isValueSection: false,
    kioskId: 'kiosk-1',
  });

  // Update handleInitialButtonClick to use the store
  const handleInitialButtonClick = useCallback(() => {
    handleButtonClick('kiosk-1');
  }, [handleButtonClick]);

  // Global navigation handlers
  const globalHandlers = useMemo(
    () => ({
      onNavigateDown: handleNavigateDown,
      onNavigateUp: handleNavigateUp,
    }),
    [handleNavigateDown, handleNavigateUp]
  );

  // Build slides from kiosk data
  const { slides } = useKioskSlides({
    diamondMapping: {
      bottomLeft: 2,
      bottomRight: 3,
      center: 0,
      topLeft: undefined,
      topRight: 1,
    },
    kioskData,
    kioskId: 'kiosk-1',
    slideBuilders: {
      globalHandlers,
      handleInitialButtonClick,
      handleRegisterCarouselHandlers,
      scrollToSectionById,
    },
  });

  // Determine current section
  const topIndex = slides.findIndex(slide => slide.id === currentScrollTarget);
  const currentSlide = slides[topIndex >= 0 ? topIndex : 0];
  const currentSection = currentSlide?.id.split('-')[0] || 'challenge';
  const isInitialScreen = currentSlide?.id === 'challenge-initial';
  const isValueSection =
    currentSection === 'value' || Boolean(currentScrollTarget && currentScrollTarget.startsWith('value-'));
  const isCustomInteractiveSection = currentSection === 'customInteractive';

  // Now recalculate arrow state with correct section info
  const { arrowTheme: finalArrowTheme, shouldShowArrows } = useKioskArrowState({
    currentScrollTarget,
    isCustomInteractiveSection,
    isInitialScreen,
    isScrolling,
    isValueSection,
    kioskId: 'kiosk-1',
  });

  // Show loading state if no slides are available
  if (slides.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-2xl">Loading kiosk data...</p>
          <p className="mt-4 text-sm opacity-60">{!kioskData ? 'Fetching data...' : 'Processing content...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-y-auto scroll-smooth" ref={containerRef}>
      <div className="flex w-full flex-col overflow-x-hidden">
        {/* Render ALL slides, always visible, stacked vertically */}
        {slides.map((slide, idx) => (
          <div className="h-screen w-full flex-shrink-0" data-slide-index={idx} key={slide.id}>
            {slide.render()}
          </div>
        ))}
      </div>

      {/* Global Navigation Arrows */}
      <AnimatePresence>
        {shouldShowArrows && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-[1945px] right-[120px] z-[50] flex -translate-y-1/2 flex-col gap-[100px]"
            data-arrow-theme={finalArrowTheme}
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: ARROW_FADE_DURATION_KIOSK1_SEC, ease: 'easeOut' }}
          >
            <div
              aria-label="Previous"
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onPointerDown={handleNavigateUp}
              role="button"
            >
              <ArrowUp
                aria-hidden="true"
                className="h-full w-full data-[arrow-theme=blue]:text-[#6DCFF6] data-[arrow-theme=gray]:text-[#58595B]"
                data-arrow-theme={finalArrowTheme}
                focusable="false"
                strokeWidth={1.5}
              />
            </div>
            <div
              aria-label="Next"
              className="flex h-[118px] w-[118px] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95"
              onPointerDown={handleNavigateDown}
              role="button"
            >
              <ArrowDown
                aria-hidden="true"
                className="h-full w-full data-[arrow-theme=blue]:text-[#6DCFF6] data-[arrow-theme=gray]:text-[#58595B]"
                data-arrow-theme={finalArrowTheme}
                focusable="false"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Kiosk1View;
