import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';

const Kiosk3Layout = ({ children }: LayoutProps<'/kiosk-3'>) => {
  return <KioskProvider kioskId="kiosk-3">{children}</KioskProvider>;
};

export default Kiosk3Layout;
