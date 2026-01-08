import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';

const Kiosk1Layout = ({ children }: LayoutProps<'/kiosk-1'>) => {
  return <KioskProvider kioskId="kiosk-1">{children}</KioskProvider>;
};

export default Kiosk1Layout;
