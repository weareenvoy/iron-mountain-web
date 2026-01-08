import IdleScreenTemplate, {
  type IdleScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/idle/idleScreenTemplate';
import { createSlide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slideFactory';
import { type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import { type KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

/**
 * Builds the slide for the Idle screen.
 * Displays before the initial challenge screen as the entry point.
 */

export type IdleScreens = {
  readonly idleScreen?: IdleScreenTemplateProps;
};

type IdleSlideOptions = {
  readonly handlers: {
    readonly onNavigateDown: () => void;
    readonly onNavigateUp: () => void;
  };
};

export const buildIdleSlides = (idle: IdleScreens, kioskId: KioskId, options: IdleSlideOptions): Slide[] => {
  const slides: Slide[] = [];

  if (idle.idleScreen) {
    slides.push(
      createSlide(
        {
          component: IdleScreenTemplate,
          id: 'idle-screen',
          props: idle.idleScreen,
          title: 'Idle Screen',
        },
        { handlers: options.handlers, kioskId }
      )
    );
  }

  return slides;
};
