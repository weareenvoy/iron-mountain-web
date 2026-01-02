import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// Made to remove the boilerplate code for creating slides. Simplifies the slide builder pattern for Kiosk slides.

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
 * Type assertion is safe because SlideConfig<TProps> ensures props matches TProps
 * at compile time. The spread is necessary because TypeScript can't infer that props
 * is assignable to TProps when spreading, despite the generic constraint.
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
        {/* Type assertion is safe - props is guaranteed to match TProps by generic constraint */}
        <Component {...(props as TProps)} kioskId={kioskId} {...handlers} />
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
 * Type assertion is safe - props is guaranteed to match TProps by generic constraint.
 */
export const createSlideWithoutHandlers = <TProps extends Record<string, unknown>>(
  config: SlideConfig<TProps>,
  kioskId: KioskId
): Slide => {
  const { component: Component, id, props, title } = config;

  return {
    id,
    render: () => (
      <SectionSlide>
        {/* Type assertion is safe - props is guaranteed to match TProps by generic constraint */}
        <Component {...(props as TProps)} kioskId={kioskId} />
      </SectionSlide>
    ),
    title,
  };
};
