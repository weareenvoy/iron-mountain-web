/**
 * Type definitions for carousel handlers used across kiosk components.
 * Provides a standardized interface for carousel navigation delegation.
 */

export type CarouselHandlers = {
  canScrollNext: () => boolean;
  canScrollPrev: () => boolean;
  scrollNext: () => void;
  scrollPrev: () => void;
};
