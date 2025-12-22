import { KioskControllerProvider } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';

const Kiosk2Layout = ({ children }: LayoutProps<'/kiosk-2'>) => {
  return (
    <KioskProvider kioskId="kiosk-2">
      <KioskControllerProvider kioskId="kiosk-2">{children}</KioskControllerProvider>
    </KioskProvider>
  );
};

export default Kiosk2Layout;
