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
  readonly number?: 1 | 2 | 3;
  readonly secondScreen?: CustomInteractiveKiosk1SecondScreenTemplateProps;
  readonly thirdScreen?: CustomInteractiveDemoScreenTemplateProps;
};

export const buildCustomInteractiveSlides = (
  customInteractive: CustomInteractiveScreens,
  kioskId: KioskId,
  scrollToSection?: (sectionId: string) => void,
  index?: number,
  customInteractiveNumber?: 1 | 2 | 3
): Slide[] => {
  // Create unique ID prefix for this custom interactive instance
  // Include the custom interactive number for gradient height calculations
  const idPrefix = index !== undefined ? `customInteractive-${index}` : 'customInteractive';
  // Use passed number or fall back to number from customInteractive object, default to 1
  const ciNumber = customInteractiveNumber ?? customInteractive.number ?? 1;
  const idSuffix = `-ci${ciNumber}`;
  // Handler for closing demo - refreshes page and skips idle video
  const handleEndTour = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('skipIdleVideo', 'true');
      window.location.reload();
    }
  };
  const slides: Slide[] = [];

  if (customInteractive.firstScreen) {
    // Extract overlay configuration based on custom interactive structure
    // Check for data presence rather than kiosk ID to support centralized custom interactives
    let overlayCardLabel: string | undefined;
    let overlayHeadline: string | undefined;

    if (customInteractive.thirdScreen) {
      // Custom Interactive 1 style (has thirdScreen with demo overlay)
      overlayCardLabel = customInteractive.thirdScreen.cardLabel;
      overlayHeadline = customInteractive.thirdScreen.headline;
    } else if (customInteractive.kiosk3OverlayConfig) {
      // Custom Interactive 3 style (has kiosk3OverlayConfig)
      overlayCardLabel = customInteractive.kiosk3OverlayConfig.cardLabel;
      overlayHeadline = customInteractive.kiosk3OverlayConfig.headline;
    } else {
      // Custom Interactive 2 style (overlay config in firstScreen)
      overlayCardLabel = customInteractive.firstScreen.overlayCardLabel;
      overlayHeadline = customInteractive.firstScreen.overlayHeadline;
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
      id: `${idPrefix}-first${idSuffix}`,
      render: () => (
        <SectionSlide>
          <CustomInteractiveFirstScreenTemplate
            customInteractiveIndex={index ?? 0}
            kioskId={kioskId}
            {...customInteractive.firstScreen}
            onEndTour={handleEndTour}
            onPrimaryCta={handlePrimaryCta}
            overlayCardLabel={overlayCardLabel}
            overlayHeadline={overlayHeadline}
          />
        </SectionSlide>
      ),
      title: `CustomInteractive ${index !== undefined ? index + 1 : ''} First`,
    });
  }

  // Second screen: Check for data structure rather than kiosk ID
  // This allows custom interactives to be shared across kiosks
  if (customInteractive.kiosk3SecondScreen) {
    // Kiosk 3 style second screen (tap carousel)
    slides.push({
      id: `${idPrefix}-second`,
      render: () => (
        <SectionSlide>
          <CustomInteractiveKiosk3SecondScreenTemplate
            {...customInteractive.kiosk3SecondScreen}
            onBack={() => scrollToSection?.(SECTION_IDS.FIRST_SCREEN)}
            onEndTour={handleEndTour}
          />
        </SectionSlide>
      ),
      title: `CustomInteractive ${index !== undefined ? index + 1 : ''} Second`,
    });
  } else if (customInteractive.secondScreen) {
    // Kiosk 1 style second screen (diamond carousel with modals)
    slides.push({
      id: `${idPrefix}-second${idSuffix}`,
      render: () => (
        <SectionSlide>
          <CustomInteractiveKiosk1SecondScreenTemplate
            {...customInteractive.secondScreen}
            onBack={() => scrollToSection?.(SECTION_IDS.FIRST_SCREEN)}
            onEndTour={handleEndTour}
          />
        </SectionSlide>
      ),
      title: `CustomInteractive ${index !== undefined ? index + 1 : ''} Second`,
    });
  }

  // Demo screens (thirdScreen for Kiosk 1, kiosk3OverlayConfig for Kiosk 3) are overlay-only

  // Keep navigation external: handled by slide order in view
  return slides;
};
