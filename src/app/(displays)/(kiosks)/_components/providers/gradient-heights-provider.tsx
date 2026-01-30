'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SectionHeights } from '@/app/(displays)/(kiosks)/_utils/calculate-section-heights';

/**
 * Context for providing dynamically calculated gradient heights to kiosk templates.
 *
 * Gradient backgrounds need to span the full height of their section, which varies
 * based on which templates are present in the data. This context makes those
 * calculated heights available to any template that needs them.
 */

type GradientHeightsContextValue = SectionHeights & {
  /**
   * Get the gradient height for a specific custom interactive instance
   * @param index - The index of the custom interactive (0-based)
   * @returns The gradient height in pixels, or 0 if index is out of bounds
   */
  getCustomInteractiveHeight: (index: number) => number;
};

const GradientHeightsContext = createContext<GradientHeightsContextValue | null>(null);

type GradientHeightsProviderProps = {
  readonly children: ReactNode;
  readonly heights: SectionHeights;
};

export const GradientHeightsProvider = ({ children, heights }: GradientHeightsProviderProps) => {
  const value: GradientHeightsContextValue = {
    ...heights,
    getCustomInteractiveHeight: (index: number) => {
      // Validate index bounds
      if (index < 0 || index >= heights.customInteractive.length) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[GradientHeightsProvider] Custom interactive index ${index} out of bounds (0-${heights.customInteractive.length - 1})`
          );
        }
        return 0;
      }

      const height = heights.customInteractive[index];

      // Additional safety check for undefined values
      if (height === undefined) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[GradientHeightsProvider] No height found for custom interactive at index ${index}`);
        }
        return 0;
      }

      return height;
    },
  };

  return <GradientHeightsContext.Provider value={value}>{children}</GradientHeightsContext.Provider>;
};

/**
 * Hook to access gradient heights in kiosk templates.
 *
 * @throws Error if used outside of GradientHeightsProvider
 * @returns Object containing gradient heights for all sections
 */
export const useGradientHeights = (): GradientHeightsContextValue => {
  const context = useContext(GradientHeightsContext);

  if (!context) {
    throw new Error('useGradientHeights must be used within a GradientHeightsProvider');
  }

  return context;
};
