'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { useCarouselDelegation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useCarouselDelegation';
import { useGlobalParagraphNavigation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useGlobalParagraphNavigation';
import { useKioskArrowState } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskArrowState';
import { useKioskSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskSlides';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { SCROLL_DURATION_MS } from '@/app/(displays)/(kiosks)/_constants/timing';
import { useKioskArrowStore } from '@/app/(displays)/(kiosks)/_stores/useKioskArrowStore';
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
  const { handleNavigateDown, handleNavigateUp, handleRegisterCarouselHandlers, handleRegisterListHandlers } =
    useCarouselDelegation({
      baseHandleNavigateDown,
      baseHandleNavigateUp,
      currentScrollTarget,
    });

  // Get store action directly to avoid double hook call
  const handleButtonClick = useKioskArrowStore(state => state.handleButtonClick);

  // Memoize the initial button click handler
  const handleInitialButtonClick = useMemo(() => () => handleButtonClick(kioskId), [handleButtonClick, kioskId]);

  // Build slides with the memoized button click handler
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
      handleRegisterListHandlers,
      scrollToSectionById,
    },
    usesAccordion,
  });

  // Determine current section using utility function - AFTER slides built
  const topIndex = slides.findIndex(slide => slide.id === currentScrollTarget);
  const currentSlide = slides[topIndex >= 0 ? topIndex : 0];
  const { isCustomInteractiveSection, isInitialScreen, isValueSection } = determineCurrentSection(
    currentSlide,
    currentScrollTarget
  );

  // Single hook call with correct section info
  const { arrowTheme, shouldShowArrows } = useKioskArrowState({
    currentScrollTarget,
    isCustomInteractiveSection,
    isInitialScreen,
    isScrolling,
    isValueSection,
    kioskId,
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
    <div
      className="group/kiosk relative h-screen w-full overflow-y-auto scroll-smooth"
      data-kiosk={kioskId}
      ref={containerRef}
    >
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
            className="fixed z-[50] flex -translate-y-1/2 flex-col"
            data-arrow-theme={arrowTheme}
            exit={{ opacity: 0, scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.9 }}
            style={{
              // Inline because Tailwind will not include styles that come from a JS config in the final CSS file
              gap: arrowConfig.arrowGap,
              right: arrowConfig.positionRight,
              top: arrowConfig.positionTop,
            }}
            transition={{ duration: arrowConfig.fadeDuration, ease: 'easeOut' }}
          >
            <div
              aria-label="Previous"
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onPointerDown={handleNavigateUp}
              role="button"
              style={{
                // Inline because Tailwind will not include styles that come from a JS config in the final CSS file
                alignItems: 'center',
                display: 'flex',
                height: arrowConfig.arrowHeight,
                justifyContent: 'center',
                width: arrowConfig.arrowWidth,
              }}
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
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
              onPointerDown={handleNavigateDown}
              role="button"
              style={{
                // Inline because Tailwind will not include styles that come from a JS config in the final CSS file
                alignItems: 'center',
                display: 'flex',
                height: arrowConfig.arrowHeight,
                justifyContent: 'center',
                width: arrowConfig.arrowWidth,
              }}
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
