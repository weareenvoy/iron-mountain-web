import CustomInteractiveFirstScreenTemplate, {
  type CustomInteractiveKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/firstScreenTemplate';
import CustomInteractiveKiosk3CombinedTemplate, {
  type CustomInteractiveKiosk3CombinedTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/combinedSecondThirdTemplate';
import {
  CustomInteractiveKiosk1SecondScreenTemplate,
  type CustomInteractiveKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk1/secondScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { CustomInteractiveDemoScreenTemplateProps } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// This file builds the slides for the Custom Interactive section of the Kiosk setup and gives each one ids for use if needed.

export type CustomInteractiveScreens = {
  readonly combinedScreen?: CustomInteractiveKiosk3CombinedTemplateProps;
  readonly demoScreen?: CustomInteractiveDemoScreenTemplateProps;
  readonly firstScreen?: CustomInteractiveKiosk1FirstScreenTemplateProps;
  readonly fourthScreen?: CustomInteractiveDemoScreenTemplateProps;
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
    // Kiosk 1 uses thirdScreen for overlay, Kiosk 2 uses firstScreen props directly, Kiosk 3 uses fourthScreen
    let overlayCardLabel: string | undefined;
    let overlayHeadline: string | undefined;

    if (kioskId === 'kiosk-1' && customInteractive.thirdScreen) {
      overlayCardLabel = customInteractive.thirdScreen.cardLabel;
      overlayHeadline = customInteractive.thirdScreen.headline;
    } else if (kioskId === 'kiosk-2') {
      overlayCardLabel = customInteractive.firstScreen.overlayCardLabel;
      overlayHeadline = customInteractive.firstScreen.overlayHeadline;
    } else if (kioskId === 'kiosk-3' && customInteractive.fourthScreen) {
      overlayCardLabel = customInteractive.fourthScreen.cardLabel;
      overlayHeadline = customInteractive.fourthScreen.headline;
    }

    slides.push({
      id: 'customInteractive-first',
      render: () => (
        <SectionSlide>
          <CustomInteractiveFirstScreenTemplate
            kioskId={kioskId}
            {...customInteractive.firstScreen}
            onPrimaryCta={() => scrollToSection?.('customInteractive-second-screen')}
            overlayCardLabel={overlayCardLabel}
            overlayHeadline={overlayHeadline}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive First',
    });
  }

  // Kiosk 3: Use combined template (second + third screen in one)
  if (kioskId === 'kiosk-3' && customInteractive.combinedScreen) {
    slides.push({
      id: 'customInteractive-combined',
      render: () => (
        <SectionSlide>
          <CustomInteractiveKiosk3CombinedTemplate
            {...customInteractive.combinedScreen}
            onBack={() => scrollToSection?.('customInteractive-first-screen')}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive Combined',
    });
  }

  // Second screen: only for kiosk-1 (kiosk-3 uses combined template above)
  if (customInteractive.secondScreen && kioskId === 'kiosk-1') {
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

  // Demo screens (thirdScreen for Kiosk 1, fourthScreen for Kiosk 3) are now overlay-only

  // Keep navigation external: handled by slide order in view
  return slides;
};
