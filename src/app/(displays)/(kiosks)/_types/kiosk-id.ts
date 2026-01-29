import type { ExhibitMqttStateBase } from '@/lib/mqtt/types';

export type KioskId = 'kiosk-1' | 'kiosk-2' | 'kiosk-3';
export const DEFAULT_KIOSK_ID: KioskId = 'kiosk-1';

/**
 * Kiosk beat-id states for MQTT state reporting.
 * - 'kiosk-idle': Kiosk is on idle/attract screen
 * - 'kiosk-active': Kiosk is in active use (user is interacting)
 */
export type KioskBeatId = 'kiosk-active' | 'kiosk-idle';
export const DEFAULT_KIOSK_BEAT_ID: KioskBeatId = 'kiosk-idle'; // The type above follows alphabetization, but to make it clear that the idle state is the default state this constant is in place. The visual order can suggest that active is the default state, so this constatnt is for clarity.

/**
 * Complete MQTT state structure for kiosks.
 * Used for state reporting and volume control.
 */
export interface KioskMqttState extends ExhibitMqttStateBase {
  'beat-id': 'kiosk-active' | 'kiosk-idle';
}

// This file is used to identify the Kiosk setup and is used to determine which Kiosk to display.
// Every function benefits from knowing which Kiosk it's being displayed on.
