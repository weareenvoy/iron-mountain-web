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
import CustomInteractiveKiosk3ThirdScreenTemplate, {
  type CustomInteractiveKiosk3ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/thirdScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { CustomInteractiveDemoScreenTemplateProps } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// This file builds the slides for the Custom Interactive section of the Kiosk setup and gives each one ids for use if needed.

export type CustomInteractiveScreens = {
  readonly demoScreen?: CustomInteractiveDemoScreenTemplateProps;
  readonly firstScreen?: CustomInteractiveKiosk1FirstScreenTemplateProps;
  readonly fourthScreen?: CustomInteractiveDemoScreenTemplateProps;
  readonly secondScreen?: CustomInteractiveKiosk1SecondScreenTemplateProps &
    CustomInteractiveKiosk3SecondScreenTemplateProps;
  readonly thirdScreen?: CustomInteractiveDemoScreenTemplateProps & CustomInteractiveKiosk3ThirdScreenTemplateProps;
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

  // Second screen: only for kiosk-1 and kiosk-3
  if (customInteractive.secondScreen && kioskId !== 'kiosk-2') {
    const KioskSecond =
      kioskId === 'kiosk-3' ? CustomInteractiveKiosk3SecondScreenTemplate : CustomInteractiveKiosk1SecondScreenTemplate;

    slides.push({
      id: 'customInteractive-second',
      render: () => (
        <SectionSlide>
          <KioskSecond
            {...customInteractive.secondScreen}
            onBack={() => scrollToSection?.('customInteractive-first-screen')}
            onTapToBegin={() => scrollToSection?.('customInteractive-third-screen')}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive Second',
    });
  }

  // Kiosk 3: thirdScreen is the carousel (render as standalone)
  // Kiosk 1: thirdScreen is the demo (used for overlay only, don't render standalone)
  if (kioskId === 'kiosk-3' && customInteractive.thirdScreen) {
    slides.push({
      id: 'customInteractive-third',
      render: () => (
        <SectionSlide>
          <CustomInteractiveKiosk3ThirdScreenTemplate {...customInteractive.thirdScreen} />
        </SectionSlide>
      ),
      title: 'CustomInteractive Third',
    });
  }

  // Demo screens (thirdScreen for Kiosk 1, fourthScreen for Kiosk 3) are now overlay-only

  // Keep navigation external: handled by slide order in view
  return slides;
};
