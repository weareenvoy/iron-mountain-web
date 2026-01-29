'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCarouselDelegation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useCarouselDelegation';
import { useGlobalParagraphNavigation } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useGlobalParagraphNavigation';
import { useKioskArrowState } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskArrowState';
import { useKioskSlides } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hooks/useKioskSlides';
import { useKiosk } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';
import { useKioskAudio } from '@/app/(displays)/(kiosks)/_components/providers/useKioskAudio';
import { SCROLL_DURATION_MS } from '@/app/(displays)/(kiosks)/_constants/timing';
import { useKioskArrowStore } from '@/app/(displays)/(kiosks)/_stores/useKioskArrowStore';
import { determineCurrentSection } from '@/app/(displays)/(kiosks)/_utils/section-utils';
import { useAudio, useMusic, useSfx } from '@/components/providers/audio-provider';
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
  const { arrowConfig, diamondMapping, kioskId, usesAccordion } = config;
  const { data: kioskData } = useKiosk();
  const { music, sfx } = useKioskAudio();
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSfx } = useSfx();
  const { setMusic } = useMusic();
  const audioController = useAudio();

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

  // Wrap navigation handlers with sound effects
  const handleNavigateUpWithSound = useCallback(() => {
    if (sfx.back) {
      playSfx(sfx.back);
    }
    handleNavigateUp();
  }, [handleNavigateUp, playSfx, sfx.back]);

  const handleNavigateDownWithSound = useCallback(() => {
    if (sfx.next) {
      playSfx(sfx.next);
    }
    handleNavigateDown();
  }, [handleNavigateDown, playSfx, sfx.next]);

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
        onNavigateDown: handleNavigateDownWithSound,
        onNavigateUp: handleNavigateUpWithSound,
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

  // Disable up arrow when on challenge first video or initial screen
  // Rationale: The button click animation on the cover screen (cover-ambient-initial) removes all visible content,
  // making it impossible to navigate back to that section. Disabling navigation back ensures smooth UX.
  const canNavigateUp =
    currentScrollTarget !== 'challenge-first-video' && currentScrollTarget !== 'cover-ambient-initial';

  // Single hook call with correct section info
  const { arrowTheme, shouldShowArrows } = useKioskArrowState({
    currentScrollTarget,
    isCustomInteractiveSection,
    isInitialScreen,
    isScrolling,
    isValueSection,
    kioskId,
  });

  // Track idle video completion state
  const [idleComplete, setIdleComplete] = useState(false);

  // Track current scroll target in a ref for accurate checks in async callbacks
  const currentScrollTargetRef = useRef(currentScrollTarget);
  useEffect(() => {
    currentScrollTargetRef.current = currentScrollTarget;
  }, [currentScrollTarget]);

  // Track if we should play ambient music (only once when idle completes)
  const shouldPlayAmbientRef = useRef(false);

  // Eagerly try to unlock audio on mount (for kiosk mode with --autoplay-policy=no-user-gesture-required)
  useEffect(() => {
    // Try to unlock immediately
    audioController.unlock().catch(() => {
      // Silent fail - expected without kiosk flags
    });
  }, [audioController]);

  // Play ambient music when idle completes
  useEffect(() => {
    if (idleComplete && music.ambient && !shouldPlayAmbientRef.current) {
      // Only run this once
      shouldPlayAmbientRef.current = true;

      const ambientUrl = music.ambient; // Capture in closure to satisfy TypeScript

      // Always try to unlock first, then play
      audioController
        .unlock()
        .then(() => {
          // Check if we're still on initial screen
          const latestScrollTarget = currentScrollTargetRef.current;
          const stillOnInitialScreen = !latestScrollTarget || latestScrollTarget === 'cover-ambient-initial';

          if (stillOnInitialScreen) {
            setMusic(ambientUrl, { fadeMs: 1000 });
          }
        })
        .catch(() => {
          // Silent fail
        });
    }
  }, [audioController, currentScrollTarget, idleComplete, music.ambient, setMusic]);

  // Observe when idle video completes
  useEffect(() => {
    let observer: MutationObserver | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkIdleComplete = () => {
      const initialScreenElement = containerRef.current?.querySelector('[data-scroll-section="cover-ambient-initial"]');
      if (!initialScreenElement) return null;

      const isComplete = initialScreenElement.getAttribute('data-idle-complete') === 'true';
      setIdleComplete(isComplete);
      return initialScreenElement;
    };

    const setupObserver = (element: Element) => {
      observer = new MutationObserver(() => {
        checkIdleComplete();
      });

      observer.observe(element, { attributeFilter: ['data-idle-complete'], attributes: true });
    };

    // Check initial state
    const element = checkIdleComplete();

    // If element exists, watch for changes
    if (element) {
      setupObserver(element);
    } else {
      // If element doesn't exist yet, poll for it
      pollInterval = setInterval(() => {
        const foundElement = checkIdleComplete();
        if (foundElement) {
          clearInterval(pollInterval!);
          pollInterval = null;
          setupObserver(foundElement);
        }
      }, 100);
    }

    return () => {
      if (observer) observer.disconnect();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  // Section-based background music (for non-initial sections)
  useEffect(() => {
    // Skip if we're on initial screen - ambient music is handled by unlock effect
    if (!currentScrollTarget || currentScrollTarget === 'cover-ambient-initial') {
      return;
    }

    // Determine which music to play based on current section
    let musicUrl: null | string | undefined = null;

    if (currentScrollTarget.startsWith('customInteractive')) {
      // Custom Interactive sections
      musicUrl = music.customInteractive;
    } else if (currentScrollTarget.startsWith('value') || currentScrollTarget === 'value-carousel') {
      // Value section and carousel
      musicUrl = music.value;
    } else if (currentScrollTarget.startsWith('solution')) {
      // Solution sections
      musicUrl = music.solution;
    } else if (currentScrollTarget.startsWith('challenge') || currentScrollTarget === 'main-description') {
      // Challenge sections
      musicUrl = music.challenge;
    }

    if (musicUrl) {
      // AudioEngine handles queueing if audio isn't unlocked yet
      setMusic(musicUrl, { fadeMs: 1000 });
    } else if (currentScrollTarget !== 'cover-ambient-initial') {
      // Clear music when no track is mapped (but not on initial screen)
      setMusic(null, { fadeMs: 1000 });
    }
  }, [currentScrollTarget, idleComplete, isCustomInteractiveSection, isInitialScreen, isValueSection, music, setMusic]);

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
            <div className={`${heightClass} w-full shrink-0`} data-slide-index={idx} key={slide.id}>
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
            className="fixed z-50 flex -translate-y-1/2 flex-col"
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
              aria-disabled={!canNavigateUp}
              aria-label="Previous"
              className={cn(
                'flex items-center justify-center transition-transform',
                canNavigateUp
                  ? 'cursor-pointer hover:scale-110 active:scale-95 active:opacity-40 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]'
                  : 'cursor-not-allowed opacity-30'
              )}
              onPointerDown={canNavigateUp ? handleNavigateUpWithSound : undefined}
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
              className="flex cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95 active:opacity-40 active:transition-opacity active:duration-60 active:ease-[cubic-bezier(0.3,0,0.6,1)]"
              onPointerDown={handleNavigateDownWithSound}
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
