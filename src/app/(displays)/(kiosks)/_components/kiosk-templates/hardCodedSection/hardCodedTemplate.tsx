import HardCodedFirstScreenTemplate, {
  type HardCodedKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/firstScreenTemplate';
import HardCodedDemoScreenTemplate, {
  type HardCodedDemoScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/demoScreenTemplate';
import HardCodedKiosk1SecondScreenTemplate, {
  type HardCodedKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/secondScreenTemplate';
import HardCodedKiosk3SecondScreenTemplate, {
  type HardCodedKiosk3SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/secondScreenTemplate';
import HardCodedKiosk3ThirdScreenTemplate, {
  type HardCodedKiosk3ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/thirdScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';

export type HardCodedScreens = Readonly<{
  demoScreen?: HardCodedDemoScreenTemplateProps;
  firstScreen?: HardCodedKiosk1FirstScreenTemplateProps;
  fourthScreen?: HardCodedDemoScreenTemplateProps;
  secondScreen?: HardCodedKiosk1SecondScreenTemplateProps & HardCodedKiosk3SecondScreenTemplateProps;
  thirdScreen?: HardCodedDemoScreenTemplateProps & HardCodedKiosk3ThirdScreenTemplateProps;
}>;

export const buildHardcodedSlides = (
  hardCoded: HardCodedScreens,
  kioskId: 'kiosk-1' | 'kiosk-2' | 'kiosk-3',
  scrollToSection?: (sectionId: string) => void
): Slide[] => {
  if (kioskId === 'kiosk-2') return [];

  const slides: Slide[] = [];

  if (hardCoded.firstScreen) {
    // Kiosk 1 uses thirdScreen for overlay, Kiosk 3 uses fourthScreen
    const overlayData = kioskId === 'kiosk-1' ? hardCoded.thirdScreen : hardCoded.fourthScreen;

    slides.push({
      id: 'hardcoded-first',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <HardCodedFirstScreenTemplate
            kioskId={kioskId}
            {...hardCoded.firstScreen}
            overlayCardLabel={overlayData?.cardLabel}
            overlayHeadline={overlayData?.headline}
            onPrimaryCta={() => scrollToSection?.('hardcoded-second-screen')}
          />
        </SectionSlide>
      ),
      title: 'Hardcoded First',
    });
  }

  if (hardCoded.secondScreen) {
    const KioskSecond =
      kioskId === 'kiosk-3' ? HardCodedKiosk3SecondScreenTemplate : HardCodedKiosk1SecondScreenTemplate;

    slides.push({
      id: 'hardcoded-second',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <KioskSecond
            {...hardCoded.secondScreen}
            onBack={() => scrollToSection?.('hardcoded-first-screen')}
            onTapToBegin={() => scrollToSection?.('hardcoded-third-screen')}
          />
        </SectionSlide>
      ),
      title: 'Hardcoded Second',
    });
  }

  // Kiosk 3: thirdScreen is the carousel (render as standalone)
  // Kiosk 1: thirdScreen is the demo (used for overlay only, don't render standalone)
  if (kioskId === 'kiosk-3' && hardCoded.thirdScreen) {
    slides.push({
      id: 'hardcoded-third',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <HardCodedKiosk3ThirdScreenTemplate {...hardCoded.thirdScreen} />
        </SectionSlide>
      ),
      title: 'Hardcoded Third',
    });
  }

  // Demo screens (thirdScreen for Kiosk 1, fourthScreen for Kiosk 3) are now overlay-only

  // Keep navigation external: handled by slide order in view
  return slides;
};
