import { KioskProvider } from '@/app/(displays)/(kiosks)/_components/providers/kiosk-provider';

const Kiosk2Layout = ({ children }: LayoutProps<'/kiosk-2'>) => {
  return <KioskProvider kioskId="kiosk-2">{children}</KioskProvider>;
};

export default Kiosk2Layout;
