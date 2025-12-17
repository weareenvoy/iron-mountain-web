import { KioskControllerProvider } from '@/app/(displays)/(kiosks)/_components/kiosk-controller/KioskController';
import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers';

const Kiosk1Layout = ({ children }: LayoutProps<'/kiosk-1'>) => {
  return (
    <KioskProvider kioskId="kiosk-1">
      <KioskControllerProvider kioskId="kiosk-1">{children}</KioskControllerProvider>
    </KioskProvider>
  );
};

export default Kiosk1Layout;
