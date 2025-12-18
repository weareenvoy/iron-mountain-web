import HardCodedFirstScreenTemplate, {
  type HardCodedKiosk1FirstScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/firstScreenTemplate';
import HardCodedKiosk3FourthScreenTemplate, {
  type HardCodedKiosk3FourthScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/fourthScreenTemplate';
import HardCodedKiosk1SecondScreenTemplate, {
  type HardCodedKiosk1SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/secondScreenTemplate';
import HardCodedKiosk3SecondScreenTemplate, {
  type HardCodedKiosk3SecondScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/secondScreenTemplate';
import HardCodedKiosk1ThirdScreenTemplate, {
  type HardCodedKiosk1ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk1/thirdScreenTemplate';
import HardCodedKiosk3ThirdScreenTemplate, {
  type HardCodedKiosk3ThirdScreenTemplateProps,
} from '@/app/(displays)/(kiosks)/_components/kiosk-templates/hardCodedSection/kiosk3/thirdScreenTemplate';
import { SectionSlide, type Slide } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/slides';

export type HardCodedScreens = Readonly<{
  firstScreen?: HardCodedKiosk1FirstScreenTemplateProps;
  fourthScreen?: HardCodedKiosk3FourthScreenTemplateProps;
  secondScreen?: HardCodedKiosk1SecondScreenTemplateProps & HardCodedKiosk3SecondScreenTemplateProps;
  thirdScreen?: HardCodedKiosk1ThirdScreenTemplateProps & HardCodedKiosk3ThirdScreenTemplateProps;
}>;

export const buildHardcodedSlides = (
  hardCoded: HardCodedScreens,
  kioskId: 'kiosk-1' | 'kiosk-2' | 'kiosk-3',
  scrollToSection?: (sectionId: string) => void
): Slide[] => {
  if (kioskId === 'kiosk-2') return [];

  const slides: Slide[] = [];

  if (hardCoded.firstScreen) {
    slides.push({
      id: 'hardcoded-first',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <HardCodedFirstScreenTemplate
            kioskId={kioskId}
            {...hardCoded.firstScreen}
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
          <KioskSecond {...hardCoded.secondScreen} onBack={() => scrollToSection?.('hardcoded-first-screen')} />
        </SectionSlide>
      ),
      title: 'Hardcoded Second',
    });
  }

  if (hardCoded.thirdScreen) {
    const KioskThird = kioskId === 'kiosk-3' ? HardCodedKiosk3ThirdScreenTemplate : HardCodedKiosk1ThirdScreenTemplate;

    slides.push({
      id: 'hardcoded-third',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <KioskThird {...hardCoded.thirdScreen} />
        </SectionSlide>
      ),
      title: 'Hardcoded Third',
    });
  }

  if (kioskId === 'kiosk-3' && hardCoded.fourthScreen) {
    slides.push({
      id: 'hardcoded-fourth',
      render: (isActive: boolean) => (
        <SectionSlide isActive={isActive}>
          <HardCodedKiosk3FourthScreenTemplate {...hardCoded.fourthScreen} />
        </SectionSlide>
      ),
      title: 'Hardcoded Fourth',
    });
  }

  // Keep navigation external: handled by slide order in view
  return slides;
};
