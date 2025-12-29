'use client';

import { BaseKioskView } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/BaseKioskView';
import { KIOSK_3_CONFIG } from '@/app/(displays)/(kiosks)/_constants/kiosk-configs';

/**
 * Kiosk 3 view component.
 * Uses BaseKioskView with Kiosk 3 specific configuration.
 */
const Kiosk3View = () => {
  return <BaseKioskView config={KIOSK_3_CONFIG} />;
};

export default Kiosk3View;
