'use client';

import { useEffect, useRef } from 'react';
import { useKioskOverlay } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-overlay-provider';

/**
 * Hook to automatically balance overlay depth based on a boolean flag.
 * Ensures that overlay depth is properly incremented when the flag is true,
 * decremented when false, and cleaned up on unmount.
 *
 * This prevents overlay depth leaks that can occur when components unmount
 * while overlays are open or when multiple overlay states overlap.
 *
 * @param isOpen - Boolean flag indicating whether the overlay should be counted
 *
 * @example
 * // In a component with modal state
 * const [showOverlay, setShowOverlay] = useState(false);
 * useOverlayDepthFlag(showOverlay);
 *
 * @example
 * // Multiple overlays in the same component
 * useOverlayDepthFlag(showOverlay);
 * useOverlayDepthFlag(openModalIndex !== null);
 */
export function useOverlayDepthFlag(isOpen: boolean) {
  const { closeOverlay, openOverlay } = useKioskOverlay();
  const isCountedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !isCountedRef.current) {
      openOverlay();
      isCountedRef.current = true;
      return;
    }

    if (!isOpen && isCountedRef.current) {
      closeOverlay();
      isCountedRef.current = false;
    }
  }, [closeOverlay, isOpen, openOverlay]);

  useEffect(() => {
    return () => {
      if (isCountedRef.current) {
        closeOverlay();
        isCountedRef.current = false;
      }
    };
  }, [closeOverlay]);
}
