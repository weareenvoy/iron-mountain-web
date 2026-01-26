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
import { cn } from '@/lib/tailwind/utils/cn';
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
  const { arrowConfig, diamondMapping, kioskId } = config;
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
  const { missingSections, slides } = useKioskSlides({
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

  // Disable up arrow when on challenge first video or initial screen
  // Rationale: The button click animation on the cover screen (cover-ambient-initial) removes all visible content,
  // making it impossible to navigate back to that section. Disabling navigation back ensures smooth UX.
  const canNavigateUp =
    currentScrollTarget !== 'challenge-first-video' && currentScrollTarget !== 'cover-ambient-initial';

  // Improved empty slides state handling
  if (slides.length === 0) {
    if (!kioskData) {
      // Still loading data from API
      return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
          <div className="text-center">
            <p className="text-2xl">Loading kiosk data...</p>
            <p className="mt-4 text-sm opacity-60">Fetching data...</p>
          </div>
        </div>
      );
    }

    // Data exists but no slides - likely a data structure issue
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-2xl">Unable to load kiosk content</p>
          {missingSections && missingSections.length > 0 ? (
            <p className="mt-4 text-sm opacity-60">Missing sections: {missingSections.join(', ')}</p>
          ) : (
            <p className="mt-4 text-sm opacity-60">Data structure may be invalid</p>
          )}
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs opacity-40">Check console for details</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="group/kiosk relative h-screen w-full overflow-y-auto bg-black"
      data-kiosk={kioskId}
      ref={containerRef}
    >
      <div className="flex w-full flex-col overflow-x-hidden">
        {/* Render ALL slides, always visible, stacked vertically */}
        {slides.map((slide, idx) => {
          let heightClass = 'h-screen';
          if (slide.id === 'challenge-second') heightClass = 'h-[50vh]';
          if (slide.id === 'challenge-third') heightClass = 'h-[150vh]';

          return (
            <div className={cn(heightClass, 'w-full flex-shrink-0')} data-slide-index={idx} key={slide.id}>
              {slide.render()}
            </div>
          );
        })}
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
            transition={{ duration: arrowConfig.fadeDuration, ease: [0.3, 0, 0.6, 1] }}
          >
            <div
              aria-disabled={!canNavigateUp}
              aria-label="Previous"
              className={cn(
                'flex items-center justify-center transition-transform',
                canNavigateUp
                  ? 'cursor-pointer hover:scale-110 active:scale-95 active:opacity-40 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]'
                  : 'cursor-not-allowed opacity-30'
              )}
              onPointerDown={canNavigateUp ? handleNavigateUp : undefined}
              role="button"
              style={{
                // Inline because Tailwind will not include styles from runtime config
                height: arrowConfig.arrowHeight,
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
              className="flex cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95 active:opacity-40 active:transition-opacity active:duration-[60ms] active:ease-[cubic-bezier(0.3,0,0.6,1)]"
              onPointerDown={handleNavigateDown}
              role="button"
              style={{
                // Inline because Tailwind will not include styles from runtime config
                height: arrowConfig.arrowHeight,
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
