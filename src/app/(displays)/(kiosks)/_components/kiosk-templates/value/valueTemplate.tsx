import { type Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import ValueCarouselTemplate, {
  type ValueCarouselTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueCarouselTemplate';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type ValueScreens = {
  readonly valueScreens?: Omit<ValueCarouselTemplateProps, 'onNavigateDown' | 'onNavigateUp' | 'onRegisterCarouselHandlers'>[];
};

export const buildValueSlides = (
  values: ValueScreens,
  kioskId: KioskId,
  controller: Controller,
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
    render: (isActive: boolean) => (
      <SectionSlide isActive={isActive}>
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `${kioskId}-value-${idx}`}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
          onRegisterCarouselHandlers={options?.onRegisterCarouselHandlers}
        />
      </SectionSlide>
    ),
    title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
  }));
};
