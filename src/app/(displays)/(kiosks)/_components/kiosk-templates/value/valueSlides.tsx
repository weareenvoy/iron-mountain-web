import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import ValueCarouselTemplate, {
  type ValueCarouselTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueCarouselTemplate';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// This file builds the slides for the Value section of the Kiosk setup and gives each one ids for use if needed.

export type ValueScreens = {
  readonly valueScreens?: Omit<
    ValueCarouselTemplateProps,
    'onNavigateDown' | 'onNavigateUp' | 'onRegisterCarouselHandlers'
  >[];
};

export const buildValueSlides = (
  values: ValueScreens,
  kioskId: KioskId,
  handlers: { onNavigateDown: () => void; onNavigateUp: () => void },
  options?: {
    onRegisterCarouselHandlers?: (handlers: {
      canScrollNext: () => boolean;
      canScrollPrev: () => boolean;
      scrollNext: () => void;
      scrollPrev: () => void;
    }) => void;
  }
): Slide[] => {
  const valueScreens = values.valueScreens ?? [];

  return valueScreens.map((config, idx) => ({
    id: `value-${idx}`,
    render: () => (
      <SectionSlide>
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `${kioskId}-value-${idx}`}
          onNavigateDown={handlers.onNavigateDown}
          onNavigateUp={handlers.onNavigateUp}
          onRegisterCarouselHandlers={options?.onRegisterCarouselHandlers}
        />
      </SectionSlide>
    ),
    title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
  }));
};
