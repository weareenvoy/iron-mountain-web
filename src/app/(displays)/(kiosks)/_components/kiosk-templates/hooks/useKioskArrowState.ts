import { useEffect, useRef } from 'react';
import { getStoreKey } from '@/app/(displays)/(kiosks)/_stores/kioskStoreUtils';
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
  const kioskState = useKioskArrowStore(state => state[getStoreKey(kioskId)]);
  const handleButtonClick = useKioskArrowStore(state => state.handleButtonClick);
  const handleScrollTargetChange = useKioskArrowStore(state => state.handleScrollTargetChange);
  const handleInitialScreenReset = useKioskArrowStore(state => state.handleInitialScreenReset);
  const handleScrollStart = useKioskArrowStore(state => state.handleScrollStart);
  const handleScrollComplete = useKioskArrowStore(state => state.handleScrollComplete);
  const handleArrowThemeUpdate = useKioskArrowStore(state => state.handleArrowThemeUpdate);

  const { arrowTheme, showArrows } = kioskState;

  // Track if we were in value section for color persistence
  const wasInValueSectionRef = useRef(false);

  // Consolidated effect #1: Handle scroll target changes and initial screen state
  useEffect(() => {
    // Track value section history
    if (isValueSection) {
      wasInValueSectionRef.current = true;
    } else if (!currentScrollTarget || !currentScrollTarget.includes('customInteractive-')) {
      wasInValueSectionRef.current = false;
    }

    // Handle scroll target changes
    handleScrollTargetChange(kioskId, currentScrollTarget, kioskState.previousScrollTarget, isInitialScreen);

    // Handle initial screen reset
    handleInitialScreenReset(kioskId, isInitialScreen);
  }, [
    currentScrollTarget,
    isInitialScreen,
    isValueSection,
    kioskState.previousScrollTarget,
    handleScrollTargetChange,
    handleInitialScreenReset,
    kioskId,
  ]);

  // Consolidated effect #2: Handle scrolling lifecycle (start/complete) and arrow visibility
  useEffect(() => {
    // Handle scroll start (hiding arrows)
    if (isScrolling) {
      handleScrollStart(kioskId, currentScrollTarget, kioskState.previousScrollTarget, isScrolling);
    }

    // Handle scroll complete (showing arrows)
    if (!isScrolling) {
      handleScrollComplete(kioskId, currentScrollTarget, isScrolling, isCustomInteractiveSection);
    }
  }, [
    isScrolling,
    currentScrollTarget,
    isCustomInteractiveSection,
    kioskState.previousScrollTarget,
    handleScrollStart,
    handleScrollComplete,
    kioskId,
  ]);

  // Effect #3: Handle arrow theme updates (depends on showArrows state)
  useEffect(() => {
    const isScrollingToCustomInteractive = currentScrollTarget && currentScrollTarget.includes('customInteractive-');

    if (showArrows && !isScrollingToCustomInteractive) {
      handleArrowThemeUpdate(kioskId, isValueSection, showArrows);
    }
  }, [isValueSection, showArrows, currentScrollTarget, handleArrowThemeUpdate, kioskId]);

  // Arrows should be visible when showArrows is true (controlled by the store)
  const shouldShowArrows = showArrows && !isCustomInteractiveSection;

  return {
    arrowTheme,
    handleButtonClick,
    shouldShowArrows,
  };
};
