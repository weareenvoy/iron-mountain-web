import CustomInteractiveFirstScreenTemplate, {
  type CustomInteractiveKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/firstScreenTemplate';
import {
  CustomInteractiveKiosk1SecondScreenTemplate,
  type CustomInteractiveKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk1/secondScreenTemplate';
import CustomInteractiveKiosk3SecondScreenTemplate, {
  type CustomInteractiveKiosk3SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/secondScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { CustomInteractiveDemoScreenTemplateProps } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// This file builds the slides for the Custom Interactive section of the Kiosk setup and gives each one ids for use if needed.

export type CustomInteractiveScreens = {
  readonly demoScreen?: CustomInteractiveDemoScreenTemplateProps;
  readonly firstScreen?: CustomInteractiveKiosk1FirstScreenTemplateProps;
  readonly kiosk3SecondScreen?: CustomInteractiveKiosk3SecondScreenTemplateProps;
  readonly kiosk3ThirdScreen?: CustomInteractiveDemoScreenTemplateProps;
  readonly secondScreen?: CustomInteractiveKiosk1SecondScreenTemplateProps;
  readonly thirdScreen?: CustomInteractiveDemoScreenTemplateProps;
};

export const buildCustomInteractiveSlides = (
  customInteractive: CustomInteractiveScreens,
  kioskId: KioskId,
  scrollToSection?: (sectionId: string) => void
): Slide[] => {
  const slides: Slide[] = [];

  if (customInteractive.firstScreen) {
    // Kiosk 1 uses thirdScreen for overlay, Kiosk 2 uses firstScreen props directly, Kiosk 3 uses kiosk3ThirdScreen
    let overlayCardLabel: string | undefined;
    let overlayHeadline: string | undefined;

    if (kioskId === 'kiosk-1' && customInteractive.thirdScreen) {
      overlayCardLabel = customInteractive.thirdScreen.cardLabel;
      overlayHeadline = customInteractive.thirdScreen.headline;
    } else if (kioskId === 'kiosk-2') {
      overlayCardLabel = customInteractive.firstScreen.overlayCardLabel;
      overlayHeadline = customInteractive.firstScreen.overlayHeadline;
    } else if (kioskId === 'kiosk-3' && customInteractive.kiosk3ThirdScreen) {
      overlayCardLabel = customInteractive.kiosk3ThirdScreen.cardLabel;
      overlayHeadline = customInteractive.kiosk3ThirdScreen.headline;
    }

    // Determine navigation target based on kiosk
    const primaryCtaTarget = 'customInteractive-second-screen';

    slides.push({
      id: 'customInteractive-first',
      render: () => (
        <SectionSlide>
          <CustomInteractiveFirstScreenTemplate
            kioskId={kioskId}
            {...customInteractive.firstScreen}
            onPrimaryCta={() => scrollToSection?.(primaryCtaTarget)}
            overlayCardLabel={overlayCardLabel}
            overlayHeadline={overlayHeadline}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive First',
    });
  }

  // Second screen: kiosk-3 has its own, kiosk-1 has its own
  if (kioskId === 'kiosk-3' && customInteractive.kiosk3SecondScreen) {
    slides.push({
      id: 'customInteractive-second',
      render: () => (
        <SectionSlide>
          <CustomInteractiveKiosk3SecondScreenTemplate
            {...customInteractive.kiosk3SecondScreen}
            onBack={() => scrollToSection?.('customInteractive-first-screen')}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive Second',
    });
  } else if (customInteractive.secondScreen && kioskId === 'kiosk-1') {
    slides.push({
      id: 'customInteractive-second',
      render: () => (
        <SectionSlide>
          <CustomInteractiveKiosk1SecondScreenTemplate
            {...customInteractive.secondScreen}
            onBack={() => scrollToSection?.('customInteractive-first-screen')}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive Second',
    });
  }

  // Demo screens (thirdScreen for Kiosk 1, kiosk3ThirdScreen for Kiosk 3) are now overlay-only

  // Keep navigation external: handled by slide order in view
  return slides;
};
