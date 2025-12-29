import { useEffect, useRef } from 'react';
import { useKioskArrowStore } from '@/app/(displays)/(kiosks)/_stores/useKioskArrowStore';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// Bridge between React components and Zustand arrow store. Selects the store slice for Kiosk 1 2 or 3 and manages arrow related useEffect calls in one place and sends back the final arrow state for themes, whether they should be visible, click interactions, etc.

/**
 * Hook for synchronizing kiosk arrow state with Zustand store.
 * Manages arrow visibility, theme updates, and scroll lifecycle events.
 *
 * This encapsulates all the complex useEffect logic that was previously
 * scattered throughout the Kiosk view components, making the store integration
 * explicit and testable.
 */

type UseKioskArrowStateConfig = {
  readonly currentScrollTarget: null | string;
  readonly isCustomInteractiveSection: boolean;
  readonly isInitialScreen: boolean;
  readonly isScrolling: boolean;
  readonly isValueSection: boolean;
  readonly kioskId: KioskId;
};

export const useKioskArrowState = ({
  currentScrollTarget,
  isCustomInteractiveSection,
  isInitialScreen,
  isScrolling,
  isValueSection,
  kioskId,
}: UseKioskArrowStateConfig) => {
  // Zustand store selectors
  const kioskState = useKioskArrowStore(
    state => state[`kiosk${kioskId.split('-')[1]}` as 'kiosk1' | 'kiosk2' | 'kiosk3']
  );
  const handleButtonClick = useKioskArrowStore(state => state.handleButtonClick);
  const handleScrollTargetChange = useKioskArrowStore(state => state.handleScrollTargetChange);
  const handleInitialScreenReset = useKioskArrowStore(state => state.handleInitialScreenReset);
  const handleScrollStart = useKioskArrowStore(state => state.handleScrollStart);
  const handleScrollComplete = useKioskArrowStore(state => state.handleScrollComplete);
  const handleArrowThemeUpdate = useKioskArrowStore(state => state.handleArrowThemeUpdate);

  const { arrowTheme, showArrows } = kioskState;

  // Track if we were in value section for color persistence
  const wasInValueSectionRef = useRef(false);

  useEffect(() => {
    // Track if we were in value section
    if (isValueSection) {
      wasInValueSectionRef.current = true;
    } else if (!currentScrollTarget || !currentScrollTarget.includes('customInteractive-')) {
      // Only clear the flag if we're not transitioning to customInteractive
      wasInValueSectionRef.current = false;
    }
  }, [isValueSection, currentScrollTarget]);

  // Handle arrow theme updates
  useEffect(() => {
    const isScrollingToCustomInteractive = currentScrollTarget && currentScrollTarget.includes('customInteractive-');

    if (showArrows && !isScrollingToCustomInteractive) {
      handleArrowThemeUpdate(kioskId, isValueSection, showArrows);
    }
  }, [isValueSection, showArrows, currentScrollTarget, handleArrowThemeUpdate, kioskId]);

  // Handle scroll target changes
  useEffect(() => {
    handleScrollTargetChange(kioskId, currentScrollTarget, kioskState.previousScrollTarget, isInitialScreen);
  }, [currentScrollTarget, kioskState.previousScrollTarget, isInitialScreen, handleScrollTargetChange, kioskId]);

  // Handle initial screen reset
  useEffect(() => {
    handleInitialScreenReset(kioskId, isInitialScreen);
  }, [isInitialScreen, handleInitialScreenReset, kioskId]);

  // Handle scroll start (hiding arrows)
  useEffect(() => {
    handleScrollStart(kioskId, currentScrollTarget, kioskState.previousScrollTarget, isScrolling);
  }, [isScrolling, currentScrollTarget, kioskState.previousScrollTarget, handleScrollStart, kioskId]);

  // Handle scroll complete (showing arrows)
  useEffect(() => {
    handleScrollComplete(kioskId, currentScrollTarget, isScrolling, isCustomInteractiveSection);
  }, [isScrolling, currentScrollTarget, isCustomInteractiveSection, handleScrollComplete, kioskId]);

  // Arrows should be visible when showArrows is true (controlled by the store)
  const shouldShowArrows = showArrows && !isCustomInteractiveSection;

  return {
    arrowTheme,
    handleButtonClick,
    shouldShowArrows,
  };
};
