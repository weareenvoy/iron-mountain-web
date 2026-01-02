'use client';

import { BaseKioskView } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/BaseKioskView';
import { KIOSK_1_CONFIG } from '@/app/(displays)/(kiosks)/_constants/kiosk-configs';

/**
 * Kiosk 1 view component.
 * Uses BaseKioskView with Kiosk 1 specific configuration.
 */
const Kiosk1View = () => {
  return <BaseKioskView config={KIOSK_1_CONFIG} />;
};

export default Kiosk1View;
