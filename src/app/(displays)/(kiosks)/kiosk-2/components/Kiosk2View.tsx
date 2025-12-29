'use client';

import { BaseKioskView } from '@/app/(displays)/(kiosks)/_components/kiosk-templates/BaseKioskView';
import { KIOSK_2_CONFIG } from '@/app/(displays)/(kiosks)/_constants/kiosk-configs';

/**
 * Kiosk 2 view component.
 * Uses BaseKioskView with Kiosk 2 specific configuration.
 */
const Kiosk2View = () => {
  return <BaseKioskView config={KIOSK_2_CONFIG} />;
};

export default Kiosk2View;
