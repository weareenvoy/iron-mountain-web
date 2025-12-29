'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';
import { useCarouselDelegation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useCarouselDelegation';
import { useGlobalParagraphNavigation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useGlobalParagraphNavigation';
import { useKioskArrowState } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskArrowState';
import { useKioskSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskSlides';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { SCROLL_DURATION_MS } from '@/app/(displays)/(kiosks)/_constants/timing';
import { determineCurrentSection } from '@/app/(displays)/(kiosks)/_utils/section-utils';
import type { KioskConfig } from '@/app/(displays)/(kiosks)/_types/kiosk-config';

// Base component shared by all three kiosks. Accepts a config object that defines kiosk-specific settings (diamond mapping, arrow positioning, etc.)

/**
 * Base kiosk view component that handles common logic for all kiosks.
 * Accepts a configuration object to handle kiosk-specific differences.
 *
 * This eliminates ~90% code duplication across Kiosk1View, Kiosk2View, and Kiosk3View.
 */

type BaseKioskViewProps = {
  readonly config: KioskConfig;
};

export const BaseKioskView = ({ config }: BaseKioskViewProps) => {
  const { arrowConfig, diamondMapping, kioskId, usesAccordion } = config;
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

  // Create stable handleInitialButtonClick reference before building slides
  // This will be populated by the arrow state hook below
  const handleInitialButtonClickRef = useRef<() => void>(() => {});
  const handleInitialButtonClick = useCallback(() => {
    handleInitialButtonClickRef.current();
  }, []);

  // Build slides from kiosk data
  const { slides } = useKioskSlides({
    diamondMapping,
    kioskData,
    kioskId,
    slideBuilders: {
      globalHandlers: {
        onNavigateDown: handleNavigateDown,
        onNavigateUp: handleNavigateUp,
      },
      handleInitialButtonClick,
      handleRegisterCarouselHandlers,
      scrollToSectionById,
    },
    usesAccordion,
  });

  // Determine current section using utility function
  const topIndex = slides.findIndex(slide => slide.id === currentScrollTarget);
  const currentSlide = slides[topIndex >= 0 ? topIndex : 0];
  const { isCustomInteractiveSection, isInitialScreen, isValueSection } = determineCurrentSection(
    currentSlide,
    currentScrollTarget
  );

  // Single arrow state call with all correct values
  const { arrowTheme, handleButtonClick, shouldShowArrows } = useKioskArrowState({
    currentScrollTarget,
    isCustomInteractiveSection,
    isInitialScreen,
    isScrolling,
    isValueSection,
    kioskId,
  });

  // Update the ref with the actual button click handler from the store
  useEffect(() => {
    handleInitialButtonClickRef.current = () => handleButtonClick(kioskId);
  }, [handleButtonClick, kioskId]);

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
            className={`fixed ${arrowConfig.positionTop} ${arrowConfig.positionRight} z-[50] flex -translate-y-1/2 flex-col ${arrowConfig.arrowGap}`}
            data-arrow-theme={arrowTheme}
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: arrowConfig.fadeDuration, ease: 'easeOut' }}
          >
            <div
              aria-label="Previous"
              className={`flex ${arrowConfig.arrowHeight} ${arrowConfig.arrowWidth} cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95`}
              onPointerDown={handleNavigateUp}
              role="button"
            >
              <ArrowUp
                aria-hidden="true"
                className="h-full w-full data-[arrow-theme=blue]:text-[#6DCFF6] data-[arrow-theme=gray]:text-[#58595B]"
                data-arrow-theme={arrowTheme}
                focusable="false"
                strokeWidth={1.5}
              />
            </div>
            <div
              aria-label="Next"
              className={`flex ${arrowConfig.arrowHeight} ${arrowConfig.arrowWidth} cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95`}
              onPointerDown={handleNavigateDown}
              role="button"
            >
              <ArrowDown
                aria-hidden="true"
                className="h-full w-full data-[arrow-theme=blue]:text-[#6DCFF6] data-[arrow-theme=gray]:text-[#58595B]"
                data-arrow-theme={arrowTheme}
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
