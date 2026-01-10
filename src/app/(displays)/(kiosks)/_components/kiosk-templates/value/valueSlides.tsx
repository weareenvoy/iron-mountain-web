import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import ValueCarouselTemplate, {
  type ValueCarouselTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueCarouselTemplate';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// This file builds the slides for the Value section of the Kiosk setup and gives each one ids for use if needed.

export type ValueScreens = {
  readonly valueScreens?: Omit<
    ValueCarouselTemplateProps,
    'onNavigateDown' | 'onNavigateUp' | 'registerCarouselHandlers'
  >[];
};

export const buildValueSlides = (
  values: ValueScreens,
  kioskId: KioskId,
  handlers: { onNavigateDown: () => void; onNavigateUp: () => void },
  options?: {
    registerCarouselHandlers?: (handlers: {
      canScrollNext: () => boolean;
      canScrollPrev: () => boolean;
      scrollNext: () => void;
      scrollPrev: () => void;
    }) => void;
  }
): Slide[] => {
  if (!values.valueScreens || values.valueScreens.length === 0) {
    throw new Error('[buildValueSlides] No value screens provided from CMS. Fix CMS data.');
  }

  const lastIndex = values.valueScreens.length - 1;

  return values.valueScreens.map((config, idx) => {
    if (!config.headline && !config.labelText) {
      throw new Error(`[buildValueSlides] Value screen ${idx} missing both headline and labelText. Fix CMS data.`);
    }

    const isLastScreen = idx === lastIndex;

    return {
      id: `value-${idx}`,
      render: () => (
        <SectionSlide>
          <ValueCarouselTemplate
            {...config}
            carouselId={config.carouselId ?? `${kioskId}-value-${idx}`}
            isLastScreen={isLastScreen}
            onNavigateDown={handlers.onNavigateDown}
            onNavigateUp={handlers.onNavigateUp}
            registerCarouselHandlers={options?.registerCarouselHandlers}
          />
        </SectionSlide>
      ),
      title: config.headline ?? config.labelText!,
    };
  });
};
