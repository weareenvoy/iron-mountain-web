import CustomInteractiveFirstScreenTemplate, {
  type CustomInteractiveKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/firstScreenTemplate';
import { SECTION_IDS } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/constants';
import {
  CustomInteractiveKiosk1SecondScreenTemplate,
  type CustomInteractiveKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk1/secondScreenTemplate';
import CustomInteractiveKiosk3SecondScreenTemplate, {
  type Kiosk3SecondScreenProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/kiosk3/secondScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';
import type { CustomInteractiveDemoScreenTemplateProps } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/demoScreenTemplate';
import type { KioskId } from '@/app/(displays)/(kiosks)/_types/kiosk-id';

// This file builds the slides for the Custom Interactive section of the Kiosk setup and gives each one ids for use if needed.

export type CustomInteractiveScreens = {
  readonly demoScreen?: CustomInteractiveDemoScreenTemplateProps;
  readonly firstScreen?: CustomInteractiveKiosk1FirstScreenTemplateProps;
  readonly kiosk3OverlayConfig?: CustomInteractiveDemoScreenTemplateProps;
  readonly kiosk3SecondScreen?: Kiosk3SecondScreenProps;
  readonly secondScreen?: CustomInteractiveKiosk1SecondScreenTemplateProps;
  readonly thirdScreen?: CustomInteractiveDemoScreenTemplateProps;
};

export const buildCustomInteractiveSlides = (
  customInteractive: CustomInteractiveScreens,
  kioskId: KioskId,
  scrollToSection?: (sectionId: string) => void
): Slide[] => {
  // Handler for closing demo - refreshes page and skips idle video
  const handleEndTour = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('skipIdleVideo', 'true');
      window.location.reload();
    }
  };
  const slides: Slide[] = [];

  if (customInteractive.firstScreen) {
    // Extract overlay configuration based on kiosk variant
    let overlayCardLabel: string | undefined;
    let overlayHeadline: string | undefined;

    if (kioskId === 'kiosk-1' && customInteractive.thirdScreen) {
      overlayCardLabel = customInteractive.thirdScreen.cardLabel;
      overlayHeadline = customInteractive.thirdScreen.headline;
    } else if (kioskId === 'kiosk-2') {
      overlayCardLabel = customInteractive.firstScreen.overlayCardLabel;
      overlayHeadline = customInteractive.firstScreen.overlayHeadline;
    } else if (kioskId === 'kiosk-3' && customInteractive.kiosk3OverlayConfig) {
      overlayCardLabel = customInteractive.kiosk3OverlayConfig.cardLabel;
      overlayHeadline = customInteractive.kiosk3OverlayConfig.headline;
    }

    // Determine navigation target based on kiosk
    const primaryCtaTarget = SECTION_IDS.SECOND_SCREEN;

    // Create stable handler outside of render to prevent double-click issues
    const handlePrimaryCta = () => {
      if (scrollToSection) {
        scrollToSection(primaryCtaTarget);
      }
    };

    slides.push({
      id: 'customInteractive-first',
      render: () => (
        <SectionSlide>
          <CustomInteractiveFirstScreenTemplate
            kioskId={kioskId}
            {...customInteractive.firstScreen}
            onEndTour={handleEndTour}
            onPrimaryCta={handlePrimaryCta}
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
            onBack={() => scrollToSection?.(SECTION_IDS.FIRST_SCREEN)}
            onEndTour={handleEndTour}
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
            onBack={() => scrollToSection?.(SECTION_IDS.FIRST_SCREEN)}
            onEndTour={handleEndTour}
          />
        </SectionSlide>
      ),
      title: 'CustomInteractive Second',
    });
  }

  // Demo screens (thirdScreen for Kiosk 1, kiosk3OverlayConfig for Kiosk 3) are overlay-only

  // Keep navigation external: handled by slide order in view
  return slides;
};
