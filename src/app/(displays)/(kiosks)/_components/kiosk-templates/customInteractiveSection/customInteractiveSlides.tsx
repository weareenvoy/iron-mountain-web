import CustomInteractiveFirstScreenTemplate, {
  type CustomInteractiveKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/customInteractiveSection/firstScreenTemplate';
import CustomInteractiveKiosk1SecondScreenTemplate, {
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
    // Kiosk 1 uses thirdScreen for overlay, Kiosk 3 uses fourthScreen
    const overlayData = kioskId === 'kiosk-1' ? customInteractive.thirdScreen : customInteractive.fourthScreen;

    slides.push({
      id: 'customInteractive-first',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <CustomInteractiveFirstScreenTemplate
            kioskId={kioskId}
            {...customInteractive.firstScreen}
            onPrimaryCta={() => scrollToSection?.('customInteractive-second-screen')}
            overlayCardLabel={overlayData?.cardLabel}
            overlayHeadline={overlayData?.headline}
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
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
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
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
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
