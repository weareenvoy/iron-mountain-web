import { type Controller } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import ValueCarouselTemplate, {
  type ValueCarouselTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/value/valueCarouselTemplate';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

export type ValueScreens = Readonly<{
  valueScreens?: Omit<ValueCarouselTemplateProps, 'onNavigateDown' | 'onNavigateUp'>[];
}>;

export const buildValueSlides = (values: ValueScreens, kioskId: KioskId, controller: Controller): Slide[] => {
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
        />
      </SectionSlide>
    ),
    title: config.headline ?? config.labelText ?? `Value ${idx + 1}`,
  }));
};
