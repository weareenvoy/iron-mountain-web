import { type Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import ValueCarouselTemplate, {
  type ValueCarouselTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueCarouselTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';

export type ValueScreens = Readonly<{
  valueScreens?: Omit<ValueCarouselTemplateProps, 'onNavigateDown' | 'onNavigateUp'>[];
}>;

export const buildValueSlides = (values: ValueScreens, kioskId: string, controller: Controller): Slide[] => {
  const valueScreens = values.valueScreens ?? [];

  return valueScreens.map((config, idx) => ({
    id: `value-${idx}`,
    render: isActive => (
      <SectionSlide isActive={isActive}>
        <ValueCarouselTemplate
          {...config}
          carouselId={config.carouselId ?? `${kioskId}-value-${idx}`}
          onNavigateDown={() => controller.next()}
          onNavigateUp={() => controller.prev()}
        />
      </SectionSlide>
    ),
    title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
  }));
};
