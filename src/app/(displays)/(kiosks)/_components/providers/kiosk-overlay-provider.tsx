'use client';

import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

/**
 * Context for managing overlay depth in kiosk views.
 * Tracks how many overlays are currently open and provides methods to open/close them.
 * Supports nested overlays by maintaining a depth counter.
 */
type KioskOverlayContextValue = {
  readonly closeOverlay: () => void;
  readonly openOverlay: () => void;
  readonly overlayDepth: number;
};

const KioskOverlayContext = createContext<KioskOverlayContextValue | undefined>(undefined);

/**
 * Hook to access kiosk overlay state and methods.
 * Must be used within a KioskOverlayProvider.
 *
 * @example
 * const { openOverlay, closeOverlay, overlayDepth } = useKioskOverlay();
 * const isAnyOverlayOpen = overlayDepth > 0;
 */
export function useKioskOverlay(): KioskOverlayContextValue {
  const ctx = useContext(KioskOverlayContext);
  if (!ctx) throw new Error('useKioskOverlay must be used within KioskOverlayProvider');
  return ctx;
}

/**
 * Provider for kiosk overlay state management.
 * Maintains a depth counter for nested overlays and provides open/close methods.
 *
 * @example
 * <KioskOverlayProvider>
 *   <YourKioskComponents />
 * </KioskOverlayProvider>
 */
export const KioskOverlayProvider = ({ children }: PropsWithChildren) => {
  const [overlayDepth, setOverlayDepth] = useState(0);

  const openOverlay = useCallback(() => {
    setOverlayDepth(d => d + 1);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlayDepth(d => Math.max(0, d - 1));
  }, []);

  const value = useMemo(
    () => ({
      closeOverlay,
      openOverlay,
      overlayDepth,
    }),
    [closeOverlay, openOverlay, overlayDepth]
  );

  return <KioskOverlayContext.Provider value={value}>{children}</KioskOverlayContext.Provider>;
};
