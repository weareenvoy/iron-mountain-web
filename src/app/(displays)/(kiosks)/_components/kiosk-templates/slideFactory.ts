import { type ReactElement } from 'react';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Factory for creating kiosk slides with consistent structure.
 * Eliminates boilerplate by providing a declarative API for slide configuration.
 *
 * This simplifies the slide builder pattern by:
 * - Removing repetitive `render` functions
 * - Auto-wrapping in `SectionSlide`
 * - Auto-injecting common props (kioskId, handlers)
 * - Providing type-safe slide configuration
 */

type NavigationHandlers = {
  readonly onNavigateDown: () => void;
  readonly onNavigateUp: () => void;
};

type SlideConfig<TProps = Record<string, unknown>> = {
  readonly component: React.ComponentType<TProps>;
  readonly id: string;
  readonly props: TProps;
  readonly title: string;
};

type CreateSlideOptions = {
  readonly handlers: NavigationHandlers;
  readonly kioskId: KioskId;
};

/**
 * Creates a single slide with automatic prop injection and wrapping.
 */
export const createSlide = <TProps extends Record<string, unknown>>(
  config: SlideConfig<TProps>,
  options: CreateSlideOptions
): Slide => {
  const { component: Component, id, props, title } = config;
  const { handlers, kioskId } = options;

  return {
    id,
    render: () => (
      <SectionSlide>
        <Component {...props} kioskId={kioskId} {...handlers} />
      </SectionSlide>
    ),
    title,
  };
};

/**
 * Creates multiple slides from an array of configurations.
 * Useful for sections with dynamic slide counts (e.g., solution steps).
 */
export const createSlides = <TProps extends Record<string, unknown>>(
  configs: SlideConfig<TProps>[],
  options: CreateSlideOptions
): Slide[] => {
  return configs.map(config => createSlide(config, options));
};

/**
 * Creates a slide without navigation handlers (e.g., initial screen).
 */
export const createSlideWithoutHandlers = <TProps extends Record<string, unknown>>(
  config: Omit<SlideConfig<TProps>, 'props'> & { props: Omit<TProps, keyof NavigationHandlers> },
  kioskId: KioskId
): Slide => {
  const { component: Component, id, props, title } = config;

  return {
    id,
    render: () => (
      <SectionSlide>
        <Component {...props} kioskId={kioskId} />
      </SectionSlide>
    ),
    title,
  };
};

